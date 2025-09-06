import React from 'react';
import { ExclamationTriangleIcon } from './icons';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 max-w-lg">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-8 w-8 mr-4 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold">An Error Occurred</h3>
            <p className="mt-1 text-sm text-left">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
