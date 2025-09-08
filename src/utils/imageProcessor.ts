import type { MatchData } from '../types/schedule';

export interface ImageAnalysisResult {
  matches: MatchData[];
  errors: string[];
}

export async function analyzeScheduleImage(imageFile: File): Promise<ImageAnalysisResult> {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Call Claude API to analyze the image
    const response = await fetch('/api/analyze-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        mimeType: imageFile.type
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.error) {
      return {
        matches: [],
        errors: [result.error]
      };
    }

    return {
      matches: result.matches || [],
      errors: result.errors || []
    };

    /* Production API call would be:
    
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Call Claude API to analyze the image
    const response = await fetch('/api/analyze-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        mimeType: imageFile.type
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.error) {
      return {
        matches: [],
        errors: [result.error]
      };
    }

    return {
      matches: result.matches || [],
      errors: result.errors || []
    };
    */

  } catch (error) {
    console.error('Error analyzing schedule image:', error);
    return {
      matches: [],
      errors: [`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix to get just the base64 data
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}