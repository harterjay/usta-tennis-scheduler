import type { MatchData } from '../types/schedule';

export function generateICalendar(matches: MatchData[]): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  let ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//USTA Schedule Importer//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  matches.forEach((match, index) => {
    const eventId = `usta-match-${index + 1}-${timestamp}`;
    const startDateTime = parseMatchDateTime(match.date, match.time);
    const endDateTime = new Date(startDateTime.getTime() + (2 * 60 * 60 * 1000)); // Add 2 hours

    ical.push(
      'BEGIN:VEVENT',
      `UID:${eventId}`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${formatDateTimeForICal(startDateTime)}`,
      `DTEND:${formatDateTimeForICal(endDateTime)}`,
      `SUMMARY:Tennis Match vs ${match.opponent}`,
      `DESCRIPTION:Match ID: ${match.matchId}\\n${match.isHomeMatch ? 'Home' : 'Away'} Match\\nOpponent: ${match.opponent}\\nCaptain: ${match.isHomeMatch ? match.visitingCaptain : match.homeCaptain}`,
      `LOCATION:${match.facility}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Tennis match reminder',
      'END:VALARM',
      'END:VEVENT'
    );
  });

  ical.push('END:VCALENDAR');
  
  return ical.join('\r\n');
}

function parseMatchDateTime(dateStr: string, timeStr: string): Date {
  const cleanDate = dateStr.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i, '');
  const dateTime = new Date(`${cleanDate} ${timeStr}`);
  
  if (isNaN(dateTime.getTime())) {
    const fallbackDate = new Date(cleanDate);
    if (!isNaN(fallbackDate.getTime())) {
      const time = parseTime(timeStr);
      fallbackDate.setHours(time.hours, time.minutes, 0, 0);
      return fallbackDate;
    }
    throw new Error(`Could not parse date and time: ${dateStr} ${timeStr}`);
  }
  
  return dateTime;
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/);
  if (!match) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  
  if (ampm === 'PM' && hours !== 12) {
    hours += 12;
  } else if (ampm === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return { hours, minutes };
}

function formatDateTimeForICal(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function downloadICalFile(content: string, filename: string = 'usta-schedule.ics'): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}