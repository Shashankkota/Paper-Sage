import type { ReviewResult, ReviewerPersona } from '../types';

export const analyzePaper = async (paperText: string, persona: ReviewerPersona): Promise<ReviewResult> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paperText, persona }),
  });

  if (!response.ok) {
    let errorMsg = `Request failed with status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMsg = errorData.error;
      }
    } catch (e) {
      // The response might not be JSON, so we ignore the parsing error
    }
    throw new Error(errorMsg);
  }

  const result: ReviewResult = await response.json();

  // Basic validation to ensure the result from our backend is valid
  if (!result.overallScore || !result.sectionReviews || !result.aiContentAnalysis) {
      throw new Error("Received an invalid or incomplete review from the server.");
  }

  return result;
};