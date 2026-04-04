/**
 * Streak Calculation Utility
 * Tracks consecutive practice days
 */

export const streakService = {
  // Get streak data from profile
  getStreakData: (userProfile) => {
    if (!userProfile) return { currentStreak: 0, longestStreak: 0, lastPracticeDate: null };
    
    return {
      currentStreak: userProfile.currentStreak || 0,
      longestStreak: userProfile.longestStreak || 0,
      lastPracticeDate: userProfile.lastPracticeDate || null,
    };
  },

  // Calculate streak when user practices
  calculateStreak: (userProfile, interviews = []) => {
    if (!userProfile) return 0;

    if (interviews.length === 0) {
      return userProfile.currentStreak || 0;
    }

    // Sort interviews by date (newest first)
    const sortedInterviews = [...interviews].sort((a, b) => {
      return new Date(b.date || new Date()) - new Date(a.date || new Date());
    });

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const interview of sortedInterviews) {
      const interviewDate = new Date(interview.date || new Date());
      interviewDate.setHours(0, 0, 0, 0);

      // Calculate difference in days
      const daysDifference = Math.floor((currentDate - interviewDate) / (1000 * 60 * 60 * 24));

      if (daysDifference === streak) {
        streak++;
      } else if (daysDifference > streak) {
        break;
      }
    }

    return streak;
  },

  // Update streak in user profile
  updateStreakInProfile: (userProfile, interviews = []) => {
    const currentStreak = streakService.calculateStreak(userProfile, interviews);
    const longestStreak = Math.max(currentStreak, userProfile.longestStreak || 0);

    return {
      ...userProfile,
      currentStreak,
      longestStreak,
      lastPracticeDate: interviews.length > 0 ? interviews[0].date : null,
    };
  },

  // Format streak display
  formatStreakMessage: (streak) => {
    if (streak === 0) return '🔥 Start your streak today!';
    if (streak === 1) return '🔥 1 day streak!';
    if (streak < 7) return `🔥 ${streak} days - Keep it up!`;
    if (streak < 30) return `🔥 ${streak} days - Amazing!`;
    return `🔥 ${streak} days - Legend status!`;
  },
};
