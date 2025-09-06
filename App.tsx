import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PaperInput } from './components/PaperInput';
import { ReviewReport } from './components/ReviewReport';
import { Loader } from './components/Loader';
import { analyzePaper } from './services/geminiService';
import type { ReviewResult, ReviewerPersona } from './types';
import { Welcome } from './components/Welcome';
import { ErrorDisplay } from './components/ErrorDisplay';

const App: React.FC = () => {
  const [paperText, setPaperText] = useState<string>('');
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [persona, setPersona] = useState<ReviewerPersona>('Expert');

  const handleAnalyze = useCallback(async () => {
    if (!paperText.trim()) {
      setError('Paper content cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setReviewResult(null);

    try {
      const result = await analyzePaper(paperText, persona);
      setReviewResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [paperText, persona]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <PaperInput
            paperText={paperText}
            setPaperText={setPaperText}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            persona={persona}
            setPersona={setPersona}
          />
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 min-h-[600px] flex flex-col">
            {isLoading && <Loader />}
            {error && <ErrorDisplay message={error} />}
            {!isLoading && !error && reviewResult && <ReviewReport result={reviewResult} />}
            {!isLoading && !error && !reviewResult && <Welcome />}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm mt-8">
        <p>&copy; {new Date().getFullYear()} PaperSage. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
