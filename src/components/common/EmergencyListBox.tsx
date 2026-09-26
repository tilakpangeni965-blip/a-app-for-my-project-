import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  ChevronDown,
  Plus,
  Trash2,
  Ambulance,
  Shield,
  Flame,
  UserCheck,
  Stethoscope,
  Copy,
  Check,
  Search,
  ListFilter,
  PhoneForwarded,
  UserPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmergencyContact } from '../../types';

interface EmergencyListBoxProps {
  compact?: boolean;
}

export const EmergencyListBox: React.FC<EmergencyListBoxProps> = ({ compact = false }) => {
  const {
    emergencyContacts,
    selectedEmergencyId,
    setSelectedEmergencyId,
    deleteEmergencyContact,
    setIsAddEmergencyContactOpen
  } = useApp();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'official' | 'user'>('all');
  const [viewMode, setViewMode] = useState<'dropdown' | 'expanded'>('expanded');

  // Selected contact fallback
  const selectedContact =
    emergencyContacts.find((c) => c.id === selectedEmergencyId) || emergencyContacts[0] || {
      id: 'em-np',
      name: 'Nepal Police',
      number: '100',
      category: 'Official' as const,
      description: 'National Police Emergency (24x7)'
    };

  const handleCopy = (id: string, number: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(number.replace(/\s+/g, ''));
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  const getContactIcon = (contact: EmergencyContact) => {
    if (contact.number === '100' || contact.number === '103') {
      return <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
    if (contact.number === '102') {
      return <Ambulance className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    }
    if (contact.number === '101') {
      return <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
    if (contact.category === 'Medical') {
      return <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
    return <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
  };

  // Filter contacts based on search query and category tab
  const filteredContacts = emergencyContacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.number.includes(filterQuery) ||
      (c.description && c.description.toLowerCase().includes(filterQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'official') {
      return c.category === 'Official' || c.number === '100' || c.number === '102';
    }
    if (activeTab === 'user') {
      return c.category !== 'Official' && c.number !== '100' && c.number !== '102';
    }
    return true;
  });

  return (
    <div className="mb-3 bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200/90 dark:border-rose-900/60 rounded-2xl p-3.5 shadow-xs text-left transition-colors">
      {/* Header with Title and Add Contact Button */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-rose-950 dark:text-rose-100 leading-tight">
              Emergency & Important Contacts
            </h3>
            <p className="text-[10px] text-rose-800/80 dark:text-rose-300/80 leading-none mt-0.5 truncate">
              Police: 100 • Ambulance: 102 • Fire: 101 • Personal ICE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddEmergencyContactOpen(true)}
            className="text-[10.5px] font-bold px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100/60 dark:hover:bg-rose-950 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs active:scale-95"
            title="Add emergency contact"
          >
            <UserPlus className="w-3 h-3" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Select List Box Dropdown + Instant Call Control */}
      <div className="space-y-2">
        <label className="block text-[10px] font-semibold text-rose-900/80 dark:text-rose-300/80">
          Select from Emergency List Box:
        </label>
        <div className="flex items-center gap-2">
          {/* Interactive Native & Accessible List Box Dropdown */}
          <div className="relative flex-1">
            <select
              aria-label="Emergency and Important Contacts List Box"
              value={selectedContact.id}
              onChange={(e) => setSelectedEmergencyId(e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 cursor-pointer appearance-none shadow-2xs"
            >
              <optgroup label="Official Nepal Emergency Numbers">
                {emergencyContacts
                  .filter((c) => c.number === '100' || c.number === '102' || c.category === 'Official')
                  .map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name}: {contact.number}
                    </option>
                  ))}
              </optgroup>

              {emergencyContacts.some(
                (c) => c.number !== '100' && c.number !== '102' && c.category !== 'Official'
              ) && (
                <optgroup label="User & Important Contacts">
                  {emergencyContacts
                    .filter(
                      (c) => c.number !== '100' && c.number !== '102' && c.category !== 'Official'
                    )
                    .map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name}: {contact.number}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Quick Call Action for Selected Contact */}
          <a
            href={`tel:${selectedContact.number.replace(/\s+/g, '')}`}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
            title={`Call ${selectedContact.name} at ${selectedContact.number}`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call {selectedContact.number}</span>
          </a>
        </div>
      </div>

      {/* Selected Contact Status Card */}
      <div className="mt-2.5 p-2 bg-white/90 dark:bg-slate-900/90 rounded-xl border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            {getContactIcon(selectedContact)}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
              {selectedContact.name}: <span className="font-mono text-rose-600 dark:text-rose-400">{selectedContact.number}</span>
            </div>
            <div className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">
              {selectedContact.description || selectedContact.category}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => handleCopy(selectedContact.id, selectedContact.number, e)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Copy phone number"
          >
            {copiedId === selectedContact.id ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'expanded' ? 'dropdown' : 'expanded')}
            className="text-[10px] font-bold text-rose-700 dark:text-rose-300 hover:underline px-1.5 py-0.5 cursor-pointer"
          >
            {viewMode === 'expanded' ? 'Collapse Box' : 'View Full Box'}
          </button>
        </div>
      </div>

      {/* Expanded Interactive List Box Component (role="listbox") */}
      {viewMode === 'expanded' && (
        <div className="mt-2.5 pt-2 border-t border-rose-200/70 dark:border-rose-900/60 space-y-2">
          {/* Filter Pills and Search */}
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter emergency contacts..."
                className="w-full pl-6 pr-2 py-1 text-[11px] rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/80 dark:bg-slate-900/80 text-rose-900 dark:text-rose-200'
                }`}
              >
                All ({emergencyContacts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('user')}
                className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeTab === 'user'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/80 dark:bg-slate-900/80 text-rose-900 dark:text-rose-200'
                }`}
              >
                Important
              </button>
            </div>
          </div>

          {/* Scrollable List Box Container */}
          <div
            role="listbox"
            aria-label="Nepal Emergency Services and User Important Contacts"
            className="space-y-1.5 max-h-56 overflow-y-auto pr-1"
          >
            {filteredContacts.map((contact) => {
              const isSelected = contact.id === selectedContact.id;
              const isNepalPolice = contact.number === '100';
              const isAmbulance = contact.number === '102';

              return (
                <div
                  key={contact.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => setSelectedEmergencyId(contact.id)}
                  className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-rose-400 dark:border-rose-600 shadow-xs ring-1 ring-rose-400/40'
                      : 'bg-white/70 dark:bg-slate-900/60 border-rose-100 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isNepalPolice
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 font-bold'
                          : isAmbulance
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {getContactIcon(contact)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-[11.5px] truncate">
                          {contact.name}:
                        </span>
                        <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs shrink-0">
                          {contact.number}
                        </span>
                        {isNepalPolice && (
                          <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 shrink-0">
                            Police 24/7
                          </span>
                        )}
                        {isAmbulance && (
                          <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-200 shrink-0">
                            Ambulance 24/7
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <span>{contact.description || contact.category}</span>
                        {contact.category !== 'Official' && !isNepalPolice && !isAmbulance && (
                          <span className="text-[9px] text-purple-600 dark:text-purple-400 font-medium">
                            • User Important
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row: Copy, Call, Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleCopy(contact.id, contact.number, e)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="Copy number"
                    >
                      {copiedId === contact.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <a
                      href={`tel:${contact.number.replace(/\s+/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10.5px] flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                      title={`Call ${contact.name}`}
                    >
                      <PhoneCall className="w-2.5 h-2.5" />
                      <span>Call</span>
                    </a>

                    {!contact.isDefault && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEmergencyContact(contact.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete user contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredContacts.length === 0 && (
              <div className="py-4 text-center text-xs text-slate-500">
                No emergency contacts matched &quot;{filterQuery}&quot;.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
