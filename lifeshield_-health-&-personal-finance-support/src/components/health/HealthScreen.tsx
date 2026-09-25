import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Mic,
  FileText,
  Upload,
  Trash2,
  AlertTriangle,
  Footprints,
  Droplets,
  Moon,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmergencyListBox } from '../common/EmergencyListBox';

export const HealthScreen: React.FC = () => {
  const {
    healthConcerns,
    deleteHealthConcern,
    setIsAddConcernOpen,
    setIsWellnessOpen,
    setIsHerbalGuideOpen,
    wellness
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'concerns' | 'wellness' | 'herbal'>('concerns');

  return (
    <div className="pb-6">
      {/* Top Banner / Disclaimer */}
      <div className="mx-4 mt-2 mb-3 bg-blue-50/80 dark:bg-[#101b33] border border-blue-100 dark:border-blue-900/60 rounded-2xl p-3.5 flex items-start gap-2.5 text-left">
        <div className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Heart className="w-4 h-4 fill-white/20" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            Personal Health Vault
          </h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5">
            Organize personal symptoms, voice recordings, and lab reports. Data is kept private on your device. Not a medical diagnostic tool.
          </p>
        </div>
      </div>

      {/* Emergency Numbers & Important Contacts List Box */}
      <EmergencyListBox />

      {/* Sub Tabs */}
      <div className="mx-4 mb-3 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl flex items-center gap-1">
        <button
          onClick={() => setActiveSubTab('concerns')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'concerns'
              ? 'bg-white dark:bg-[#101b33] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Concerns ({healthConcerns.length})
        </button>
        <button
          onClick={() => setActiveSubTab('wellness')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'wellness'
              ? 'bg-white dark:bg-[#101b33] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Daily Vitals
        </button>
        <button
          onClick={() => setActiveSubTab('herbal')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'herbal'
              ? 'bg-white dark:bg-[#101b33] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Herbal Guide
        </button>
      </div>

      {/* Concerns Tab */}
      {activeSubTab === 'concerns' && (
        <div className="space-y-3">
          <div className="mx-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Recorded Health Issues
            </span>
            <button
              onClick={() => setIsAddConcernOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Concern</span>
            </button>
          </div>

          {healthConcerns.length === 0 ? (
            <div className="mx-4 p-8 bg-white dark:bg-[#101b33] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
              <Heart className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No health concerns logged yet
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                Record a voice note, upload a photo of a medical report, or type your symptoms.
              </p>
              <button
                onClick={() => setIsAddConcernOpen(true)}
                className="mt-3 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-medium cursor-pointer"
              >
                Log First Concern
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 mx-4">
              {healthConcerns.map((concern) => (
                <div
                  key={concern.id}
                  className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 shadow-sm p-4 text-left transition-colors relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {concern.title}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteHealthConcern(concern.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="Delete concern"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                    {concern.description}
                  </p>

                  {/* Attachment pills and metadata */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      {concern.category}
                    </span>

                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-medium">
                      Severity: {concern.severity}
                    </span>

                    {concern.inputType === 'voice' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-medium">
                        <Mic className="w-3 h-3" />
                        <span>Voice Note {concern.voiceDuration ? `(${concern.voiceDuration})` : ''}</span>
                      </span>
                    )}

                    {concern.inputType === 'image' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-medium">
                        <Upload className="w-3 h-3" />
                        <span>Report Photo Attached</span>
                      </span>
                    )}

                    <span className="text-slate-400 text-[10px] ml-auto">
                      {concern.date}
                    </span>
                  </div>

                  {concern.imageReportUrl && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <img
                        src={concern.imageReportUrl}
                        alt="Medical report scan"
                        className="max-h-32 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wellness & Vitals Tab */}
      {activeSubTab === 'wellness' && (
        <div className="space-y-3 mx-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Today's Daily Vitals
            </span>
            <button
              onClick={() => setIsWellnessOpen(true)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Update Logs →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-3.5 text-left shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-cyan-600 dark:text-cyan-400">
                <Footprints className="w-4 h-4" />
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Daily Steps
                </span>
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                {wellness.steps.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Goal: {wellness.stepGoal.toLocaleString()} ({Math.round((wellness.steps / wellness.stepGoal) * 100)}%)
              </div>
            </div>

            <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-3.5 text-left shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                <Droplets className="w-4 h-4" />
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Hydration
                </span>
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                {wellness.waterMl} ml
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Target: {wellness.waterGoalMl} ml ({Math.round((wellness.waterMl / wellness.waterGoalMl) * 100)}%)
              </div>
            </div>

            <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-3.5 text-left shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
                <Moon className="w-4 h-4" />
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Sleep Duration
                </span>
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                {wellness.sleepHours} hrs
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Restorative night sleep
              </div>
            </div>

            <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-3.5 text-left shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400">
                <Heart className="w-4 h-4" />
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Resting Heart Rate
                </span>
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                {wellness.heartRateBpm} bpm
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                BP: {wellness.bloodPressure}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Herbal Guide Tab Shortcut */}
      {activeSubTab === 'herbal' && (
        <div className="space-y-3 mx-4 text-left">
          <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Herbal Preparation & Doctor Care Hub
                </h4>
                <p className="text-[11px] text-slate-500">
                  YouTube video tutorials • Gemini AI Assistant • Doctor Safety Review
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Watch step-by-step preparation videos for traditional remedies (Tulsi Kadha, Turmeric Golden Milk, Ginger Decoction, Ashwagandha), ask the AI assistant about safe dosages, and check drug contraindications with a verified clinician.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setIsHerbalGuideOpen(true)}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Watch Video Guides</span>
                <span>→</span>
              </button>

              <button
                onClick={() => setIsHerbalGuideOpen(true)}
                className="py-2.5 px-3 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Ask AI Herbal Guide</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
