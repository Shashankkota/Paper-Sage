import React from 'react';
import type { ReviewResult, SectionReview } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, LightBulbIcon } from './icons';

interface ReviewReportProps {
  result: ReviewResult;
}

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-green-600';
  if (score >= 5) return 'text-yellow-600';
  return 'text-red-600';
};

const ScoreCard: React.FC<{ title: string; score: number; maxScore: number; comment?: string; children?: React.ReactNode }> = ({ title, score, maxScore, comment, children }) => (
  <div className="bg-gray-100 p-4 rounded-lg">
    <h3 className="text-md font-semibold text-gray-700">{title}</h3>
    <p className={`text-3xl font-bold ${getScoreColor(score)}`}>
      {score.toFixed(1)} <span className="text-lg text-gray-500">/ {maxScore}</span>
    </p>
    {comment && <p className="text-sm text-gray-600 mt-1">{comment}</p>}
    {children}
  </div>
);

const SectionFeedback: React.FC<{ review: SectionReview }> = ({ review }) => (
  <div className="border-t border-gray-200 pt-4 mt-4">
    <h4 className="font-semibold text-lg text-indigo-700">{review.sectionName}</h4>
    <div className="mt-2 space-y-2 text-sm">
      <p><strong className="font-medium text-gray-600">Clarity:</strong> {review.clarity}</p>
      <p><strong className="font-medium text-gray-600">Originality:</strong> {review.originality}</p>
      {review.suggestions.length > 0 && (
        <div>
          <strong className="font-medium text-gray-600 flex items-center">
            <LightBulbIcon className="h-4 w-4 mr-1 text-yellow-500"/>
            Suggestions:
          </strong>
          <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-gray-700">
            {review.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const PlagiarismCard: React.FC<{ status: string; details: string }> = ({ status, details }) => {
  const isHighAlert = status === 'High Similarity';
  const isWarning = status === 'Possible Issues';
  const bgColor = isHighAlert ? 'bg-red-50' : isWarning ? 'bg-yellow-50' : 'bg-green-50';
  const textColor = isHighAlert ? 'text-red-800' : isWarning ? 'text-yellow-800' : 'text-green-800';
  const icon = isHighAlert || isWarning ? <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> : <CheckCircleIcon className="h-5 w-5 mr-2" />;

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-lg`}>
      <h3 className="font-semibold flex items-center">{icon} Plagiarism Check: {status}</h3>
      <p className="text-sm mt-1">{details}</p>
    </div>
  );
};


export const ReviewReport: React.FC<ReviewReportProps> = ({ result }) => {
  return (
    <div className="h-full overflow-y-auto pr-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Review Report</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ScoreCard title="Overall Score" score={result.overallScore} maxScore={10} comment={result.verdict} />
        <ScoreCard title="Originality Score" score={result.originality.score} maxScore={10} comment={result.originality.comment} />
      </div>

      <div className="space-y-4 mb-6">
        <PlagiarismCard status={result.plagiarism.status} details={result.plagiarism.details} />

        <div className={`p-4 rounded-lg ${result.citations.status === 'Good' ? 'bg-blue-50 text-blue-800' : 'bg-yellow-50 text-yellow-800'}`}>
           <h3 className="font-semibold flex items-center"><InformationCircleIcon className="h-5 w-5 mr-2" /> Citation Quality: {result.citations.status}</h3>
           <p className="text-sm mt-1">{result.citations.comment}</p>
        </div>

        <div className="bg-purple-50 text-purple-800 p-4 rounded-lg">
           <h3 className="font-semibold">AI Content Detector</h3>
           <p className="text-sm mt-1">Estimated <span className="font-bold">{result.aiContentPercentage}%</span> AI-generated content detected.</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Section-by-Section Feedback</h3>
        {result.sectionReviews.map((review, index) => (
          <SectionFeedback key={index} review={review} />
        ))}
      </div>
    </div>
  );
};
