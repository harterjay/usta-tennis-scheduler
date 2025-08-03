import type { MatchData, ValidationResult } from '../types/schedule';

export function validateScheduleData(matches: MatchData[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (matches.length === 0) {
    errors.push('No matches found to validate');
    return { isValid: false, errors, warnings };
  }

  matches.forEach((match, index) => {
    const matchNumber = index + 1;

    if (!isValidDate(match.date)) {
      errors.push(`Match ${matchNumber}: Invalid date format - ${match.date}`);
    }

    if (!isValidTime(match.time)) {
      errors.push(`Match ${matchNumber}: Invalid time format - ${match.time}`);
    }

    if (!match.opponent.trim()) {
      errors.push(`Match ${matchNumber}: Opponent cannot be empty`);
    }

    if (!match.facility.trim()) {
      errors.push(`Match ${matchNumber}: Facility cannot be empty`);
    }

    if (match.facility.toLowerCase().includes('tbd') || match.facility.toLowerCase().includes('to be determined')) {
      warnings.push(`Match ${matchNumber}: Facility is marked as TBD`);
    }

    if (!match.matchId.trim()) {
      warnings.push(`Match ${matchNumber}: Match ID is missing`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && dateStr.trim().length > 0;
}

function isValidTime(timeStr: string): boolean {
  const timeRegex = /^(1[0-2]|0?[1-9]):([0-5]?[0-9])\s*(AM|PM|am|pm)$/;
  return timeRegex.test(timeStr.trim());
}