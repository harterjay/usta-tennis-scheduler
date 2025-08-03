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
      <button
        onClick={handleDownload}
        disabled={isDisabled}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          isDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Calendar...
          </span>
        ) : (
          `Download Calendar File (${matches.length} match${matches.length !== 1 ? 'es' : ''})`
        )}
      </button>
      
      {lastDownload && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            ✅ Calendar file downloaded successfully at {lastDownload.toLocaleTimeString()}
          </p>
          <p className="text-green-700 text-xs mt-1">
            Import the .ics file into Google Calendar by opening Google Calendar → Settings → Import & Export → Import
          </p>
        </div>
      )}
      
      {!isValid && matches.length > 0 && (
        <p className="mt-2 text-red-600 text-sm">
          Please fix the validation errors above before downloading.
        </p>
      )}
    </div>
  );
}