import React from 'react';
import { X, Bell, Calendar, ShieldCheck, HeartPulse, Receipt, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    premiumStatus,
    claims,
    latestReceipt,
    wellness
  } = useApp();

  if (!isNotificationsOpen) return null;

  interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    icon: any;
    color: string;
  }

  const realNotifications: NotificationItem[] = [];

  if (premiumStatus.pendingAmount > 0) {
    realNotifications.push({
      id: 'notif-premium',
      title: 'Premium Payment Due',
      message: `₹ ${premiumStatus.pendingAmount.toLocaleString('en-IN')} pending for your active policies. Due on ${premiumStatus.nextDueDate}.`,
      time: 'Action Required',
      icon: Calendar,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950'
    });
  }

  claims.forEach((claim) => {
    realNotifications.push({
      id: `notif-claim-${claim.id}`,
      title: `Claim Ref: ${claim.id}`,
      message: `Your claim for ${claim.hospitalName} (₹ ${claim.claimAmount.toLocaleString('en-IN')}) is currently ${claim.status}.`,
      time: claim.dateSubmitted,
      icon: ShieldCheck,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950'
    });
  });

  if (latestReceipt) {
    realNotifications.push({
      id: `notif-payment-${latestReceipt.txnId}`,
      title: 'Payment Confirmed',
      message: `Payment of ₹ ${latestReceipt.amount.toLocaleString('en-IN')} was confirmed via ${latestReceipt.method}.`,
      time: 'Recent',
      icon: Receipt,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950'
    });
  }

  if (wellness.steps > 0) {
    const pct = Math.round((wellness.steps / wellness.stepGoal) * 100);
    realNotifications.push({
      id: 'notif-steps',
      title: 'Daily Activity Progress',
      message: `You have completed ${wellness.steps.toLocaleString()} of your ${wellness.stepGoal.toLocaleString()} daily step goal (${pct}%).`,
      time: 'Today',
      icon: HeartPulse,
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950'
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Notifications & Alerts
            </h3>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 text-left">
          {realNotifications.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                You&apos;re all caught up
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                No active notifications or pending reminders for your account.
              </p>
            </div>
          ) : (
            realNotifications.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                      {n.message}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
