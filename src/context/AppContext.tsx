import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  TabType,
  UserProfile,
  Policy,
  HealthConcern,
  WellnessMetric,
  FinanceEntry,
  Claim,
  SupportProvider,
  EmergencyContact,
  PaymentReceipt,
  AuthUser
} from '../types';
import {
  INITIAL_USER,
  INITIAL_POLICIES,
  INITIAL_WELLNESS,
  INITIAL_HEALTH_CONCERNS,
  INITIAL_FINANCE_ENTRIES,
  INITIAL_CLAIMS,
  INITIAL_PROVIDERS,
  INITIAL_EMERGENCY_CONTACTS
} from '../data/initialData';

export interface PremiumInfo {
  totalPremium: number;
  paidAmount: number;
  pendingAmount: number;
  percentage: number;
  nextDueDate: string;
  autoDebitEnabled: boolean;
  bankAccount: string;
}

interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  viewMode: 'frame' | 'full';
  setViewMode: (mode: 'frame' | 'full') => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserProfile;
  updateUser: (user: Partial<UserProfile>) => void;
  policies: Policy[];
  addPolicy: (policyData: any) => Promise<{ success: boolean; error?: string }>;
  deletePolicy: (id: string) => Promise<void>;
  premiumStatus: PremiumInfo;
  payPremium: (amount: number, method: string, paymentDetails?: any) => Promise<{ success: boolean; receipt?: PaymentReceipt; error?: string }>;
  latestReceipt: PaymentReceipt | null;
  toggleAutoDebit: () => void;
  healthConcerns: HealthConcern[];
  addHealthConcern: (concern: Omit<HealthConcern, 'id'>) => Promise<{ success: boolean; error?: string }>;
  deleteHealthConcern: (id: string) => Promise<void>;
  wellness: WellnessMetric;
  updateWellness: (patch: Partial<WellnessMetric>) => Promise<void>;
  financeEntries: FinanceEntry[];
  addFinanceEntry: (entry: Omit<FinanceEntry, 'id'>) => Promise<{ success: boolean; error?: string }>;
  deleteFinanceEntry: (id: string) => Promise<void>;
  claims: Claim[];
  addClaim: (claim: Omit<Claim, 'id' | 'dateSubmitted' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  providers: SupportProvider[];

  // Emergency Contacts List Box
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  updateEmergencyContact: (id: string, updated: Partial<EmergencyContact>) => Promise<void>;
  deleteEmergencyContact: (id: string) => Promise<void>;
  selectedEmergencyId: string;
  setSelectedEmergencyId: (id: string) => void;
  isAddEmergencyContactOpen: boolean;
  setIsAddEmergencyContactOpen: (open: boolean) => void;

  // Authentication
  authUser: AuthUser | null;
  authToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  biometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => void;
  toggleBiometric: () => void;
  
  // Modals & Action triggers
  isAddConcernOpen: boolean;
  setIsAddConcernOpen: (open: boolean) => void;
  isAddPolicyOpen: boolean;
  setIsAddPolicyOpen: (open: boolean) => void;
  isAddFinanceOpen: boolean;
  setIsAddFinanceOpen: (open: boolean) => void;
  isMakePaymentOpen: boolean;
  setIsMakePaymentOpen: (open: boolean) => void;
  isFileClaimOpen: boolean;
  setIsFileClaimOpen: (open: boolean) => void;
  isWellnessOpen: boolean;
  setIsWellnessOpen: (open: boolean) => void;
  isHerbalGuideOpen: boolean;
  setIsHerbalGuideOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  selectedContact: SupportProvider | null;
  setSelectedContact: (provider: SupportProvider | null) => void;
  selectedPolicyForDetail: Policy | null;
  setSelectedPolicyForDetail: (policy: Policy | null) => void;

  // Data management
  exportAllData: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'lifeshield_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}theme`);
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  const [viewMode, setViewMode] = useState<'frame' | 'full'>('full');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}theme`, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Auth State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_PREFIX}token`);
  });

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Biometric Authentication Simulation State
  const [biometricEnabled, setBiometricEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}biometric_enabled`);
    return saved === 'true';
  });

  const setBiometricEnabled = (enabled: boolean) => {
    setBiometricEnabledState(enabled);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}biometric_enabled`, enabled ? 'true' : 'false');
  };

  const toggleBiometric = () => {
    setBiometricEnabledState(prev => {
      const next = !prev;
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}biometric_enabled`, next ? 'true' : 'false');
      return next;
    });
  };

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}user`);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const updateUser = (patch: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}user`, JSON.stringify(next));
      return next;
    });
  };

  // Policies
  const [policies, setPolicies] = useState<Policy[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}policies`);
    return saved ? JSON.parse(saved) : INITIAL_POLICIES;
  });

  // Premium status
  const [premiumStatus, setPremiumStatus] = useState<PremiumInfo>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}premium_status`);
    if (saved) return JSON.parse(saved);
    return {
      totalPremium: 0,
      paidAmount: 0,
      pendingAmount: 0,
      percentage: 0,
      nextDueDate: 'No dues pending',
      autoDebitEnabled: false,
      bankAccount: ''
    };
  });

  const [latestReceipt, setLatestReceipt] = useState<PaymentReceipt | null>(null);

  const addPolicy = async (policyData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(policyData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Failed to add policy' };
      }
      setPolicies(prev => [...prev, data.policy]);
      if (data.premiumStatus) {
        setPremiumStatus(data.premiumStatus);
      }
      return { success: true };
    } catch {
      const fallbackPolicy = {
        ...policyData,
        id: `pol-${Date.now()}`,
        status: 'Active',
        coverageFormatted: `₹ ${(Number(policyData.coverageAmount) || 0).toLocaleString('en-IN')}`,
        paidAmount: 0,
        nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        color: 'blue'
      };
      setPolicies(prev => [...prev, fallbackPolicy]);
      return { success: true };
    }
  };

  const deletePolicy = async (id: string) => {
    try {
      await fetch(`/api/policies/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {}
    setPolicies(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}policies`, JSON.stringify(next));
      return next;
    });
  };

  // Health Concerns
  const [healthConcerns, setHealthConcerns] = useState<HealthConcern[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}concerns`);
    return saved ? JSON.parse(saved) : INITIAL_HEALTH_CONCERNS;
  });

  // Wellness
  const [wellness, setWellness] = useState<WellnessMetric>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}wellness`);
    return saved ? JSON.parse(saved) : INITIAL_WELLNESS;
  });

  // Finance Entries
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}finance`);
    return saved ? JSON.parse(saved) : INITIAL_FINANCE_ENTRIES;
  });

  // Claims
  const [claims, setClaims] = useState<Claim[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}claims`);
    return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
  });

  // Providers
  const [providers] = useState<SupportProvider[]>(INITIAL_PROVIDERS);

  // Emergency Contacts
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}emergency_contacts`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_EMERGENCY_CONTACTS;
  });

  const [selectedEmergencyId, setSelectedEmergencyId] = useState<string>('em-np');
  const [isAddEmergencyContactOpen, setIsAddEmergencyContactOpen] = useState(false);

  // Helper for authenticated fetch headers
  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  }, [authToken]);

  // Initial Sync with Backend Server
  useEffect(() => {
    const syncData = async () => {
      try {
        // Check current auth profile
        if (authToken) {
          const authRes = await fetch('/api/auth/me', { headers: getAuthHeaders() });
          if (authRes.ok) {
            const data = await authRes.json();
            if (data.authenticated && data.user) {
              setAuthUser(data.user);
              setUser(prev => ({
                ...prev,
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone
              }));
            }
          }
        }

        // Fetch Finance Ledger
        const finRes = await fetch('/api/finance', { headers: getAuthHeaders() });
        if (finRes.ok) {
          const finData = await finRes.json();
          if (Array.isArray(finData.entries)) {
            setFinanceEntries(finData.entries);
            localStorage.setItem(`${LOCAL_STORAGE_PREFIX}finance`, JSON.stringify(finData.entries));
          }
        }

        // Fetch Premium Status
        const premRes = await fetch('/api/premium-status', { headers: getAuthHeaders() });
        if (premRes.ok) {
          const premData = await premRes.json();
          if (premData.premiumStatus) {
            setPremiumStatus(premData.premiumStatus);
            localStorage.setItem(`${LOCAL_STORAGE_PREFIX}premium_status`, JSON.stringify(premData.premiumStatus));
          }
        }

        // Fetch Health Concerns
        const hcRes = await fetch('/api/health-concerns', { headers: getAuthHeaders() });
        if (hcRes.ok) {
          const hcData = await hcRes.json();
          if (Array.isArray(hcData.concerns)) {
            setHealthConcerns(hcData.concerns);
            localStorage.setItem(`${LOCAL_STORAGE_PREFIX}concerns`, JSON.stringify(hcData.concerns));
          }
        }

        // Fetch Claims
        const clmRes = await fetch('/api/claims', { headers: getAuthHeaders() });
        if (clmRes.ok) {
          const clmData = await clmRes.json();
          if (Array.isArray(clmData.claims)) {
            setClaims(clmData.claims);
            localStorage.setItem(`${LOCAL_STORAGE_PREFIX}claims`, JSON.stringify(clmData.claims));
          }
        }

        // Fetch Emergency Contacts
        const emRes = await fetch('/api/emergency-contacts', { headers: getAuthHeaders() });
        if (emRes.ok) {
          const emData = await emRes.json();
          if (Array.isArray(emData.contacts)) {
            setEmergencyContacts(emData.contacts);
            localStorage.setItem(`${LOCAL_STORAGE_PREFIX}emergency_contacts`, JSON.stringify(emData.contacts));
          }
        }
      } catch (err) {
        console.warn('Backend synchronization warning (using local fallback):', err);
      }
    };

    syncData();
  }, [authToken, getAuthHeaders]);

  // Auth Functions
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Login failed' };
      }
      setAuthToken(data.token);
      setAuthUser(data.user);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}token`, data.token);
      setUser(prev => ({
        ...prev,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone
      }));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error' };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Registration failed' };
      }
      setAuthToken(data.token);
      setAuthUser(data.user);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}token`, data.token);
      setUser(prev => ({
        ...prev,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone
      }));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error' };
    }
  };

  const logout = () => {
    if (authToken) {
      fetch('/api/auth/logout', { method: 'POST', headers: getAuthHeaders() }).catch(() => {});
    }
    setAuthToken(null);
    setAuthUser(null);
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}token`);
  };

  // Payment Execution through Backend Gateway
  const payPremium = async (
    amount: number,
    method: string,
    paymentDetails?: any
  ): Promise<{ success: boolean; receipt?: PaymentReceipt; error?: string }> => {
    const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    try {
      const res = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          amount,
          method,
          paymentDetails,
          idempotencyKey
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.message || 'Payment processing failed' };
      }

      // Update state only upon server verification
      setPremiumStatus(data.premiumStatus);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}premium_status`, JSON.stringify(data.premiumStatus));

      if (data.ledgerEntry) {
        setFinanceEntries(prev => [data.ledgerEntry, ...prev]);
      }

      setLatestReceipt(data.receipt);
      return { success: true, receipt: data.receipt };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network failure communicating with payment clearing gateway' };
    }
  };

  const toggleAutoDebit = async () => {
    try {
      const res = await fetch('/api/premium-status/toggle-auto-debit', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setPremiumStatus(data.premiumStatus);
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}premium_status`, JSON.stringify(data.premiumStatus));
      }
    } catch {
      setPremiumStatus(prev => {
        const next = { ...prev, autoDebitEnabled: !prev.autoDebitEnabled };
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}premium_status`, JSON.stringify(next));
        return next;
      });
    }
  };

  // Health Concerns
  const addHealthConcern = async (concern: Omit<HealthConcern, 'id'>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/health-concerns', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(concern)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Failed to record health concern' };
      }
      setHealthConcerns(prev => [data.concern, ...prev]);
      return { success: true };
    } catch {
      const localConcern: HealthConcern = { ...concern, id: `hc-${Date.now()}` };
      setHealthConcerns(prev => [localConcern, ...prev]);
      return { success: true };
    }
  };

  const deleteHealthConcern = async (id: string) => {
    try {
      await fetch(`/api/health-concerns/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {}
    setHealthConcerns(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}concerns`, JSON.stringify(next));
      return next;
    });
  };

  // Wellness
  const updateWellness = async (patch: Partial<WellnessMetric>) => {
    try {
      await fetch('/api/wellness', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(patch)
      });
    } catch {}
    setWellness(prev => {
      const next = { ...prev, ...patch, lastUpdated: 'Just now' };
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}wellness`, JSON.stringify(next));
      return next;
    });
  };

  // Finance Entries
  const addFinanceEntry = async (entry: Omit<FinanceEntry, 'id'>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(entry)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Failed to add finance entry' };
      }
      setFinanceEntries(prev => [data.entry, ...prev]);
      return { success: true };
    } catch {
      const fallbackEntry: FinanceEntry = { ...entry, id: `fe-${Date.now()}` };
      setFinanceEntries(prev => [fallbackEntry, ...prev]);
      return { success: true };
    }
  };

  const deleteFinanceEntry = async (id: string) => {
    try {
      await fetch(`/api/finance/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {}
    setFinanceEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}finance`, JSON.stringify(next));
      return next;
    });
  };

  // Claims
  const addClaim = async (claimData: Omit<Claim, 'id' | 'dateSubmitted' | 'status'>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(claimData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Failed to file claim' };
      }
      setClaims(prev => [data.claim, ...prev]);
      return { success: true };
    } catch {
      const localClaim: Claim = {
        ...claimData,
        id: `clm-${Date.now().toString().slice(-6)}`,
        dateSubmitted: new Date().toISOString().split('T')[0],
        status: 'Submitted'
      };
      setClaims(prev => [localClaim, ...prev]);
      return { success: true };
    }
  };

  // Emergency Contacts
  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    try {
      const res = await fetch('/api/emergency-contacts', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(contact)
      });
      if (res.ok) {
        const data = await res.json();
        setEmergencyContacts(prev => [...prev, data.contact]);
        setSelectedEmergencyId(data.contact.id);
        return;
      }
    } catch {}
    const newContact: EmergencyContact = { ...contact, id: `em-user-${Date.now()}` };
    setEmergencyContacts(prev => [...prev, newContact]);
    setSelectedEmergencyId(newContact.id);
  };

  const updateEmergencyContact = async (id: string, updated: Partial<EmergencyContact>) => {
    try {
      await fetch(`/api/emergency-contacts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated)
      });
    } catch {}
    setEmergencyContacts(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteEmergencyContact = async (id: string) => {
    try {
      await fetch(`/api/emergency-contacts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch {}
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
    if (selectedEmergencyId === id) {
      setSelectedEmergencyId('em-np');
    }
  };

  // Modals
  const [isAddConcernOpen, setIsAddConcernOpen] = useState(false);
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false);
  const [isAddFinanceOpen, setIsAddFinanceOpen] = useState(false);
  const [isMakePaymentOpen, setIsMakePaymentOpen] = useState(false);
  const [isFileClaimOpen, setIsFileClaimOpen] = useState(false);
  const [isWellnessOpen, setIsWellnessOpen] = useState(false);
  const [isHerbalGuideOpen, setIsHerbalGuideOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<SupportProvider | null>(null);
  const [selectedPolicyForDetail, setSelectedPolicyForDetail] = useState<Policy | null>(null);

  // Export Data
  const exportAllData = () => {
    const data = {
      app: 'LifeShield Health & Personal Finance Support',
      version: '2026.09.25',
      exportTimestamp: new Date().toISOString(),
      user,
      policies,
      premiumStatus,
      healthConcerns,
      wellness,
      financeEntries,
      claims,
      emergencyContacts
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeshield_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Reset Data
  const resetAllData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setPolicies(INITIAL_POLICIES);
    setHealthConcerns(INITIAL_HEALTH_CONCERNS);
    setFinanceEntries(INITIAL_FINANCE_ENTRIES);
    setClaims(INITIAL_CLAIMS);
    setWellness(INITIAL_WELLNESS);
    setEmergencyContacts(INITIAL_EMERGENCY_CONTACTS);
    setSelectedEmergencyId('em-np');
    setPremiumStatus({
      totalPremium: 0,
      paidAmount: 0,
      pendingAmount: 0,
      percentage: 0,
      nextDueDate: 'No dues pending',
      autoDebitEnabled: false,
      bankAccount: ''
    });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        user,
        updateUser,
        policies,
        addPolicy,
        deletePolicy,
        premiumStatus,
        payPremium,
        latestReceipt,
        toggleAutoDebit,
        healthConcerns,
        addHealthConcern,
        deleteHealthConcern,
        wellness,
        updateWellness,
        financeEntries,
        addFinanceEntry,
        deleteFinanceEntry,
        claims,
        addClaim,
        providers,
        emergencyContacts,
        addEmergencyContact,
        updateEmergencyContact,
        deleteEmergencyContact,
        selectedEmergencyId,
        setSelectedEmergencyId,
        isAddEmergencyContactOpen,
        setIsAddEmergencyContactOpen,
        authUser,
        authToken,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        biometricEnabled,
        setBiometricEnabled,
        toggleBiometric,
        isAddConcernOpen,
        setIsAddConcernOpen,
        isAddPolicyOpen,
        setIsAddPolicyOpen,
        isAddFinanceOpen,
        setIsAddFinanceOpen,
        isMakePaymentOpen,
        setIsMakePaymentOpen,
        isFileClaimOpen,
        setIsFileClaimOpen,
        isWellnessOpen,
        setIsWellnessOpen,
        isHerbalGuideOpen,
        setIsHerbalGuideOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        selectedContact,
        setSelectedContact,
        selectedPolicyForDetail,
        setSelectedPolicyForDetail,
        exportAllData,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
