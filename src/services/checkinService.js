/**
 * Checkin Service
 * Handles daily check-ins for streaks
 */

import { supabase, isSupabaseConfigured } from './supabase';

const CHECKINS_KEY = 'app_checkins';

const initializeCheckinsDB = () => {
  if (!localStorage.getItem(CHECKINS_KEY)) {
    localStorage.setItem(CHECKINS_KEY, JSON.stringify([]));
  }
};

const getCheckinsFromLocal = () => {
  initializeCheckinsDB();
  return JSON.parse(localStorage.getItem(CHECKINS_KEY)) || [];
};

const saveCheckinsToLocal = (checkins) => {
  localStorage.setItem(CHECKINS_KEY, JSON.stringify(checkins));
};

export const checkinService = {
  // CREATE - Add a check-in
  addCheckin: async (streakId, userId, checkinDate, status = 'completed', notes = '') => {
    try {
      if (!isSupabaseConfigured) {
        // Use localStorage fallback
        const checkins = getCheckinsFromLocal();
        const newCheckin = {
          id: `${streakId}-${checkinDate}`,
          streak_id: streakId,
          user_id: userId,
          checkin_date: checkinDate,
          status,
          notes,
          created_at: new Date().toISOString(),
        };
        checkins.push(newCheckin);
        saveCheckinsToLocal(checkins);
        return { success: true, data: newCheckin };
      }

      const { data, error } = await supabase
        .from('checkins')
        .insert([
          {
            streak_id: streakId,
            user_id: userId,
            checkin_date: checkinDate,
            status,
            notes,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding checkin:', error);
      return { success: false, error: error.message };
    }
  },

  // READ - Get all check-ins for a streak
  getStreakCheckins: async (streakId) => {
    try {
      if (!isSupabaseConfigured) {
        const checkins = getCheckinsFromLocal()
          .filter(c => c.streak_id === streakId)
          .sort((a, b) => new Date(b.checkin_date) - new Date(a.checkin_date));
        return { success: true, data: checkins };
      }

      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .eq('streak_id', streakId)
        .order('checkin_date', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching checkins:', error);
      return { success: false, error: error.message };
    }
  },

  // READ - Get check-ins for a date range
  getCheckinsByDateRange: async (streakId, startDate, endDate) => {
    try {
      if (!isSupabaseConfigured) {
        const checkins = getCheckinsFromLocal()
          .filter(c => c.streak_id === streakId && c.checkin_date >= startDate && c.checkin_date <= endDate)
          .sort((a, b) => new Date(a.checkin_date) - new Date(b.checkin_date));
        return { success: true, data: checkins };
      }

      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .eq('streak_id', streakId)
        .gte('checkin_date', startDate)
        .lte('checkin_date', endDate)
        .order('checkin_date', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching checkins by date range:', error);
      return { success: false, error: error.message };
    }
  },

  // READ - Check if user has checked in today
  hasCheckedInToday: async (streakId, userId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      if (!isSupabaseConfigured) {
        const checkins = getCheckinsFromLocal();
        const hasCheckedIn = checkins.some(
          c => c.streak_id === streakId && c.user_id === userId && c.checkin_date === today
        );
        return { success: true, hasCheckedIn };
      }

      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .eq('streak_id', streakId)
        .eq('user_id', userId)
        .eq('checkin_date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return { success: true, hasCheckedIn: !!data };
    } catch (error) {
      console.error('Error checking today checkin:', error);
      return { success: false, error: error.message };
    }
  },

  // UPDATE - Update check-in status/notes
  updateCheckin: async (checkinId, updateData) => {
    try {
      if (!isSupabaseConfigured) {
        const checkins = getCheckinsFromLocal();
        const index = checkins.findIndex(c => c.id === checkinId);
        if (index !== -1) {
          checkins[index] = {
            ...checkins[index],
            ...updateData,
            updated_at: new Date().toISOString(),
          };
          saveCheckinsToLocal(checkins);
          return { success: true, data: checkins[index] };
        }
        return { success: false, error: 'Check-in not found' };
      }

      const { data, error } = await supabase
        .from('checkins')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', checkinId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating checkin:', error);
      return { success: false, error: error.message };
    }
  },

  // DELETE - Remove check-in
  deleteCheckin: async (checkinId) => {
    try {
      if (!isSupabaseConfigured) {
        const checkins = getCheckinsFromLocal().filter(c => c.id !== checkinId);
        saveCheckinsToLocal(checkins);
        return { success: true };
      }

      const { error } = await supabase
        .from('checkins')
        .delete()
        .eq('id', checkinId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting checkin:', error);
      return { success: false, error: error.message };
    }
  },

  // Advanced - Get consecutive check-in count
  getConsecutiveDays: async (streakId) => {
    try {
      let data;
      
      if (!isSupabaseConfigured) {
        data = getCheckinsFromLocal()
          .filter(c => c.streak_id === streakId)
          .sort((a, b) => new Date(b.checkin_date) - new Date(a.checkin_date))
          .map(c => ({ checkin_date: c.checkin_date }));
      } else {
        const { data: dbData, error } = await supabase
          .from('checkins')
          .select('checkin_date')
          .eq('streak_id', streakId)
          .order('checkin_date', { ascending: false });

        if (error) throw error;
        data = dbData;
      }

      if (!data || data.length === 0) return { success: true, consecutiveDays: 0 };

      let consecutiveDays = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (const checkin of data) {
        const checkinDate = new Date(checkin.checkin_date);
        checkinDate.setHours(0, 0, 0, 0);

        const daysDifference = Math.floor((currentDate - checkinDate) / (1000 * 60 * 60 * 24));

        if (daysDifference === consecutiveDays) {
          consecutiveDays++;
        } else if (daysDifference > consecutiveDays) {
          break;
        }
      }

      return { success: true, consecutiveDays };
    } catch (error) {
      console.error('Error getting consecutive days:', error);
      return { success: false, error: error.message };
    }
  },

  // Advanced - Get total check-ins count
  getTotalCheckins: async (streakId) => {
    try {
      if (!isSupabaseConfigured) {
        const count = getCheckinsFromLocal().filter(c => c.streak_id === streakId).length;
        return { success: true, count };
      }

      const { count, error } = await supabase
        .from('checkins')
        .select('*', { count: 'exact' })
        .eq('streak_id', streakId);

      if (error) throw error;
      return { success: true, count };
    } catch (error) {
      console.error('Error getting total checkins:', error);
      return { success: false, error: error.message };
    }
  },

  // Advanced - Get check-in stats for a streak
  getCheckinStats: async (streakId) => {
    try {
      let data;
      
      if (!isSupabaseConfigured) {
        data = getCheckinsFromLocal().filter(c => c.streak_id === streakId);
      } else {
        const { data: dbData, error } = await supabase
          .from('checkins')
          .select('*')
          .eq('streak_id', streakId);

        if (error) throw error;
        data = dbData;
      }

      const completed = data.filter((c) => c.status === 'completed').length;
      const missed = data.filter((c) => c.status === 'missed').length;
      const completionRate = data.length > 0 ? Math.round((completed / data.length) * 100) : 0;

      return {
        success: true,
        stats: {
          total: data.length,
          completed,
          missed,
          completionRate,
        },
      };
    } catch (error) {
      console.error('Error getting checkin stats:', error);
      return { success: false, error: error.message };
    }
  },
};
