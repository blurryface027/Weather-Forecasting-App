import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-500/20 backdrop-blur-md rounded-3xl p-8 border border-red-400/30 text-center">
      <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-white/80 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-white font-medium transition-all duration-200 border border-white/30"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};