import { createContext, useContext, useState, useCallback } from 'react';

const AssessmentContext = createContext();

export const AssessmentProvider = ({ children }) => {
  // Test selection
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  // Test state
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Timer
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [totalTime, setTotalTime] = useState(3600);

  // Answers
  const [answers, setAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState(new Set());

  // Results
  const [results, setResults] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // Initialize test
  const initializeTest = useCallback((qList) => {
    setQuestions(qList);
    setTestStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setBookmarks(new Set());
    setTimeRemaining(3600);
  }, []);

  // Save answer
  const saveAnswer = useCallback((questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answer,
        timestamp: new Date(),
      },
    }));
  }, []);

  // Toggle bookmark
  const toggleBookmark = useCallback((questionId) => {
    setBookmarks((prev) => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(questionId)) {
        newBookmarks.delete(questionId);
      } else {
        newBookmarks.add(questionId);
      }
      return newBookmarks;
    });
  }, []);

  // Navigate to question
  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  // Next/Previous question
  const goNext = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  }, [questions.length]);

  const goPrevious = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Submit test
  const submitTest = useCallback((evaluation) => {
    setTestCompleted(true);
    setResults(evaluation);
  }, []);

  // Reset test
  const resetTest = useCallback(() => {
    setTestStarted(false);
    setTestCompleted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTimeRemaining(3600);
    setAnswers({});
    setBookmarks(new Set());
    setResults(null);
    setSelectedCategory(null);
    setSelectedField(null);
    setSelectedDifficulty(null);
  }, []);

  const value = {
    // Selection
    selectedCategory,
    setSelectedCategory,
    selectedField,
    setSelectedField,
    selectedDifficulty,
    setSelectedDifficulty,

    // Test state
    testStarted,
    testCompleted,
    questions,
    currentQuestionIndex,
    initializeTest,

    // Timer
    timeRemaining,
    setTimeRemaining,
    totalTime,

    // Answers
    answers,
    saveAnswer,
    bookmarks,
    toggleBookmark,

    // Navigation
    goToQuestion,
    goNext,
    goPrevious,

    // Results
    results,
    submitTest,
    leaderboard,
    setLeaderboard,

    // Reset
    resetTest,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};
