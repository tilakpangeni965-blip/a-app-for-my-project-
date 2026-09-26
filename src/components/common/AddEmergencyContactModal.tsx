import React, { useState } from 'react';
import { X, Phone, UserPlus, ShieldAlert, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmergencyContact } from '../../types';

export const AddEmergencyContactModal: React.FC = () => {
  const { isAddEmergencyContactOpen, setIsAddEmergencyContactOpen, addEmergencyContact } = useApp();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [category, setCategory] = useState<EmergencyContact['category']>('Personal');
  const [description, setDescription] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isAddEmergencyContactOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !number.trim()) return;

    addEmergencyContact({
      name: name.trim(),
      number: number.trim(),
      category,
      description: description.trim() || undefined,
      isDefault: false
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      handleClose();
    }, 800);
  };

  const handleClose = () => {
    setIsAddEmergencyContactOpen(false);
    setName('');
    setNumber('');
    setDescription('');
    setCategory('Personal');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Add Important Emergency Contact
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                Save personal, medical, or family emergency numbers
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-left">
          {/* Contact Name */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Contact Name or Facility *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kathmandu Model Hospital ER, Dr. Sharma, Uncle Suresh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Phone / Emergency Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                required
                placeholder="e.g. 102, 01-4221111, +977 9841..."
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
            >
              <option value="Personal">Personal / Family (ICE)</option>
              <option value="Medical">Medical / Hospital / Doctor</option>
              <option value="Official">Official Hotline / Police / Rescue</option>
              <option value="Other">Other Important Help</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Description or Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 24x7 Emergency Room, Family Physician, Ward Help"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Contact Saved to Emergency List Box!</span>
                </>
              ) : (
                <span>Save to Emergency List Box</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
