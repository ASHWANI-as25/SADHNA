/**
 * Real Leaderboard System (Supabase Integration)
 */

import { supabase } from './supabase';

/**
 * Get global leaderboard
 */
export const getGlobalLeaderboard = async (options = {}) => {
  const { limit = 50, difficulty = null, role = null } = options;

  try {
    let query = supabase
      .from('interviews')
      .select(`
        id,
        user_id,
        score,
        technical_score,
        communication_score,
        created_at,
        user_profiles(email, fullName)
      `)
      .order('score', { ascending: false })
      .limit(limit);

    // Apply filters
    if (difficulty) query = query.eq('difficulty', difficulty);
    if (role) query = query.eq('role', role);

    const { data, error } = await query;

    if (error) {
      console.error('Leaderboard error:', error);
      return { data: [], error };
    }

    // Enrich with ranking
    const leaderboard = (data || []).map((entry, index) => ({
      rank: index + 1,
      userId: entry.user_id,
      userName: entry.user_profiles?.fullName || 'Anonymous',
      userEmail: entry.user_profiles?.email,
      score: entry.score,
      technicalScore: entry.technical_score,
      communicationScore: entry.communication_score,
      date: entry.created_at,
      badge: getBadgeForRank(index + 1)
    }));

    return { data: leaderboard, error: null };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { data: [], error: error.message };
  }
};

/**
 * Get user ranking
 */
export const getUserRanking = async (userId) => {
  try {
    // Get all scores for this user
    const { data: userScores, error } = await supabase
      .from('interviews')
      .select('score')
      .eq('user_id', userId)
      .order('score', { ascending: false });

    if (error) throw error;

    const averageScore = userScores.length > 0
      ? Math.round(userScores.reduce((a, b) => a + b.score, 0) / userScores.length)
      : 0;

    // Get user's rank
    const { data: allScores } = await supabase
      .from('interviews')
      .select('user_id, score')
      .order('score', { ascending: false });

    const uniqueUsers = {};
    (allScores || []).forEach(entry => {
      if (!uniqueUsers[entry.user_id] || entry.score > uniqueUsers[entry.user_id]) {
        uniqueUsers[entry.user_id] = entry.score;
      }
    });

    const sortedUsers = Object.entries(uniqueUsers)
      .sort((a, b) => b[1] - a[1]);

    const userRank = sortedUsers.findIndex(([uid]) => uid === userId) + 1;
    const totalUsers = sortedUsers.length;

    return {
      userId,
      averageScore,
      rank: userRank,
      totalUsers,
      percentile: Math.round((1 - userRank / totalUsers) * 100),
      interviewsCount: userScores.length
    };
  } catch (error) {
    console.error('Error getting user ranking:', error);
    return null;
  }
};

/**
 * Get role-specific leaderboard
 */
export const getRoleLeaderboard = async (role, limit = 50) => {
  return getGlobalLeaderboard({ limit, role });
};

/**
 * Get weekly leaderboard
 */
export const getWeeklyLeaderboard = async (limit = 50) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('interviews')
      .select(`
        id,
        user_id,
        score,
        created_at,
        user_profiles(email, fullName)
      `)
      .gte('created_at', sevenDaysAgo)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((entry, index) => ({
      rank: index + 1,
      userId: entry.user_id,
      userName: entry.user_profiles?.fullName || 'Anonymous',
      score: entry.score,
      date: entry.created_at,
      badge: getBadgeForRank(index + 1)
    }));
  } catch (error) {
    console.error('Error fetching weekly leaderboard:', error);
    return [];
  }
};

/**
 * Get skill-based leaderboard
 */
export const getSkillLeaderboard = async (skill, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .select(`
        id,
        user_id,
        score,
        technical_score,
        created_at,
        user_profiles(email, fullName)
      `)
      .contains('skills', [skill])
      .order('technical_score', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((entry, index) => ({
      rank: index + 1,
      userId: entry.user_id,
      userName: entry.user_profiles?.fullName || 'Anonymous',
      score: entry.score,
      technicalScore: entry.technical_score,
      skill,
      date: entry.created_at
    }));
  } catch (error) {
    console.error('Error fetching skill leaderboard:', error);
    return [];
  }
};

/**
 * Get trending performers (recently improved)
 */
export const getTrendingPerformers = async (limit = 20) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('interviews')
      .select(`
        user_id,
        score,
        created_at,
        user_profiles(fullName)
      `)
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate improvement for each user
    const userData = {};
    (data || []).forEach(entry => {
      if (!userData[entry.user_id]) {
        userData[entry.user_id] = { scores: [], name: entry.user_profiles?.fullName };
      }
      userData[entry.user_id].scores.push(entry.score);
    });

    // Calculate trend
    const trending = Object.entries(userData)
      .map(([userId, { scores, name }]) => {
        if (scores.length < 2) return null;
        
        const recentScores = scores.slice(0, 5);
        const olderScores = scores.slice(5, 10);
        
        const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
        const olderAvg = olderScores.length > 0 
          ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length
          : recentAvg - 10;

        return {
          userId,
          userName: name,
          improvement: recentAvg - olderAvg,
          currentScore: recentScores[0],
          trend: 'up'
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.improvement - a.improvement)
      .slice(0, limit);

    return trending;
  } catch (error) {
    console.error('Error fetching trending performers:', error);
    return [];
  }
};

/**
 * Save interview result to leaderboard
 */
export const saveInterviewResult = async (userId, resultData) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .insert([
        {
          user_id: userId,
          role: resultData.role,
          difficulty: resultData.difficulty,
          score: resultData.score,
          technical_score: resultData.technicalScore,
          communication_score: resultData.communicationScore,
          duration: resultData.duration,
          code_quality: resultData.codeQuality,
          skills: resultData.skills || [],
          transcript: resultData.transcript,
          feedback: resultData.feedback,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (error) {
    console.error('Error saving interview result:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user interview history
 */
export const getUserInterviewHistory = async (userId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return {
      interviews: data || [],
      totalCount: (data || []).length,
      averageScore: data && data.length > 0
        ? Math.round(data.reduce((sum, i) => sum + i.score, 0) / data.length)
        : 0
    };
  } catch (error) {
    console.error('Error fetching user history:', error);
    return { interviews: [], totalCount: 0, averageScore: 0 };
  }
};

/**
 * Get badge for rank
 */
const getBadgeForRank = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  if (rank <= 10) return '⭐';
  return null;
};

/**
 * Real-time leaderboard updates
 */
export const subscribeToLeaderboardUpdates = (callback) => {
  const subscription = supabase
    .from('interviews')
    .on('*', () => {
      // Refetch and call callback
      getGlobalLeaderboard()
        .then(({ data }) => callback(data))
        .catch(err => console.error('Error on leaderboard update:', err));
    })
    .subscribe();

  return subscription;
};

export default {
  getGlobalLeaderboard,
  getUserRanking,
  getRoleLeaderboard,
  getWeeklyLeaderboard,
  getTrendingPerformers,
  saveInterviewResult,
  getUserInterviewHistory,
  subscribeToLeaderboardUpdates
};
