import type { VercelRequest, VercelResponse } from '@vercel/node';

interface MatchData {
  matchId: string;
  date: string;
  time: string;
  homeTeam: string;
  homeCaptain: string;
  visitingTeam: string;
  visitingCaptain: string;
  facility: string;
  isHomeMatch: boolean;
  opponent: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!process.env.CLAUDE_API_KEY) {
      return res.status(500).json({ error: 'Claude API key not configured' });
    }

    const result = await analyzeWithClaude(image, mimeType);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in analyze-schedule API:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze schedule',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function analyzeWithClaude(base64Image: string, mimeType: string) {
  const prompt = `Analyze this USTA tennis schedule image and extract match information.

IMPORTANT: Return ONLY valid JSON in this exact format (no other text):
{
  "matches": [
    {
      "matchId": "string",
      "date": "MM/DD/YYYY",
      "time": "H:MM AM/PM", 
      "homeTeam": "string",
      "homeCaptain": "string",
      "visitingTeam": "string", 
      "visitingCaptain": "string",
      "facility": "string",
      "isHomeMatch": true,
      "opponent": "string"
    }
  ],
  "errors": []
}

Instructions:
- Extract all visible matches from the schedule table
- Match ID: Numeric identifier (usually first column)
- Date: Convert to MM/DD/YYYY format
- Time: Include AM/PM
- Team names: May span multiple lines, include full names
- Captain names: First and last name
- Facility: Full facility/venue name
- For isHomeMatch: Set to true if this appears to be the home team's schedule
- For opponent: Use visitingTeam if isHomeMatch=true, else homeTeam
- If any data is unclear or missing, note it in errors array
- Return ONLY the JSON, no explanatory text`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Image
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const claudeResponse = await response.json();
    
    if (claudeResponse.error) {
      throw new Error(`Claude API error: ${claudeResponse.error.message}`);
    }

    // Parse Claude's response
    const responseText = claudeResponse.content[0].text;
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
      const extractedData = JSON.parse(jsonStr);
      
      // Validate the response structure
      if (!extractedData.matches || !Array.isArray(extractedData.matches)) {
        throw new Error('Invalid response format from Claude');
      }

      return extractedData;
      
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      return {
        matches: [],
        errors: [`Failed to parse Claude response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`]
      };
    }

  } catch (error) {
    console.error('Claude API error:', error);
    return {
      matches: [],
      errors: [`Claude API error: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}