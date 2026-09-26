import { UserProfile, Policy, HealthConcern, WellnessMetric, FinanceEntry, Claim, SupportProvider, EmergencyContact } from '../types';

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em-np',
    name: 'Police Emergency',
    number: '100',
    category: 'Official',
    description: 'National Police Control Room (24x7)',
    isDefault: true
  },
  {
    id: 'em-amb',
    name: 'Ambulance & Medical Emergency',
    number: '102',
    category: 'Medical',
    description: 'Emergency Medical & Red Cross Ambulance Dispatch (24x7)',
    isDefault: true
  },
  {
    id: 'em-fire',
    name: 'Fire Brigade & Rescue',
    number: '101',
    category: 'Official',
    description: 'Fire Emergency & Disaster Response (24x7)',
    isDefault: true
  },
  {
    id: 'em-child',
    name: 'Child Helpline',
    number: '1098',
    category: 'Official',
    description: 'National Child Safety & Emergency Hotline',
    isDefault: true
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'User',
  greeting: 'Welcome to LifeShield',
  email: '',
  phone: '',
  avatarUrl: '/src/assets/images/user_avatar_profile_1790311969325.jpg',
  emergencyContact: {
    name: '',
    phone: '',
    relation: ''
  },
  consentAccepted: true,
  consentDate: new Date().toISOString().split('T')[0]
};

export const INITIAL_POLICIES: Policy[] = [];

export const INITIAL_WELLNESS: WellnessMetric = {
  steps: 0,
  stepGoal: 10000,
  waterMl: 0,
  waterGoalMl: 2500,
  sleepHours: 0,
  heartRateBpm: 0,
  bloodPressure: '--/--',
  lastUpdated: 'No vitals logged yet',
  weeklyTrend: []
};

export const INITIAL_HEALTH_CONCERNS: HealthConcern[] = [];

export const INITIAL_FINANCE_ENTRIES: FinanceEntry[] = [];

export const INITIAL_CLAIMS: Claim[] = [];

export const INITIAL_PROVIDERS: SupportProvider[] = [
  {
    id: 'prov-01',
    name: 'City Care Multispecialty Hospital',
    role: 'Emergency & Inpatient Hospital',
    category: 'Hospital',
    organization: 'NABH Accredited Tertiary Center',
    location: 'Central Ring Road, Sector 14',
    distanceKm: 2.1,
    phone: '+91 11 2789 4400',
    email: 'helpdesk@citycarehospital.org',
    availableHours: '24x7 Emergency Services',
    verifiedDate: 'Sep 2025',
    verificationSource: 'NABH Registry',
    rating: 4.8,
    reviewsCount: 320
  },
  {
    id: 'prov-02',
    name: 'Dr. Sunita Kulkarni, MD',
    role: 'Senior Consultant Physician',
    category: 'Doctor',
    organization: 'Apex Wellness Clinic',
    location: 'Suite 204, Green Park Medical Enclave',
    distanceKm: 3.5,
    phone: '+91 98230 11223',
    email: 'dr.sunita@apexclinic.com',
    availableHours: 'Mon-Sat: 10:00 AM - 6:00 PM',
    verifiedDate: 'Aug 2025',
    verificationSource: 'Medical Council Registry',
    rating: 4.9,
    reviewsCount: 184
  },
  {
    id: 'prov-03',
    name: 'Vaidya Rameshwar Shastri (BAMS)',
    role: 'Ayurvedic & Herbal Practitioner',
    category: 'Ayurveda & Herbal',
    organization: 'AyurShree Holistic Health Center',
    location: '44 Heritage Lane',
    distanceKm: 4.8,
    phone: '+91 94120 77651',
    email: 'consult@ayurshree.in',
    availableHours: 'Tue-Sun: 9:00 AM - 1:00 PM, 5:00 PM - 8:00 PM',
    verifiedDate: 'Jul 2025',
    verificationSource: 'AYUSH Practitioner Directory',
    rating: 4.7,
    reviewsCount: 96
  },
  {
    id: 'prov-04',
    name: 'Rajesh Singhal, CFP®',
    role: 'Investment & Protection Advisor',
    category: 'Financial Advisor',
    organization: 'Fortress Financial Wealth Advisory',
    location: '8th Floor, World Trade Tower',
    distanceKm: 5.2,
    phone: '+91 22 6600 8900',
    email: 'rajesh.singhal@fortresswealth.com',
    availableHours: 'Mon-Fri: 9:30 AM - 5:30 PM',
    verifiedDate: 'Sep 2025',
    verificationSource: 'SEBI Registered IA',
    rating: 4.8,
    reviewsCount: 78
  },
  {
    id: 'prov-05',
    name: 'Star Care TPA & Insurance Desk',
    role: 'Cashless Hospitalization Claims Desk',
    category: 'Insurance Desk',
    organization: 'Star Care Health Assurance TPA Cell',
    location: 'Ground Floor, City Care Hospital',
    distanceKm: 2.1,
    phone: '+91 1800 425 2255',
    email: 'support@starcareclaims.com',
    availableHours: '24x7 Toll-Free Support',
    verifiedDate: 'Sep 2025',
    verificationSource: 'IRDAI Approved TPA Registry',
    rating: 4.6,
    reviewsCount: 412
  }
];
