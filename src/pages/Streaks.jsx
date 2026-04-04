import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame, Trophy, BarChart3, AlertCircle, X, Maximize2, Minimize2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { streakManagementService } from '../services/streakManagementService';
import { milestoneService } from '../services/milestoneService';
import { habitPredictionService } from '../services/habitPredictionService';
import StreakCard from '../components/StreakCard';
import GlowButton from '../components/GlowButton';
import { CardSkeleton, StatsSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { toast } from '../services/toastService';
import { validate } from '../services/validationService';
import { fullscreenService } from '../services/fullscreenService';
import '../styles/streaks.css';

// Categories with emojis
const CATEGORIES = [
  { value: 'Coding', label: 'Coding', emoji: '💻' },
  { value: 'Fitness', label: 'Fitness', emoji: '💪' },
  { value: 'Reading', label: 'Reading', emoji: '📚' },
  { value: 'Meditation', label: 'Meditation', emoji: '🧘' },
  { value: 'Writing', label: 'Writing', emoji: '✍️' },
  { value: 'Learning', label: 'Learning', emoji: '🎓' },
  { value: 'Music', label: 'Music', emoji: '🎵' },
  { value: 'Art', label: 'Art', emoji: '🎨' },
  { value: 'Cooking', label: 'Cooking', emoji: '🍳' },
  { value: 'Gaming', label: 'Gaming', emoji: '🎮' },
  { value: 'General', label: 'Any Other', emoji: '⭐' },
];

// Milestones config
const MILESTONES_INFO = [
  { emoji: '🔥', title: 'Week Warrior', description: '7 days streak' },
  { emoji: '💪', title: 'Month Master', description: '30 days streak' },
  { emoji: '🚀', title: 'Century Club', description: '100 days streak' },
  { emoji: '👑', title: 'Year Legend', description: '365 days streak' },
];

const Streaks = () => {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState([]);
  const [filteredStreaks, setFilteredStreaks] = useState([]);
  const [stats, setStats] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStreakData, setNewStreakData] = useState({
    title: '',
    description: '',
    category: 'Coding',
    url: '',
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user?.id]);

  // Listen for fullscreen changes
  useEffect(() => {
    return fullscreenService.onFullscreenChange((isActive) => {
      setIsFullscreen(isActive);
    });
  }, []);

  useEffect(() => {
    filterStreaks();
  }, [streaks, activeFilter]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load streaks
      const streaksResult = await streakManagementService.getUserStreaks(user.id);
      if (streaksResult.success) {
        setStreaks(streaksResult.data);
      }

      // Load statistics
      const statsResult = await streakManagementService.getStreakStats(user.id);
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      // Load suggestions
      const suggestionsResult = await habitPredictionService.getPersonalizedSuggestions(user.id);
      if (suggestionsResult.success) {
        setSuggestions(suggestionsResult.suggestions);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStreaks = () => {
    let filtered = streaks;
    if (activeFilter === 'active') {
      filtered = filtered.filter((s) => s.is_active);
    } else if (activeFilter === 'completed') {
      filtered = filtered.filter((s) => !s.is_active);
    }
    setFilteredStreaks(filtered);
  };

  const handleCreateStreak = async () => {
    // Validation
    const titleError = validate.required(newStreakData.title, 'Streak name');
    if (titleError) {
      toast.error(titleError);
      return;
    }

    const urlError = validate.url(newStreakData.url);
    if (urlError) {
      toast.error(urlError);
      return;
    }

    try {
      const result = await streakManagementService.createStreak(user.id, newStreakData);
      if (result.success) {
        // Initialize milestones
        await milestoneService.initializeMilestones(result.data.id, user.id);
        
        setShowCreateModal(false);
        setNewStreakData({ title: '', description: '', category: 'General', url: '' });
        toast.success('🔥 Streak created successfully!');
        loadAllData();
      } else {
        toast.error('Failed to create streak. Please try again.');
      }
    } catch (error) {
      console.error('Error creating streak:', error);
      toast.error('Error creating streak. Please try again.');
    }
  };

  const handleToggleFullscreen = async () => {
    const success = await fullscreenService.toggleFullscreen(document.documentElement);
    if (!success) {
      toast.warning('Fullscreen not available in your browser');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sadhna-red via-sadhna-navy to-sadhna-black p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 space-y-2">
            <StatsSkeleton count={5} />
          </div>
          <CardSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sadhna-red via-sadhna-navy to-sadhna-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-8">
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Flame className="text-energy-coral" size={40} />
                My Streaks
              </h1>
              <p className="text-gray-300">Track your habits and build consistency</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleFullscreen}
                className="p-3 rounded-xl glass-panel hover:bg-white/20 transition-all duration-300 text-energy-coral hover:text-energy-pink"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <GlowButton
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                New Streak
              </GlowButton>
            </div>
          </motion.div>

          {/* Stats Cards */}
          {stats && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
            >
              {[
                {
                  icon: Flame,
                  label: 'Total Streaks',
                  value: stats.totalStreaks,
                  color: 'from-orange-500 to-red-600',
                },
                {
                  icon: Trophy,
                  label: 'Active Streaks',
                  value: stats.activeStreaks,
                  color: 'from-cyan-500 to-blue-600',
                },
                {
                  icon: BarChart3,
                  label: 'Total Check-ins',
                  value: stats.totalCheckins,
                  color: 'from-emerald-500 to-teal-600',
                },
                {
                  icon: Flame,
                  label: 'Average Current',
                  value: `${stats.averageStreak} d`,
                  color: 'from-purple-500 to-pink-600',
                },
                {
                  icon: Trophy,
                  label: 'Best Streak',
                  value: `${stats.bestStreak} d`,
                  color: 'from-amber-500 to-yellow-600',
                },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className={`bg-gradient-to-br ${stat.color} p-4 rounded-lg text-white shadow-lg`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={20} className="opacity-70" />
                    </div>
                    <p className="text-sm opacity-80 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
                <AlertCircle size={18} />
                Personalized Suggestions
              </h3>
              <div className="space-y-2">
                {suggestions.slice(0, 3).map((sugg, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-sm text-blue-200"
                  >
                    {sugg.message}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex gap-2 mb-8"
        >
          {['all', 'active', 'completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Streaks Grid */}
        {filteredStreaks.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="streak-container"
          >
            {filteredStreaks.map((streak) => (
              <motion.div key={streak.id} variants={itemVariants}>
                <StreakCard streak={streak} userId={user.id} onUpdate={loadAllData} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-center py-12"
          >
            <Flame size={48} className="mx-auto text-slate-600 mb-4" />
            <h2 className="text-xl font-bold text-slate-400 mb-2">No streaks yet</h2>
            <p className="text-slate-500 mb-6">Create your first habit streak to get started!</p>
            <GlowButton onClick={() => setShowCreateModal(true)}>
              <Plus size={18} className="mr-2" />
              Create Your First Streak
            </GlowButton>
          </motion.div>
        )}
      </div>

      {/* Create Streak Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-sadhna-navy to-sadhna-black border border-energy-coral/30 rounded-2xl p-6 md:p-8 w-full max-w-md md:max-w-2xl lg:max-w-3xl my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">🎯 Start a New Streak</h2>
                <p className="text-slate-400">Track anything - coding, fitness, reading, and more!</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Streak Name */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">
                  Streak Name
                </label>
                <input
                  type="text"
                  value={newStreakData.title}
                  onChange={(e) =>
                    setNewStreakData({ ...newStreakData, title: e.target.value })
                  }
                  placeholder="e.g., Daily LeetCode, Morning Yoga"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-4">
                  📋 Select Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setNewStreakData({ ...newStreakData, category: cat.value })
                      }
                      className={`p-3 md:p-4 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${
                        newStreakData.category === cat.value
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <span className="text-base md:text-lg mr-1">{cat.emoji}</span>
                      <span className="hidden sm:inline">{cat.label}</span>
                      <span className="sm:hidden text-xs">{cat.label.split(' ')[0]}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">
                  Description (Optional)
                </label>
                <textarea
                  value={newStreakData.description}
                  onChange={(e) =>
                    setNewStreakData({ ...newStreakData, description: e.target.value })
                  }
                  placeholder="What are you tracking?"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 h-20 resize-none transition-all"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">
                  URL (Optional)
                </label>
                <input
                  type="url"
                  value={newStreakData.url}
                  onChange={(e) =>
                    setNewStreakData({ ...newStreakData, url: e.target.value })
                  }
                  placeholder="Related website or resource"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
                <GlowButton onClick={handleCreateStreak} className="flex-1">
                  ➕ Add Streak
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Streaks;
