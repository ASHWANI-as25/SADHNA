import { useState, useEffect } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { getQuestions, getCategories, getFieldsByCategory, getDifficultyLevels } from '../services/questionsDatabase';
import { evaluateAnswers, generatePerformanceAnalysis, generateMockLeaderboard, calculateDifficultyWeightedProgress } from '../services/assessmentService';
import { motion } from 'framer-motion';
import { Play, Clock, AlertCircle, CheckCircle, SkipForward, BookmarkIcon } from 'lucide-react';
import AssessmentResults from '../components/AssessmentResults';
import '../styles/assessment.css';

const Assessment = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedField,
    setSelectedField,
    selectedDifficulty,
    setSelectedDifficulty,
    testStarted,
    testCompleted,
    questions,
    currentQuestionIndex,
    timeRemaining,
    setTimeRemaining,
    answers,
    saveAnswer,
    bookmarks,
    toggleBookmark,
    goToQuestion,
    goNext,
    goPrevious,
    initializeTest,
    submitTest,
    resetTest,
    setLeaderboard,
    results,
  } = useAssessment();

  const [categories, setCategories] = useState([]);
  const [fields, setFields] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [selectedLayout, setSelectedLayout] = useState('default');

  // Timer effect
  useEffect(() => {
    if (!testStarted || testCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit when time ends
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testCompleted]);

  // Load categories
  useEffect(() => {
    setCategories(getCategories());
  }, []);

  // Load fields when category changes
  useEffect(() => {
    if (selectedCategory) {
      const categoryFields = getFieldsByCategory(selectedCategory);
      setFields(categoryFields);
      setSelectedField(null);
    }
  }, [selectedCategory]);

  // Load difficulties when field changes
  useEffect(() => {
    if (selectedCategory && selectedField) {
      const categoryDifficulties = getDifficultyLevels(selectedCategory, selectedField);
      setDifficulties(categoryDifficulties);
      setSelectedDifficulty(null);
    }
  }, [selectedField, selectedCategory]);

  // Update current answer when question changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      const savedAnswer = answers[question.id];
      setCurrentAnswer(savedAnswer?.answer || '');
    }
  }, [currentQuestionIndex, questions, answers]);

  // Start test
  const handleStartTest = () => {
    if (!selectedCategory || !selectedField || !selectedDifficulty) {
      alert('Please select category, field, and difficulty level');
      return;
    }

    const testQuestions = getQuestions(selectedCategory, selectedField, selectedDifficulty);
    if (testQuestions.length === 0) {
      alert('No questions available for this combination');
      return;
    }

    initializeTest(testQuestions);
  };

  // Save answer
  const handleSaveAnswer = () => {
    if (questions.length > 0) {
      const question = questions[currentQuestionIndex];
      saveAnswer(question.id, currentAnswer);
    }
  };

  // Skip question
  const handleSkip = () => {
    setCurrentAnswer('');
    handleSaveAnswer();
    goNext();
  };

  // Submit test
  const handleSubmitTest = () => {
    if (questions.length === 0) return;

    // CRITICAL: Build updated answers object that includes the current answer
    let updatedAnswers = { ...answers };
    
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentAnswer.trim() !== '') {
        updatedAnswers[currentQuestion.id] = {
          answer: currentAnswer,
          timestamp: new Date(),
        };
      }
    }

    // Save the answer to context state for persistence
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentAnswer.trim() !== '') {
        saveAnswer(currentQuestion.id, currentAnswer);
      }
    }

    // Evaluate with the updated answers
    const evaluation = evaluateAnswers(questions, updatedAnswers);

    // Generate analysis
    const analysis = generatePerformanceAnalysis(questions, evaluation);

    // Calculate test score percentage
    const testScorePercentage = (evaluation.totalScore / evaluation.maxScore) * 100;

    // Calculate difficulty-weighted progress
    const weightedProgress = calculateDifficultyWeightedProgress(
      testScorePercentage,
      selectedDifficulty
    );

    // Generate leaderboard
    const leaderboard = generateMockLeaderboard(evaluation.totalScore, evaluation.maxScore);
    setLeaderboard(leaderboard);

    // Submit results with weighted progress
    submitTest({
      ...evaluation,
      ...analysis,
      category: selectedCategory,
      field: selectedField,
      difficulty: selectedDifficulty,
      timestamp: new Date(),
      testScorePercentage,
      weightedProgress,
    });
  };

  // Format time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (testStarted && questions.length === 0) {
    return (
      <div className="assessment-loading">
        <div className="loader-spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  // Results page
  if (testCompleted && results) {
    return <AssessmentResults results={results} onRetry={resetTest} />;
  }

  // FALLBACK: Test completed but results not ready (timing issue)
  if (testCompleted && !results) {
    return (
      <div className="assessment-loading">
        <div className="loader-spinner"></div>
        <p>Processing your results...</p>
        <p style={{fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '1rem'}}>This usually takes a few seconds</p>
      </div>
    );
  }

  // Test selection page
  if (!testStarted) {
    return (
      <motion.div
        className="assessment-selection-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card assessment-selection-card">
          <div className="selection-header">
            <h1 className="text-gradient">📝 Assessment Test System</h1>
            <p className="subtitle">Choose your test parameters</p>
          </div>

          <div className="selection-section">
            <label className="selection-label">
              <span>📚 Category *</span>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass-input selection-input"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="selection-label">
              <span>🎯 Field / Role *</span>
              <select
                value={selectedField || ''}
                onChange={(e) => setSelectedField(e.target.value)}
                className="glass-input selection-input"
                disabled={!selectedCategory}
              >
                <option value="">Select Field</option>
                {fields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </label>

            <label className="selection-label">
              <span>⚡ Difficulty Level *</span>
              <select
                value={selectedDifficulty || ''}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="glass-input selection-input"
                disabled={!selectedField}
              >
                <option value="">Select Difficulty</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="selection-info">
            <div className="info-item">
              <Clock size={20} />
              <span>⏱️ Duration: 60 minutes</span>
            </div>
            <div className="info-item">
              <CheckCircle size={20} />
              <span>✓ 50 Questions</span>
            </div>
            <div className="info-item">
              <AlertCircle size={20} />
              <span>📊 Scoring: 2 points per correct answer</span>
            </div>
          </div>

          <button
            onClick={handleStartTest}
            className="start-button glow-blue"
            disabled={!selectedCategory || !selectedField || !selectedDifficulty}
          >
            <Play size={24} />
            Start Test
          </button>
        </div>
      </motion.div>
    );
  }

  // Test in progress
  if (questions.length > 0 && currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswered = answers[currentQuestion.id];
    const isBookmarked = bookmarks.has(currentQuestion.id);
    const answerStatus = isAnswered ? 'answered' : 'unanswered';

    return (
      <motion.div
        className="assessment-test-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with timer and progress */}
        <div className="assessment-header glow-blue">
          <div className="progress-info">
            <span className="question-counter">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="timer-section">
            <Clock size={24} />
            <span className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="assessment-content">
          {/* Question panel */}
          <motion.div
            className="question-panel glass-card"
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="question-header">
              <div className="question-meta">
                <span className={`question-type badge-${currentQuestion.type}`}>
                  {currentQuestion.type}
                </span>
                <span className="question-category">{currentQuestion.category}</span>
              </div>
              <button
                className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={() => toggleBookmark(currentQuestion.id)}
              >
                <BookmarkIcon size={20} />
              </button>
            </div>

            <h2 className="question-text">{currentQuestion.question}</h2>

            {/* Hints if available */}
            {currentQuestion.hints && currentQuestion.hints.length > 0 && (
              <details className="hints-section">
                <summary>💡 Hints</summary>
                <ul className="hints-list">
                  {currentQuestion.hints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              </details>
            )}

            {/* Answer textarea */}
            <textarea
              className="answer-textarea glass-input"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              rows="8"
            />

            {/* Answer status */}
            <div className={`answer-status ${answerStatus}`}>
              {answerStatus === 'answered' ? (
                <>
                  <CheckCircle size={16} />
                  <span>Answer saved</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>No answer</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Question navigation */}
          <div className="question-navigation">
            <div className="nav-buttons">
              <button
                onClick={goPrevious}
                disabled={currentQuestionIndex === 0}
                className="nav-btn"
              >
                ← Previous
              </button>

              <button
                onClick={handleSaveAnswer}
                className="nav-btn save-btn glow-purple"
              >
                💾 Save Answer
              </button>

              <button
                onClick={handleSkip}
                className="nav-btn skip-btn"
              >
                <SkipForward size={18} />
                Skip
              </button>

              <button
                onClick={goNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="nav-btn"
              >
                Next →
              </button>
            </div>

            {/* Question grid */}
            <div className="question-grid">
              <h4>Question Overview</h4>
              <div className="grid-wrapper">
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id];
                  const isCurrentQuestion = idx === currentQuestionIndex;
                  const isBookmarked = bookmarks.has(q.id);

                  return (
                    <motion.button
                      key={q.id}
                      onClick={() => goToQuestion(idx)}
                      className={`grid-item ${
                        isCurrentQuestion ? 'current' : ''
                      } ${isAnswered ? 'answered' : ''} ${isBookmarked ? 'bookmarked' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {idx + 1}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="action-buttons">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to submit the test?')) {
                    handleSubmitTest();
                  }
                }}
                className="submit-btn glow-cyan"
              >
                ✓ Submit Test
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Fallback: If test is completed but results haven't rendered yet, show a loading state
  // This prevents the blank page issue when there's a state timing issue
  if (testCompleted && !results) {
    return (
      <div className="assessment-loading">
        <div className="loader-spinner"></div>
        <p>Processing your results...</p>
      </div>
    );
  }

  // Debug fallback: This should rarely be hit, but if it is, we have state info
  if (testStarted && questions.length > 0) {
    console.warn('Assessment: Unexpected state after test submission', {
      testCompleted,
      results: !!results,
      testStarted,
      questionsLength: questions.length,
      currentQuestionIndex,
    });
    return (
      <div className="assessment-loading glass-card">
        <div className="loader-spinner"></div>
        <p>Loading assessment...</p>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
          {testCompleted ? 'Results processing...' : 'Test in progress...'}
        </p>
      </div>
    );
  }

  return null;
};

export default Assessment;
