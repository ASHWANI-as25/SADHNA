/**
 * Milestone Service
 * Handles milestone tracking and automation
 * Milestones triggered at: 7, 30, 100, 365 days
 */

import { supabase, isSupabaseConfigured } from './supabase';

const MILESTONE_LEVELS = [
  { level: 1, days: 7, badge: 'Week Warrior', emoji: '🔥', color: 'from-orange-500 to-red-500' },
  { level: 2, days: 30, badge: 'Month Master', emoji: '💪', color: 'from-cyan-500 to-blue-500' },
  { level: 3, days: 100, badge: 'Century Club', emoji: '🚀', color: 'from-purple-500 to-pink-500' },
  { level: 4, days: 365, badge: 'Year Legend', emoji: '👑', color: 'from-yellow-500 to-amber-500' },
];

const MILESTONES_KEY = 'app_milestones';

const initializeMilestonesDB = () => {
  if (!localStorage.getItem(MILESTONES_KEY)) {
    localStorage.setItem(MILESTONES_KEY, JSON.stringify([]));
  }
};

const getMilestonesFromLocal = () => {
  initializeMilestonesDB();
  return JSON.parse(localStorage.getItem(MILESTONES_KEY)) || [];
};

const saveMilestonesToLocal = (milestones) => {
  localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
};

export const milestoneService = {
  // Initialize milestones for a new streak
  initializeMilestones: async (streakId, userId) => {
    try {
      const milestonesToInsert = MILESTONE_LEVELS.map((m) => ({
        id: `${streakId}-${m.level}`,
        streak_id: streakId,
        user_id: userId,
        level: m.level,
        days_required: m.days,
        badge_type: m.badge,
        is_achieved: false,
        created_at: new Date().toISOString(),
      }));

      if (!isSupabaseConfigured) {
        // Use localStorage fallback
        const milestones = getMilestonesFromLocal();
        milestones.push(...milestonesToInsert);
        saveMilestonesToLocal(milestones);
        return { success: true, data: milestonesToInsert };
      }

      const { data, error } = await supabase
        .from('milestones')
        .insert(milestonesToInsert)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error initializing milestones:', error);
      // Return success anyway - don't fail streak creation
      return { success: true, data: [] };
    }
  },

  // READ - Get all milestones for a streak
  getStreakMilestones: async (streakId) => {
    try {
      if (!isSupabaseConfigured) {
        const milestones = getMilestonesFromLocal()
          .filter(m => m.streak_id === streakId)
          .sort((a, b) => a.level - b.level);
        return { success: true, data: milestones };
      }

      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('streak_id', streakId)
        .order('level', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching milestones:', error);
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Mark milestone as achieved
  achieveMilestone: async (milestoneId) => {
    try {
      if (!isSupabaseConfigured) {
        const milestones = getMilestonesFromLocal();
        const index = milestones.findIndex(m => m.id === milestoneId);
        if (index !== -1) {
          milestones[index] = {
            ...milestones[index],
            is_achieved: true,
            achieved_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          saveMilestonesToLocal(milestones);
          return { success: true, data: milestones[index] };
        }
      }

      const { data, error } = await supabase
        .from('milestones')
        .update({
          is_achieved: true,
          achieved_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', milestoneId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error achieving milestone:', error);
      return { success: false, error: error.message };
    }
  },

  // Advanced - Check and auto-award milestones
  checkAndAwardMilestones: async (streakId, currentStreakDays) => {
    try {
      let milestones;
      
      if (!isSupabaseConfigured) {
        milestones = getMilestonesFromLocal()
          .filter(m => m.streak_id === streakId && !m.is_achieved);
      } else {
        const { data: milData, error: milError } = await supabase
          .from('milestones')
          .select('*')
          .eq('streak_id', streakId)
          .eq('is_achieved', false);

        if (milError) throw milError;
        milestones = milData;
      }

      const newlyAwarded = [];

      for (const milestone of milestones) {
        if (currentStreakDays >= milestone.days_required) {
          if (!isSupabaseConfigured) {
            const allMilestones = getMilestonesFromLocal();
            const index = allMilestones.findIndex(m => m.id === milestone.id);
            if (index !== -1) {
              allMilestones[index].is_achieved = true;
              allMilestones[index].achieved_date = new Date().toISOString();
              saveMilestonesToLocal(allMilestones);
              newlyAwarded.push(allMilestones[index]);
            }
          } else {
            const { data, error } = await supabase
              .from('milestones')
              .update({
                is_achieved: true,
                achieved_date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', milestone.id)
            .select()
            .single();

          if (error) throw error;
          newlyAwarded.push(data);
        }
      }

      return { success: true, newlyAwarded };
    } catch (error) {
      console.error('Error checking and awarding milestones:', error);
      return { success: false, error: error.message };
    }
  },

  // Advanced - Get achieved milestones for a streak
  getAchievedMilestones: async (streakId) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('streak_id', streakId)
        .eq('is_achieved', true)
        .order('level', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching achieved milestones:', error);
      return { success: false, error: error.message };
    }
  },

  // Advanced - Get next milestone target
  getNextMilestone: async (streakId, currentStreakDays) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('streak_id', streakId)
        .eq('is_achieved', false)
        .order('level', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        return {
          success: true,
          nextMilestone: null,
          message: 'All milestones achieved!',
        };
      }

      const daysRemaining = Math.max(0, data.days_required - currentStreakDays);

      return {
        success: true,
        nextMilestone: {
          ...data,
          daysRemaining,
          progress: Math.round((currentStreakDays / data.days_required) * 100),
        },
      };
    } catch (error) {
      console.error('Error getting next milestone:', error);
      return { success: false, error: error.message };
    }
  },

  // Advanced - Get total milestone count for user
  getUserMilestoneStats: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('is_achieved')
        .eq('user_id', userId);

      if (error) throw error;

      const totalMilestones = data.length;
      const achievedMilestones = data.filter((m) => m.is_achieved).length;

      return {
        success: true,
        stats: {
          total: totalMilestones,
          achieved: achievedMilestones,
          percentage:
            totalMilestones > 0 ? Math.round((achievedMilestones / totalMilestones) * 100) : 0,
        },
      };
    } catch (error) {
      console.error('Error getting user milestone stats:', error);
      return { success: false, error: error.message };
    }
  },

  // Helper - Get milestone badge info
  getMilestoneInfo: (level) => {
    return MILESTONE_LEVELS.find((m) => m.level === level) || null;
  },

  // Helper - Get all milestone levels info
  getAllMilestoneInfo: () => {
    return MILESTONE_LEVELS;
  },
};
