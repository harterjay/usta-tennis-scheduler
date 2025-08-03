export interface MatchData {
  matchId: string;
  date: string;
  time: string;
  homeTeam: string;
  homeCaptain: string;
  visitingTeam: string;
  visitingCaptain: string;
  facility: string;
  isHomeMatch: boolean;
  opponent: string; // Will be either homeTeam or visitingTeam depending on perspective
}

export interface ParsedSchedule {
  matches: MatchData[];
  errors: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location: string;
}