import React, { useEffect } from 'react';
import { useQuiz } from './hooks/useQuiz';
import { QuizCard } from './components/QuizCard';
import { QuizResults } from './components/QuizResults';
import { Brain, Loader2 } from 'lucide-react';

function App() {
  const {
    quizData,
    loading,
    error,
    quizState,
    submitAnswer,
    submitQuiz,
    goToQuestion,
    usePowerUp,
    restartQuiz
  } = useQuiz();

  useEffect(() => {
    if (quizState.timeRemaining === 0 && !quizState.isComplete ) {
      submitQuiz();
    }
  }, [quizState.timeRemaining, quizState.isComplete]);

  const handleNext = () => {
    goToQuestion(quizState.currentQuestion + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" >
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-medium">Loading quiz...</span>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="font-medium">Error: {error || 'Failed to load quiz data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="flex items-center gap-2 mb-8">
        <Brain className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">{quizData.title}</h1>
      </div>

      {!quizState.isComplete ? (
        <>
          <div className="mb-6 text-center">
            <p className="text-lg font-medium text-blue-600">
              Score: {quizState.score.toFixed(1)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Topic: {quizData.topic}
            </p>
          </div>

          <QuizCard
            question={quizData.questions[quizState.currentQuestion]}
            onAnswer={submitAnswer}
            onSubmit={submitQuiz}
            onPrevious={() => goToQuestion(quizState.currentQuestion - 1)}
            streak={quizState.streak}
            currentQuestionIndex={quizState.currentQuestion}
            totalQuestions={quizData.questions_count}
            timeRemaining={quizState.timeRemaining}
            selectedAnswer={quizState.selectedAnswers[quizState.currentQuestion]}
            powerUps={quizState.powerUps}
            onUsePowerUp={usePowerUp}
            hiddenOptions={quizState.hiddenOptions[quizState.currentQuestion] || []}
            isAnswered={quizState.answeredQuestions[quizState.currentQuestion] || false}
            multiplier={quizState.multiplier}
            onNext={handleNext}
          />
        </>
      ) : (
        <QuizResults quizState={quizState} onRestart={restartQuiz} />
      )}
    </div>
  );
}

export default App;