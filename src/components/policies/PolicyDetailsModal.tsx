import React, { useState } from 'react';
import { X, Shield, Download, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PolicyDetailsModal: React.FC = () => {
  const {
    selectedPolicyForDetail,
    setSelectedPolicyForDetail,
    setIsFileClaimOpen,
    setIsMakePaymentOpen
  } = useApp();

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!selectedPolicyForDetail) return null;

  const policy = selectedPolicyForDetail;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Policy Details
            </h3>
          </div>
          <button
            onClick={() => setSelectedPolicyForDetail(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-left">
          {/* Main Card */}
          <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  {policy.insurer}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {policy.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {policy.subtitle}
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                {policy.status}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Policy Number</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums font-mono text-[11px]">
                  {policy.policyNumber}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">{policy.coverageLabel}</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {policy.coverageFormatted}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Next Due Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {policy.nextDueDate}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Annual Premium</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  ₹ {policy.annualPremium.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Beneficiary Info */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Covered Members / Beneficiary</span>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {policy.beneficiary}
            </div>
            <p className="text-[11px] text-slate-500">
              Cashless hospital network access active nationwide across 12,000+ NABH partner facilities.
            </p>
          </div>

          {downloadSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Policy document and card saved to device downloads.</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                setSelectedPolicyForDetail(null);
                setIsFileClaimOpen(true);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>File a Claim Under this Policy</span>
            </button>

            <button
              onClick={() => {
                setSelectedPolicyForDetail(null);
                setIsMakePaymentOpen(true);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Manage Premium & Auto-Debit</span>
            </button>

            <button
              onClick={handleDownload}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Policy Schedule (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
