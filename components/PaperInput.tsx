import React from 'react';
import type { ReviewerPersona } from '../types';
import { SparklesIcon } from './icons';

interface PaperInputProps {
  paperText: string;
  setPaperText: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  persona: ReviewerPersona;
  setPersona: (persona: ReviewerPersona) => void;
}

export const PaperInput: React.FC<PaperInputProps> = ({
  paperText,
  setPaperText,
  onAnalyze,
  isLoading,
  persona,
  setPersona
}) => {
  const personas: ReviewerPersona[] = ['Expert', 'Strict', 'Friendly'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Submit Your Paper for Review</h2>
      <p className="text-sm text-gray-500">
        Paste the full content of your research paper below. Our AI will analyze its structure, clarity, originality, and more.
      </p>
      
      <div className="flex-grow">
        <textarea
          value={paperText}
          onChange={(e) => setPaperText(e.target.value)}
          placeholder="Paste your abstract, introduction, methods, results, and conclusion here..."
          className="w-full h-[400px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="persona-select" className="block text-sm font-medium text-gray-700 mb-1">
          Reviewer Persona
        </label>
        <select
          id="persona-select"
          value={persona}
          onChange={(e) => setPersona(e.target.value as ReviewerPersona)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm"
          disabled={isLoading}
        >
          {personas.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      
      <button
        onClick={onAnalyze}
        disabled={isLoading || !paperText}
        className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <SparklesIcon className="h-5 w-5 mr-2" />
        {isLoading ? 'Analyzing...' : 'Analyze Paper'}
      </button>
    </div>
  );
};
