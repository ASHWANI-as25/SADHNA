/**
 * Gamification System - Badges, Streaks, Points
 */

export const badges = {
  // Coding Achievement Badges
  FIRST_PROBLEM: {
    id: 'first_problem',
    name: '🚀 Getting Started',
    description: 'Complete your first interview problem',
    icon: '🚀',
    condition: (data) => data.totalInterviews >= 1
  },
  
  FIVE_STREAK: {
    id: 'five_streak',
    name: '🔥 On Fire',
    description: '5 consecutive day interviews',
    icon: '🔥',
    condition: (data) => data.currentStreak >= 5
  },
  
  TEN_STREAK: {
    id: 'ten_streak',
    name: '💪 Unstoppable',
    description: '10 consecutive day interviews',
    icon: '💪',
    condition: (data) => data.currentStreak >= 10
  },
  
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: '💯 Perfect',
    description: 'Score 100% on an interview',
    icon: '💯',
    condition: (data) => data.recentScores.some(s => s === 100)
  },
  
  HARD_MASTER: {
    id: 'hard_master',
    name: '🏆 Hard Master',
    description: '5 Hard problems solved with 80%+ score',
    icon: '🏆',
    condition: (data) => {
      const hardProblems = data.history.filter(h => h.difficulty === 'Hard' && h.score >= 80);
      return hardProblems.length >= 5;
    }
  },
  
  SPEED_RUNNER: {
    id: 'speed_runner',
    name: '⚡ Speed Runner',
    description: 'Solve a Hard problem in under 10 minutes',
    icon: '⚡',
    condition: (data) => data.fastestHardProblemTime < 600 // 600 seconds = 10 mins
  },
  
  CONSISTENT: {
    id: 'consistent',
    name: '📈 Consistent',
    description: 'Average score above 80% over 10 interviews',
    icon: '📈',
    condition: (data) => {
      if (data.recentScores.length < 10) return false;
      const avg = data.recentScores.slice(-10).reduce((a, b) => a + b, 0) / 10;
      return avg >= 80;
    }
  },
  
  MULTI_LANGUAGE: {
    id: 'multi_language',
    name: '🌍 Polyglot',
    description: 'Solve problems in 5 different languages',
    icon: '🌍',
    condition: (data) => {
      const languages = new Set(data.history.map(h => h.language));
      return languages.size >= 5;
    }
  },
  
  ROLE_MASTER: {
    id: 'role_master',
    name: '👨‍💼 Role Expert',
    description: 'Master all difficulty levels in a single role',
    icon: '👨‍💼',
    condition: (data) => {
      const roles = {};
      data.history.forEach(h => {
        if (!roles[h.role]) roles[h.role] = new Set();
        if (h.score >= 70) roles[h.role].add(h.difficulty);
      });
      return Object.values(roles).some(difficulties => difficulties.size >= 3);
    }
  },
  
  COMEBACK_KID: {
    id: 'comeback_kid',
    name: '🎯 Comeback King',
    description: 'Score 90%+ after scoring below 50% previously',
    icon: '🎯',
    condition: (data) => {
      if (data.recentScores.length < 2) return false;
      for (let i = 1; i < data.recentScores.length; i++) {
        if (data.recentScores[i - 1] < 50 && data.recentScores[i] >= 90) {
          return true;
        }
      }
      return false;
    }
  }
};

/**
 * Calculate user streaks and achievements
 */
export const calculateStreaks = (history) => {
  if (!history || history.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysParticipated: 0,
      lastInterviewDate: null
    };
  }

  const interviews = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const uniqueDates = new Set();

  let lastDate = null;

  for (const interview of interviews) {
    const date = new Date(interview.date).toDateString();
    uniqueDates.add(date);

    if (!lastDate) {
      lastDate = new Date(date);
      tempStreak = 1;
      continue;
    }

    const prevDate = new Date(lastDate);
    const currentDate = new Date(date);
    const daysDiff = Math.floor((prevDate - currentDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      tempStreak++;
    } else if (daysDiff > 1) {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }

    lastDate = currentDate;
  }

  currentStreak = tempStreak;
  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    totalDaysParticipated: uniqueDates.size,
    lastInterviewDate: interviews[0]?.date
  };
};

/**
 * Calculate user level based on points
 */
export const calculateUserLevel = (userStats) => {
  let points = 0;

  // Points from interviews
  points += (userStats.totalInterviews || 0) * 10;
  
  // Points from scores
  points += (userStats.averageScore || 0) * 5;
  
  // Points from streak
  points += (userStats.currentStreak || 0) * 20;
  
  // Points from completed badges
  points += (userStats.badges || []).length * 50;

  // Calculate level (every 500 points = 1 level)
  const level = Math.floor(points / 500) + 1;
  const progressToNextLevel = (points % 500) / 500;

  return {
    level,
    points,
    progressToNextLevel,
    nextLevelPoints: Math.ceil((level) * 500)
  };
};

/**
 * Check and award badges
 */
export const checkAndAwardBadges = (currentBadges, userStats) => {
  const newBadges = [];
  const alreadyHas = new Set(currentBadges.map(b => b.id));

  for (const [key, badge] of Object.entries(badges)) {
    if (!alreadyHas.has(badge.id) && badge.condition(userStats)) {
      newBadges.push({
        ...badge,
        unlockedAt: new Date().toISOString()
      });
    }
  }

  return newBadges;
};

/**
 * Get user achievements summary
 */
export const getAchievementsSummary = (userStats) => {
  const streaks = calculateStreaks(userStats.history || []);
  const level = calculateUserLevel({
    ...userStats,
    ...streaks
  });

  const achievements = {
    badgesCount: (userStats.badges || []).length,
    levelInfo: level,
    streaks,
    nextMilestone: getNextMilestone(userStats),
    achievements: userStats.badges || []
  };

  return achievements;
};

/**
 * Get next achievable milestone
 */
const getNextMilestone = (userStats) => {
  const milestones = [
    { name: 'First Interview', target: 1, current: userStats.totalInterviews || 0, unit: 'interviews' },
    { name: 'Five Day Streak', target: 5, current: userStats.currentStreak || 0, unit: 'days' },
    { name: 'Ten Hard Problems', target: 10, current: (userStats.history || []).filter(h => h.difficulty === 'Hard').length, unit: 'problems' },
    { name: 'Perfect Score', target: 1, current: (userStats.history || []).filter(h => h.score === 100).length, unit: 'scores' },
    { name: 'Level 10', target: 10, current: Math.floor((userStats.points || 0) / 500) + 1, unit: 'level' }
  ];

  const nextMilestone = milestones.find(m => m.current < m.target);
  
  if (!nextMilestone) {
    return { name: 'Master Level', message: '🌟 You are a Master! Keep pushing!' };
  }

  const progress = Math.round((nextMilestone.current / nextMilestone.target) * 100);
  
  return {
    name: nextMilestone.name,
    progress,
    current: nextMilestone.current,
    target: nextMilestone.target,
    unit: nextMilestone.unit,
    message: `${progress}% to unlocking ${nextMilestone.name}`
  };
};

/**
 * Calculate points for an interview
 */
export const calculateInterviewPoints = (interview) => {
  let points = 0;

  // Base points
  points += 10;

  // Score-based points
  points += Math.round((interview.score || 0) / 10);

  // Difficulty multiplier
  const difficultyMultiplier = {
    'Easy': 1,
    'Medium': 1.5,
    'Hard': 2
  };
  points *= (difficultyMultiplier[interview.difficulty] || 1);

  // Speed bonus (under 50% of total time)
  if (interview.timeSpent && interview.maxTime && interview.timeSpent < interview.maxTime * 0.5) {
    points *= 1.2;
  }

  return Math.round(points);
};

/**
 * Generate daily challenge
 */
export const generateDailyChallenge = () => {
  const challenges = [
    { title: '5-Minute Problem', difficulty: 'Easy', timeLimit: 300 },
    { title: '10-Minute Code Battle', difficulty: 'Medium', timeLimit: 600 },
    { title: 'Algorithm Master', difficulty: 'Hard', timeLimit: 900 },
    { title: 'Code Quality', difficulty: 'Medium', requirement: 'score 80% code quality' },
    { title: 'Streak Builder', difficulty: 'Any', requirement: 'maintain current streak' }
  ];

  const today = new Date().getDate();
  const challenge = challenges[today % challenges.length];

  return {
    ...challenge,
    reward: 100,
    date: new Date().toDateString()
  };
};

export default {
  badges,
  calculateStreaks,
  calculateUserLevel,
  checkAndAwardBadges,
  getAchievementsSummary,
  calculateInterviewPoints,
  generateDailyChallenge
};
