import React, { useState } from 'react';
import { Shield, Lock, Heart, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WelcomeConsentModal: React.FC = () => {
  const { user, updateUser } = useApp();
  const [isOpen, setIsOpen] = useState(!user.consentAccepted);
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    updateUser({
      consentAccepted: true,
      consentDate: new Date().toISOString()
    });
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0f172a] max-w-sm w-full rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl text-left space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md">
          <Shield className="w-6 h-6 stroke-[2.2]" />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            Welcome to LifeShield
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Your private companion for organizing health concerns and personal finances.
          </p>
        </div>

        <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block">
                Strict Data Privacy
              </strong>
              Your records are stored securely on this device and never shared without your explicit confirmation.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Heart className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block">
                General Health & Financial Support
              </strong>
              This application helps organize your notes, claims, and policies. It does not provide medical diagnosis or certified investment advice.
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>
              I understand how my information is handled and agree to proceed.
            </span>
          </label>

          <button
            type="button"
            disabled={!agreed}
            onClick={handleAccept}
            className="w-full py-2.5 bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Get Started</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
