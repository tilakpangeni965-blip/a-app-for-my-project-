import React from 'react';
import { FileCheck2, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClaimsScreen: React.FC = () => {
  const { claims, setIsFileClaimOpen } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Disbursed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
            {status}
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
            Under Review
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 text-left pb-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                Insurance Claims Portal
              </h1>
              <p className="text-[10px] text-slate-500">
                Cashless hospital authorization & reimbursement tracking
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFileClaimOpen(true)}
            className="self-start sm:self-auto flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>File Claim</span>
          </button>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Claim History & Tracking ({claims.length})
          </h2>
        </div>

        {claims.length === 0 ? (
          <div className="p-8 bg-white dark:bg-[#101b33] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
            <FileCheck2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No claims submitted yet
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
              If you had hospital admission or medical expenses, submit your claim directly here.
            </p>
            <button
              onClick={() => setIsFileClaimOpen(true)}
              className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium cursor-pointer"
            >
              Start New Claim
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 shadow-sm p-4 text-left transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Ref: {claim.id}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                      {claim.hospitalName}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {claim.diagnosisOrReason}
                    </p>
                  </div>
                  {getStatusBadge(claim.status)}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Claim Amount</span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                      ₹ {claim.claimAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Submitted On</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {claim.dateSubmitted}
                    </span>
                  </div>
                </div>

                {/* Progress bar timeline */}
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>Submitted</span>
                    <span>Document Verified</span>
                    <span>Approved</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        claim.status === 'Approved' || claim.status === 'Disbursed'
                          ? 'w-full bg-emerald-500'
                          : claim.status === 'Under Review'
                          ? 'w-2/3 bg-amber-500'
                          : 'w-1/3 bg-blue-500'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
