import React from 'react';
import { Trophy, Award, RefreshCw, Zap } from 'lucide-react';
import { QuizState } from '../types';

interface QuizResultsProps {
  quizState: QuizState;
  onRestart: () => void;
}

export function QuizResults({ quizState, onRestart }: QuizResultsProps) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 text-center">
      <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
      <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
      
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-center gap-4">
          <div className="bg-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-600">Final Score</p>
            <p className="text-2xl font-bold text-blue-700">{quizState.score.toFixed(1)}</p>
          </div>
          
          <div className="bg-amber-100 rounded-lg p-4">
            <p className="text-sm text-amber-600">Highest Streak</p>
            <div className="flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <p className="text-2xl font-bold text-amber-700">{quizState.highestStreak}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-blue-600 
                 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <RefreshCw className="w-5 h-5" />
        Try Again
      </button>
    </div>
  );
}