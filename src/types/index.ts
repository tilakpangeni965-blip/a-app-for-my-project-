export type TabType = 'home' | 'policies' | 'finance' | 'health' | 'claims' | 'support' | 'more';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  token?: string;
  createdAt: string;
}

export interface PaymentReceipt {
  txnId: string;
  idempotencyKey: string;
  amount: number;
  currency: string;
  method: 'UPI' | 'CARD' | 'NETBANKING';
  status: 'SETTLED' | 'PENDING' | 'FAILED';
  timestamp: string;
  provider: string;
  note: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  category: 'Official' | 'Medical' | 'Personal' | 'Other';
  description?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  name: string;
  greeting: string;
  email: string;
  phone: string;
  avatarUrl: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  consentAccepted: boolean;
  consentDate: string;
}

export interface Policy {
  id: string;
  title: string;
  subtitle: string;
  type: 'health' | 'life' | 'savings';
  policyNumber: string;
  status: 'Active' | 'Grace Period' | 'Lapsed';
  coverageLabel: string;
  coverageAmount: number;
  coverageFormatted: string;
  annualPremium: number;
  paidAmount: number;
  nextDueDate: string;
  renewalDate: string;
  beneficiary: string;
  insurer: string;
  color: string;
}

export interface HealthConcern {
  id: string;
  title: string;
  description: string;
  category: 'General' | 'Chronic' | 'Diet/Nutrition' | 'Mental Health' | 'Symptoms';
  date: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  inputType: 'text' | 'voice' | 'image';
  voiceDuration?: string;
  audioBlobUrl?: string;
  imageReportUrl?: string;
  doctorConsulted?: boolean;
  notes?: string;
}

export interface HealthTrendDay {
  day: string;
  date: string;
  steps: number;
  waterMl: number;
  sleepHours: number;
  heartRateBpm: number;
}

export interface WellnessMetric {
  steps: number;
  stepGoal: number;
  waterMl: number;
  waterGoalMl: number;
  sleepHours: number;
  heartRateBpm: number;
  bloodPressure: string;
  lastUpdated: string;
  weeklyTrend?: HealthTrendDay[];
}

export interface HerbalRemedy {
  id: string;
  name: string;
  hindiName?: string;
  category: string;
  traditionalUse: string;
  safePreparation: string;
  cautions: string;
  evidenceSummary: string;
  disclaimer: string;
  youtubeVideoId?: string;
  youtubeTitle?: string;
  youtubeChannel?: string;
  keyIngredients?: string[];
}

export interface FinanceEntry {
  id: string;
  title: string;
  category: 'Health Insurance' | 'Life Insurance' | 'Medical Bills' | 'Doctor Consult' | 'Pharmacy' | 'General Living' | 'Salary/Income' | 'Emergency Fund';
  type: 'income' | 'expense' | 'savings';
  amount: number;
  date: string;
  notes?: string;
}

export interface Claim {
  id: string;
  policyId: string;
  policyTitle: string;
  patientName: string;
  hospitalName: string;
  claimAmount: number;
  dateSubmitted: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Disbursed' | 'Needs Info';
  diagnosisOrReason: string;
  hospitalizationDate: string;
  uploadedBillsCount: number;
}

export interface SupportProvider {
  id: string;
  name: string;
  role: string;
  category: 'Hospital' | 'Doctor' | 'Ayurveda & Herbal' | 'Financial Advisor' | 'Insurance Desk';
  organization: string;
  location: string;
  distanceKm: number;
  phone: string;
  email: string;
  availableHours: string;
  verifiedDate: string;
  verificationSource: string;
  rating: number;
  reviewsCount: number;
}
