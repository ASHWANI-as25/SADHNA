import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, CheckCircle2, AlertCircle, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { streakManagementService } from '../services/streakManagementService';
import { checkinService } from '../services/checkinService';
import { milestoneService } from '../services/milestoneService';
import { habitPredictionService } from '../services/habitPredictionService';
import { toast } from '../services/toastService';
import GlowButton from './GlowButton';
import '../styles/streaks.css';

// Category emoji mapping
const CATEGORY_EMOJI = {
  'Coding': '💻',
  'Fitness': '💪',
  'Reading': '📚',
  'Meditation': '🧘',
  'Writing': '✍️',
  'Learning': '🎓',
  'Music': '🎵',
  'Art': '🎨',
  'Cooking': '🍳',
  'Gaming': '🎮',
  'General': '⭐',
};

const StreakCard = ({ streak, userId, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [nextMilestone, setNextMilestone] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ title: streak.title, description: streak.description, url: streak.url || '' });

  // Memoize category emoji for performance
  const categoryEmoji = useMemo(() => CATEGORY_EMOJI[streak.category] || '⭐', [streak.category]);

  const loadStreakData = useCallback(async () => {
    setLoading(true);
    try {
      // Parallel fetch for better performance
      const [checkinToday, nextMil, pred] = await Promise.all([
        checkinService.hasCheckedInToday(streak.id, userId),
        milestoneService.getNextMilestone(streak.id, streak.current_streak),
        habitPredictionService.predictHabitSuccess(streak.id, userId),
      ]);

      if (checkinToday.success) setCheckedInToday(checkinToday.hasCheckedIn);
      if (nextMil.success) setNextMilestone(nextMil.nextMilestone);
      if (pred.success) setPrediction(pred.prediction);
    } catch (error) {
      console.error('Error loading streak data:', error);
    } finally {
      setLoading(false);
    }
  }, [streak.id, streak.current_streak, userId]);

  useEffect(() => {
    loadStreakData();
  }, [loadStreakData]);

  const handleCheckIn = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const result = await checkinService.addCheckin(
      streak.id,
      userId,
      today,
      'completed',
      'Daily check-in'
    );

    if (result.success) {
      // Get updated consecutive days
      const consecutiveDaysResult = await checkinService.getConsecutiveDays(streak.id);
      const consecutiveDays = consecutiveDaysResult.consecutiveDays || 0;
      
      // Update streak counters
      await streakManagementService.updateStreakStats(
        streak.id,
        consecutiveDays,
        Math.max(streak.best_streak || 0, consecutiveDays),
        (streak.total_checkins || 0) + 1
      );

      // Check for milestone achievements
      await milestoneService.checkAndAwardMilestones(streak.id, consecutiveDays);

      setCheckedInToday(true);
      toast.success(`🔥 Checked in! Keep the streak alive!`);
      
      // Reload data with slight delay to ensure localStorage is updated
      setTimeout(() => {
        onUpdate();
      }, 100);
    } else {
      if (result.error?.includes('duplicate') || result.error?.includes('already')) {
        toast.info('Already checked in today! Come back tomorrow 💪');
      } else {
        toast.error('Check-in failed. Please try again.');
      }
    }
  }, [streak.id, streak.best_streak, streak.total_checkins, userId, onUpdate]);

  const handleDelete = useCallback(async () => {
    if (window.confirm(`Delete streak "${streak.title}"?`)) {
      const result = await streakManagementService.deleteStreak(streak.id);
      if (result.success) {
        onUpdate();
      }
    }
  }, [streak.id, streak.title, onUpdate]);

  const handleEdit = useCallback(async () => {
    const normalizedUrl = editData.url.trim()
      ? editData.url.match(/^https?:\/\//) ? editData.url : `https://${editData.url}`
      : '';
    
    const result = await streakManagementService.updateStreak(streak.id, {
      title: editData.title,
      description: editData.description,
      url: normalizedUrl,
    });
    
    if (result.success) {
      toast.success('Streak updated!');
      setShowEditModal(false);
      onUpdate();
    } else {
      toast.error('Failed to update streak');
    }
  }, [editData, streak.id, onUpdate]);

  const streakColor = useMemo(() => {
    if (streak.current_streak >= 30) return 'from-purple-500 to-pink-500';
    if (streak.current_streak >= 14) return 'from-orange-500 to-red-500';
    if (streak.current_streak >= 7) return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-cyan-500';
  }, [streak.current_streak]);

  const successColor = useMemo(() => {
    if (!prediction) return 'text-gray-400';
    if (prediction.successScore >= 80) return 'text-green-400';
    if (prediction.successScore >= 60) return 'text-yellow-400';
    return 'text-red-400';
  }, [prediction]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{streak.title}</h3>
            <p className="text-sm text-slate-400">
              <span className="text-base mr-2">{categoryEmoji}</span>
              {streak.category || 'General'}
            </p>
            {streak.url && (
              <a
                href={streak.url.startsWith('http') ? streak.url : `https://${streak.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 
                           bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 
                           px-3 py-1.5 rounded-full transition-all duration-200 mt-2 group"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={12} className="group-hover:scale-110 transition-transform" />
                Open Resource
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-slate-300"
            >
              <Edit2 size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className={`bg-gradient-to-br ${streakColor} p-3 rounded-lg`}>
            <p className="text-xs text-white/70">Current Streak</p>
            <p className="text-2xl font-bold text-white">{streak.current_streak}</p>
            <p className="text-xs text-white/60">days</p>
          </div>

          <div className="bg-slate-700/50 p-3 rounded-lg">
            <p className="text-xs text-slate-400">Best Streak</p>
            <p className="text-2xl font-bold text-amber-400">{streak.best_streak}</p>
            <p className="text-xs text-slate-500">days</p>
          </div>

          <div className="bg-slate-700/50 p-3 rounded-lg">
            <p className="text-xs text-slate-400">Check-ins</p>
            <p className="text-2xl font-bold text-cyan-400">{streak.total_checkins}</p>
            <p className="text-xs text-slate-500">total</p>
          </div>
        </div>

        {/* Quick Stats Row */}
        {prediction && (
          <div className="flex items-center justify-between mb-4 p-2 bg-slate-700/30 rounded">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className={successColor} />
              <span className={`text-sm font-semibold ${successColor}`}>
                Success: {prediction.successScore}%
              </span>
              {prediction.completionRate > 0 && (
                <span className="text-xs text-slate-500">
                  ({prediction.completionRate}% check-in rate)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {prediction.isImproving && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  📈 Improving
                </span>
              )}
              {!prediction.isImproving && prediction.completionRate > 0 && (
                <span className="text-xs text-yellow-400 flex items-center gap-1">
                  📊 Stable
                </span>
              )}
            </div>
          </div>
        )}

        {/* Next Milestone */}
        {nextMilestone && (
          <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <p className="text-xs text-purple-300 mb-2 font-semibold">
              🏆 Next Milestone: {nextMilestone.badge_type}
            </p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-white whitespace-nowrap">{nextMilestone.days_required}d</span>
              <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${nextMilestone.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{nextMilestone.daysRemaining}d left</span>
            </div>
          </div>
        )}

        {/* Check-in Button */}
        <div className="flex gap-2 mb-4">
          {!checkedInToday ? (
            <GlowButton
              onClick={handleCheckIn}
              className="flex-1"
              size="sm"
              disabled={loading}
            >
              {loading ? 'Checking In...' : '✓ Check In Today'}
            </GlowButton>
          ) : (
            <div className="flex-1 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center gap-2 text-green-300">
              <CheckCircle2 size={16} />
              <span className="text-sm font-semibold">Checked In Today!</span>
            </div>
          )}
          {/* URL Open button shown next to check-in when URL exists */}
          {streak.url && (
            <a
              href={streak.url.startsWith('http') ? streak.url : `https://${streak.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 
                         rounded-lg text-blue-300 hover:text-blue-200 transition-all duration-200
                         flex items-center gap-1.5 text-sm font-medium"
              title={`Open: ${streak.url}`}
            >
              <ExternalLink size={14} />
              Go
            </a>
          )}
        </div>

        {/* Expand Button */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-xs text-slate-400 hover:text-slate-300 transition-colors"
        >
          {expanded ? '▲ Less Details' : '▼ More Details'}
        </motion.button>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-slate-700 space-y-3"
            >
              {streak.url && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-slate-400 mb-2 font-semibold">🔗 Resource Link</p>
                  <a
                    href={streak.url.startsWith('http') ? streak.url : `https://${streak.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 break-all 
                               flex items-center gap-2 hover:underline"
                  >
                    <ExternalLink size={12} className="flex-shrink-0" />
                    {streak.url}
                  </a>
                </div>
              )}

              {prediction && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-300">Health Assessment</h4>
                  <div className="space-y-1 text-xs text-slate-400">
                    <p>
                      <span className="text-slate-300">Risk Level:</span> {prediction.riskLevel}
                    </p>
                    <p>
                      <span className="text-slate-300">Reason:</span> {prediction.riskReason}
                    </p>
                    <p>
                      <span className="text-slate-300">Completion Rate:</span>{' '}
                      {prediction.completionRate}%
                    </p>
                  </div>
                </div>
              )}

              {prediction?.recommendations?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-300 mb-2">Suggestions</h4>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {prediction.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2">
                        <AlertCircle size={12} className="flex-shrink-0 mt-0.5 text-blue-400" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowEditModal(false)}>
            <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-white mb-4">Edit Streak</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Name</label>
                  <input type="text" value={editData.title}
                    onChange={e => setEditData({...editData, title: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">Description</label>
                  <textarea value={editData.description}
                    onChange={e => setEditData({...editData, description: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 h-20 resize-none" />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-1 block">URL</label>
                  <input type="text" value={editData.url}
                    onChange={e => setEditData({...editData, url: e.target.value})}
                    placeholder="e.g., leetcode.com"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">Cancel</button>
                  <button onClick={handleEdit}
                    className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors">Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StreakCard;
