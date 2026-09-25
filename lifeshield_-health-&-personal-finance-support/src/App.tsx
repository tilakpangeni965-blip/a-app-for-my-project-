/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { HomeScreen } from './components/home/HomeScreen';
import { PoliciesScreen } from './components/policies/PoliciesScreen';
import { HealthScreen } from './components/health/HealthScreen';
import { FinanceScreen } from './components/finance/FinanceScreen';
import { ClaimsScreen } from './components/claims/ClaimsScreen';
import { MoreScreen } from './components/more/MoreScreen';
import { AddConcernModal } from './components/health/AddConcernModal';
import { WellnessTrackerModal } from './components/health/WellnessTrackerModal';
import { HerbalGuideModal } from './components/health/HerbalGuideModal';
import { PolicyDetailsModal } from './components/policies/PolicyDetailsModal';
import { AddFinanceEntryModal } from './components/finance/AddFinanceEntryModal';
import { MakePaymentModal } from './components/finance/MakePaymentModal';
import { FileClaimModal } from './components/claims/FileClaimModal';
import { ContactConfirmModal } from './components/support/ContactConfirmModal';
import { NotificationsModal } from './components/more/NotificationsModal';
import { WelcomeConsentModal } from './components/common/WelcomeConsentModal';
import { AddEmergencyContactModal } from './components/common/AddEmergencyContactModal';

const MainAppContent: React.FC = () => {
  const { activeTab, selectedContact, setSelectedContact } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'policies':
        return <PoliciesScreen />;
      case 'health':
        return <HealthScreen />;
      case 'claims':
        return <ClaimsScreen />;
      case 'more':
        return <MoreScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <DeviceFrame>
      {renderActiveScreen()}

      {/* Global Interactive Modals */}
      <AddConcernModal />
      <WellnessTrackerModal />
      <HerbalGuideModal />
      <PolicyDetailsModal />
      <AddFinanceEntryModal />
      <MakePaymentModal />
      <FileClaimModal />
      <NotificationsModal />
      <WelcomeConsentModal />
      <AddEmergencyContactModal />
      <ContactConfirmModal
        provider={selectedContact}
        onClose={() => setSelectedContact(null)}
      />
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
