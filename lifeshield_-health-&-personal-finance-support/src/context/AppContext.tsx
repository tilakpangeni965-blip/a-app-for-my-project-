import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TabType,
  UserProfile,
  Policy,
  HealthConcern,
  WellnessMetric,
  FinanceEntry,
  Claim,
  SupportProvider,
  EmergencyContact
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
  premiumStatus: PremiumInfo;
  payPremium: (amount: number, method: string) => void;
  toggleAutoDebit: () => void;
  healthConcerns: HealthConcern[];
  addHealthConcern: (concern: Omit<HealthConcern, 'id'>) => void;
  deleteHealthConcern: (id: string) => void;
  wellness: WellnessMetric;
  updateWellness: (patch: Partial<WellnessMetric>) => void;
  financeEntries: FinanceEntry[];
  addFinanceEntry: (entry: Omit<FinanceEntry, 'id'>) => void;
  deleteFinanceEntry: (id: string) => void;
  claims: Claim[];
  addClaim: (claim: Omit<Claim, 'id' | 'dateSubmitted' | 'status'>) => void;
  providers: SupportProvider[];

  // Emergency Contacts List Box
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  updateEmergencyContact: (id: string, updated: Partial<EmergencyContact>) => void;
  deleteEmergencyContact: (id: string) => void;
  selectedEmergencyId: string;
  setSelectedEmergencyId: (id: string) => void;
  isAddEmergencyContactOpen: boolean;
  setIsAddEmergencyContactOpen: (open: boolean) => void;
  
  // Modals & Action triggers
  isAddConcernOpen: boolean;
  setIsAddConcernOpen: (open: boolean) => void;
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

  const [viewMode, setViewMode] = useState<'frame' | 'full'>('frame');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}theme`, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // User state
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

  // Premium payment state
  const [premiumStatus, setPremiumStatus] = useState<PremiumInfo>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}premium_status`);
    if (saved) return JSON.parse(saved);
    return {
      totalPremium: 20000,
      paidAmount: 15200,
      pendingAmount: 4800,
      percentage: 76,
      nextDueDate: '25 Oct 2025',
      autoDebitEnabled: true,
      bankAccount: 'HDFC Bank **** 4321'
    };
  });

  const payPremium = (amount: number, method: string) => {
    setPremiumStatus(prev => {
      const newPaid = Math.min(prev.totalPremium, prev.paidAmount + amount);
      const newPending = Math.max(0, prev.totalPremium - newPaid);
      const newPct = Math.round((newPaid / prev.totalPremium) * 100);
      const next: PremiumInfo = {
        ...prev,
        paidAmount: newPaid,
        pendingAmount: newPending,
        percentage: newPct,
        nextDueDate: newPending === 0 ? 'All dues cleared for FY 2025-26' : prev.nextDueDate
      };
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}premium_status`, JSON.stringify(next));
      return next;
    });

    // Also record in finance entries
    addFinanceEntry({
      title: `Insurance Premium Payment via ${method}`,
      category: 'Health Insurance',
      type: 'expense',
      amount,
      date: new Date().toISOString().split('T')[0],
      notes: `Receipt generated for installment. Auto-debit confirmed.`
    });
  };

  const toggleAutoDebit = () => {
    setPremiumStatus(prev => {
      const next = { ...prev, autoDebitEnabled: !prev.autoDebitEnabled };
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}premium_status`, JSON.stringify(next));
      return next;
    });
  };

  // Health Concerns
  const [healthConcerns, setHealthConcerns] = useState<HealthConcern[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}concerns`);
    return saved ? JSON.parse(saved) : INITIAL_HEALTH_CONCERNS;
  });

  const addHealthConcern = (concern: Omit<HealthConcern, 'id'>) => {
    const newConcern: HealthConcern = {
      ...concern,
      id: `hc-${Date.now()}`
    };
    setHealthConcerns(prev => {
      const next = [newConcern, ...prev];
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}concerns`, JSON.stringify(next));
      return next;
    });
  };

  const deleteHealthConcern = (id: string) => {
    setHealthConcerns(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}concerns`, JSON.stringify(next));
      return next;
    });
  };

  // Wellness
  const [wellness, setWellness] = useState<WellnessMetric>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}wellness`);
    return saved ? JSON.parse(saved) : INITIAL_WELLNESS;
  });

  const updateWellness = (patch: Partial<WellnessMetric>) => {
    setWellness(prev => {
      const next = { ...prev, ...patch, lastUpdated: 'Just now' };
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}wellness`, JSON.stringify(next));
      return next;
    });
  };

  // Finance Entries
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}finance`);
    return saved ? JSON.parse(saved) : INITIAL_FINANCE_ENTRIES;
  });

  const addFinanceEntry = (entry: Omit<FinanceEntry, 'id'>) => {
    const newEntry: FinanceEntry = {
      ...entry,
      id: `fe-${Date.now()}`
    };
    setFinanceEntries(prev => {
      const next = [newEntry, ...prev];
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}finance`, JSON.stringify(next));
      return next;
    });
  };

  const deleteFinanceEntry = (id: string) => {
    setFinanceEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}finance`, JSON.stringify(next));
      return next;
    });
  };

  // Claims
  const [claims, setClaims] = useState<Claim[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}claims`);
    return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
  });

  const addClaim = (claimData: Omit<Claim, 'id' | 'dateSubmitted' | 'status'>) => {
    const newClaim: Claim = {
      ...claimData,
      id: `clm-${Date.now().toString().slice(-6)}`,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Submitted'
    };
    setClaims(prev => {
      const next = [newClaim, ...prev];
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}claims`, JSON.stringify(next));
      return next;
    });
  };

  // Providers Directory
  const [providers] = useState<SupportProvider[]>(INITIAL_PROVIDERS);

  // Emergency Contacts List
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}emergency_contacts`);
    if (saved) {
      try {
        const parsed: EmergencyContact[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const police = parsed.find(c => c.number === '100') || INITIAL_EMERGENCY_CONTACTS[0];
          const ambulance = parsed.find(c => c.number === '102') || INITIAL_EMERGENCY_CONTACTS[1];
          const others = parsed.filter(c => c.number !== '100' && c.number !== '102');
          return [
            { ...police, name: 'Nepal Police', number: '100', category: 'Official', isDefault: true },
            { ...ambulance, name: 'Ambulance Support', number: '102', category: 'Medical', isDefault: true },
            ...others
          ];
        }
      } catch {
        // Fallback to initial contacts
      }
    }
    return INITIAL_EMERGENCY_CONTACTS;
  });

  const [selectedEmergencyId, setSelectedEmergencyId] = useState<string>('em-np');
  const [isAddEmergencyContactOpen, setIsAddEmergencyContactOpen] = useState(false);

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: `em-user-${Date.now()}`
    };
    setEmergencyContacts(prev => {
      const next = [...prev, newContact];
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}emergency_contacts`, JSON.stringify(next));
      return next;
    });
    setSelectedEmergencyId(newContact.id);
  };

  const updateEmergencyContact = (id: string, updated: Partial<EmergencyContact>) => {
    setEmergencyContacts(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, ...updated } : c));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}emergency_contacts`, JSON.stringify(next));
      return next;
    });
  };

  const deleteEmergencyContact = (id: string) => {
    setEmergencyContacts(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}emergency_contacts`, JSON.stringify(next));
      return next;
    });
    if (selectedEmergencyId === id) {
      setSelectedEmergencyId('em-np');
    }
  };

  // Modals
  const [isAddConcernOpen, setIsAddConcernOpen] = useState(false);
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
      app: 'LifeShield Health & Wealth',
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
      totalPremium: 20000,
      paidAmount: 15200,
      pendingAmount: 4800,
      percentage: 76,
      nextDueDate: '25 Oct 2025',
      autoDebitEnabled: true,
      bankAccount: 'HDFC Bank **** 4321'
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
        premiumStatus,
        payPremium,
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
        isAddConcernOpen,
        setIsAddConcernOpen,
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
