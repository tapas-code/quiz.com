import React from 'react';
import { Trophy, Zap, Clock, Split, Timer, SkipForward } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (index: number) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  streak: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  selectedAnswer: number | null;
  powerUps: {
    fiftyFifty: number;
    timeBonus: number;
    skipQuestion: number;
  };
  onUsePowerUp: (type: 'fiftyFifty' | 'timeBonus' | 'skipQuestion') => void;
  hiddenOptions: number[];
  isAnswered: boolean;
  multiplier: number;
  onNext: () => void;
}

export function QuizCard({
  question,
  onAnswer,
  onSubmit,
  onPrevious,
  streak,
  currentQuestionIndex,
  totalQuestions,
  timeRemaining,
  selectedAnswer,
  powerUps,
  onUsePowerUp,
  hiddenOptions,
  isAnswered,
  multiplier,
  onNext
}: QuizCardProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getOptionClass = (index: number) => {
    const baseClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ease-in-out";
    
    if (hiddenOptions.includes(index)) {
      return `${baseClass} opacity-30 cursor-not-allowed`;
    }

    if (!isAnswered) {
      return `${baseClass} ${
        selectedAnswer === index 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
      }`;
    }

    if (question.options[index].is_correct) {
      return `${baseClass} border-green-500 bg-green-50`;
    }

    if (selectedAnswer === index && !question.options[index].is_correct) {
      return `${baseClass} border-red-500 bg-red-50`;
    }

    return `${baseClass} border-gray-200 opacity-50`;
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="flex items-center gap-2 text-amber-500">
              <Zap className="w-5 h-5" />
              <span className="font-bold">Streak: {streak}</span>
            </div>
          )}
          {multiplier > 1 && (
            <div className="text-purple-600 font-bold">
              {multiplier.toFixed(1)}x Multiplier
            </div>
          )}
        </div>
        <div className={`flex items-center gap-2 ${timeRemaining < 60 ? 'text-red-500 animate-bounce' : 'text-blue-600'} `}>
          <Clock className="w-5 h-5" />
          <span className="font-medium">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => onUsePowerUp('fiftyFifty')}
          disabled={powerUps.fiftyFifty === 0 || isAnswered}
          className="flex items-center gap-2 px-3 py-2 bg-purple-100 rounded-lg disabled:opacity-50"
          title="Remove two wrong answers"
        >
          <Split className="w-4 h-4 text-purple-600" />
          <span className="text-purple-600 font-medium">{powerUps.fiftyFifty}</span>
        </button>

        <button
          onClick={() => onUsePowerUp('timeBonus')}
          disabled={powerUps.timeBonus === 0}
          className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg disabled:opacity-50"
          title="Add 1 minute"
        >
          <Timer className="w-4 h-4 text-green-600" />
          <span className="text-green-600 font-medium">{powerUps.timeBonus}</span>
        </button>

        <button
          onClick={() => onUsePowerUp('skipQuestion')}
          disabled={powerUps.skipQuestion === 0 || isAnswered || currentQuestionIndex === totalQuestions - 1}
          className="flex items-center gap-2 px-3 py-2 bg-yellow-100 rounded-lg disabled:opacity-50"
          title="Skip to next question"
        >
          <SkipForward className="w-4 h-4 text-yellow-600" />
          <span className="text-yellow-600 font-medium">{powerUps.skipQuestion}</span>
        </button>
      </div>
      
      <h2 className="text-xl font-semibold mb-6">{question.description}</h2>
      
      {question.photo_url && (
        <img 
          src={question.photo_url} 
          alt="Question illustration" 
          className="mb-6 rounded-lg w-full"
        />
      )}
      
      <div className="grid gap-4 mb-6">
        {question.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => !isAnswered && onAnswer(index)}
            disabled={hiddenOptions.includes(index) || isAnswered}
            className={getOptionClass(index)}
          >
            {option.description}
            {option.photo_url && (
              <img 
                src={option.photo_url} 
                alt={`Option ${index + 1}`} 
                className="mt-2 rounded-lg w-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-blue-600 disabled:opacity-50"
        >
          Previous
        </button>

        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <button
            onClick={onSubmit}
            disabled={!isAnswered}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!isAnswered}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}