import type { MatchData, ValidationResult } from '../../types/schedule';

interface DataPreviewProps {
  matches: MatchData[];
  validation: ValidationResult;
  parseErrors: string[];
}

export default function DataPreview({ matches, validation, parseErrors }: DataPreviewProps) {
  const hasWarnings = validation.warnings.length > 0;

  if (matches.length === 0 && parseErrors.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Schedule Preview ({matches.length} match{matches.length !== 1 ? 'es' : ''})
      </h3>

      {parseErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-red-800 font-medium mb-2">Parsing Errors:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {parseErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-red-800 font-medium mb-2">Validation Errors:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {hasWarnings && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-yellow-800 font-medium mb-2">Warnings:</h4>
          <ul className="text-yellow-700 text-sm space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <div
              key={index}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500">Date & Time</div>
                    <div className="font-medium">{match.date} at {match.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Match ID</div>
                    <div className="font-mono text-sm">{match.matchId}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">
                      {match.isHomeMatch ? 'Home Team (You)' : 'Visiting Team (You)'}
                    </div>
                    <div className="font-medium">
                      {match.isHomeMatch ? match.homeTeam : match.visitingTeam}
                    </div>
                    <div className="text-sm text-gray-600">
                      Captain: {match.isHomeMatch ? match.homeCaptain : match.visitingCaptain}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      {match.isHomeMatch ? 'Visiting Team' : 'Home Team'}
                    </div>
                    <div className="font-medium">
                      {match.opponent}
                    </div>
                    <div className="text-sm text-gray-600">
                      Captain: {match.isHomeMatch ? match.visitingCaptain : match.homeCaptain}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500">Facility</div>
                  <div className="font-medium">{match.facility}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}