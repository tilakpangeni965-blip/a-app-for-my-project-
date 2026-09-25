import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Building2,
  Stethoscope,
  Sparkles,
  TrendingUp,
  Headphones
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportProvider } from '../../types';
import { EmergencyListBox } from '../common/EmergencyListBox';

export const SupportScreen: React.FC = () => {
  const { providers, setSelectedContact } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');

  const categories = [
    'All',
    'Hospital',
    'Doctor',
    'Ayurveda & Herbal',
    'Financial Advisor',
    'Insurance Desk'
  ];

  const filtered = providers.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase()) ||
      p.organization.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const getCategoryIcon = (cat: SupportProvider['category']) => {
    switch (cat) {
      case 'Hospital':
        return <Building2 className="w-4 h-4 text-rose-500" />;
      case 'Doctor':
        return <Stethoscope className="w-4 h-4 text-blue-500" />;
      case 'Ayurveda & Herbal':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'Financial Advisor':
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'Insurance Desk':
        return <Headphones className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div className="pb-6">
      {/* Emergency Hotline & Contacts List Box */}
      <div className="mt-2">
        <EmergencyListBox />
      </div>

      {/* Search Header */}
      <div className="mx-4 mt-2 mb-3 bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-4 text-left shadow-xs space-y-3">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            Verified Support Directory
          </h3>
          <p className="text-[10px] text-slate-500">
            Hospitals, Clinicians, Herbal Practitioners, and Financial Guides
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search verified support, doctors, or clinics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory List */}
      <div className="mx-4 space-y-2.5 text-left">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-4 shadow-sm space-y-3 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 truncate">
                    {item.role}
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    {item.organization}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{item.rating}</span>
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.location} ({item.distanceKm} km away)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  Verified: {item.verifiedDate} via {item.verificationSource}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedContact(item)}
              className="w-full py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/80 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact with Pre-Review Safety Check</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
