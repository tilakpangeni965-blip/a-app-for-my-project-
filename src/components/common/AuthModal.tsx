import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  ScanFace,
  Loader2,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authUser,
    login,
    register,
    logout,
    biometricEnabled,
    toggleBiometric
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Biometric simulation states
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [biometricScanStep, setBiometricScanStep] = useState<string>('');
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [testSensorSuccess, setTestSensorSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (mode === 'login') {
      const result = await login(email, password);
      setIsLoading(false);
      if (result.success) {
        setSuccessMessage('Logged in successfully');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMessage('');
        }, 800);
      } else {
        setErrorMessage(result.error || 'Login failed');
      }
    } else {
      const result = await register(name, email, password, phone);
      setIsLoading(false);
      if (result.success) {
        setSuccessMessage('Account created and logged in successfully!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMessage('');
        }, 800);
      } else {
        setErrorMessage(result.error || 'Registration failed');
      }
    }
  };

  const handleBiometricAuth = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsBiometricScanning(true);
    setBiometricSuccess(false);

    try {
      // Step 1: Initialize hardware simulation
      setBiometricScanStep('Requesting biometric credentials from hardware enclave...');
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: Fingerprint / Facial Recognition match
      setBiometricScanStep('Scanning biometric geometry (Touch ID / Face ID)...');
      await new Promise((r) => setTimeout(r, 700));

      // Step 3: Cryptographic verification
      setBiometricScanStep('Validating hardware signature...');
      await new Promise((r) => setTimeout(r, 500));

      setBiometricSuccess(true);
      setBiometricScanStep('Biometric identity confirmed!');
      await new Promise((r) => setTimeout(r, 400));

      // Automatically authenticate with existing or default secure account
      const authEmail = email.trim() || 'user.healthwealth@lifeshield.org';
      const authPassword = password || 'Password123!';

      const result = await login(authEmail, authPassword);
      if (result.success) {
        setSuccessMessage('Biometric authentication confirmed. Vault unlocked!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setIsBiometricScanning(false);
          setBiometricSuccess(false);
          setSuccessMessage('');
        }, 900);
      } else {
        setIsBiometricScanning(false);
        setErrorMessage(result.error || 'Biometric authentication failed. Please enter your password.');
      }
    } catch {
      setIsBiometricScanning(false);
      setErrorMessage('Biometric simulation timed out. Please use password login.');
    }
  };

  const handleTestSensor = async () => {
    setIsLoading(true);
    setTestSensorSuccess(false);
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
    setTestSensorSuccess(true);
    setTimeout(() => setTestSensorSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col text-left">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              {biometricEnabled ? <Fingerprint className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {authUser ? 'Account & Security' : mode === 'login' ? 'Sign In to LifeShield' : 'Create Account'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {authUser ? 'Security preferences active' : 'Secure vault & biometric protection'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isBiometricScanning) setIsBiometricScanning(false);
              setIsAuthModalOpen(false);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {authUser ? (
            <div className="space-y-4">
              {/* Authenticated User Info */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {authUser.name}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    {authUser.email}
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    Role: {authUser.role.toUpperCase()} • Authenticated Session
                  </div>
                </div>
              </div>

              {/* Biometric Security Setting Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      biometricEnabled
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <Fingerprint className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        Biometric Security
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Face ID & Touch ID hardware simulation
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={toggleBiometric}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      biometricEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        biometricEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {biometricEnabled
                    ? 'Biometric protection is enabled. Sensitive health records, transactions, and insurance claims require biometric verification.'
                    : 'Biometric protection is currently disabled. Toggle on to simulate biometric unlock on this device.'}
                </div>

                {biometricEnabled && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleTestSensor}
                      disabled={isLoading}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Testing Sensor...</span>
                        </>
                      ) : testSensorSuccess ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 dark:text-emerald-400">Sensor Operational!</span>
                        </>
                      ) : (
                        <>
                          <ScanFace className="w-3 h-3" />
                          <span>Test Biometric Sensor</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Enclave Ready
                    </span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500">
                Your medical concerns, policy numbers, and financial records are cryptographically protected.
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <>
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setIsBiometricScanning(false);
                  }}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                    setIsBiometricScanning(false);
                  }}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Register
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-600 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Biometric Scanning Overlay Simulation */}
              {isBiometricScanning ? (
                <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border-2 border-blue-500/40 dark:border-blue-500/30 text-center space-y-3.5">
                  <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                    <div className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-colors ${
                      biometricSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {biometricSuccess ? (
                        <CheckCircle2 className="w-7 h-7" />
                      ) : (
                        <Fingerprint className="w-7 h-7 animate-pulse" />
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {biometricSuccess ? 'Authentication Verified' : 'Simulating Biometric Verification'}
                    </h4>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1">
                      {biometricScanStep}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsBiometricScanning(false)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      Cancel and use password
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Biometric Toggle Card in Modal */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        biometricEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        <Fingerprint className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-900 dark:text-white">
                          Biometric Simulation
                        </div>
                        <div className="text-[9px] text-slate-500">
                          Touch ID & Face ID device unlock
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleBiometric}
                      className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        biometricEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      title="Toggle simulated biometric hardware support"
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                          biometricEnabled ? 'translate-x-3' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* One-click biometric sign-in button if enabled in login mode */}
                  {mode === 'login' && biometricEnabled && (
                    <button
                      type="button"
                      onClick={handleBiometricAuth}
                      disabled={isLoading}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Fingerprint className="w-4 h-4" />
                      <span>One-Tap Biometric Sign In</span>
                    </button>
                  )}

                  {mode === 'login' && biometricEnabled && (
                    <div className="relative flex py-1 items-center">
                      <div className="grow border-t border-slate-200 dark:border-slate-800" />
                      <span className="shrink mx-2 text-[10px] text-slate-400 uppercase font-medium">or enter password</span>
                      <div className="grow border-t border-slate-200 dark:border-slate-800" />
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {mode === 'register' && (
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Aarav Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="you@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Password * {mode === 'register' && <span className="text-[10px] text-slate-400">(Min. 8 characters)</span>}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="password"
                          required
                          minLength={8}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Phone Number (Optional)
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <span>{isLoading ? 'Processing...' : mode === 'login' ? 'Sign In Securely' : 'Create Encrypted Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    Demo Account: <strong>user.healthwealth@lifeshield.org</strong> / <strong>Password123!</strong>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
