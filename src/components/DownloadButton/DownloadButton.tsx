import { useState } from 'react';
import type { MatchData } from '../../types/schedule';
import { generateICalendar, downloadICalFile } from '../../utils/icalGenerator';

interface DownloadButtonProps {
  matches: MatchData[];
  isValid: boolean;
  disabled?: boolean;
}

export default function DownloadButton({ matches, isValid, disabled = false }: DownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastDownload, setLastDownload] = useState<Date | null>(null);

  const handleDownload = async () => {
    if (!isValid || matches.length === 0 || disabled) return;

    setIsGenerating(true);
    
    try {
      const icalContent = generateICalendar(matches);
      const filename = `usta-schedule-${new Date().toISOString().split('T')[0]}.ics`;
      
      downloadICalFile(icalContent, filename);
      setLastDownload(new Date());
    } catch (error) {
      console.error('Error generating calendar file:', error);
      alert('Error generating calendar file. Please check your schedule data and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isDisabled = disabled || !isValid || matches.length === 0 || isGenerating;

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Download</h3>
      </div>
      
      <button
        onClick={handleDownload}
        disabled={isDisabled}
        className={`w-full py-6 px-8 rounded-2xl font-bold text-lg transition-all duration-500 relative overflow-hidden group shadow-xl ${
          isDisabled
            ? 'bg-slate-200/80 backdrop-blur-sm text-slate-400 cursor-not-allowed border border-slate-300/50'
            : 'bg-gradient-to-r from-indigo-600/95 to-indigo-700/95 backdrop-blur-sm text-white hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-[1.02] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border border-indigo-500/30'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-50"></div>
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        <div className="relative z-10">
          {isGenerating ? (
            <span className="flex items-center justify-center gap-4">
              <div className="relative">
                <div className="w-7 h-7 border-3 border-white/30 rounded-full"></div>
                <div className="absolute inset-0 w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin shadow-lg"></div>
              </div>
              <span className="text-lg">Generating Calendar...</span>
            </span>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🗓️</span>
              <span>Generate Calendar File ({matches.length} match{matches.length !== 1 ? 'es' : ''})</span>
            </div>
          )}
        </div>
      </button>
      
      {lastDownload && (
        <div className="mt-8 p-6 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500/90 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-emerald-900 font-bold text-lg mb-2">
                Calendar file downloaded successfully!
              </p>
              <p className="text-emerald-700 text-sm mb-4 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                Downloaded at {lastDownload.toLocaleTimeString()}
              </p>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-emerald-500/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📅</span>
                  </div>
                  <p className="text-emerald-900 font-bold text-sm">Next Steps:</p>
                </div>
                <div className="text-emerald-800 text-sm space-y-1 pl-8">
                  <p>1. Open Google Calendar</p>
                  <p>2. Go to Settings → Import & Export</p>
                  <p>3. Click "Import" and select your downloaded .ics file</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!isValid && matches.length > 0 && (
        <div className="mt-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-white text-sm">⚠️</span>
            </div>
            <p className="text-red-900 font-medium">
              Please fix the validation errors above before downloading.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}