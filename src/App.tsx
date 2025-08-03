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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            USTA Tennis Schedule Importer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert your USTA team match schedules into Google Calendar-compatible files. 
            Simply paste your schedule text below and download the .ics file to import into your calendar.
          </p>
        </header>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ScheduleInput
              value={scheduleText}
              onChange={setScheduleText}
            />
          </div>

          {(parsedData.matches.length > 0 || parsedData.errors.length > 0) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <DataPreview
                matches={parsedData.matches}
                validation={validation}
                parseErrors={parsedData.errors}
              />
            </div>
          )}

          {parsedData.matches.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <DownloadButton
                matches={parsedData.matches}
                isValid={validation.isValid}
              />
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            After downloading, import the .ics file into Google Calendar: 
            Settings → Import & Export → Import
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
