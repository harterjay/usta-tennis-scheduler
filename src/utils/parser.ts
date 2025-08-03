import type { MatchData, ParsedSchedule } from '../types/schedule';

export function parseScheduleText(text: string): ParsedSchedule {
  const matches: MatchData[] = [];
  const errors: string[] = [];
  
  if (!text.trim()) {
    errors.push('No schedule text provided');
    return { matches, errors };
  }

  // Try to parse as tabular USTA format first
  const tabularResult = parseTabularFormat(text);
  if (tabularResult.matches.length > 0 || tabularResult.errors.length > 0) {
    return tabularResult;
  }

  // Fallback to legacy format
  return parseLegacyFormat(text);
}

function parseTabularFormat(text: string): ParsedSchedule {
  const matches: MatchData[] = [];
  const errors: string[] = [];
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Skip header line if present
  let startIndex = 0;
  if (lines.length > 0 && lines[0].toLowerCase().includes('match id')) {
    startIndex = 1;
  }
  
  // Find match boundaries by looking for match IDs (lines that are just numbers)
  const matchStarts: number[] = [];
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].match(/^\d+$/)) {
      matchStarts.push(i);
    }
  }
  
  // Process each match
  for (let i = 0; i < matchStarts.length; i++) {
    const matchStartIndex = matchStarts[i];
    const matchEndIndex = i < matchStarts.length - 1 ? matchStarts[i + 1] : lines.length;
    
    const matchLines = lines.slice(matchStartIndex, matchEndIndex);
    const match = parseFlexibleMatch(matchLines, matchStartIndex + 1);
    
    if (match.error) {
      errors.push(match.error);
    } else if (match.data) {
      matches.push(match.data);
    }
  }
  
  return { matches, errors };
}

function parseFlexibleMatch(matchLines: string[], startLineNumber: number): { data?: MatchData; error?: string } {
  try {
    if (matchLines.length < 2) {
      return { error: `Match starting at line ${startLineNumber}: Not enough lines (found ${matchLines.length}, expected at least 2)` };
    }

    const matchId = matchLines[0].trim();
    if (!matchId.match(/^\d+$/)) {
      return { error: `Line ${startLineNumber}: Invalid match ID format: ${matchId}` };
    }

    // Handle 3 different formats based on number of lines:
    // 4-line: Both team names wrap
    // 3-line: First team name wraps  
    // 2-line: Neither team name wraps

    if (matchLines.length === 4) {
      return parse4LineFormat(matchId, matchLines);
    } else if (matchLines.length === 3) {
      return parse3LineFormat(matchId, matchLines);
    } else if (matchLines.length === 2) {
      return parse2LineFormat(matchId, matchLines);
    } else {
      return { error: `Match ${matchId}: Unexpected format with ${matchLines.length} lines` };
    }
  } catch (error) {
    return { error: `Match starting at line ${startLineNumber}: Error parsing - ${error}` };
  }
}

function parse4LineFormat(matchId: string, matchLines: string[]): { data?: MatchData; error?: string } {
  // 4-line format: Both team names wrap
  // Line 1: Match ID
  // Line 2: Date    Time    HomeTeam(part1)
  // Line 3: HomeTeam(part2)    HomeCaptain    VisitingTeam(part1)  
  // Line 4: VisitingTeam(part2)    VisitingCaptain    Facility

  const line2 = matchLines[1].trim();
  const line3 = matchLines[2].trim();
  const line4 = matchLines[3].trim();

  // Parse line 2: "6/14/2025    8:30 AM    Chestnut Oaks"
  // Use pattern-based extraction instead of relying on spacing
  const dateMatch = line2.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  const timeMatch = line2.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  
  if (!dateMatch || !timeMatch) {
    return { error: `Match ${matchId}: Could not extract date and time from line: "${line2}"` };
  }
  
  const date = dateMatch[1];
  const time = timeMatch[1];
  
  // Extract home team part by removing date and time
  let homeTeamPart1 = line2.replace(dateMatch[0], '').replace(timeMatch[0], '').trim();
  // Clean up extra whitespace
  homeTeamPart1 = homeTeamPart1.replace(/\s+/g, ' ').trim();

  // Parse line 3: "Mercurio 3.5    Robert Mercurio    Woodlake McCoy"
  // This line contains: HomeTeam(part2), HomeCaptain, VisitingTeam(part1)
  // We need to identify the captain name pattern (First Last) to split correctly
  const words3 = line3.split(/\s+/).filter(p => p.trim().length > 0);
  
  // Look for captain name pattern - typically after team level (3.5, 4.0, etc)
  let homeTeamPart2 = '';
  let homeCaptain = '';
  let visitingTeamPart1 = '';
  
  // Find where the team level ends (3.5, 4.0, etc) - this marks end of home team
  const levelIndex = words3.findIndex(word => /^\d\.\d$/.test(word));
  if (levelIndex >= 0) {
    homeTeamPart2 = words3.slice(0, levelIndex + 1).join(' ');
    // Next 2 words should be captain name
    if (words3.length > levelIndex + 2) {
      homeCaptain = words3[levelIndex + 1] + ' ' + words3[levelIndex + 2];
      visitingTeamPart1 = words3.slice(levelIndex + 3).join(' ');
    }
  } else {
    // Fallback: assume first word is team, next 2 are captain, rest is visiting team
    homeTeamPart2 = words3[0] || '';
    homeCaptain = (words3[1] || '') + ' ' + (words3[2] || '');
    visitingTeamPart1 = words3.slice(3).join(' ');
  }

  // Parse line 4: "3.5    Dave McCoy    Chestnut Oaks Recreation Association" 
  // This line contains: VisitingTeam(part2), VisitingCaptain, Facility
  const words4 = line4.split(/\s+/).filter(p => p.trim().length > 0);
  
  let visitingTeamPart2 = '';
  let visitingCaptain = '';
  let facility = '';
  
  if (words4.length >= 4) {
    // First word is team part, next 2 are captain, rest is facility
    visitingTeamPart2 = words4[0];
    visitingCaptain = words4[1] + ' ' + words4[2];
    facility = words4.slice(3).join(' ');
  } else {
    return { error: `Match ${matchId}: Line 4 format error. Expected at least 4 words. Got: "${line4}"` };
  }

  // Reconstruct full team names
  const homeTeam = `${homeTeamPart1} ${homeTeamPart2}`.trim();
  const visitingTeam = `${visitingTeamPart1} ${visitingTeamPart2}`.trim();

  // Determine if this is a home match
  const isHomeMatch = homeTeam.toLowerCase().includes('chestnut oaks') && homeTeam.toLowerCase().includes('mercurio');
  
  const match: MatchData = {
    matchId: matchId,
    date: date,
    time: time,
    homeTeam: homeTeam,
    homeCaptain: homeCaptain,
    visitingTeam: visitingTeam,
    visitingCaptain: visitingCaptain,
    facility: facility,
    isHomeMatch: isHomeMatch,
    opponent: isHomeMatch ? visitingTeam : homeTeam
  };
  
  return { data: match };
}

function parse3LineFormat(matchId: string, matchLines: string[]): { data?: MatchData; error?: string } {
  // 3-line format: First team name wraps
  // Two patterns:
  // Pattern A: Line 2: Date Time HomeTeam(part1) HomeCaptain VisitingTeam(part1)
  //           Line 3: VisitingTeam(part2) VisitingCaptain Facility
  // Pattern B: Line 2: Date Time HomeTeam(part1)
  //           Line 3: HomeTeam(part2) HomeCaptain VisitingTeam VisitingCaptain Facility

  const line2 = matchLines[1].trim();
  const line3 = matchLines[2].trim();

  // Parse line 2: Extract date, time, and remaining content
  const dateMatch = line2.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  const timeMatch = line2.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  
  if (!dateMatch || !timeMatch) {
    return { error: `Match ${matchId}: Could not extract date and time from line: "${line2}"` };
  }
  
  const date = dateMatch[1];
  const time = timeMatch[1];
  let line2Remaining = line2.replace(dateMatch[0], '').replace(timeMatch[0], '').trim().replace(/\s+/g, ' ');
  const line2Words = line2Remaining.split(/\s+/).filter(p => p.trim().length > 0);
  const line3Words = line3.split(/\s+/).filter(p => p.trim().length > 0);

  // Try to determine which pattern this is by analyzing the content
  // Pattern A has more content on line 2 (home team part + captain + visiting team part)
  // Pattern B has less content on line 2 (just home team part)
  
  if (line2Words.length >= 4) {
    // Pattern A: 6/15/2025 9:00 AM CCV Henry Jonathan Henry Willow Oaks
    //           Bressler Bernly Bressler Country Club of Virginia
    
    // Find where captain name likely starts (after team name)
    // Look for common first names or assume it's after the team name
    let homeTeamEndIndex = 1; // Default: assume team is 2 words
    if (line2Words.length >= 4) {
      // Try to find captain name pattern - often after team name
      // For "CCV Henry Jonathan Henry", we want to split at "Jonathan"
      homeTeamEndIndex = findCaptainNameStart(line2Words);
    }
    
    const homeTeam = line2Words.slice(0, homeTeamEndIndex + 1).join(' ');
    const homeCaptain = line2Words.slice(homeTeamEndIndex + 1, homeTeamEndIndex + 3).join(' ');
    const visitingTeamPart1 = line2Words.slice(homeTeamEndIndex + 3).join(' ');
    
    // Line 3: VisitingTeam(part2) VisitingCaptain Facility
    if (line3Words.length >= 3) {
      const visitingTeamPart2 = line3Words[0];
      const visitingCaptain = line3Words[1] + ' ' + line3Words[2];
      const facility = line3Words.slice(3).join(' ');
      const visitingTeam = `${visitingTeamPart1} ${visitingTeamPart2}`.trim();
      
      const isHomeMatch = homeTeam.toLowerCase().includes('chestnut oaks') && homeTeam.toLowerCase().includes('mercurio');
      
      return {
        data: {
          matchId,
          date,
          time,
          homeTeam,
          homeCaptain,
          visitingTeam,
          visitingCaptain,
          facility,
          isHomeMatch,
          opponent: isHomeMatch ? visitingTeam : homeTeam
        }
      };
    }
  } else {
    // Pattern B: 6/22/2025 5:30 PM Westwood
    //           Mullahy James Mullahy CCV Henry Jonathan Henry Westwood Club
    
    const homeTeamPart1 = line2Words.join(' ');
    
    // Line 3: HomeTeam(part2) HomeCaptain VisitingTeam VisitingCaptain Facility
    if (line3Words.length >= 6) {
      const homeTeamPart2 = line3Words[0];
      const homeCaptain = line3Words[1] + ' ' + line3Words[2];
      
      // Find visiting team - look for end of captain names
      // Assume visiting team starts after home captain
      const visitingTeamStart = 3;
      let visitingCaptainStart = visitingTeamStart + 2; // Assume 2-word team name initially
      
      // Try to find where visiting captain starts by looking for name patterns
      if (line3Words.length > visitingCaptainStart + 1) {
        const visitingTeam = line3Words.slice(visitingTeamStart, visitingCaptainStart).join(' ');
        const visitingCaptain = line3Words[visitingCaptainStart] + ' ' + line3Words[visitingCaptainStart + 1];
        const facility = line3Words.slice(visitingCaptainStart + 2).join(' ');
        const homeTeam = `${homeTeamPart1} ${homeTeamPart2}`.trim();
        
        const isHomeMatch = homeTeam.toLowerCase().includes('chestnut oaks') && homeTeam.toLowerCase().includes('mercurio');
        
        return {
          data: {
            matchId,
            date,
            time,
            homeTeam,
            homeCaptain,
            visitingTeam,
            visitingCaptain,
            facility,
            isHomeMatch,
            opponent: isHomeMatch ? visitingTeam : homeTeam
          }
        };
      }
    }
  }
  
  return { error: `Match ${matchId}: Could not parse 3-line format. Line 2: "${line2}", Line 3: "${line3}"` };
}

function findCaptainNameStart(words: string[]): number {
  // Try to identify where the captain name starts
  // Common patterns: team names are often 1-3 words, then captain name
  // For "CCV Henry Jonathan Henry", we want to split after "Henry" (index 1)
  
  // Simple heuristic: if we have 4+ words, assume first 2 are team name
  if (words.length >= 4) {
    return 1; // Team is first 2 words (index 0 and 1)
  }
  
  // Fallback: assume first word is team name
  return 0;
}

function parse2LineFormat(matchId: string, matchLines: string[]): { data?: MatchData; error?: string } {
  // 2-line format: Neither team name wraps
  // Line 1: Match ID
  // Line 2: Date    Time    HomeTeam    HomeCaptain    VisitingTeam    VisitingCaptain    Facility

  const line2 = matchLines[1].trim();

  // Parse line 2: Extract date and time first
  const dateMatch = line2.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
  const timeMatch = line2.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  
  if (!dateMatch || !timeMatch) {
    return { error: `Match ${matchId}: Could not extract date and time from line: "${line2}"` };
  }
  
  const date = dateMatch[1];
  const time = timeMatch[1];
  
  // Remove date and time, then parse remaining content
  let remaining = line2.replace(dateMatch[0], '').replace(timeMatch[0], '').trim().replace(/\s+/g, ' ');
  const words = remaining.split(/\s+/).filter(p => p.trim().length > 0);
  
  // Look for team levels to identify team boundaries
  const levelIndices = words.map((word, idx) => /^\d\.\d$/.test(word) ? idx : -1).filter(idx => idx >= 0);
  
  if (levelIndices.length >= 2) {
    // Found two team levels
    const firstLevelIndex = levelIndices[0];
    const secondLevelIndex = levelIndices[1];
    
    const homeTeam = words.slice(0, firstLevelIndex + 1).join(' ');
    const homeCaptain = words[firstLevelIndex + 1] + ' ' + words[firstLevelIndex + 2];
    const visitingTeam = words.slice(firstLevelIndex + 3, secondLevelIndex + 1).join(' ');
    const visitingCaptain = words[secondLevelIndex + 1] + ' ' + words[secondLevelIndex + 2];
    const facility = words.slice(secondLevelIndex + 3).join(' ');
    
    const isHomeMatch = homeTeam.toLowerCase().includes('chestnut oaks') && homeTeam.toLowerCase().includes('mercurio');
    
    return {
      data: {
        matchId,
        date,
        time,
        homeTeam,
        homeCaptain,
        visitingTeam,
        visitingCaptain,
        facility,
        isHomeMatch,
        opponent: isHomeMatch ? visitingTeam : homeTeam
      }
    };
  }
  
  return { error: `Match ${matchId}: Could not parse 2-line format - unable to identify team boundaries` };
}


// Keep the legacy format parser for backward compatibility
function parseLegacyFormat(text: string): ParsedSchedule {
  const matches: MatchData[] = [];
  const errors: string[] = [];
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentMatch: Partial<any> = {};
  let lineNumber = 0;

  for (const line of lines) {
    lineNumber++;
    
    if (line.toLowerCase().startsWith('date:')) {
      if (Object.keys(currentMatch).length > 0) {
        const match = validateAndAddLegacyMatch(currentMatch, errors, lineNumber);
        if (match) matches.push(match);
        currentMatch = {};
      }
      currentMatch.date = line.substring(5).trim();
    } else if (line.toLowerCase().startsWith('time:')) {
      currentMatch.time = line.substring(5).trim();
    } else if (line.toLowerCase().startsWith('opponent:')) {
      currentMatch.opponent = line.substring(9).trim();
    } else if (line.toLowerCase().startsWith('location:')) {
      currentMatch.location = line.substring(9).trim();
    }
  }

  if (Object.keys(currentMatch).length > 0) {
    const match = validateAndAddLegacyMatch(currentMatch, errors, lineNumber);
    if (match) matches.push(match);
  }

  return { matches, errors };
}

function validateAndAddLegacyMatch(
  matchData: any, 
  errors: string[], 
  lineNumber: number
): MatchData | null {
  const requiredFields = ['date', 'time', 'opponent', 'location'];
  const missingFields = requiredFields.filter(field => !matchData[field]);
  
  if (missingFields.length > 0) {
    errors.push(`Match at line ${lineNumber}: Missing required fields: ${missingFields.join(', ')}`);
    return null;
  }

  return {
    matchId: 'legacy',
    date: matchData.date,
    time: matchData.time,
    homeTeam: 'Your Team',
    homeCaptain: 'You',
    visitingTeam: matchData.opponent,
    visitingCaptain: 'TBD',
    facility: matchData.location,
    isHomeMatch: true,
    opponent: matchData.opponent
  };
}