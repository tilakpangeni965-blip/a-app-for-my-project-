import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Mic,
  Upload,
  Trash2,
  Footprints,
  Droplets,
  Moon,
  Sparkles
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
    <div className="space-y-4 text-left pb-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 fill-white/20" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
            Personal Health Vault
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Privately track symptoms, doctor notes, medical reports, and daily wellness vitals.
          </p>
        </div>
      </div>

      {/* Emergency Hotlines Box */}
      <EmergencyListBox />

      {/* Sub Tabs */}
      <div className="p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl flex items-center gap-1">
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
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Recorded Health Issues
            </h2>
            <button
              onClick={() => setIsAddConcernOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Concern</span>
            </button>
          </div>

          {healthConcerns.length === 0 ? (
            <div className="p-8 bg-white dark:bg-[#101b33] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
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
            <div className="space-y-2.5">
              {healthConcerns.map((concern) => (
                <div
                  key={concern.id}
                  className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-100 dark:border-slate-800/90 shadow-sm p-4 text-left transition-colors relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {concern.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => deleteHealthConcern(concern.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                      title="Delete concern"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                    {concern.description}
                  </p>

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
                        <span>Report Attached</span>
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Today&apos;s Daily Vitals
            </h2>
            <button
              onClick={() => setIsWellnessOpen(true)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Update Logs →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                Goal: {wellness.stepGoal.toLocaleString()}
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
                Target: {wellness.waterGoalMl} ml
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
                Target: 8.0 hrs
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
                {wellness.heartRateBpm > 0 ? `${wellness.heartRateBpm} bpm` : '--'}
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
        <div className="space-y-3 text-left">
          <div className="bg-white dark:bg-[#101b33] rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                  Herbal Preparation & Care Guide
                </h2>
                <p className="text-[11px] text-slate-500">
                  Preparation videos • Assistant Guidance • Doctor Directory
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore safe preparation techniques for traditional culinary herbs (Tulsi, Turmeric, Ginger, Ashwagandha), ask preparation questions, and verify herb-drug safety with verified practitioners.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setIsHerbalGuideOpen(true)}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>Open Herbal Guide & Assistant</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
