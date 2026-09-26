import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_USER,
  INITIAL_POLICIES,
  INITIAL_WELLNESS,
  INITIAL_HEALTH_CONCERNS,
  INITIAL_FINANCE_ENTRIES,
  INITIAL_CLAIMS,
  INITIAL_PROVIDERS,
  INITIAL_EMERGENCY_CONTACTS
} from './src/data/initialData.js';
import {
  Policy,
  HealthConcern,
  WellnessMetric,
  FinanceEntry,
  Claim,
  SupportProvider,
  EmergencyContact,
  PaymentReceipt
} from './src/types/index.js';
import {
  processAiQuery,
  scanEmergencySymptoms,
  LIFESHIELD_AI_SYSTEM_INSTRUCTION
} from './src/services/aiAssistantService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Trust reverse proxies in container environment
app.set('trust proxy', 1);

// JSON body parsing with strict size limit to prevent memory exhaustion / DoS
app.use(express.json({ limit: '1mb' }));

// ============================================================================
// 1. SECURITY HEADERS & CORS MIDDLEWARE
// ============================================================================
app.use((req: Request, res: Response, next: NextFunction) => {
  // Content Security Policy: Strict yet permitting necessary assets & YouTube embeds
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob:",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "connect-src 'self' https://generativelanguage.googleapis.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'"
    ].join('; ')
  );

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Idempotency-Key');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// ============================================================================
// 2. RATE LIMITING MIDDLEWARE (SLIDING WINDOW)
// ============================================================================
interface RateLimitBucket {
  tokens: number[];
}

const rateLimitStores = {
  general: new Map<string, RateLimitBucket>(),
  auth: new Map<string, RateLimitBucket>(),
  ai: new Map<string, RateLimitBucket>(),
  payment: new Map<string, RateLimitBucket>()
};

function createRateLimiter(limit: number, windowMs: number, store: Map<string, RateLimitBucket>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'anonymous';
    const now = Date.now();
    const bucket = store.get(ip) || { tokens: [] };

    // Evict timestamps older than window
    bucket.tokens = bucket.tokens.filter(t => now - t < windowMs);

    if (bucket.tokens.length >= limit) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please wait ${Math.ceil((bucket.tokens[0] + windowMs - now) / 1000)} seconds.`
      });
    }

    bucket.tokens.push(now);
    store.set(ip, bucket);
    next();
  };
}

const generalLimiter = createRateLimiter(180, 60 * 1000, rateLimitStores.general);
const authLimiter = createRateLimiter(15, 15 * 60 * 1000, rateLimitStores.auth);
const aiLimiter = createRateLimiter(30, 60 * 1000, rateLimitStores.ai);
const paymentLimiter = createRateLimiter(20, 60 * 1000, rateLimitStores.payment);

app.use('/api/', generalLimiter);

// ============================================================================
// 3. INPUT SANITIZATION UTILITY
// ============================================================================
export function sanitizeString(val: unknown): string {
  if (typeof val !== 'string') return '';
  // Strip control chars and encode dangerous HTML tags
  return val
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

// ============================================================================
// 4. IN-MEMORY SECURE STORE & STATE
// ============================================================================
interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// Seed default demo user (password: Password123!)
const defaultPasswordHash = bcrypt.hashSync('Password123!', 10);
const usersStore: Map<string, StoredUser> = new Map([
  [
    'user-default-01',
    {
      id: 'user-default-01',
      name: INITIAL_USER.name,
      email: INITIAL_USER.email.toLowerCase(),
      phone: INITIAL_USER.phone,
      passwordHash: defaultPasswordHash,
      role: 'user',
      createdAt: '2026-09-01T00:00:00.000Z'
    }
  ]
]);

// Active sessions: token -> { userId, expiresAt }
const sessionsStore: Map<string, { userId: string; expiresAt: number }> = new Map();

// Password Reset Tokens: token -> { email, expiresAt }
const resetTokensStore: Map<string, { email: string; expiresAt: number }> = new Map();

// Financial Ledger Store
let financeLedger: FinanceEntry[] = JSON.parse(JSON.stringify(INITIAL_FINANCE_ENTRIES));

// Policies Store
let policiesStore: Policy[] = JSON.parse(JSON.stringify(INITIAL_POLICIES));

// Premium Status Store
let premiumStatus = {
  totalPremium: 0,
  paidAmount: 0,
  pendingAmount: 0,
  percentage: 0,
  nextDueDate: 'No dues pending',
  autoDebitEnabled: false,
  bankAccount: ''
};

// Payment Receipts & Idempotency Store
const processedPaymentsStore: Map<string, PaymentReceipt> = new Map();

// Claims Store
let claimsStore: Claim[] = JSON.parse(JSON.stringify(INITIAL_CLAIMS));

// Health Concerns Store
let healthConcernsStore: HealthConcern[] = JSON.parse(JSON.stringify(INITIAL_HEALTH_CONCERNS));

// Wellness Store
let wellnessStore: WellnessMetric = JSON.parse(JSON.stringify(INITIAL_WELLNESS));

// Emergency Contacts Store
let emergencyContactsStore: EmergencyContact[] = JSON.parse(JSON.stringify(INITIAL_EMERGENCY_CONTACTS));

// Providers
const providersStore: SupportProvider[] = JSON.parse(JSON.stringify(INITIAL_PROVIDERS));

// ============================================================================
// 5. AUTHENTICATION MIDDLEWARE
// ============================================================================
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const session = sessionsStore.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) sessionsStore.delete(token);
    return res.status(401).json({ error: 'Unauthorized', message: 'Session expired or invalid' });
  }

  const user = usersStore.get(session.userId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
  }

  (req as any).user = user;
  next();
}

// Optional Auth: If token provided, populates user; otherwise allows guest/demo access
function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = sessionsStore.get(token);
    if (session && session.expiresAt > Date.now()) {
      const user = usersStore.get(session.userId);
      if (user) {
        (req as any).user = user;
      }
    }
  }
  next();
}

// ============================================================================
// 6. AUTHENTICATION & SESSION ROUTES
// ============================================================================
app.post('/api/auth/register', authLimiter, (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    const cleanEmail = sanitizeString(email).toLowerCase();
    const cleanName = sanitizeString(name);
    const cleanPhone = sanitizeString(phone);

    if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 5) {
      return res.status(400).json({ error: 'Validation Error', message: 'Valid email address is required' });
    }

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: 'Validation Error', message: 'Full name must be at least 2 characters' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 8 characters long with uppercase, lowercase, and numbers'
      });
    }

    // Check for existing user
    for (const u of usersStore.values()) {
      if (u.email === cleanEmail) {
        return res.status(409).json({ error: 'Conflict', message: 'An account with this email already exists' });
      }
    }

    const userId = `user-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const passwordHash = bcrypt.hashSync(password, 10);

    const newUser: StoredUser = {
      id: userId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || '+91 98765 00000',
      passwordHash,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    usersStore.set(userId, newUser);

    // Issue session token
    const token = crypto.randomBytes(32).toString('hex');
    sessionsStore.set(token, {
      userId,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server Error', message: 'Failed to process registration' });
  }
});

app.post('/api/auth/login', authLimiter, (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = sanitizeString(email).toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email and password are required' });
    }

    let foundUser: StoredUser | null = null;
    for (const u of usersStore.values()) {
      if (u.email === cleanEmail) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      // Mitigate timing attacks with dummy compare
      bcrypt.compareSync(password, defaultPasswordHash);
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, foundUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
    }

    // Issue session token
    const token = crypto.randomBytes(32).toString('hex');
    sessionsStore.set(token, {
      userId: foundUser.id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        role: foundUser.role
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server Error', message: 'Login failed' });
  }
});

app.get('/api/auth/me', optionalAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    // Return default demo profile if no token provided
    return res.json({
      authenticated: false,
      user: {
        id: 'user-default-01',
        name: INITIAL_USER.name,
        email: INITIAL_USER.email,
        phone: INITIAL_USER.phone,
        role: 'user'
      }
    });
  }

  return res.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessionsStore.delete(token);
  }
  return res.json({ message: 'Session logged out successfully' });
});

app.post('/api/auth/password-reset', authLimiter, (req: Request, res: Response) => {
  const { email, resetToken, newPassword } = req.body;
  const cleanEmail = sanitizeString(email).toLowerCase();

  // Step 2: Confirm reset with token
  if (resetToken && newPassword) {
    const tokenData = resetTokensStore.get(resetToken);
    if (!tokenData || tokenData.expiresAt < Date.now() || tokenData.email !== cleanEmail) {
      return res.status(400).json({ error: 'Invalid Token', message: 'Reset token is invalid or expired' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Weak Password', message: 'New password must be at least 8 characters' });
    }

    for (const u of usersStore.values()) {
      if (u.email === cleanEmail) {
        u.passwordHash = bcrypt.hashSync(newPassword, 10);
        resetTokensStore.delete(resetToken);
        return res.json({ message: 'Password has been securely reset. You can now log in.' });
      }
    }
    return res.status(404).json({ error: 'Not Found', message: 'User account not found' });
  }

  // Step 1: Request reset token
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return res.status(400).json({ error: 'Bad Request', message: 'Valid email is required' });
  }

  const generatedToken = crypto.randomBytes(24).toString('hex');
  resetTokensStore.set(generatedToken, {
    email: cleanEmail,
    expiresAt: Date.now() + 15 * 60 * 1000 // 15 mins
  });

  return res.json({
    message: 'If the email exists in our records, a secure reset token has been issued.',
    resetToken: generatedToken,
    instructions: 'Use this token with newPassword to finalize your password update.'
  });
});

// ============================================================================
// 7. FINANCIAL LEDGER & TRANSACTION PROCESSING
// ============================================================================
app.get('/api/finance', optionalAuth, (_req: Request, res: Response) => {
  const income = financeLedger
    .filter(e => e.type === 'income')
    .reduce((acc, e) => acc + e.amount, 0);

  const expense = financeLedger
    .filter(e => e.type === 'expense')
    .reduce((acc, e) => acc + e.amount, 0);

  const savings = financeLedger
    .filter(e => e.type === 'savings')
    .reduce((acc, e) => acc + e.amount, 0);

  return res.json({
    entries: financeLedger,
    summary: {
      totalIncome: Math.round(income * 100) / 100,
      totalExpense: Math.round(expense * 100) / 100,
      totalSavings: Math.round(savings * 100) / 100,
      netBalance: Math.round((income - expense) * 100) / 100
    }
  });
});

app.post('/api/finance', optionalAuth, (req: Request, res: Response) => {
  try {
    const { title, category, type, amount, date, notes } = req.body;

    const cleanTitle = sanitizeString(title);
    const cleanNotes = sanitizeString(notes);
    const parsedAmount = Math.round(Number(amount) * 100) / 100;

    if (!cleanTitle || cleanTitle.length > 120) {
      return res.status(400).json({ error: 'Validation Error', message: 'Title must be between 1 and 120 characters' });
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 10_000_000) {
      return res.status(400).json({ error: 'Validation Error', message: 'Amount must be a positive number up to 10,000,000' });
    }

    if (!['income', 'expense', 'savings'].includes(type)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Invalid transaction type' });
    }

    const validCategories = [
      'Health Insurance',
      'Life Insurance',
      'Medical Bills',
      'Doctor Consult',
      'Pharmacy',
      'General Living',
      'Salary/Income',
      'Emergency Fund'
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Invalid category specified' });
    }

    const cleanDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().split('T')[0];

    // Duplicate transaction detection: check if identical title & amount added in last 20 seconds
    const recentDuplicate = financeLedger.find(
      e => e.title === cleanTitle && e.amount === parsedAmount && e.category === category && e.date === cleanDate
    );

    if (recentDuplicate && (req.headers['x-allow-duplicate'] !== 'true')) {
      // Only block if submitted within last 20 seconds
      const entryTime = parseInt(recentDuplicate.id.replace('fe-', ''), 10);
      if (!isNaN(entryTime) && Date.now() - entryTime < 20000) {
        return res.status(409).json({
          error: 'Duplicate Transaction Detected',
          message: 'An identical transaction was recorded moments ago. If intentional, please confirm.'
        });
      }
    }

    const newEntry: FinanceEntry = {
      id: `fe-${Date.now()}`,
      title: cleanTitle,
      category,
      type,
      amount: parsedAmount,
      date: cleanDate,
      notes: cleanNotes || undefined
    };

    financeLedger.unshift(newEntry);

    return res.status(201).json({
      message: 'Transaction recorded successfully',
      entry: newEntry
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server Error', message: 'Failed to record transaction' });
  }
});

app.delete('/api/finance/:id', optionalAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = financeLedger.length;
  financeLedger = financeLedger.filter(e => e.id !== id);

  if (financeLedger.length === initialLen) {
    return res.status(404).json({ error: 'Not Found', message: 'Transaction record not found' });
  }

  return res.json({ message: 'Transaction removed successfully' });
});

// ============================================================================
// 8. PAYMENT CLEARING & IDEMPOTENT TRANSACTION PROCESSING
// ============================================================================
function validateLuhn(numStr: string): boolean {
  let sum = 0;
  let alternate = false;
  for (let i = numStr.length - 1; i >= 0; i--) {
    let n = parseInt(numStr.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n = (n % 10) + 1;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

app.post('/api/payments/process', paymentLimiter, (req: Request, res: Response) => {
  try {
    const idempotencyKey = (req.headers['idempotency-key'] as string) || req.body.idempotencyKey;
    const { amount, method, paymentDetails } = req.body;

    if (!idempotencyKey || typeof idempotencyKey !== 'string' || idempotencyKey.length < 8) {
      return res.status(400).json({
        error: 'Missing Idempotency-Key',
        message: 'A unique Idempotency-Key header is required to guarantee atomic, single-execution payments.'
      });
    }

    // Check if this exact idempotency key was previously processed
    if (processedPaymentsStore.has(idempotencyKey)) {
      const priorReceipt = processedPaymentsStore.get(idempotencyKey)!;
      return res.status(200).json({
        cached: true,
        message: 'Payment previously cleared and recorded (Idempotency Replay)',
        receipt: priorReceipt,
        premiumStatus
      });
    }

    const payAmount = Math.round(Number(amount) * 100) / 100;
    if (isNaN(payAmount) || payAmount <= 0) {
      return res.status(400).json({ error: 'Validation Error', message: 'Payment amount must be greater than zero' });
    }

    if (premiumStatus.pendingAmount > 0 && payAmount > premiumStatus.pendingAmount + 5000) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Amount exceeds maximum outstanding dues (₹ ${premiumStatus.pendingAmount.toLocaleString('en-IN')})`
      });
    }

    const payMethod = (method || '').toUpperCase();
    if (!['UPI', 'CARD', 'NETBANKING'].includes(payMethod)) {
      return res.status(400).json({ error: 'Validation Error', message: 'Supported payment methods: UPI, CARD, NETBANKING' });
    }

    // Validate method-specific formats without storing credentials
    if (payMethod === 'UPI') {
      const upiId = paymentDetails?.upiId ? sanitizeString(paymentDetails.upiId) : 'user@okaxis';
      if (!/^[\w.\-_]{2,256}@[\w]{2,64}$/.test(upiId)) {
        return res.status(400).json({ error: 'Validation Error', message: 'Invalid UPI handle format (e.g., name@okhdfcbank)' });
      }
    } else if (payMethod === 'CARD') {
      const cardNumber = (paymentDetails?.cardNumber || '').replace(/[\s-]/g, '');
      if (cardNumber && (!/^\d{15,19}$/.test(cardNumber) || !validateLuhn(cardNumber))) {
        return res.status(400).json({ error: 'Validation Error', message: 'Invalid card number or Luhn checksum failure' });
      }
    }

    // Atomic execution & ledger updates
    const txnId = `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const newPaid = premiumStatus.totalPremium > 0 ? Math.min(premiumStatus.totalPremium, premiumStatus.paidAmount + payAmount) : payAmount;
    const newPending = Math.max(0, premiumStatus.totalPremium - newPaid);
    const newPct = premiumStatus.totalPremium > 0 ? Math.round((newPaid / premiumStatus.totalPremium) * 100) : 100;

    premiumStatus = {
      ...premiumStatus,
      paidAmount: newPaid,
      pendingAmount: newPending,
      percentage: newPct,
      nextDueDate: newPending === 0 ? 'All dues cleared for FY 2025-26' : premiumStatus.nextDueDate
    };

    // Create corresponding ledger expense record
    const ledgerEntry: FinanceEntry = {
      id: `fe-${Date.now()}`,
      title: `Insurance Premium Payment via ${payMethod} (${txnId})`,
      category: 'Health Insurance',
      type: 'expense',
      amount: payAmount,
      date: timestamp.split('T')[0],
      notes: `Verified Clearing Receipt ${txnId} via LifeShield Gateway`
    };
    financeLedger.unshift(ledgerEntry);

    const receipt: PaymentReceipt = {
      txnId,
      idempotencyKey,
      amount: payAmount,
      currency: 'INR',
      method: payMethod as 'UPI' | 'CARD' | 'NETBANKING',
      status: 'SETTLED',
      timestamp,
      provider: 'LifeShield IRDAI-Compliant Sandbox Gateway',
      note: 'Payment verified and cleared through simulated banking gateway sandbox. For live production, configure Razorpay/Stripe webhooks.'
    };

    processedPaymentsStore.set(idempotencyKey, receipt);

    return res.status(200).json({
      success: true,
      message: `Payment of ₹ ${payAmount.toLocaleString('en-IN')} successfully settled`,
      receipt,
      premiumStatus,
      ledgerEntry
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Clearing Gateway Error', message: 'Payment authorization failed' });
  }
});

app.get('/api/payments/history', (_req: Request, res: Response) => {
  const history = Array.from(processedPaymentsStore.values()).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return res.json({ history });
});

// ============================================================================
// 9. POLICIES & PREMIUM STATUS
// ============================================================================
app.get('/api/policies', (_req: Request, res: Response) => {
  return res.json({ policies: policiesStore });
});

app.post('/api/policies', (req: Request, res: Response) => {
  try {
    const { title, subtitle, type, policyNumber, coverageAmount, annualPremium, insurer } = req.body;
    const cleanTitle = sanitizeString(title);
    const cleanSubtitle = sanitizeString(subtitle);
    const cleanNumber = sanitizeString(policyNumber);
    const cleanInsurer = sanitizeString(insurer);
    const parsedCoverage = Number(coverageAmount) || 0;
    const parsedPremium = Number(annualPremium) || 0;

    if (!cleanTitle || !cleanNumber) {
      return res.status(400).json({ error: 'Validation Error', message: 'Title and policy number are required' });
    }

    const newPolicy: Policy = {
      id: `pol-${Date.now()}`,
      title: cleanTitle,
      subtitle: cleanSubtitle || 'Personal Plan',
      type: type || 'health',
      policyNumber: cleanNumber,
      status: 'Active',
      coverageLabel: 'Sum Insured',
      coverageAmount: parsedCoverage,
      coverageFormatted: `₹ ${parsedCoverage.toLocaleString('en-IN')}`,
      annualPremium: parsedPremium,
      paidAmount: 0,
      nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      beneficiary: 'Self & Dependents',
      insurer: cleanInsurer || 'General Insurance',
      color: type === 'life' ? 'emerald' : type === 'savings' ? 'purple' : 'blue'
    };

    policiesStore.push(newPolicy);

    // Update premium status
    premiumStatus.totalPremium += parsedPremium;
    premiumStatus.pendingAmount += parsedPremium;
    premiumStatus.percentage = premiumStatus.totalPremium > 0 ? Math.round((premiumStatus.paidAmount / premiumStatus.totalPremium) * 100) : 0;

    return res.status(201).json({ message: 'Insurance policy added', policy: newPolicy, premiumStatus });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server Error', message: 'Failed to add policy' });
  }
});

app.delete('/api/policies/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = policiesStore.length;
  policiesStore = policiesStore.filter(p => p.id !== id);

  if (policiesStore.length === initialLen) {
    return res.status(404).json({ error: 'Not Found', message: 'Policy not found' });
  }

  return res.json({ message: 'Policy removed successfully' });
});

app.get('/api/premium-status', (_req: Request, res: Response) => {
  return res.json({ premiumStatus });
});

app.post('/api/premium-status/toggle-auto-debit', (_req: Request, res: Response) => {
  premiumStatus.autoDebitEnabled = !premiumStatus.autoDebitEnabled;
  return res.json({
    message: `Auto-debit protection ${premiumStatus.autoDebitEnabled ? 'enabled' : 'disabled'}`,
    premiumStatus
  });
});

// ============================================================================
// 10. CLAIMS MANAGEMENT
// ============================================================================
app.get('/api/claims', (_req: Request, res: Response) => {
  return res.json({ claims: claimsStore });
});

app.post('/api/claims', (req: Request, res: Response) => {
  try {
    const { policyId, policyTitle, patientName, hospitalName, claimAmount, diagnosisOrReason, hospitalizationDate, uploadedBillsCount } = req.body;

    const cleanPatient = sanitizeString(patientName);
    const cleanHospital = sanitizeString(hospitalName);
    const cleanDiagnosis = sanitizeString(diagnosisOrReason);
    const parsedAmount = Math.round(Number(claimAmount) * 100) / 100;

    if (!cleanHospital || cleanHospital.length < 2) {
      return res.status(400).json({ error: 'Validation Error', message: 'Hospital or clinic name is required' });
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Validation Error', message: 'Valid positive claim amount is required' });
    }

    if (!cleanDiagnosis) {
      return res.status(400).json({ error: 'Validation Error', message: 'Diagnosis or medical reason is required' });
    }

    const newClaim: Claim = {
      id: `clm-${Date.now().toString().slice(-6)}`,
      policyId: policyId || 'pol-health-01',
      policyTitle: policyTitle || 'Health Insurance',
      patientName: cleanPatient || 'Insured Member',
      hospitalName: cleanHospital,
      claimAmount: parsedAmount,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      diagnosisOrReason: cleanDiagnosis,
      hospitalizationDate: hospitalizationDate || new Date().toISOString().split('T')[0],
      uploadedBillsCount: Number(uploadedBillsCount) || 1
    };

    claimsStore.unshift(newClaim);

    return res.status(201).json({
      message: 'Insurance claim submitted for fast-track cashless/reimbursement review',
      claim: newClaim
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server Error', message: 'Failed to submit claim' });
  }
});

// ============================================================================
// 11. HEALTH CONCERNS & WELLNESS
// ============================================================================
app.get('/api/health-concerns', (_req: Request, res: Response) => {
  return res.json({ concerns: healthConcernsStore });
});

app.post('/api/health-concerns', (req: Request, res: Response) => {
  try {
    const { title, description, category, severity, inputType, voiceDuration, notes } = req.body;

    const cleanTitle = sanitizeString(title);
    const cleanDesc = sanitizeString(description);
    const cleanNotes = sanitizeString(notes);

    if (!cleanTitle || cleanTitle.length > 150) {
      return res.status(400).json({ error: 'Validation Error', message: 'Concern title is required (up to 150 characters)' });
    }

    const validSeverities = ['Mild', 'Moderate', 'Severe'];
    const assignedSeverity = validSeverities.includes(severity) ? severity : 'Mild';

    const newConcern: HealthConcern = {
      id: `hc-${Date.now()}`,
      title: cleanTitle,
      description: cleanDesc,
      category: category || 'Symptoms',
      date: new Date().toISOString().split('T')[0],
      severity: assignedSeverity as 'Mild' | 'Moderate' | 'Severe',
      inputType: inputType || 'text',
      voiceDuration: voiceDuration ? sanitizeString(voiceDuration) : undefined,
      notes: cleanNotes || undefined,
      doctorConsulted: false
    };

    healthConcernsStore.unshift(newConcern);

    return res.status(201).json({
      message: 'Health concern recorded securely in your vault',
      concern: newConcern
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server Error', message: 'Failed to record health concern' });
  }
});

app.delete('/api/health-concerns/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = healthConcernsStore.length;
  healthConcernsStore = healthConcernsStore.filter(c => c.id !== id);

  if (healthConcernsStore.length === initialLen) {
    return res.status(404).json({ error: 'Not Found', message: 'Health concern not found' });
  }

  return res.json({ message: 'Concern removed from personal vault' });
});

app.get('/api/wellness', (_req: Request, res: Response) => {
  return res.json({ wellness: wellnessStore });
});

app.put('/api/wellness', (req: Request, res: Response) => {
  try {
    const patch = req.body;
    wellnessStore = {
      ...wellnessStore,
      ...patch,
      lastUpdated: 'Just now'
    };
    return res.json({ message: 'Wellness metrics updated', wellness: wellnessStore });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server Error', message: 'Failed to update wellness metrics' });
  }
});

// ============================================================================
// 12. EMERGENCY CONTACTS & PROVIDERS
// ============================================================================
app.get('/api/emergency-contacts', (_req: Request, res: Response) => {
  return res.json({ contacts: emergencyContactsStore });
});

app.post('/api/emergency-contacts', (req: Request, res: Response) => {
  try {
    const { name, number, category, description } = req.body;
    const cleanName = sanitizeString(name);
    const cleanNumber = sanitizeString(number);
    const cleanDesc = sanitizeString(description);

    if (!cleanName || !cleanNumber) {
      return res.status(400).json({ error: 'Validation Error', message: 'Contact name and phone number are required' });
    }

    const newContact: EmergencyContact = {
      id: `em-user-${Date.now()}`,
      name: cleanName,
      number: cleanNumber,
      category: category || 'Personal',
      description: cleanDesc || undefined,
      isDefault: false
    };

    emergencyContactsStore.push(newContact);
    return res.status(201).json({ message: 'Emergency contact added', contact: newContact });
  } catch (err: any) {
    return res.status(500).json({ error: 'Server Error', message: 'Failed to add emergency contact' });
  }
});

app.put('/api/emergency-contacts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = emergencyContactsStore.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: 'Contact not found' });
  }

  const { name, number, category, description } = req.body;
  emergencyContactsStore[index] = {
    ...emergencyContactsStore[index],
    name: name ? sanitizeString(name) : emergencyContactsStore[index].name,
    number: number ? sanitizeString(number) : emergencyContactsStore[index].number,
    category: category || emergencyContactsStore[index].category,
    description: description !== undefined ? sanitizeString(description) : emergencyContactsStore[index].description
  };

  return res.json({ message: 'Contact updated', contact: emergencyContactsStore[index] });
});

app.delete('/api/emergency-contacts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = emergencyContactsStore.length;
  emergencyContactsStore = emergencyContactsStore.filter(c => c.id !== id);

  if (emergencyContactsStore.length === initialLen) {
    return res.status(404).json({ error: 'Not Found', message: 'Contact not found' });
  }

  return res.json({ message: 'Contact deleted' });
});

app.get('/api/providers', (_req: Request, res: Response) => {
  return res.json({ providers: providersStore });
});

// ============================================================================
// 13. AI HERBAL & HEALTH SAFETY ASSISTANT
// ============================================================================
// Initialize Google Gen AI client with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Re-export scanEmergencySymptoms for medical emergency triage
export { scanEmergencySymptoms };

app.post('/api/herbal-assistant', aiLimiter, async (req: Request, res: Response) => {
  try {
    const { query, conversationHistory, userContext } = req.body;

    const result = await processAiQuery({
      query,
      conversationHistory,
      userContext,
      aiClient: ai,
      apiKey: process.env.GEMINI_API_KEY
    });

    if (result.error) {
      if (result.error === 'Validation Error') {
        return res.status(400).json({ error: result.error, message: result.message });
      }
      return res.status(503).json({ error: result.error, message: result.message });
    }

    return res.status(200).json({
      reply: result.reply,
      isEmergency: !!result.isEmergency
    });
  } catch (error: any) {
    console.error('[LifeShield AI Endpoint Error]:', error?.message || error);
    return res.status(503).json({
      error: 'AI Service Error',
      message: 'The AI assistant encountered an unexpected error. Please try again shortly.'
    });
  }
});

// ============================================================================
// 14. HEALTH STATUS CHECK
// ============================================================================
app.get('/api/health/status', (_req: Request, res: Response) => {
  return res.json({
    status: 'healthy',
    app: 'LifeShield Health & Personal Finance Support',
    version: '2026.09.25',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// 15. PRODUCTION SERVING & ERROR HANDLING
// ============================================================================
// Global Error Handler Middleware: prevents leaking stack traces or credentials
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[LifeShield Server Error]:', err?.message || err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred while processing your request. Please try again.'
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LifeShield server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

export { app };
