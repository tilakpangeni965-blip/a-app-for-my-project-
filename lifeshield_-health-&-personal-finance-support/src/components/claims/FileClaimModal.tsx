import React, { useState } from 'react';
import { X, CheckCircle2, Upload, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FileClaimModal: React.FC = () => {
  const { isFileClaimOpen, setIsFileClaimOpen, policies, addClaim, user } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id || '');
  const [patientName, setPatientName] = useState(user.name);
  const [hospitalName, setHospitalName] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [diagnosisOrReason, setDiagnosisOrReason] = useState('');
  const [hospitalizationDate, setHospitalizationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [uploadedFilesCount, setUploadedFilesCount] = useState(1);
  const [submittedClaimId, setSubmittedClaimId] = useState<string | null>(null);

  if (!isFileClaimOpen) return null;

  const selectedPolicy = policies.find((p) => p.id === selectedPolicyId) || policies[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(claimAmount);
    if (!hospitalName || isNaN(amount) || amount <= 0) return;

    addClaim({
      policyId: selectedPolicy.id,
      policyTitle: selectedPolicy.title,
      patientName: patientName.trim() || user.name,
      hospitalName: hospitalName.trim(),
      claimAmount: amount,
      diagnosisOrReason: diagnosisOrReason.trim() || 'General Hospitalization Claim',
      hospitalizationDate,
      uploadedBillsCount: Math.max(1, uploadedFilesCount)
    });

    const newId = `CLM-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedClaimId(newId);
    setStep(3);
  };

  const handleClose = () => {
    setIsFileClaimOpen(false);
    setStep(1);
    setSubmittedClaimId(null);
    setHospitalName('');
    setClaimAmount('');
    setDiagnosisOrReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              File an Insurance Claim
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              Step {step} of 3 • Cashless & Reimbursement
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-left">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  1. Select Insurance Policy *
                </label>
                <div className="space-y-2">
                  {policies.map((pol) => (
                    <div
                      key={pol.id}
                      onClick={() => setSelectedPolicyId(pol.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        selectedPolicyId === pol.id
                          ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-white font-medium ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{pol.title}</span>
                        <span className="text-blue-600 dark:text-blue-400">{pol.coverageFormatted}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {pol.subtitle} • {pol.policyNumber}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Continue to Hospital Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Hospital / Clinic Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Care Multispecialty Hospital"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Claim Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    placeholder="e.g. 24000"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    required
                    value={hospitalizationDate}
                    onChange={(e) => setHospitalizationDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Diagnosis / Treatment Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute appendicitis with laparoscopic surgery"
                  value={diagnosisOrReason}
                  onChange={(e) => setDiagnosisOrReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Document upload simulation */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Attach Bills & Discharge Summary
                </label>
                <div
                  onClick={() => setUploadedFilesCount((prev) => prev + 1)}
                  className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-400"
                >
                  <Upload className="w-4 h-4 text-blue-500" />
                  <span>
                    {uploadedFilesCount} Document(s) Attached (Tap to add more)
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-xs"
                >
                  Submit Claim to TPA
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Claim Request Logged
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reference: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{submittedClaimId}</span>
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Insurer Desk:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPolicy.insurer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Requested Amount:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹ {parseFloat(claimAmount || '0').toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Initial Status:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Under Fast-Track Review</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                You will receive status updates via your connected contact. Our hospital desk coordinator will assist with paperless processing.
              </p>

              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                View Claims Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
