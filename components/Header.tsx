import React from 'react';
import { BookOpenIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpenIcon className="h-10 w-10 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">PaperSage</h1>
            <p className="text-sm text-gray-500">AI-Powered Research Paper Reviewer</p>
          </div>
        </div>
      </div>
    </header>
  );
};
