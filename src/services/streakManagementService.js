/**
 * Streak Management Service
 * CRUD operations for streaks table
 * Handles: Create, Read, Update, Delete streaks
 * Fallback to localStorage when Supabase not configured
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { logger, safeAsync, validateRequired } from './errorHandler';

// Local storage for streaks
const STREAKS_KEY = 'app_streaks';

const initializeStreaksDB = () => {
  if (!localStorage.getItem(STREAKS_KEY)) {
    localStorage.setItem(STREAKS_KEY, JSON.stringify([]));
  }
};

const getStreaksFromLocal = () => {
  initializeStreaksDB();
  return JSON.parse(localStorage.getItem(STREAKS_KEY)) || [];
};

const saveStreaksToLocal = (streaks) => {
  localStorage.setItem(STREAKS_KEY, JSON.stringify(streaks));
};

// Middleware to check Supabase configuration
const checkDbConfig = (operationName) => {
  if (!isSupabaseConfigured) {
    logger.warn(`Using localStorage for ${operationName} - Database not configured`);
    return null; // Use localStorage fallback instead of returning error
  }
  return null;
};

export const streakManagementService = {
  // CREATE - Insert new streak
  createStreak: async (userId, streakData) => {
    const validation = validateRequired(streakData, ['title']);
    if (!validation.valid) {
      return { success: false, error: validation.errors[0] };
    }

    try {
      if (!isSupabaseConfigured) {
        // Use localStorage fallback
        const streaks = getStreaksFromLocal();
        const newStreak = {
          id: Date.now().toString(),
          user_id: userId,
          title: streakData.title,
          description: streakData.description || '',
          category: streakData.category || 'General',
          url: streakData.url || '',
          current_streak: 0,
          best_streak: 0,
          total_checkins: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        streaks.push(newStreak);
        saveStreaksToLocal(streaks);
        logger.info('Streak created (localStorage)', { id: newStreak.id, title: streakData.title });
        return { success: true, data: newStreak };
      }

      // Use Supabase if configured
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
    } catch (error) {
      logger.error('Error creating streak', error);
      return { success: false, error: error.message };
    }
  },

  // READ - Get all streaks for user
  getUserStreaks: async (userId) => {
    try {
      if (!isSupabaseConfigured) {
        const streaks = getStreaksFromLocal().filter(s => s.user_id === userId);
        return { success: true, data: streaks };
      }

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
    } catch (error) {
      logger.error('Error getting user streaks', error);
      return { success: false, error: error.message };
    }
  },

  // READ - Get active streaks only
  getActiveStreaks: async (userId) => {
    try {
      if (!isSupabaseConfigured) {
        const streaks = getStreaksFromLocal()
          .filter(s => s.user_id === userId && s.is_active)
          .sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0));
        return { success: true, data: streaks };
      }

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
      if (!isSupabaseConfigured) {
        const streak = getStreaksFromLocal().find(s => s.id === streakId);
        if (!streak) return { success: false, error: 'Streak not found' };
        return { success: true, data: streak };
      }

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
      if (!isSupabaseConfigured) {
        const streaks = getStreaksFromLocal()
          .filter(s => s.user_id === userId && s.category === category)
          .sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0));
        return { success: true, data: streaks };
      }

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
      if (!isSupabaseConfigured) {
        const streaks = getStreaksFromLocal();
        const index = streaks.findIndex(s => s.id === streakId);
        if (index === -1) return { success: false, error: 'Streak not found' };
        
        streaks[index] = {
          ...streaks[index],
          ...updateData,
          updated_at: new Date().toISOString(),
        };
        saveStreaksToLocal(streaks);
        return { success: true, data: streaks[index] };
      }

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
      if (!isSupabaseConfigured) {
        const streaks = getStreaksFromLocal();
        const index = streaks.findIndex(s => s.id === streakId);
        if (index === -1) return { success: false, error: 'Streak not found' };
        
        streaks[index] = {
          ...streaks[index],
          current_streak: currentStreak,
          best_streak: Math.max(currentStreak, bestStreak),
          total_checkins: totalCheckins,
          updated_at: new Date().toISOString(),
        };
        saveStreaksToLocal(streaks);
        return { success: true, data: streaks[index] };
      }

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
      if (!isSupabaseConfigured) {
        const streaks = getStreaksFromLocal().filter(s => s.id !== streakId);
        saveStreaksToLocal(streaks);
        return { success: true };
      }

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
      if (!isSupabaseConfigured) {
        const streaks = getStreaksFromLocal();
        const index = streaks.findIndex(s => s.id === streakId);
        if (index === -1) return { success: false, error: 'Streak not found' };
        
        streaks[index] = {
          ...streaks[index],
          is_active: isActive,
          updated_at: new Date().toISOString(),
        };
        saveStreaksToLocal(streaks);
        return { success: true, data: streaks[index] };
      }

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
      let data;
      
      if (!isSupabaseConfigured) {
        data = getStreaksFromLocal().filter(s => s.user_id === userId);
      } else {
        const { data: streaksData, error } = await supabase
          .from('streaks')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        data = streaksData;
      }

      const stats = {
        totalStreaks: data.length,
        activeStreaks: data.filter((s) => s.is_active).length,
        totalCheckins: data.reduce((sum, s) => sum + (s.total_checkins || 0), 0),
        averageStreak: data.length > 0 ? Math.round(data.reduce((sum, s) => sum + (s.current_streak || 0), 0) / data.length) : 0,
        bestStreak: Math.max(...data.map((s) => s.best_streak || 0), 0),
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
