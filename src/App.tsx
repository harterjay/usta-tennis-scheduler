import { useState, useMemo } from 'react';
import ScheduleInput from './components/ScheduleInput/ScheduleInput';
import DataPreview from './components/DataPreview/DataPreview';
import DownloadButton from './components/DownloadButton/DownloadButton';
import { parseScheduleText } from './utils/parser';
import { validateScheduleData } from './utils/validator';

function App() {
  const [scheduleText, setScheduleText] = useState('');

  const parsedData = useMemo(() => {
    if (!scheduleText.trim()) {
      return { matches: [], errors: [] };
    }
    return parseScheduleText(scheduleText);
  }, [scheduleText]);

  const validation = useMemo(() => {
    return validateScheduleData(parsedData.matches);
  }, [parsedData.matches]);

  return (
    <div className="min-h-screen bg-gradient-professional">
      {/* Professional Header */}
      <header className="bg-gradient-hero text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/riptonic_logo_lab.svg" 
                alt="Riptonic Logo" 
                className="w-12 h-12"
                onError={(e) => {
                  e.currentTarget.src = "/riptonic_logo_enhanced.svg";
                }}
              />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Riptonic</h1>
                <p className="text-primary-200 text-sm font-medium">Tennis Schedule Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-primary-200">USTA Schedule Converter</p>
                <p className="text-xs text-primary-300">Powered by AI</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-6 leading-tight">
              Transform USTA Schedules into<br/>
              <span className="bg-gradient-accent bg-clip-text text-transparent">Google Calendar Events</span>
            </h2>
            <p className="text-xl text-primary-600 mb-8 leading-relaxed">
              Convert your USTA team match schedules into Google Calendar-compatible files. 
              Simply paste your schedule text below and download the .ics file to import into your calendar.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>Instant conversion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>Google Calendar ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>No data stored</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 mb-8">
          <div className="space-y-8">
            {/* Schedule Input Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
              <ScheduleInput
                value={scheduleText}
                onChange={setScheduleText}
              />
            </div>

            {/* Data Preview Section */}
            {(parsedData.matches.length > 0 || parsedData.errors.length > 0) && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
                <DataPreview
                  matches={parsedData.matches}
                  validation={validation}
                  parseErrors={parsedData.errors}
                />
              </div>
            )}

            {/* Download Section */}
            {parsedData.matches.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
                <DownloadButton
                  matches={parsedData.matches}
                  isValid={validation.isValid}
                />
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-primary-500">
          <p className="mb-2">
            After downloading, import the .ics file into Google Calendar: 
            Settings → Import & Export → Import
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-primary-400">
            <span>Powered by Riptonic</span>
            <span>•</span>
            <span>Enterprise-grade security</span>
            <span>•</span>
            <span>Privacy-first design</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
