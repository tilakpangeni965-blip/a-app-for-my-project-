import React, { useState } from 'react';
import {
  User,
  Shield,
  Download,
  Trash2,
  Moon,
  Sun,
  Lock,
  PhoneCall,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MoreScreen: React.FC = () => {
  const {
    user,
    updateUser,
    theme,
    toggleTheme,
    exportAllData,
    resetAllData,
    setActiveTab,
    updateEmergencyContact,
    biometricEnabled,
    toggleBiometric,
    setIsAuthModalOpen
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [emergencyName, setEmergencyName] = useState(user.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyContact.phone);
  const [emergencyRelation, setEmergencyRelation] = useState(user.emergencyContact.relation);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedName = emergencyName.trim();
    const updatedPhone = emergencyPhone.trim();
    const updatedRel = emergencyRelation.trim();

    updateUser({
      name: name.trim() || 'User',
      phone: phone.trim(),
      emergencyContact: {
        name: updatedName,
        phone: updatedPhone,
        relation: updatedRel
      }
    });

    if (updatedName) {
      updateEmergencyContact('em-user-ice', {
        name: `${updatedName} (${updatedRel || 'ICE'})`,
        number: updatedPhone,
        category: 'Personal',
        description: 'Primary In Case of Emergency (ICE) Contact'
      });
    }

    setSaveProfileSuccess(true);
    setTimeout(() => {
      setSaveProfileSuccess(false);
      setIsEditingProfile(false);
    }, 1200);
  };

  const handleConfirmDelete = () => {
    resetAllData();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-4 text-left pb-6">
      {/* Profile Card */}
      <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/20 bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                {user.name.charAt(0)}
              </span>
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {user.name}
              </h2>
              {user.email && (
                <p className="text-[11px] text-slate-500">
                  {user.email}
                </p>
              )}
              {user.phone && (
                <p className="text-[11px] text-slate-500 font-mono">
                  {user.phone}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {isEditingProfile ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Your Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Emergency Contact (ICE)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Relation (e.g. Spouse)"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Emergency Phone"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white mt-1.5"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              {saveProfileSuccess ? 'Saved!' : 'Save Profile Changes'}
            </button>
          </form>
        )}

        {/* Emergency Contact Badge */}
        {!isEditingProfile && user.emergencyContact.name && (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Emergency Contact</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {user.emergencyContact.name} ({user.emergencyContact.relation})
              </span>
            </div>
            <a
              href={`tel:${user.emergencyContact.phone.replace(/\s+/g, '')}`}
              className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-rose-200/60 dark:border-rose-900/60 cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Call ICE</span>
            </a>
          </div>
        )}
      </div>

      {/* Preferences & Settings */}
      <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
          Preferences
        </h2>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-sky-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <span className="text-xs text-slate-700 dark:text-slate-300">Appearance</span>
          </div>

          <button
            onClick={toggleTheme}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        {/* Biometric Security Simulation Toggle */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Fingerprint className={`w-4 h-4 ${biometricEnabled ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
            <div>
              <span className="text-xs text-slate-700 dark:text-slate-300 block">Biometric Security</span>
              <span className="text-[10px] text-slate-400 block">Touch ID / Face ID Vault Protection</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
            >
              Configure
            </button>
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
        </div>

        {/* Support Directory Link */}
        <div
          onClick={() => setActiveTab('support')}
          className="flex items-center justify-between py-1 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-slate-700 dark:text-slate-300">Care & Support Directory</span>
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Open →</span>
        </div>
      </div>

      {/* Privacy & Data Management */}
      <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-500" />
          <h2 className="text-xs font-bold text-slate-900 dark:text-white">
            Privacy & Data Controls
          </h2>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          LifeShield stores your health concerns and personal financial records privately. No personal data is shared with external third-party advertisers.
        </p>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <button
            onClick={exportAllData}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Stored Data</span>
          </button>
        </div>
      </div>

      {/* Medical & Financial Notices */}
      <div className="bg-slate-100/80 dark:bg-slate-900/60 rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5 text-[10px] text-slate-500 leading-tight">
        <span className="font-semibold text-slate-700 dark:text-slate-300 block">
          Important Disclaimers
        </span>
        <p>
          <strong>Health Notice:</strong> Information organized in LifeShield is for personal record-keeping only and does not substitute professional medical diagnosis, advice, or treatment.
        </p>
        <p>
          <strong>Financial Notice:</strong> Policy and financial logs are user-managed trackers and do not constitute formal financial, insurance underwriting, or legal advice.
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0f172a] max-w-sm w-full rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Clear All Stored Data?
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              This will erase all recorded health concerns, financial transactions, claims, and policies from this device.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-1/2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-1/2 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
