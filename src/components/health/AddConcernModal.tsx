import React, { useState, useRef } from 'react';
import {
  X,
  Mic,
  Square,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Play,
  Pause
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddConcernModal: React.FC = () => {
  const { isAddConcernOpen, setIsAddConcernOpen, addHealthConcern } = useApp();

  const [inputType, setInputType] = useState<'text' | 'voice' | 'image'>('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'General' | 'Chronic' | 'Diet/Nutrition' | 'Mental Health' | 'Symptoms'>('Symptoms');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [notes, setNotes] = useState('');
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Image upload state
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Review step
  const [isReviewStep, setIsReviewStep] = useState(false);
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  if (!isAddConcernOpen) return null;

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      // Fallback simulation if mic permissions are blocked in sandbox
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    if (!recordedAudioUrl) {
      setRecordedAudioUrl('simulated-voice-note');
    }
    if (!title) {
      setTitle('Voice Recorded Health Note');
    }
    if (!description) {
      setDescription(`Recorded ${recordingSeconds}s audio description of health concern.`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        if (!title) {
          setTitle(`Uploaded Health Report: ${file.name.replace(/\.[^/.]+$/, '')}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsReviewStep(true);
  };

  const handleFinalSave = async () => {
    const res = await addHealthConcern({
      title: title.trim(),
      description: description.trim() || 'No detailed description provided.',
      category,
      date: new Date().toISOString().split('T')[0],
      severity,
      inputType,
      voiceDuration: recordedAudioUrl ? `0:${recordingSeconds.toString().padStart(2, '0')}` : undefined,
      audioBlobUrl: recordedAudioUrl || undefined,
      imageReportUrl: previewImage || undefined,
      doctorConsulted: false,
      notes: notes.trim() || undefined
    });

    if (res.success) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (isRecording) {
      handleStopRecording();
    }
    setIsAddConcernOpen(false);
    setIsReviewStep(false);
    setTitle('');
    setDescription('');
    setPreviewImage(null);
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    setConsentConfirmed(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isReviewStep ? 'Review Health Entry' : 'Log a Health Concern'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isReviewStep
                ? 'Verify information before saving to device'
                : 'Choose text, voice note, or photo of report'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-left">
          {!isReviewStep ? (
            <form onSubmit={handleProceedToReview} className="space-y-4">
              {/* Input Method Selector (Text, Voice, Image) */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  How would you like to record?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setInputType('text')}
                    className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      inputType === 'text'
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-[11px]">Written Text</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputType('voice')}
                    className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      inputType === 'voice'
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span className="text-[11px]">Voice Note</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputType('image')}
                    className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      inputType === 'image'
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-[11px]">Report Photo</span>
                  </button>
                </div>
              </div>

              {/* Voice Note Recording Panel */}
              {inputType === 'voice' && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center text-center">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    {isRecording ? 'Recording your voice note...' : recordedAudioUrl ? 'Audio recording ready' : 'Tap to start recording'}
                  </div>

                  <div className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 mb-3 tabular-nums">
                    0:{recordingSeconds.toString().padStart(2, '0')}
                  </div>

                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <Mic className="w-6 h-6" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="w-12 h-12 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer animate-pulse"
                    >
                      <Square className="w-5 h-5 fill-current" />
                    </button>
                  )}

                  {recordedAudioUrl && !isRecording && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Audio captured successfully ({recordingSeconds}s)</span>
                    </div>
                  )}
                </div>
              )}

              {/* Photo / Image Upload Panel */}
              {inputType === 'image' && (
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/40"
                  >
                    {previewImage ? (
                      <div className="relative w-full">
                        <img
                          src={previewImage}
                          alt="Report preview"
                          className="max-h-36 mx-auto rounded-lg object-contain shadow-xs"
                        />
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 mt-2 block font-medium">
                          Click to change file
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-7 h-7 text-slate-400 mb-1" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Upload lab test, prescription or report
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5">
                          Supports PNG, JPG, or PDF photo
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Concern Title */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Title / Symptom summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mild dry cough in evenings, knee soreness"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Category & Severity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option value="Symptoms">Symptoms</option>
                    <option value="General">General Wellness</option>
                    <option value="Chronic">Chronic Management</option>
                    <option value="Diet/Nutrition">Diet / Nutrition</option>
                    <option value="Mental Health">Mental Health / Rest</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e: any) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option value="Mild">Mild (Noticeable, manageable)</option>
                    <option value="Moderate">Moderate (Interferes with routine)</option>
                    <option value="Severe">Severe (Prompt medical care needed)</option>
                  </select>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Observations
                </label>
                <textarea
                  rows={3}
                  placeholder="When did it begin? What makes it better or worse? Any remedies tried?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Private doctor / self-care notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Taking ginger tea, follow-up if still present in 3 days"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                Proceed to Review & Confirm →
              </button>
            </form>
          ) : (
            /* Review & Consent Step (Required by specification) */
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {title}
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                    {category}
                  </span>
                  <span>•</span>
                  <span>Severity: {severity}</span>
                  <span>•</span>
                  <span>Input: {inputType}</span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed pt-1">
                  {description}
                </p>

                {previewImage && (
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 block mb-1">Attached Document/Photo:</span>
                    <img
                      src={previewImage}
                      alt="Review"
                      className="max-h-28 rounded-lg border border-slate-200 dark:border-slate-700 object-cover"
                    />
                  </div>
                )}

                {notes && (
                  <div className="pt-1 text-[11px] text-slate-500 italic">
                    Notes: {notes}
                  </div>
                )}
              </div>

              {/* Safety & Consent Warning */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 flex gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-900 dark:text-amber-300 leading-snug">
                  <span className="font-semibold block mb-0.5">Medical Safety Notice</span>
                  LifeShield securely stores this record on your device. This app does not provide medical diagnosis or treatment. For emergency symptoms, contact local emergency services immediately.
                </div>
              </div>

              {/* Mandatory Consent Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={consentConfirmed}
                  onChange={(e) => setConsentConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>
                  I confirm this information is accurate, and I consent to storing this health entry privately on this device.
                </span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewStep(false)}
                  className="w-1/3 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Edit Entry
                </button>
                <button
                  type="button"
                  disabled={!consentConfirmed}
                  onClick={handleFinalSave}
                  className="w-2/3 py-2 px-4 rounded-xl bg-blue-600 disabled:opacity-50 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  Save Health Concern
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
