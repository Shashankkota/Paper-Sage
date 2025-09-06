import React from 'react';
import { BookOpenIcon, CheckCircleIcon, SparklesIcon } from './icons';

export const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 p-4">
      <BookOpenIcon className="h-16 w-16 text-indigo-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Welcome to PaperSage</h2>
      <p className="mt-2 max-w-md">
        Your AI-powered assistant for perfecting academic papers before submission.
      </p>
      <div className="mt-8 text-left space-y-4">
        <div className="flex items-start">
          <SparklesIcon className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-700">Comprehensive Feedback</h3>
            <p className="text-sm">Get detailed, section-by-section analysis on clarity, originality, and structure.</p>
          </div>
        </div>
        <div className="flex items-start">
          <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-700">Plagiarism & Originality Check</h3>
            <p className="text-sm">Ensure your work is novel and properly cited with our advanced checks.</p>
          </div>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-500">
        To get started, simply paste your paper's content into the text area on the left and click "Analyze Paper".
      </p>
    </div>
  );
};
