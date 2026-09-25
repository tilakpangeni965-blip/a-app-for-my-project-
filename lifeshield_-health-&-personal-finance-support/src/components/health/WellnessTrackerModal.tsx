import React, { useState } from 'react';
import {
  X,
  Footprints,
  Droplets,
  Moon,
  Heart,
  Check,
  TrendingUp,
  Activity,
  Calendar,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { HealthTrendDay } from '../../types';

export const WellnessTrackerModal: React.FC = () => {
  const { isWellnessOpen, setIsWellnessOpen, wellness, updateWellness, theme } = useApp();

  const [activeView, setActiveView] = useState<'chart' | 'log'>('chart');
  const [selectedMetric, setSelectedMetric] = useState<'steps' | 'water' | 'sleep' | 'heartRate'>('steps');

  // Daily log inputs
  const [steps, setSteps] = useState(wellness.steps);
  const [waterMl, setWaterMl] = useState(wellness.waterMl);
  const [sleepHours, setSleepHours] = useState(wellness.sleepHours);
  const [heartRate, setHeartRate] = useState(wellness.heartRateBpm);
  const [bloodPressure, setBloodPressure] = useState(wellness.bloodPressure);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isWellnessOpen) return null;

  const trendData: HealthTrendDay[] = wellness.weeklyTrend || [
    { day: 'Mon', date: 'Sep 18', steps: 8420, waterMl: 2600, sleepHours: 7.2, heartRateBpm: 70 },
    { day: 'Tue', date: 'Sep 19', steps: 10150, waterMl: 3100, sleepHours: 8.0, heartRateBpm: 68 },
    { day: 'Wed', date: 'Sep 20', steps: 6540, waterMl: 2200, sleepHours: 6.5, heartRateBpm: 74 },
    { day: 'Thu', date: 'Sep 21', steps: 9320, waterMl: 2800, sleepHours: 7.4, heartRateBpm: 71 },
    { day: 'Fri', date: 'Sep 22', steps: 7890, waterMl: 2400, sleepHours: 7.0, heartRateBpm: 73 },
    { day: 'Sat', date: 'Sep 23', steps: 11400, waterMl: 3300, sleepHours: 8.2, heartRateBpm: 66 },
    { day: 'Sun', date: 'Sep 24', steps: steps, waterMl: waterMl, sleepHours: sleepHours, heartRateBpm: heartRate }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTrend = trendData.map((d, i) =>
      i === trendData.length - 1
        ? { ...d, steps, waterMl, sleepHours, heartRateBpm: heartRate }
        : d
    );

    updateWellness({
      steps,
      waterMl,
      sleepHours,
      heartRateBpm: heartRate,
      bloodPressure,
      weeklyTrend: updatedTrend
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveView('chart');
    }, 1000);
  };

  const addWater = (ml: number) => {
    setWaterMl((prev) => Math.min(6000, prev + ml));
  };

  const addSteps = (s: number) => {
    setSteps((prev) => prev + s);
  };

  // Helper for metrics configuration
  const getMetricConfig = () => {
    switch (selectedMetric) {
      case 'steps':
        return {
          key: 'steps',
          label: 'Daily Steps',
          unit: 'steps',
          target: wellness.stepGoal,
          targetLabel: '10,000 Step Goal',
          strokeColor: '#0284c7',
          fillColor: 'rgba(2, 132, 199, 0.25)',
          currentVal: steps.toLocaleString(),
          avgVal: Math.round(
            trendData.reduce((acc, d) => acc + d.steps, 0) / trendData.length
          ).toLocaleString(),
          icon: Footprints,
          colorClass: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60'
        };
      case 'water':
        return {
          key: 'waterMl',
          label: 'Hydration Intake',
          unit: 'ml',
          target: wellness.waterGoalMl,
          targetLabel: '3,000 ml Target',
          strokeColor: '#2563eb',
          fillColor: 'rgba(37, 99, 235, 0.25)',
          currentVal: `${waterMl} ml`,
          avgVal: `${Math.round(
            trendData.reduce((acc, d) => acc + d.waterMl, 0) / trendData.length
          )} ml`,
          icon: Droplets,
          colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
        };
      case 'sleep':
        return {
          key: 'sleepHours',
          label: 'Sleep Duration',
          unit: 'hrs',
          target: 8.0,
          targetLabel: '8.0 hrs Target',
          strokeColor: '#8b5cf6',
          fillColor: 'rgba(139, 92, 246, 0.25)',
          currentVal: `${sleepHours} hrs`,
          avgVal: `${(
            trendData.reduce((acc, d) => acc + d.sleepHours, 0) / trendData.length
          ).toFixed(1)} hrs`,
          icon: Moon,
          colorClass: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60'
        };
      case 'heartRate':
        return {
          key: 'heartRateBpm',
          label: 'Resting Heart Rate',
          unit: 'bpm',
          target: 70,
          targetLabel: '70 bpm Baseline',
          strokeColor: '#e11d48',
          fillColor: 'rgba(225, 29, 72, 0.25)',
          currentVal: `${heartRate} bpm`,
          avgVal: `${Math.round(
            trendData.reduce((acc, d) => acc + d.heartRateBpm, 0) / trendData.length
          )} bpm`,
          icon: Heart,
          colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60'
        };
    }
  };

  const metricConfig = getMetricConfig();

  // Custom chart tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as HealthTrendDay;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 shadow-lg text-xs space-y-1">
          <div className="font-bold text-slate-800 dark:text-slate-200">
            {label} ({dataPoint.date})
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
            <span>{metricConfig.label}:</span>
            <span className="font-mono">{payload[0].value} {metricConfig.unit}</span>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Goal: {metricConfig.target} {metricConfig.unit}</span>
            <span>
              {payload[0].value >= metricConfig.target ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Met</span>
              ) : (
                <span className="text-amber-500">In Progress</span>
              )}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Wellness & Health Analytics
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                Weekly health trends & daily activity tracker
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWellnessOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switcher: Weekly Trends Chart vs Update Today */}
        <div className="px-5 pt-3 pb-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('chart')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'chart'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Weekly Trends Chart</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('log')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'log'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Update Today's Vitals</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-left">
          {activeView === 'chart' ? (
            <div className="space-y-4">
              {/* Metric Selector Tabs */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMetric('steps')}
                  className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    selectedMetric === 'steps'
                      ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold ring-1 ring-sky-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <Footprints className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">Steps</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMetric('water')}
                  className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    selectedMetric === 'water'
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <Droplets className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">Water</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMetric('sleep')}
                  className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    selectedMetric === 'sleep'
                      ? 'border-purple-500 bg-purple-50/80 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold ring-1 ring-purple-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <Moon className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">Sleep</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMetric('heartRate')}
                  className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                    selectedMetric === 'heartRate'
                      ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold ring-1 ring-rose-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <Heart className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">Pulse</span>
                </button>
              </div>

              {/* KPI Stat Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                    Today's Recorded
                  </span>
                  <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {metricConfig.currentVal}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Target: {metricConfig.targetLabel}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                    7-Day Rolling Average
                  </span>
                  <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {metricConfig.avgVal}
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>Consistent Habit</span>
                  </span>
                </div>
              </div>

              {/* Recharts 7-Day Interactive Area Chart */}
              <div className="bg-slate-50/80 dark:bg-[#0c162b] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    7-Day {metricConfig.label} Trend
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Mon - Sun
                  </span>
                </div>

                <div className="w-full h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={metricConfig.strokeColor} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={metricConfig.strokeColor} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'}
                      />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine
                        y={metricConfig.target}
                        stroke="#10b981"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Goal',
                          position: 'right',
                          fill: '#10b981',
                          fontSize: 9
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey={metricConfig.key}
                        stroke={metricConfig.strokeColor}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#metricGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-800 mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: metricConfig.strokeColor }}></span>
                    <span>Actual Recorded</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-emerald-500"></span>
                    <span>Target Goal Line</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveView('log')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Log or Adjust Today's Reading</span>
                <span>→</span>
              </button>
            </div>
          ) : (
            /* Log Form */
            <form onSubmit={handleSave} className="space-y-4">
              {/* Steps */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                      <Footprints className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Daily Step Count
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    {steps.toLocaleString()} / {wellness.stepGoal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addSteps(500)}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-colors cursor-pointer"
                  >
                    +500 steps
                  </button>
                  <button
                    type="button"
                    onClick={() => addSteps(1000)}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-colors cursor-pointer"
                  >
                    +1,000 steps
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="50000"
                    value={steps}
                    onChange={(e) => setSteps(parseInt(e.target.value) || 0)}
                    className="w-24 px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white ml-auto"
                  />
                </div>
              </div>

              {/* Hydration */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Water Hydration
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    {waterMl} ml ({Math.round((waterMl / wellness.waterGoalMl) * 100)}%)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addWater(250)}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    +1 Glass (250 ml)
                  </button>
                  <button
                    type="button"
                    onClick={() => addWater(500)}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    +1 Bottle (500 ml)
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    step="50"
                    value={waterMl}
                    onChange={(e) => setWaterMl(parseInt(e.target.value) || 0)}
                    className="w-24 px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white ml-auto"
                  />
                </div>
              </div>

              {/* Sleep & Heart Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Sleep Hours
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Resting Pulse
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="40"
                      max="200"
                      value={heartRate}
                      onChange={(e) => setHeartRate(parseInt(e.target.value) || 70)}
                      className="w-full px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    <span className="text-[10px] text-slate-400">bpm</span>
                  </div>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Blood Pressure (systolic/diastolic)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 120/80 mmHg"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView('chart')}
                  className="w-1/3 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved! Updating Chart...</span>
                    </>
                  ) : (
                    <span>Save & Update Weekly Chart</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
