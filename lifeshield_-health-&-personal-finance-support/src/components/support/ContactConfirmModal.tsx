import React, { useState } from 'react';
import { X, Phone, Mail, MessageSquare, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportProvider } from '../../types';

interface ContactConfirmModalProps {
  provider: SupportProvider | null;
  onClose: () => void;
}

export const ContactConfirmModal: React.FC<ContactConfirmModalProps> = ({ provider, onClose }) => {
  const { user } = useApp();
  const [contactMode, setContactMode] = useState<'call' | 'email' | 'message'>('call');
  const [customNote, setCustomNote] = useState(
    `Hello, I would like to inquire about consultation and support services for ${user.name}.`
  );
  const [includeHealthSummary, setIncludeHealthSummary] = useState(false);
  const [hasConfirmedReview, setHasConfirmedReview] = useState(false);

  if (!provider) return null;

  const handleExecuteAction = () => {
    if (contactMode === 'call') {
      window.location.href = `tel:${provider.phone.replace(/\s+/g, '')}`;
    } else if (contactMode === 'email') {
      const subject = encodeURIComponent(`Inquiry from LifeShield User: ${user.name}`);
      const body = encodeURIComponent(customNote);
      window.location.href = `mailto:${provider.email}?subject=${subject}&body=${body}`;
    } else if (contactMode === 'message') {
      const text = encodeURIComponent(customNote);
      window.location.href = `sms:${provider.phone.replace(/\s+/g, '')}?body=${text}`;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              Pre-Contact Review & Safety Check
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              Review details before connecting to an external service
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-left">
          {/* Recipient Details */}
          <div className="bg-slate-50 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase block">
              Recipient Information
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {provider.name}
            </div>
            <div className="text-[11px] text-slate-500">
              {provider.role} • {provider.organization}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified: {provider.verifiedDate} via {provider.verificationSource}</span>
            </div>
          </div>

          {/* Action Choice: Call, Message, Email */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Contact Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setContactMode('call')}
                className={`py-2 px-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  contactMode === 'call'
                    ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span className="text-[11px]">Phone Call</span>
              </button>

              <button
                type="button"
                onClick={() => setContactMode('message')}
                className={`py-2 px-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  contactMode === 'message'
                    ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-[11px]">SMS / Text</span>
              </button>

              <button
                type="button"
                onClick={() => setContactMode('email')}
                className={`py-2 px-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  contactMode === 'email'
                    ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span className="text-[11px]">Email</span>
              </button>
            </div>
          </div>

          {/* Details & Target Display */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase mb-0.5">
              Target Destination:
            </span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {contactMode === 'email' ? provider.email : provider.phone}
            </span>
          </div>

          {/* Message preview if email or message */}
          {contactMode !== 'call' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Draft Message Content (Editable before sending)
              </label>
              <textarea
                rows={3}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none"
              />
            </div>
          )}

          {/* Safety Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={hasConfirmedReview}
              onChange={(e) => setHasConfirmedReview(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>
              I have reviewed the destination details and explicitly authorize opening my device's native {contactMode} client.
            </span>
          </label>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!hasConfirmedReview}
              onClick={handleExecuteAction}
              className="w-2/3 py-2.5 bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Confirm & Launch {contactMode.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
