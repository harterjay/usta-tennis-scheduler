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
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-primary-900 mb-2">
          🔍 Schedule Preview
        </h3>
        <p className="text-primary-600">
          {matches.length} match{matches.length !== 1 ? 'es' : ''} parsed from your input
        </p>
      </div>

      {parseErrors.length > 0 && (
        <div className="mb-6 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">⚠️</span>
            </div>
            <div className="flex-1">
              <h4 className="text-red-900 font-bold mb-3 text-lg">Parsing Errors</h4>
              <ul className="text-red-800 space-y-3">
                {parseErrors.map((error, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-red-200/30">
                    <span className="text-red-500 text-lg mt-0.5">•</span>
                    <span className="flex-1">{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {validation.errors.length > 0 && (
        <div className="mb-6 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">❌</span>
            </div>
            <div className="flex-1">
              <h4 className="text-red-900 font-bold mb-3 text-lg">Validation Errors</h4>
              <ul className="text-red-800 space-y-3">
                {validation.errors.map((error, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-red-200/30">
                    <span className="text-red-500 text-lg mt-0.5">•</span>
                    <span className="flex-1">{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {hasWarnings && (
        <div className="mb-6 p-6 bg-amber-50/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">⚡</span>
            </div>
            <div className="flex-1">
              <h4 className="text-amber-900 font-bold mb-3 text-lg">Warnings</h4>
              <ul className="text-amber-800 space-y-3">
                {validation.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-200/30">
                    <span className="text-amber-600 text-lg mt-0.5">•</span>
                    <span className="flex-1">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {matches.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-800/95 to-slate-700/95 backdrop-blur-sm text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Your Team</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Opponent</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Captain</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Facility</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Match ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {matches.map((match, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-primary-900">{match.date}</div>
                      <div className="text-sm text-primary-600">{match.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{match.isHomeMatch ? '🏠' : '✈️'}</span>
                        <div>
                          <div className="font-semibold text-primary-900">
                            {match.isHomeMatch ? match.homeTeam : match.visitingTeam}
                          </div>
                          <div className="text-xs text-emerald-600 font-medium">
                            {match.isHomeMatch ? 'Home' : 'Visiting'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-primary-900">{match.opponent}</div>
                      <div className="text-xs text-blue-600 font-medium">
                        {match.isHomeMatch ? 'Visiting' : 'Home'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-primary-900 font-medium">
                        {match.isHomeMatch ? match.visitingCaptain : match.homeCaptain}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-primary-900">{match.facility}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-mono text-xs bg-slate-100/60 backdrop-blur-sm px-2 py-1 rounded border border-slate-200/50">
                        {match.matchId}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}