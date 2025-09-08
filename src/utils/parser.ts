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

    // New approach: Combine all match lines into single text block and parse as columns
    const allText = matchLines.slice(1).join(' ').trim();
    return parseColumnBasedMatch(matchId, allText);
    
  } catch (error) {
    return { error: `Match starting at line ${startLineNumber}: Error parsing - ${error}` };
  }
}

function parseColumnBasedMatch(matchId: string, allText: string): { data?: MatchData; error?: string } {
  try {
    // Parse using anchor patterns: Date/Time at start, Facility at end
    const dateMatch = allText.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    const timeMatch = allText.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
    
    if (!dateMatch || !timeMatch) {
      return { error: `Match ${matchId}: Could not extract date and time from text: "${allText}"` };
    }
    
    const date = dateMatch[1];
    const time = timeMatch[1];
    
    // Find facility at the end - look for known facility keywords or assume last significant text
    const facilityPatterns = [
      /(?:Association|Club|Center|Courts?|Recreation|Athletic|Academy|Country Club)[\w\s-]*$/i,
      /(?:ACAC|MRTC|MAC)\s+[\w\s-]*$/i
    ];
    
    let facility = '';
    let facilityMatch = null;
    
    for (const pattern of facilityPatterns) {
      facilityMatch = allText.match(pattern);
      if (facilityMatch) {
        facility = facilityMatch[0].trim();
        break;
      }
    }
    
    // Fallback: assume facility is the last few words
    if (!facility) {
      const words = allText.split(/\s+/);
      facility = words.slice(-3).join(' '); // Take last 3 words as facility
    }
    
    // Remove date, time, and facility to get the middle content
    let middleContent = allText;
    middleContent = middleContent.replace(dateMatch[0], '').trim();
    middleContent = middleContent.replace(timeMatch[0], '').trim();
    if (facilityMatch) {
      middleContent = middleContent.replace(facilityMatch[0], '').trim();
    } else {
      // Remove the facility words we extracted
      const words = middleContent.split(/\s+/);
      middleContent = words.slice(0, -3).join(' ');
    }
    
    // Split middle content to find teams and captains
    // Strategy: Look for common name patterns (First Last) to identify captains
    const result = parseTeamsAndCaptains(middleContent);
    
    if (result.error) {
      return { error: `Match ${matchId}: ${result.error}` };
    }
    
    // Determine which team is home based on facility or default logic
    const isRaintreeHome = facility.toLowerCase().includes('raintree') || 
                          result.homeTeam.toLowerCase().includes('raintree');
    
    const matchData: MatchData = {
      matchId,
      date,
      time,
      homeTeam: result.homeTeam,
      homeCaptain: result.homeCaptain,
      visitingTeam: result.visitingTeam,
      visitingCaptain: result.visitingCaptain,
      facility,
      isHomeMatch: isRaintreeHome,
      opponent: isRaintreeHome ? result.visitingTeam : result.homeTeam
    };
    
    return { data: matchData };
    
  } catch (error) {
    return { error: `Match ${matchId}: Error parsing - ${error}` };
  }
}

function parseTeamsAndCaptains(content: string): { 
  homeTeam: string; 
  homeCaptain: string; 
  visitingTeam: string; 
  visitingCaptain: string; 
  error?: string 
} {
  try {
    // Strategy: Look for captain name patterns (First Last) to divide the content
    const words = content.split(/\s+/).filter(w => w.trim());
    
    // Find potential captain names (two consecutive capitalized words)
    const captainIndices: number[] = [];
    for (let i = 0; i < words.length - 1; i++) {
      const word1 = words[i];
      const word2 = words[i + 1];
      
      // Captain pattern: Two consecutive words, both capitalized, no numbers/special chars
      if (isCapitalized(word1) && isCapitalized(word2) && 
          !hasNumbers(word1) && !hasNumbers(word2) &&
          word1.length > 1 && word2.length > 1) {
        captainIndices.push(i);
      }
    }
    
    if (captainIndices.length < 2) {
      // Fallback: Split content roughly in half
      const midPoint = Math.floor(words.length / 2);
      return {
        homeTeam: words.slice(0, midPoint).join(' ').trim(),
        homeCaptain: 'Captain',
        visitingTeam: words.slice(midPoint).join(' ').trim(),
        visitingCaptain: 'Captain'
      };
    }
    
    // Assume first captain index is home captain, second is visiting captain
    const homeCaptainStart = captainIndices[0];
    const visitingCaptainStart = captainIndices[1];
    
    const homeTeam = words.slice(0, homeCaptainStart).join(' ').trim();
    const homeCaptain = words.slice(homeCaptainStart, homeCaptainStart + 2).join(' ');
    const visitingTeam = words.slice(homeCaptainStart + 2, visitingCaptainStart).join(' ').trim();
    const visitingCaptain = words.slice(visitingCaptainStart, visitingCaptainStart + 2).join(' ');
    
    return {
      homeTeam: homeTeam || 'Home Team',
      homeCaptain: homeCaptain || 'Captain',
      visitingTeam: visitingTeam || 'Visiting Team', 
      visitingCaptain: visitingCaptain || 'Captain'
    };
    
  } catch (error) {
    return {
      homeTeam: 'Home Team',
      homeCaptain: 'Captain',
      visitingTeam: 'Visiting Team',
      visitingCaptain: 'Captain',
      error: `Error parsing teams and captains: ${error}`
    };
  }
}

function isCapitalized(word: string): boolean {
  return word.charAt(0) === word.charAt(0).toUpperCase() && 
         word.charAt(0).match(/[A-Z]/) !== null;
}

function hasNumbers(word: string): boolean {
  return /\d/.test(word);
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
    homeTeam: 'Home Team',
    homeCaptain: 'Home Captain',
    visitingTeam: matchData.opponent,
    visitingCaptain: 'TBD',
    facility: matchData.location,
    isHomeMatch: true,
    opponent: matchData.opponent
  };
}