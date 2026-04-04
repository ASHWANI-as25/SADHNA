/**
 * Assessment Scoring & Evaluation Service
 * Handles scoring logic, analysis, and leaderboard calculations
 */

/**
 * Evaluate answers and calculate score
 * Scoring rules:
 * - Correct: +2 points
 * - Wrong: 0 points
 * - Skipped: 0 points
 */
export const evaluateAnswers = (questions, answers) => {
  if (!questions || questions.length === 0) {
    return {
      totalScore: 0,
      maxScore: 0,
      accuracy: 0,
      attempted: 0,
      skipped: 0,
      correct: 0,
      wrong: 0,
      scoreBreakdown: [],
    };
  }

  const maxScore = questions.length * 2; // 2 points per question
  let totalScore = 0;
  let correct = 0;
  let wrong = 0;
  let attempted = 0;
  let skipped = 0;
  const scoreBreakdown = [];

  questions.forEach((question) => {
    const userAnswer = answers[question.id];

    if (!userAnswer || userAnswer.answer === null || userAnswer.answer === '') {
      skipped++;
      scoreBreakdown.push({
        questionId: question.id,
        status: 'skipped',
        points: 0,
      });
    } else {
      attempted++;
      // Simple evaluation: check if answer matches
      const isCorrect = evaluateSingleAnswer(question, userAnswer.answer);

      if (isCorrect) {
        correct++;
        totalScore += 2;
        scoreBreakdown.push({
          questionId: question.id,
          status: 'correct',
          points: 2,
        });
      } else {
        wrong++;
        scoreBreakdown.push({
          questionId: question.id,
          status: 'wrong',
          points: 0,
        });
      }
    }
  });

  const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

  return {
    totalScore,
    maxScore,
    accuracy: Math.round(accuracy * 100) / 100,
    attempted,
    skipped,
    correct,
    wrong,
    scoreBreakdown,
  };
};

/**
 * Evaluate a single answer
 * For coding questions, check if output matches expected
 * For MCQ/conceptual, check if answer contains key terms
 */
const evaluateSingleAnswer = (question, userAnswer) => {
  if (!userAnswer || userAnswer.trim() === '') {
    return false;
  }

  // For coding questions, check if test cases pass
  if (question.type === 'coding' && question.testCases) {
    return evaluateCodeAnswer(question, userAnswer);
  }

  // For conceptual questions, check if answer contains key terms
  if (question.type === 'conceptual') {
    return evaluateConceptualAnswer(question.answer, userAnswer);
  }

  // For scenario-based, check answer quality
  if (question.type === 'scenario-based') {
    return evaluateScenarioAnswer(question.answer, userAnswer);
  }

  // For practical, flexible matching
  if (question.type === 'practical') {
    return evaluatePracticalAnswer(question.answer, userAnswer);
  }

  // For problem-solving, check logic
  if (question.type === 'problem-solving') {
    return evaluateProblemAnswer(question.answer, userAnswer);
  }

  return false;
};

/**
 * Evaluate code answer against test cases
 */
const evaluateCodeAnswer = (question, userAnswer) => {
  if (!question.testCases || question.testCases.length === 0) {
    return false;
  }

  // Try to execute code and check against test cases
  try {
    // This would require actual code execution sandbox
    // For now, simple heuristic: check if user code is reasonable length
    return userAnswer.length > 50; // Placeholder
  } catch (e) {
    return false;
  }
};

/**
 * Evaluate conceptual answer by checking key terms
 */
const evaluateConceptualAnswer = (expectedAnswer, userAnswer) => {
  const expected = expectedAnswer.toLowerCase();
  const user = userAnswer.toLowerCase();

  // Extract key terms (words longer than 3 chars)
  const expectedTerms = expected
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .map((w) => w.replace(/[.,;:!?\-()]/g, ''));

  const userTerms = user
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .map((w) => w.replace(/[.,;:!?\-()]/g, ''));

  // Check if at least 60% of key terms match
  const matchedTerms = expectedTerms.filter((term) =>
    userTerms.some((uTerm) => uTerm.includes(term) || term.includes(uTerm))
  );

  return matchedTerms.length / expectedTerms.length >= 0.6;
};

/**
 * Evaluate scenario-based answer
 */
const evaluateScenarioAnswer = (expectedAnswer, userAnswer) => {
  const expected = expectedAnswer.toLowerCase();
  const user = userAnswer.toLowerCase();

  // Check for key solution components
  const keyPoints = expected.split('.').filter((s) => s.trim().length > 0);
  let matchedPoints = 0;

  keyPoints.forEach((point) => {
    const keywords = point
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 3);

    if (
      keywords.some((kw) =>
        user.includes(kw.replace(/[.,;:!?\-()]/g, ''))
      )
    ) {
      matchedPoints++;
    }
  });

  return matchedPoints / keyPoints.length >= 0.5;
};

/**
 * Evaluate practical answer
 */
const evaluatePracticalAnswer = (expectedAnswer, userAnswer) => {
  const expected = expectedAnswer.toLowerCase();
  const user = userAnswer.toLowerCase();

  // Check for code-like structure
  const codeIndicators = ['function', 'return', 'const', 'let', 'var', '='];
  const hasCode = codeIndicators.some((ind) => user.includes(ind));

  if (hasCode) {
    // Check if key algorithm components match
    const expectedComponents = expected
      .split(/\s+/)
      .filter((w) => w.match(/[a-z]+/i) && w.length > 4)
      .slice(0, 5);

    const matchedComponents = expectedComponents.filter((comp) =>
      user.includes(comp.replace(/[.,;:!?\-()]/g, ''))
    );

    return matchedComponents.length / expectedComponents.length >= 0.4;
  }

  return false;
};

/**
 * Evaluate problem-solving answer
 */
const evaluateProblemAnswer = (expectedAnswer, userAnswer) => {
  return evaluateConceptualAnswer(expectedAnswer, userAnswer);
};

/**
 * Generate performance analysis
 */
export const generatePerformanceAnalysis = (questions, evaluation, categorySkills) => {
  const strengths = [];
  const weaknesses = [];

  if (!evaluation || !questions) {
    return { strengths, weaknesses, improvementTips: [] };
  }

  // Analyze by question type
  const byType = {};
  questions.forEach((q, idx) => {
    const type = q.type;
    if (!byType[type]) byType[type] = { correct: 0, total: 0 };
    byType[type].total++;

    const breakdown = evaluation.scoreBreakdown[idx];
    if (breakdown && breakdown.status === 'correct') {
      byType[type].correct++;
    }
  });

  // Identify strong and weak areas
  Object.entries(byType).forEach(([type, stats]) => {
    const accuracy = (stats.correct / stats.total) * 100;
    if (accuracy >= 80) {
      strengths.push(`Strong in ${type} questions (${accuracy.toFixed(1)}% accuracy)`);
    } else if (accuracy < 50) {
      weaknesses.push(`Needs improvement in ${type} questions (${accuracy.toFixed(1)}% accuracy)`);
    }
  });

  // Analyze by skills
  const skillAccuracy = {};
  questions.forEach((q, idx) => {
    if (q.skills) {
      q.skills.forEach((skill) => {
        if (!skillAccuracy[skill]) skillAccuracy[skill] = { correct: 0, total: 0 };
        skillAccuracy[skill].total++;

        const breakdown = evaluation.scoreBreakdown[idx];
        if (breakdown && breakdown.status === 'correct') {
          skillAccuracy[skill].correct++;
        }
      });
    }
  });

  const improvementTips = [
    'Review fundamentals of weak areas',
    'Practice more scenario-based problems',
    'Focus on concepts showing < 50% accuracy',
    'Study related topics and interconnections',
    'Solve previous year questions for revision',
  ];

  return {
    strengths: strengths.length > 0 ? strengths : ['Good attempt on the test'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Overall performance is good'],
    skillAccuracy,
    improvementTips,
    byType,
  };
};

/**
 * Calculate percentile and rank based on leaderboard
 */
export const calculateRanking = (score, leaderboard) => {
  if (!leaderboard || leaderboard.length === 0) {
    return {
      rank: 1,
      percentile: 100,
      performance: 'Advanced',
    };
  }

  const rankedScores = leaderboard.sort((a, b) => b.totalScore - a.totalScore);
  const rank = rankedScores.findIndex((entry) => entry.totalScore === score) + 1;
  const percentile = Math.round(((leaderboard.length - rank) / leaderboard.length) * 100);

  let performance = 'Beginner';
  if (percentile >= 80) performance = 'Advanced';
  else if (percentile >= 50) performance = 'Intermediate';
  else performance = 'Beginner';

  return {
    rank: rank || leaderboard.length,
    percentile,
    performance,
    totalAttempts: leaderboard.length,
  };
};

/**
 * Format score percentage
 */
export const formatScore = (score, maxScore) => {
  if (maxScore === 0) return '0%';
  const percentage = (score / maxScore) * 100;
  return `${Math.round(percentage)}%`;
};

/**
 * Get performance level badge
 */
export const getPerformanceBadge = (score, maxScore) => {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 90) return { level: '🏆 Excellent', color: 'gold' };
  if (percentage >= 80) return { level: '🥇 Very Good', color: 'silver' };
  if (percentage >= 70) return { level: '🥈 Good', color: 'bronze' };
  if (percentage >= 60) return { level: '✓ Satisfactory', color: 'green' };
  if (percentage >= 50) return { level: '△ Average', color: 'orange' };
  return { level: '✗ Below Average', color: 'red' };
};

/**
 * Calculate difficulty-weighted progress
 * Applies multiplier based on difficulty level to adjust overall progress
 * 
 * Weights:
 * - Easy: 0.6x multiplier
 * - Medium: 0.8x multiplier
 * - Hard: 1.0x multiplier (100%)
 * 
 * Example:
 * - Score 80% on Easy → Progress = 80 × 0.6 = 48%
 * - Score 80% on Medium → Progress = 80 × 0.8 = 64%
 * - Score 80% on Hard → Progress = 80 × 1.0 = 80%
 */
export const calculateDifficultyWeightedProgress = (testScorePercentage, difficulty) => {
  const weights = {
    'Easy': 0.6,
    'Medium': 0.8,
    'Hard': 1.0,
  };

  const weight = weights[difficulty] || 0.8; // Default to Medium if unknown
  const overallProgress = Math.round((testScorePercentage * weight) * 100) / 100;

  return {
    rawScore: Math.round(testScorePercentage * 100) / 100,
    difficulty,
    weight,
    overallProgress,
  };
};

/**
 * Generate mock leaderboard data for testing
 */
export const generateMockLeaderboard = (userScore, userMaxScore) => {
  const mockScores = [
    { name: 'Raj Kumar', totalScore: 90, maxScore: 100, accuracy: 90, category: 'CS', field: 'Software Engineer', difficulty: 'Hard' },
    { name: 'Priya Sen', totalScore: 88, maxScore: 100, accuracy: 88, category: 'CS', field: 'Software Engineer', difficulty: 'Hard' },
    { name: 'Amit Patel', totalScore: 85, maxScore: 100, accuracy: 85, category: 'CS', field: 'Software Engineer', difficulty: 'Medium' },
    { name: 'Neha Gupta', totalScore: 82, maxScore: 100, accuracy: 82, category: 'CS', field: 'Data Scientist', difficulty: 'Hard' },
    { name: 'Vikram Singh', totalScore: 80, maxScore: 100, accuracy: 80, category: 'CS', field: 'DevOps Engineer', difficulty: 'Medium' },
    { name: 'Current User', totalScore: userScore, maxScore: userMaxScore, accuracy: (userScore / userMaxScore) * 100, category: 'CS', field: 'Software Engineer', difficulty: 'Medium' },
    { name: 'Anjali Verma', totalScore: 75, maxScore: 100, accuracy: 75, category: 'CS', field: 'Software Engineer', difficulty: 'Medium' },
    { name: 'Rohan Kulkarni', totalScore: 72, maxScore: 100, accuracy: 72, category: 'CS', field: 'Software Engineer', difficulty: 'Easy' },
  ];

  return mockScores.sort((a, b) => b.totalScore - a.totalScore);
};
