import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Search,
  BookOpen,
  ShieldAlert,
  Youtube,
  Sparkles,
  Stethoscope,
  Send,
  Loader2,
  ExternalLink,
  CheckSquare,
  Square,
  PhoneCall,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HERBAL_REMEDIES } from '../../data/herbalResources';
import { HerbalRemedy, SupportProvider } from '../../types';

export const HerbalGuideModal: React.FC = () => {
  const { isHerbalGuideOpen, setIsHerbalGuideOpen, setSelectedContact, providers } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'ai_assistant' | 'doctors'>('catalog');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('tulsi');

  // Interactive checked ingredients state per remedy
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Active YouTube video player remedy
  const [playingVideoId, setPlayingVideoId] = useState<string | null>('tulsi');

  // AI Herbal Assistant State
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; isEmergency?: boolean; isError?: boolean }>>([
    {
      role: 'assistant',
      text: 'Ask any question about health herbs, potential medication interactions, or safety precautions. The LifeShield assistant prioritizes clinical safety.'
    }
  ]);

  if (!isHerbalGuideOpen) return null;

  const categories = [
    'All',
    'Immunity & Respiratory',
    'Joint Comfort & Digestion',
    'Digestion & Nausea',
    'Sleep & Stress Balance',
    'Throat & Acid Reflux'
  ];

  const filtered = HERBAL_REMEDIES.filter((remedy) => {
    const matchesSearch =
      remedy.name.toLowerCase().includes(search.toLowerCase()) ||
      remedy.traditionalUse.toLowerCase().includes(search.toLowerCase()) ||
      remedy.safePreparation.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || remedy.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const doctorsAndVaidyas = providers.filter(
    (p) => p.category === 'Doctor' || p.category === 'Ayurveda & Herbal' || p.category === 'Hospital'
  );

  const toggleIngredient = (key: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAskAi = async (customPrompt?: string) => {
    const queryToSend = customPrompt || aiQuery;
    if (!queryToSend.trim() || aiLoading) return;

    const userMsg = queryToSend.trim();
    setAiMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setAiQuery('');
    setAiError(null);
    setLastFailedQuery(null);
    setAiLoading(true);

    try {
      // Pass clean conversation history excluding initial greeting
      const conversationHistory = aiMessages
        .slice(1)
        .filter((m) => !m.isError)
        .map((m) => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch('/api/herbal-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg,
          conversationHistory,
          userContext: {
            app: 'LifeShield',
            activeHerb: expandedId || undefined
          }
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const errorDetail = data.message || data.error || 'The AI assistant is temporarily unavailable. Please try again.';
        setAiError(errorDetail);
        setLastFailedQuery(userMsg);
        setAiMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `⚠️ Notice: ${errorDetail}`,
            isError: true
          }
        ]);
        return;
      }

      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || 'No response could be generated for this inquiry.',
          isEmergency: !!data.isEmergency
        }
      ]);
    } catch {
      const connError = 'Unable to reach the assistant service. Please check your internet connection or try again later.';
      setAiError(connError);
      setLastFailedQuery(userMsg);
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ Notice: ${connError}`,
          isError: true
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleContactDoctorForRemedy = (remedyName: string, doctor?: SupportProvider) => {
    const targetDoctor = doctor || doctorsAndVaidyas[0];
    if (targetDoctor) {
      setSelectedContact(targetDoctor);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Herbal Preparation & Doctor Care
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                Video tutorials • AI Safety Assistant • Doctor Verification
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHerbalGuideOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Tabs: Video Guides | AI Preparation Assistant | Doctor Consultation */}
        <div className="px-4 pt-2.5 pb-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>Video Guides ({HERBAL_REMEDIES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'ai_assistant'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'doctors'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor Contact</span>
          </button>
        </div>

        {/* Prominent Mandatory Medical Safety Notice */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 px-4 py-2 flex items-start gap-2 text-left">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[10.5px] text-amber-900 dark:text-amber-300 leading-snug">
            <strong>Medical Notice:</strong> Herbal infusions are dietary traditions and not replacements for licensed medical diagnosis. If you take prescription medicines or have severe symptoms, review with a doctor before consuming.
          </p>
        </div>

        {/* Tab 1: Video Guides & Herbal Catalog */}
        {activeTab === 'catalog' && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Search & Categories */}
            <div className="p-4 pb-2 space-y-2 text-left border-b border-slate-100 dark:border-slate-800/80">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search remedies, symptoms, or preparations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Remedies List */}
            <div className="p-4 space-y-3.5 text-left">
              {filtered.map((remedy) => {
                const isExpanded = expandedId === remedy.id;
                return (
                  <div
                    key={remedy.id}
                    className="bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : remedy.id)}
                      className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{remedy.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-0.5">
                            <Youtube className="w-2.5 h-2.5" /> Video
                          </span>
                        </div>
                        {remedy.hindiName && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {remedy.hindiName}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
                        {remedy.category}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="px-3.5 pb-4 pt-1 space-y-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                        {/* YouTube Video Player Embed Integration */}
                        {remedy.youtubeVideoId && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                <Youtube className="w-3.5 h-3.5 text-rose-600" />
                                <span>{remedy.youtubeTitle || 'Video Preparation Guide'}</span>
                              </span>
                              <a
                                href={`https://www.youtube.com/watch?v=${remedy.youtubeVideoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-medium"
                              >
                                <span>Watch on YouTube</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>

                            {/* Responsive 16:9 Video Container */}
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-sm">
                              <iframe
                                src={`https://www.youtube-nocookie.com/embed/${remedy.youtubeVideoId}?rel=0&modestbranding=1`}
                                title={remedy.youtubeTitle || remedy.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full border-0"
                              />
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
                              <span>Source: {remedy.youtubeChannel || 'Ayurvedic Wellness'}</span>
                              <span>Educational Preparation</span>
                            </div>
                          </div>
                        )}

                        {/* Interactive Key Ingredients Checklist */}
                        {remedy.keyIngredients && remedy.keyIngredients.length > 0 && (
                          <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                              Required Kitchen Ingredients (Check off as you prepare):
                            </span>
                            <div className="grid grid-cols-1 gap-1">
                              {remedy.keyIngredients.map((ing, idx) => {
                                const key = `${remedy.id}_${idx}`;
                                const isChecked = !!checkedIngredients[key];
                                return (
                                  <div
                                    key={key}
                                    onClick={() => toggleIngredient(key)}
                                    className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                                  >
                                    {isChecked ? (
                                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    ) : (
                                      <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    )}
                                    <span className={isChecked ? 'line-through text-slate-400' : ''}>
                                      {ing}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Safe Home Preparation Method */}
                        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
                          <span className="font-semibold text-emerald-800 dark:text-emerald-400 block text-[11px] mb-0.5">
                            Safe Home Preparation Method:
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                            {remedy.safePreparation}
                          </p>
                        </div>

                        {/* Cautions & Drug Interactions */}
                        <div className="bg-rose-50/80 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
                          <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-semibold text-[11px] mb-0.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Cautions & Known Drug Interactions:</span>
                          </div>
                          <p className="text-rose-900/90 dark:text-rose-300/90 text-[11px] leading-relaxed">
                            {remedy.cautions}
                          </p>
                        </div>

                        {/* Direct Doctor Contact Action for this Remedy */}
                        <div className="pt-1 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleContactDoctorForRemedy(remedy.name)}
                            className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Ask Doctor / Vaidya About {remedy.name.split(' ')[0]}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('ai_assistant');
                              handleAskAi(`How to safely prepare ${remedy.name} at home? Are there any side effects?`);
                            }}
                            className="py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Chat</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: AI Safety & Preparation Assistant */}
        {activeTab === 'ai_assistant' && (
          <div className="flex-1 overflow-y-auto flex flex-col justify-between p-4 space-y-3 text-left">
            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-[260px] max-h-[400px] p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white font-medium rounded-br-none'
                        : msg.isEmergency
                        ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-2 border-rose-500 rounded-bl-none shadow-md'
                        : msg.isError
                        ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-bl-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {msg.isEmergency && (
                      <div className="mt-3 pt-2 border-t border-rose-200 dark:border-rose-800 flex items-center justify-between gap-2">
                        <a
                          href="tel:102"
                          className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call 102 Ambulance</span>
                        </a>
                        <a
                          href="tel:100"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call 100 Police</span>
                        </a>
                      </div>
                    )}

                    {msg.isError && lastFailedQuery && (
                      <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-800 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleAskAi(lastFailedQuery)}
                          className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                        >
                          Try Again
                        </button>
                      </div>
                    )}

                    {msg.role === 'assistant' && !msg.isError && idx > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleContactDoctorForRemedy('AI Consultation')}
                          className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Stethoscope className="w-3 h-3" />
                          <span>Review with Doctor</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {aiLoading && (
                <div className="flex items-center gap-2 p-2 text-xs text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating question and verifying clinical safety guidance...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAi();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                placeholder="Ask about safety, medication interactions, or herbal guidance..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                disabled={aiLoading}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiQuery.trim()}
                className="p-2.5 rounded-xl bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white cursor-pointer transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Doctor & Vaidya Contact Directory */}
        {activeTab === 'doctors' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-left">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200/80 dark:border-purple-900/60 text-xs">
              <span className="font-bold text-purple-900 dark:text-purple-300 block mb-0.5">
                Qualified Health & Ayurvedic Clinicians
              </span>
              <p className="text-[11px] text-purple-800 dark:text-purple-300">
                Always confirm home remedies with a licensed doctor if you take medications, have chronic conditions, or symptoms continue beyond 48 hours.
              </p>
            </div>

            <div className="space-y-2.5">
              {doctorsAndVaidyas.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-slate-50/80 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {doctor.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {doctor.role}
                    </div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                      {doctor.organization}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{doctor.verificationSource}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedContact(doctor)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
