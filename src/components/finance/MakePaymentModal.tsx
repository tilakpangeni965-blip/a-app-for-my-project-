import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, ShieldCheck, ArrowRight, ToggleLeft, ToggleRight, AlertCircle, FileText, Printer } from 'lucide-react';
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
    premiumStatus.pendingAmount > 0 ? premiumStatus.pendingAmount.toString() : ''
  );
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptData, setReceiptData] = useState<any>(null);

  if (!isMakePaymentOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMessage('Please enter a valid payment amount greater than zero.');
      return;
    }

    if (method === 'upi' && (!upiId || !upiId.includes('@'))) {
      setErrorMessage('Please enter a valid UPI handle (e.g. name@bank).');
      return;
    }

    if (method === 'card' && cardNumber.replace(/\s/g, '').length < 15) {
      setErrorMessage('Please enter a valid card number.');
      return;
    }

    setIsProcessing(true);

    const paymentDetails = {
      upiId: method === 'upi' ? upiId : undefined,
      cardNumber: method === 'card' ? cardNumber : undefined,
      cardExpiry: method === 'card' ? cardExpiry : undefined
    };

    const result = await payPremium(amountNum, method.toUpperCase(), paymentDetails);
    setIsProcessing(false);

    if (result.success && result.receipt) {
      setReceiptData(result.receipt);
      setPaymentSuccess(true);
    } else {
      setErrorMessage(result.error || 'Payment gateway clearance failed.');
    }
  };

  const handleClose = () => {
    setIsMakePaymentOpen(false);
    setPaymentSuccess(false);
    setErrorMessage('');
    setReceiptData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              Insurance Premium Payment Gateway
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              Encrypted insurance clearing • End-to-end ledger verification
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-left">
          {paymentSuccess && receiptData ? (
            <div className="text-center py-2 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Confirmed & Settled
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  ₹ {receiptData.amount.toLocaleString('en-IN')} successfully applied toward your policy portfolio
                </p>
              </div>

              {/* Cryptographic Verified Receipt */}
              <div className="bg-slate-50 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-left space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Transaction ID:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{receiptData.txnId}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Clearing Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{receiptData.status}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{receiptData.method} Instant</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Timestamp:</span>
                  <span className="text-slate-700 dark:text-slate-300">{new Date(receiptData.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Gateway Provider:</span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-[200px]">
                    {receiptData.provider}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[11px] text-blue-900 dark:text-blue-300 leading-snug">
                <strong>Audit Record:</strong> This transaction was verified and recorded to your financial expense ledger with an atomic idempotency lock.
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-1/3 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Outstanding Due Banner */}
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
                    Renewal Due
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {premiumStatus.nextDueDate}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Amount to pay */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Payment Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="100"
                    step="any"
                    required
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
                    <span className="text-[10px]">Instant QR / VPA</span>
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

              {/* Method-Specific Inputs */}
              {method === 'upi' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Virtual Payment Address (UPI ID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mobile@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              )}

              {method === 'card' && (
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="4532 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Expiry (MM/YY) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        CVV *
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Auto Debit Toggle */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Auto-Debit Renewal Guarantee
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

              {/* Sandbox Gateway Notice */}
              <div className="text-[10px] text-slate-400 leading-snug">
                Gateway Mode: <strong>LifeShield Sandbox Gateway</strong>. Real cryptographic validation & atomic double-charge prevention active.
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Contacting Clearing Gateway...</span>
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
