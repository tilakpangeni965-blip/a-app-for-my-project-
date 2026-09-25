import React from 'react';
import { HeroBanner } from './HeroBanner';
import { ActivePoliciesCard } from './ActivePoliciesCard';
import { PremiumStatusCard } from './PremiumStatusCard';
import { QuickActionsGrid } from './QuickActionsGrid';
import { WellnessPromoCard } from './WellnessPromoCard';

export const HomeScreen: React.FC = () => {
  return (
    <div className="space-y-1">
      {/* 1. Hero Landscape Banner */}
      <HeroBanner />

      {/* 2. Active Policies List */}
      <ActivePoliciesCard />

      {/* 3. Premium Payment Status Donut Card */}
      <PremiumStatusCard />

      {/* 4. Quick Actions 6-Grid */}
      <QuickActionsGrid />

      {/* 5. Bottom Health & Wellness Promo Card */}
      <WellnessPromoCard />
    </div>
  );
};
