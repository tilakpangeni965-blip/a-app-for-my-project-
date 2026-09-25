import { UserProfile, Policy, HealthConcern, WellnessMetric, FinanceEntry, Claim, SupportProvider, EmergencyContact } from '../types';

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em-np',
    name: 'Nepal Police',
    number: '100',
    category: 'Official',
    description: 'National Police Emergency Control Room (24x7)',
    isDefault: true
  },
  {
    id: 'em-amb',
    name: 'Ambulance Support',
    number: '102',
    category: 'Medical',
    description: 'National Red Cross & Medical Emergency Ambulance Service (24x7)',
    isDefault: true
  },
  {
    id: 'em-fire',
    name: 'Fire Service (Damkal)',
    number: '101',
    category: 'Official',
    description: 'Fire Brigade & Disaster Rescue Dispatch',
    isDefault: true
  },
  {
    id: 'em-traf',
    name: 'Traffic Police',
    number: '103',
    category: 'Official',
    description: 'Metropolitan Traffic Police Emergency Line',
    isDefault: true
  },
  {
    id: 'em-child',
    name: 'Child Helpline / SOS',
    number: '1098',
    category: 'Official',
    description: 'National Child Protection Emergency Support',
    isDefault: true
  },
  {
    id: 'em-user-ice',
    name: 'Priya Sharma (Spouse)',
    number: '+977 9841 123456',
    category: 'Personal',
    description: 'Primary In Case of Emergency (ICE) contact',
    isDefault: false
  },
  {
    id: 'em-user-doc',
    name: 'Dr. Sunita Kulkarni (Family Doctor)',
    number: '+977 9801 234567',
    category: 'Medical',
    description: 'Personal Primary Physician / Clinic Desk',
    isDefault: false
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'User',
  greeting: 'Good morning,',
  email: 'user.healthwealth@lifeshield.org',
  phone: '+91 98765 43210',
  avatarUrl: '/src/assets/images/user_avatar_profile_1790311969325.jpg',
  emergencyContact: {
    name: 'Priya Sharma',
    phone: '+91 98765 12345',
    relation: 'Spouse'
  },
  consentAccepted: true,
  consentDate: '2026-09-01'
};

export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'pol-health-01',
    title: 'Health Insurance',
    subtitle: 'Family Floater Plan',
    type: 'health',
    policyNumber: 'HLTH-FLT-884920',
    status: 'Active',
    coverageLabel: 'Sum Insured',
    coverageAmount: 500000,
    coverageFormatted: '₹ 5,00,000',
    annualPremium: 12000,
    paidAmount: 9120,
    nextDueDate: '25 Oct 2025',
    renewalDate: '25 Oct 2026',
    beneficiary: 'Family (Self, Spouse & 1 Child)',
    insurer: 'Star Care Health Assurance',
    color: 'blue'
  },
  {
    id: 'pol-life-02',
    title: 'Life Insurance',
    subtitle: 'Term Plan',
    type: 'life',
    policyNumber: 'LIFE-TRM-339102',
    status: 'Active',
    coverageLabel: 'Coverage',
    coverageAmount: 5000000,
    coverageFormatted: '₹ 50,00,000',
    annualPremium: 5000,
    paidAmount: 3800,
    nextDueDate: '15 Nov 2025',
    renewalDate: '15 Nov 2026',
    beneficiary: 'Priya Sharma (Spouse)',
    insurer: 'National Life Security',
    color: 'emerald'
  },
  {
    id: 'pol-savings-03',
    title: 'Savings & Investment',
    subtitle: 'ULIP Plan',
    type: 'savings',
    policyNumber: 'ULIP-INV-550219',
    status: 'Active',
    coverageLabel: 'Fund Value',
    coverageAmount: 200000,
    coverageFormatted: '₹ 2,00,000',
    annualPremium: 3000,
    paidAmount: 2280,
    nextDueDate: '05 Dec 2025',
    renewalDate: '05 Dec 2026',
    beneficiary: 'Self (Retirement & Medical Reserve)',
    insurer: 'Apex Wealth Growth Trust',
    color: 'purple'
  }
];

export const INITIAL_WELLNESS: WellnessMetric = {
  steps: 6840,
  stepGoal: 10000,
  waterMl: 2100,
  waterGoalMl: 3000,
  sleepHours: 7.5,
  heartRateBpm: 72,
  bloodPressure: '118/78 mmHg',
  lastUpdated: 'Today at 08:30 AM',
  weeklyTrend: [
    { day: 'Mon', date: 'Sep 18', steps: 8420, waterMl: 2600, sleepHours: 7.2, heartRateBpm: 70 },
    { day: 'Tue', date: 'Sep 19', steps: 10150, waterMl: 3100, sleepHours: 8.0, heartRateBpm: 68 },
    { day: 'Wed', date: 'Sep 20', steps: 6540, waterMl: 2200, sleepHours: 6.5, heartRateBpm: 74 },
    { day: 'Thu', date: 'Sep 21', steps: 9320, waterMl: 2800, sleepHours: 7.4, heartRateBpm: 71 },
    { day: 'Fri', date: 'Sep 22', steps: 7890, waterMl: 2400, sleepHours: 7.0, heartRateBpm: 73 },
    { day: 'Sat', date: 'Sep 23', steps: 11400, waterMl: 3300, sleepHours: 8.2, heartRateBpm: 66 },
    { day: 'Sun', date: 'Sep 24', steps: 6840, waterMl: 2100, sleepHours: 7.5, heartRateBpm: 72 }
  ]
};

export const INITIAL_HEALTH_CONCERNS: HealthConcern[] = [
  {
    id: 'hc-01',
    title: 'Mild evening throat irritation & dry cough',
    description: 'Started 2 days ago after weather change. Mild tickle in throat in the evenings, no high fever. Tried warm salt water gargle.',
    category: 'Symptoms',
    date: '2026-09-22',
    severity: 'Mild',
    inputType: 'voice',
    voiceDuration: '0:34',
    doctorConsulted: false,
    notes: 'Monitoring temperature. If cough persists more than 4 days, booking physician checkup.'
  },
  {
    id: 'hc-02',
    title: 'Annual Preventive Lipid & Blood Sugar Panel',
    description: 'Routine blood tests uploaded. Fasting blood glucose normal (92 mg/dL), Total Cholesterol slightly elevated (208 mg/dL). Doctor advised 30 mins brisk walking daily and reducing fried food.',
    category: 'Chronic',
    date: '2026-09-15',
    severity: 'Mild',
    inputType: 'image',
    imageReportUrl: '/src/assets/images/health_wellness_banner_1790311957982.jpg',
    doctorConsulted: true,
    notes: 'Follow-up test scheduled in 3 months.'
  }
];

export const INITIAL_FINANCE_ENTRIES: FinanceEntry[] = [
  {
    id: 'fe-01',
    title: 'Monthly Salary Credit',
    category: 'Salary/Income',
    type: 'income',
    amount: 75000,
    date: '2026-09-01',
    notes: 'Direct bank deposit'
  },
  {
    id: 'fe-02',
    title: 'Health Insurance Premium (Q3 Installment)',
    category: 'Health Insurance',
    type: 'expense',
    amount: 3000,
    date: '2026-09-10',
    notes: 'Auto-debit from HDFC Bank'
  },
  {
    id: 'fe-03',
    title: 'Monthly Medicine & Pharmacy',
    category: 'Pharmacy',
    type: 'expense',
    amount: 1450,
    date: '2026-09-18',
    notes: 'Multivitamins, inhaler refill'
  },
  {
    id: 'fe-04',
    title: 'Emergency Medical Reserve Transfer',
    category: 'Emergency Fund',
    type: 'savings',
    amount: 10000,
    date: '2026-09-05',
    notes: 'High-yield liquid emergency savings'
  }
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'clm-2025-081',
    policyId: 'pol-health-01',
    policyTitle: 'Health Insurance (Family Floater)',
    patientName: 'Aarav Sharma (Self)',
    hospitalName: 'Apollo City Multispecialty Hospital',
    claimAmount: 18500,
    dateSubmitted: '2026-08-14',
    status: 'Approved',
    diagnosisOrReason: 'Acute viral gastroenteritis with day-care IV rehydration',
    hospitalizationDate: '2026-08-12',
    uploadedBillsCount: 4
  }
];

export const INITIAL_PROVIDERS: SupportProvider[] = [
  {
    id: 'prov-01',
    name: 'City Care Multispecialty Hospital',
    role: '24x7 Emergency & Inpatient Hospital',
    category: 'Hospital',
    organization: 'NABH Accredited Tertiary Center',
    location: 'Sector 14, Central Ring Road, Metro Station Gate 2',
    distanceKm: 2.1,
    phone: '+91 11 2789 4400',
    email: 'helpdesk@citycarehospital.org',
    availableHours: '24 Hours Open',
    verifiedDate: 'Sep 2025',
    verificationSource: 'NABH Registry & State Health Authority',
    rating: 4.8,
    reviewsCount: 320
  },
  {
    id: 'prov-02',
    name: 'Dr. Sunita Kulkarni, MD',
    role: 'Senior Consultant Physician & Diabetologist',
    category: 'Doctor',
    organization: 'Apex Wellness Clinic',
    location: 'Suite 204, Green Park Medical Enclave',
    distanceKm: 3.5,
    phone: '+91 98230 11223',
    email: 'dr.sunita@apexclinic.com',
    availableHours: 'Mon-Sat: 10:00 AM - 6:00 PM',
    verifiedDate: 'Aug 2025',
    verificationSource: 'Medical Council of India (Reg. 48821)',
    rating: 4.9,
    reviewsCount: 184
  },
  {
    id: 'prov-03',
    name: 'Vaidya Rameshwar Shastri (BAMS)',
    role: 'Traditional Ayurvedic Physician & Wellness Practitioner',
    category: 'Ayurveda & Herbal',
    organization: 'AyurShree Holistic Health Center',
    location: '44 Heritage Lane, Near Old Town Library',
    distanceKm: 4.8,
    phone: '+91 94120 77651',
    email: 'consult@ayurshree.in',
    availableHours: 'Tue-Sun: 9:00 AM - 1:00 PM, 5:00 PM - 8:00 PM',
    verifiedDate: 'Jul 2025',
    verificationSource: 'Ministry of AYUSH Practitioner Directory',
    rating: 4.7,
    reviewsCount: 96
  },
  {
    id: 'prov-04',
    name: 'Rajesh Singhal, CFP®',
    role: 'SEBI Registered Investment & Protection Advisor',
    category: 'Financial Advisor',
    organization: 'Fortress Financial Wealth Advisory',
    location: '8th Floor, World Trade Tower, Financial District',
    distanceKm: 5.2,
    phone: '+91 22 6600 8900',
    email: 'rajesh.singhal@fortresswealth.com',
    availableHours: 'Mon-Fri: 9:30 AM - 5:30 PM',
    verifiedDate: 'Sep 2025',
    verificationSource: 'SEBI Registered IA / FPSB India Registry',
    rating: 4.8,
    reviewsCount: 78
  },
  {
    id: 'prov-05',
    name: 'Star Care TPA & Insurance Helpdesk',
    role: 'Cashless Hospitalization & Claims Support Desk',
    category: 'Insurance Desk',
    organization: 'Star Care Health Assurance TPA Cell',
    location: 'Desk B-12, Ground Floor, City Care Hospital',
    distanceKm: 2.1,
    phone: '+91 1800 425 2255',
    email: 'support@starcareclaims.com',
    availableHours: '24x7 Toll-Free & Hospital Desk',
    verifiedDate: 'Sep 2025',
    verificationSource: 'IRDAI Approved TPA Registry',
    rating: 4.6,
    reviewsCount: 412
  }
];
