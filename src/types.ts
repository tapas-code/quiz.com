export interface QuizOption {
  id: number;
  description: string;
  is_correct: boolean;
  photo_url: string | null;
  question_id: number;
  unanswered: boolean;
}

export interface QuizQuestion {
  id: number;
  description: string;
  detailed_solution: string;
  options: QuizOption[];
  photo_url: string | null;
  topic: string;
}

export interface QuizData {
  id: number;
  title: string;
  topic: string;
  questions: QuizQuestion[];
  duration: number;
  questions_count: number;
  correct_answer_marks: string;
  negative_marks: string;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  answers: number[];
  isComplete: boolean;
  streak: number;
  highestStreak: number;
  timeRemaining: number;
  selectedAnswers: (number | null)[];
  powerUps: {
    fiftyFifty: number;
    timeBonus: number;
    skipQuestion: number;
  };
  hiddenOptions: { [key: number]: number[] };
  answeredQuestions: { [key: number]: boolean };
  multiplier: number;
}