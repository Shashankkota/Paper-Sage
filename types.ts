export interface SectionReview {
  sectionName: string;
  clarity: string;
  originality: string;
  suggestions: string[];
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
  aiContentPercentage: number;
  sectionReviews: SectionReview[];
}

export type ReviewerPersona = 'Expert' | 'Strict' | 'Friendly';
