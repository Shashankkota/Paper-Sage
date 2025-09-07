export interface SectionReview {
  sectionName: string;
  clarity: string;
  originality: string;
  suggestions: string[];
}

export interface AiFlaggedPassage {
  passage: string;
  reason: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface AiContentAnalysis {
  estimatedPercentage: number;
  flaggedPassages: AiFlaggedPassage[];
}

export interface ReviewResult {
  overallScore: number;
  verdict: string;
  originality: {
    score: number;
    comment: string;
  };
  plagiarism: {
    status: 'Clear' | 'Possible Issues' | 'High Similarity';
    details: string;
  };
  citations: {
    status: 'Good' | 'Needs Improvement';
    comment: string;
  };
  aiContentAnalysis: AiContentAnalysis;
  sectionReviews: SectionReview[];
}

export type ReviewerPersona = 'Expert' | 'Strict' | 'Friendly';