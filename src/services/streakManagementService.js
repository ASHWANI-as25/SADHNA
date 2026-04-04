/**
 * Streak Management Service
 * CRUD operations for streaks table
 * Handles: Create, Read, Update, Delete streaks
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { logger, safeAsync, validateRequired } from './errorHandler';

// Middleware to check Supabase configuration
const checkDbConfig = (operationName) => {
  if (!isSupabaseConfigured) {
    logger.warn(`Skipped ${operationName} - Database not configured`);
    return { success: false, error: 'Database not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local' };
  }
  return null;
};

export const streakManagementService = {
  // CREATE - Insert new streak
  createStreak: async (userId, streakData) => {
    const dbCheck = checkDbConfig('createStreak');
    if (dbCheck) return dbCheck;

    const validation = validateRequired(streakData, ['title']);
    if (!validation.valid) {
      return { success: false, error: validation.errors[0] };
    }

    return safeAsync(
      async () => {
        const { data, error } = await supabase
          .from('streaks')
          .insert([
            {
              user_id: userId,
              title: streakData.title,
              description: streakData.description || '',
              category: streakData.category || 'General',
              url: streakData.url || '',
              current_streak: 0,
              best_streak: 0,
              total_checkins: 0,
              is_active: true,
            },
          ])
          .select()
          .single();

        if (error) throw error;
        logger.info('Streak created', { id: data?.id, title: streakData.title });
        return data;
      },
      'Create streak'
    );
  },

  // READ - Get all streaks for user
  getUserStreaks: async (userId) => {
    const dbCheck = checkDbConfig('getUserStreaks');
    if (dbCheck) return dbCheck;

    return safeAsync(
      async () => {
        const { data, error } = await supabase
          .from('streaks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      },
      'Get user streaks'
    );
  },

  // READ - Get active streaks only
  getActiveStreaks: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('current_streak', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching active streaks:', error);
      return { success: false, error: error.message };
    }
  },

  // READ - Get single streak by ID
  getStreakById: async (streakId) => {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('id', streakId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching streak:', error);
      return { success: false, error: error.message };
    }
  },

  // READ - Get streaks by category
  getStreaksByCategory: async (userId, category) => {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .order('current_streak', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching streaks by category:', error);
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Update streak info
  updateStreak: async (streakId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', streakId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating streak:', error);
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Update streak counters
  updateStreakStats: async (streakId, currentStreak, bestStreak, totalCheckins) => {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .update({
          current_streak: currentStreak,
          best_streak: Math.max(currentStreak, bestStreak),
          total_checkins: totalCheckins,
          updated_at: new Date().toISOString(),
        })
        .eq('id', streakId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating streak stats:', error);
      return { success: false, error: error.message };
    }
  },

  // DELETE - Delete streak
  deleteStreak: async (streakId) => {
    try {
      const { error } = await supabase
        .from('streaks')
        .delete()
        .eq('id', streakId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting streak:', error);
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Toggle streak active status
  toggleStreakStatus: async (streakId, isActive) => {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', streakId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error toggling streak status:', error);
      return { success: false, error: error.message };
    }
  },

  // READ - Get streak statistics
  getStreakStats: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalStreaks: data.length,
        activeStreaks: data.filter((s) => s.is_active).length,
        totalCheckins: data.reduce((sum, s) => sum + (s.total_checkins || 0), 0),
        averageStreak: data.length > 0 ? Math.round(data.reduce((sum, s) => sum + s.current_streak, 0) / data.length) : 0,
        bestStreak: Math.max(...data.map((s) => s.best_streak), 0),
        streaksByCategory: data.reduce((acc, s) => {
          const category = s.category || 'General';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {}),
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting streak statistics:', error);
      return { success: false, error: error.message };
    }
  },
};
