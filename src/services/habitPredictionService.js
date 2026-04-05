/**
 * Habit Prediction Service
 * AI-based habit analytics and personalized suggestions
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { checkinService } from './checkinService';
import { streakManagementService } from './streakManagementService';

// Local storage helpers
const getStreaksFromLocal = () => {
  const data = localStorage.getItem('app_streaks');
  return data ? JSON.parse(data) : [];
};

const getCheckinsFromLocal = () => {
  const data = localStorage.getItem('app_checkins');
  return data ? JSON.parse(data) : [];
};

export const habitPredictionService = {
  // Analyze habit success probability
  predictHabitSuccess: async (streakId, userId) => {
    try {
      let streak, checkins;

      if (!isSupabaseConfigured) {
        // Use localStorage fallback
        const streaks = getStreaksFromLocal();
        streak = streaks.find(s => s.id === streakId);
        checkins = getCheckinsFromLocal().filter(c => c.streak_id === streakId);
        
        if (!streak) {
          return { success: true, prediction: null };
        }
      } else {
        // Get streak data
        const { data: streakData, error: streakError } = await supabase
          .from('streaks')
          .select('*')
          .eq('id', streakId)
          .single();

        if (streakError) throw streakError;
        streak = streakData;

        // Get checkin stats
        const { data: checkinData, error: checkinError } = await supabase
          .from('checkins')
          .select('*')
          .eq('streak_id', streakId);

        if (checkinError) throw checkinError;
        checkins = checkinData;
      }

      // Calculate metrics
      const totalCheckins = checkins.length;
      const completedCheckins = checkins.filter((c) => c.status === 'completed').length;
      const completionRate = totalCheckins > 0 ? (completedCheckins / totalCheckins) * 100 : 0;

      // Get last 7 days performance
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentCheckins = checkins.filter((c) => new Date(c.checkin_date) >= sevenDaysAgo);
      const recentCompletionRate =
        recentCheckins.length > 0
          ? (recentCheckins.filter((c) => c.status === 'completed').length / recentCheckins.length) * 100
          : 0;

      // Calculate trend
      const isImproving = totalCheckins >= 3 
        ? recentCompletionRate >= completionRate 
        : true; // New streaks are always "improving"
      const momentum = streak.current_streak || 0;

      // Predictive score (0-100) — FIXED formula
      let successScore = 0;

      if (totalCheckins === 0) {
        // Brand new streak — start at 50% to encourage user
        successScore = 50;
      } else {
        // Historical completion rate (40% weight)
        successScore += (completionRate / 100) * 40;
        
        // Recent 7-day performance (35% weight)
        successScore += (recentCompletionRate / 100) * 35;
        
        // Streak momentum bonus (15% weight) — capped at 30 days
        const momentumScore = Math.min(momentum / 30, 1) * 15;
        successScore += momentumScore;
        
        // Trend bonus (10% weight)
        successScore += isImproving ? 10 : 0;
      }

      successScore = Math.min(100, Math.round(successScore));

      // Risk assessment
      let riskLevel = 'Low';
      let riskReason = 'Great performance!';

      if (successScore < 40) {
        riskLevel = 'High';
        riskReason = 'Inconsistent checkins detected';
      } else if (successScore < 60) {
        riskLevel = 'Medium';
        riskReason = 'Performance could be better';
      }

      // Recommended actions
      let recommendations = [];
      if (momentum === 0) {
        recommendations.push('Start your habit today! Check in now.');
      }
      if (recentCompletionRate < 50) {
        recommendations.push('Increase frequency of checkins to maintain habit.');
      }
      if (completionRate > 80 && momentum > 14) {
        recommendations.push('Excellent consistency! Consider creating a new habit.');
      }

      return {
        success: true,
        prediction: {
          successScore: Math.round(successScore),
          riskLevel,
          riskReason,
          completionRate: Math.round(completionRate),
          recentCompletionRate: Math.round(recentCompletionRate),
          currentStreak: momentum,
          isImproving,
          recommendations,
          analyzedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('❌ Error predicting habit success:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Unable to analyze habit at this moment';
      if (error.message?.includes('API')) {
        errorMessage = 'API service temporarily unavailable - showing local analysis only';
      } else if (error.message?.includes('network') || error.message?.includes('Network')) {
        errorMessage = 'Network connection issue - using offline data';
      }
      
      return { 
        success: false, 
        error: errorMessage,
        fallbackData: {
          successScore: 0,
          riskLevel: 'Unknown',
          riskReason: 'Unable to compute metrics',
          recommendations: [],
        }
      };
    }
  },

  // Get personalized habit suggestions
  getPersonalizedSuggestions: async (userId) => {
    try {
      let streaks;
      
      if (!isSupabaseConfigured) {
        // Use localStorage fallback
        const allStreaks = getStreaksFromLocal();
        streaks = allStreaks.filter(s => s.user_id === userId);
      } else {
        const { data, error: streaksError } = await supabase
          .from('streaks')
          .select('*')
          .eq('user_id', userId);

        if (streaksError) throw streaksError;
        streaks = data;
      }

      const suggestions = [];

      // Analyze each streak
      for (const streak of streaks) {
        const prediction = await habitPredictionService.predictHabitSuccess(streak.id, userId);

        if (prediction.success) {
          const pred = prediction.prediction;

          if (pred.successScore > 80 && streak.is_active) {
            suggestions.push({
              streakId: streak.id,
              streakTitle: streak.title,
              type: 'celebrate',
              message: `🎉 Amazing work on "${streak.title}"! You're at ${pred.currentStreak} days!`,
              priority: 'high',
            });
          }

          if (
            pred.successScore > 50 &&
            pred.successScore < 70 &&
            streak.is_active &&
            pred.currentStreak > 0
          ) {
            suggestions.push({
              streakId: streak.id,
              streakTitle: streak.title,
              type: 'motivate',
              message: `💪 Keep pushing "${streak.title}". You're doing well!`,
              priority: 'medium',
            });
          }

          if (pred.successScore < 50 && streak.is_active) {
            suggestions.push({
              streakId: streak.id,
              streakTitle: streak.title,
              type: 'warning',
              message: `⚠️ "${streak.title}" needs attention. Don't lose your streak!`,
              priority: 'high',
            });
          }

          if (pred.currentStreak === 0 && streak.is_active && streak.created_at) {
            const createdDate = new Date(streak.created_at);
            const daysSinceCreation = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
            if (daysSinceCreation <= 7) {
              suggestions.push({
                streakId: streak.id,
                streakTitle: streak.title,
                type: 'start',
                message: `🚀 Get started with "${streak.title}". Check in today!`,
                priority: 'high',
              });
            }
          }
        }
      }

      // Sort by priority
      suggestions.sort((a, b) => {
        const priorityMap = { high: 0, medium: 1, low: 2 };
        return priorityMap[a.priority] - priorityMap[b.priority];
      });

      return { success: true, suggestions };
    } catch (error) {
      console.error('Error getting personalized suggestions:', error);
      return { success: false, error: error.message };
    }
  },

  // Get performance trend analysis
  getPerformanceTrends: async (streakId) => {
    try {
      let checkins;
      
      if (!isSupabaseConfigured) {
        // Use localStorage fallback
        checkins = getCheckinsFromLocal().filter(c => c.streak_id === streakId);
      } else {
        const { data, error } = await supabase
          .from('checkins')
          .select('*')
          .eq('streak_id', streakId)
          .order('checkin_date', { ascending: true });

        if (error) throw error;
        checkins = data;
      }

      // Analyze trends by week
      const weeklyData = {};
      checkins.forEach((checkin) => {
        const date = new Date(checkin.checkin_date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = { total: 0, completed: 0 };
        }
        weeklyData[weekKey].total++;
        if (checkin.status === 'completed') {
          weeklyData[weekKey].completed++;
        }
      });

      // Calculate trend
      const weeks = Object.entries(weeklyData);
      const trendData = weeks.map(([week, data]) => ({
        week,
        completionRate: Math.round((data.completed / data.total) * 100),
        checkins: data.total,
      }));

      // Determine overall trend
      let trend = 'stable';
      if (trendData.length >= 2) {
        const recent = trendData.slice(-2);
        if (recent[1].completionRate > recent[0].completionRate) {
          trend = 'improving';
        } else if (recent[1].completionRate < recent[0].completionRate) {
          trend = 'declining';
        }
      }

      return {
        success: true,
        trendAnalysis: {
          trend,
          weeklyData: trendData,
          totalWeeks: trendData.length,
          averageCompletionRate: Math.round(
            trendData.reduce((sum, w) => sum + w.completionRate, 0) / trendData.length
          ),
        },
      };
    } catch (error) {
      console.error('Error getting performance trends:', error);
      return { success: false, error: error.message };
    }
  },

  // Get smart reminder suggestions
  getSmartReminders: async (userId) => {
    try {
      let streaks;
      
      if (!isSupabaseConfigured) {
        // Use localStorage fallback
        const allStreaks = getStreaksFromLocal();
        streaks = allStreaks.filter(s => s.user_id === userId && s.is_active);
      } else {
        const { data, error: streaksError } = await supabase
          .from('streaks')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true);

        if (streaksError) throw streaksError;
        streaks = data;
      }

      const reminders = [];
      const today = new Date().toISOString().split('T')[0];

      for (const streak of streaks) {
        let hasCheckedInToday = false;
        
        if (!isSupabaseConfigured) {
          // Check localStorage
          const allCheckins = getCheckinsFromLocal();
          hasCheckedInToday = allCheckins.some(c => c.streak_id === streak.id && c.checkin_date === today);
        } else {
          // Check Supabase
          const { data: todaysCheckin } = await supabase
            .from('checkins')
            .select('*')
            .eq('streak_id', streak.id)
            .eq('checkin_date', today)
            .single();

          hasCheckedInToday = !!todaysCheckin;
        }

        if (!hasCheckedInToday) {
          reminders.push({
            streakId: streak.id,
            streakTitle: streak.title,
            urgency: streak.current_streak > 10 ? 'high' : 'medium',
            message: `Don't forget to check in for "${streak.title}"!`,
            time: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`,
          });
        }
      }

      return { success: true, reminders };
    } catch (error) {
      console.error('Error getting smart reminders:', error);
      return { success: false, error: error.message };
    }
  },
};
