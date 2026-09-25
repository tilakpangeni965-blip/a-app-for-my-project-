import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, ShieldCheck, ArrowRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MakePaymentModal: React.FC = () => {
  const {
    isMakePaymentOpen,
    setIsMakePaymentOpen,
    premiumStatus,
    payPremium,
    toggleAutoDebit
  } = useApp();

  const [paymentAmount, setPaymentAmount] = useState<string>(
    premiumStatus.pendingAmount > 0 ? premiumStatus.pendingAmount.toString() : '2000'
  );
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptTxnId, setReceiptTxnId] = useState('');

  if (!isMakePaymentOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const txnId = `TXN-${Date.now().toString().slice(-8)}`;
      setReceiptTxnId(txnId);
      setPaymentSuccess(true);
      payPremium(amountNum, method.toUpperCase());
    }, 1200);
  };

  const handleClose = () => {
    setIsMakePaymentOpen(false);
    setPaymentSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              Premium Payment Gateway
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              Secure insurance premium clearing & auto-debit
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
          {paymentSuccess ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Successful!
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  ₹ {parseFloat(paymentAmount).toLocaleString('en-IN')} paid towards policy renewal
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-left space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Transaction ID:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{receiptTxnId}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Payment Channel:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{method.toUpperCase()} Instant</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Timestamp:</span>
                  <span className="text-slate-700 dark:text-slate-300">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                Active policies updated. Your progress chart now reflects this contribution!
              </p>

              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Premium Status summary */}
              <div className="bg-slate-50 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Outstanding Due
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                    ₹ {premiumStatus.pendingAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                    Due Date
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {premiumStatus.nextDueDate}
                  </span>
                </div>
              </div>

              {/* Amount to pay */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="100"
                    step="any"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('upi')}
                    className={`py-2 px-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      method === 'upi'
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold">UPI</span>
                    <span className="text-[10px]">GPay / PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`py-2 px-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      method === 'card'
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px]">Debit / Credit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('netbanking')}
                    className={`py-2 px-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      method === 'netbanking'
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px]">Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Auto Debit Toggle */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Auto-Debit Protection
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Linked: {premiumStatus.bankAccount}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleAutoDebit}
                  className="cursor-pointer text-blue-600 dark:text-blue-400 p-1"
                >
                  {premiumStatus.autoDebitEnabled ? (
                    <ToggleRight className="w-7 h-7 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-400" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing secure transaction...</span>
                ) : (
                  <>
                    <span>Pay ₹ {parseFloat(paymentAmount || '0').toLocaleString('en-IN')} Securely</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
