import { useState, useEffect } from "react";
import { QuizState, QuizData } from "../types";

// Mock data for development
const mockQuizData: QuizData = {
  id: 60,
  title: "Genetics and Evolution",
  topic: "The Molecular Basis of Inheritance",
  duration: 15,
  questions_count: 10,
  correct_answer_marks: "4.0",
  negative_marks: "1.0",
  questions: [
    {
      id: 3342,
      description:
        "If the base sequence in DNA is 5' AAAT 3' then the base sequence in mRNA is :",
      detailed_solution: "The base sequence in mRNA is: 5' AAAU 3'",
      options: [
        {
          id: 13379,
          description: "5'UUUU3'",
          is_correct: false,
          photo_url: null,
          question_id: 3342,
          unanswered: false,
        },
        {
          id: 13380,
          description: "5'AAAU3'",
          is_correct: true,
          photo_url: null,
          question_id: 3342,
          unanswered: false,
        },
        {
          id: 13381,
          description: "5'UUUA3'",
          is_correct: false,
          photo_url: null,
          question_id: 3342,
          unanswered: false,
        },
        {
          id: 13382,
          description: "5'TTTA3'",
          is_correct: false,
          photo_url: null,
          question_id: 3342,
          unanswered: false,
        },
      ],
      photo_url: null,
      topic: "Molecular Basis Of Inheritance",
    },
    {
      id: 3343,
      description:
        "During DNA replication, which enzyme is responsible for joining DNA fragments on the lagging strand?",
      detailed_solution:
        "DNA ligase joins Okazaki fragments on the lagging strand during DNA replication. These fragments are formed because DNA synthesis can only occur in the 5' to 3' direction.",
      options: [
        {
          id: 13383,
          description: "DNA Polymerase",
          is_correct: false,
          photo_url: null,
          question_id: 3343,
          unanswered: false,
        },
        {
          id: 13384,
          description: "DNA Ligase",
          is_correct: true,
          photo_url: null,
          question_id: 3343,
          unanswered: false,
        },
        {
          id: 13385,
          description: "Helicase",
          is_correct: false,
          photo_url: null,
          question_id: 3343,
          unanswered: false,
        },
        {
          id: 13386,
          description: "Primase",
          is_correct: false,
          photo_url: null,
          question_id: 3343,
          unanswered: false,
        },
      ],
      photo_url: null,
      topic: "Molecular Basis Of Inheritance",
    },
  ],
};

export function useQuiz() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    answers: [],
    isComplete: false,
    streak: 0,
    highestStreak: 0,
    timeRemaining: 0,
    selectedAnswers: [],
    powerUps: {
      fiftyFifty: 2,
      timeBonus: 3,
      skipQuestion: 2,
    },
    hiddenOptions: {},
    answeredQuestions: {},
    multiplier: 1,
  });

  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    if (quizData && !quizState.isComplete) {
      setQuizState((prev) => ({
        ...prev,
        timeRemaining: quizData.duration * 60,
      }));
      const timer = setInterval(() => {
        setQuizState((prev) => {
          if (prev.timeRemaining <= 0) {
            clearInterval(timer);
            return { ...prev, isComplete: true };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizData, quizState.isComplete]);

  const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? '/api'  // Uses the Vite proxy in dev
    : 'https://api.allorigins.win/get?url=https://api.jsonserve.com';  // Direct API call in production

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Uw5CrX`);
      console.log('Fetching data from: ', API_BASE_URL);
      if (!response.ok) throw new Error("Failed to fetch quiz data");
      const data = await response.json();
      
      const fetchedQuizData = import.meta.env.MODE === 'development' ? data : data.contents;
      
      setQuizData(fetchedQuizData);
      setQuizState((prev) => ({
        ...prev,
        selectedAnswers: new Array(mockQuizData.questions_count).fill(null),
        hiddenOptions: {},
        answeredQuestions: {},
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  // const submitAnswer = (answerIndex: number) => {
  //   if (!quizData) return;

  //   const currentQuestion = quizData.questions[quizState.currentQuestion];
  //   const isCorrect = currentQuestion.options[answerIndex].is_correct;

  //   setQuizState(prev => {
  //     const newState = {
  //       ...prev,
  //       selectedAnswers: prev.selectedAnswers.map((ans, i) =>
  //         i === prev.currentQuestion ? answerIndex : ans
  //       ),
  //       answeredQuestions: {
  //         ...prev.answeredQuestions,
  //         [prev.currentQuestion]: true
  //       }
  //     };

  //     if (isCorrect) {
  //       newState.streak = prev.streak + 1;
  //       newState.multiplier = Math.min(prev.multiplier + 0.1, 2);
  //     } else {
  //       newState.streak = 0;
  //       newState.multiplier = 1;
  //     }

  //     return newState;
  //   });
  // };
  const submitAnswer = (answerIndex: number) => {
    if (!quizData) return;

    const currentQuestion = quizData.questions[quizState.currentQuestion];
    const isCorrect = currentQuestion.options[answerIndex].is_correct;
    const correctMarks = parseFloat(quizData.correct_answer_marks);
    const negativeMarks = parseFloat(quizData.negative_marks);

    setQuizState((prev) => {
      const newState = {
        ...prev,
        selectedAnswers: prev.selectedAnswers.map((ans, i) =>
          i === prev.currentQuestion ? answerIndex : ans
        ),
        answeredQuestions: {
          ...prev.answeredQuestions,
          [prev.currentQuestion]: true,
        },
      };

      if (isCorrect) {
        // Update the score immediately using the current multiplier
        newState.score = prev.score + correctMarks * prev.multiplier;
        newState.streak = prev.streak + 1;
        newState.multiplier = Math.min(prev.multiplier + 0.1, 2);
      } else {
        newState.score = prev.score - negativeMarks;
        newState.streak = 0;
        newState.multiplier = 1;
      }

      return newState;
    });
  };

  const submitQuiz = () => {
    if (!quizData) return;

    // let totalScore = 0;
    let streak = 0;
    let highestStreak = 0;

    quizState.selectedAnswers.forEach((answerIndex, questionIndex) => {
      if (answerIndex === null) return;

      const question = quizData.questions[questionIndex];
      const isCorrect = question.options[answerIndex].is_correct;
      // const correctMarks = parseFloat(quizData.correct_answer_marks);
      // const negativeMarks = parseFloat(quizData.negative_marks);

      if (isCorrect) {
        // totalScore += correctMarks * quizState.multiplier;
        streak++;
        highestStreak = Math.max(highestStreak, streak);
      } else {
        // totalScore -= negativeMarks;
        streak = 0;
      }
    });

    setQuizState((prev) => ({
      ...prev,
      // score: totalScore,
      isComplete: true,
      highestStreak,
    }));
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < (quizData?.questions_count || 0)) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: index,
      }));
    }
  };

  const usePowerUp = (type: "fiftyFifty" | "timeBonus" | "skipQuestion") => {
    if (!quizData || quizState.powerUps[type] <= 0) return;

    setQuizState((prev) => {
      const newState = { ...prev };

      switch (type) {
        case "fiftyFifty": {
          newState.powerUps.fiftyFifty--;
          const currentQuestion = quizData.questions[prev.currentQuestion];
          const incorrectOptions = currentQuestion.options
            .map((opt, idx) => ({ idx, isCorrect: opt.is_correct }))
            .filter((opt) => !opt.isCorrect)
            .map((opt) => opt.idx);

          // Randomly select two incorrect options to hide
          const shuffled = incorrectOptions.sort(() => 0.5 - Math.random());
          const toHide = shuffled.slice(0, 2);

          newState.hiddenOptions = {
            ...prev.hiddenOptions,
            [prev.currentQuestion]: toHide,
          };
          break;
        }
        case "timeBonus":
          newState.powerUps.timeBonus--;
          newState.timeRemaining += 60;
          break;
        case "skipQuestion":
          newState.powerUps.skipQuestion--;
          if (prev.currentQuestion < quizData.questions_count - 1) {
            newState.currentQuestion = prev.currentQuestion + 1;
          }
          break;
      }

      return newState;
    });
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      score: 0,
      answers: [],
      isComplete: false,
      streak: 0,
      highestStreak: 0,
      timeRemaining: quizData?.duration ? quizData.duration * 60 : 0,
      selectedAnswers: new Array(quizData?.questions_count || 0).fill(null),
      powerUps: {
        fiftyFifty: 2,
        timeBonus: 3,
        skipQuestion: 2,
      },
      hiddenOptions: {},
      answeredQuestions: {},
      multiplier: 1,
    });
  };

  return {
    quizData,
    loading,
    error,
    quizState,
    submitAnswer,
    submitQuiz,
    goToQuestion,
    usePowerUp,
    restartQuiz,
  };
}
