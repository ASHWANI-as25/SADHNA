import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Clock, CheckCircle2, ChevronRight, Trash2, Zap, Target, BookOpen, Star, Flame, Gift, Award, Calendar, CheckCheck, BarChart3, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import { streakService } from '../services/streakService';
import { motivationService } from '../services/motivationService';
import { fullscreenService } from '../services/fullscreenService';
import FloatingCard from '../components/FloatingCard';
import GlowButton from '../components/GlowButton';

const Dashboard = () => {
  const navigate = useNavigate();
  const { history, viewPastResult, deleteHistoryItem } = useInterview();
  const { user, userProfile, isNewUser, markUserAsVisited } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [oauthProvider, setOauthProvider] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mark user as visited when they land on dashboard (for new users)
  useEffect(() => {
    if (isNewUser) {
      markUserAsVisited();
    }
  }, [isNewUser, markUserAsVisited]);

  // Listen for fullscreen changes
  useEffect(() => {
    return fullscreenService.onFullscreenChange((isActive) => {
      setIsFullscreen(isActive);
    });
  }, []);

  // Get display name and OAuth provider info
  useEffect(() => {
    if (user?.id) {
      const provider = localStorage.getItem(`oauth_provider_${user.id}`);
      const oauthName = localStorage.getItem(`oauth_name_${user.id}`);
      const oauthEmail = localStorage.getItem(`oauth_email_${user.id}`);

      if (provider && oauthEmail) {
        setOauthProvider(provider);
        setDisplayName(oauthName || oauthEmail.split('@')[0]);
      } else {
        setDisplayName(userProfile?.fullName?.split(' ')[0] || 'User');
      }
    }
  }, [user?.id, userProfile]);

  // Calculate metrics
  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length)
    : 0;

  const currentStreak = streakService.calculateStreak(userProfile, history);
  const streakMessage = streakService.formatStreakMessage(currentStreak);

  const handleToggleFullscreen = async () => {
    const success = await fullscreenService.toggleFullscreen(document.documentElement);
    if (!success) {
      console.warn('Fullscreen not available');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-slate-950 p-4 sm:p-8">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 🔥 HERO HEADER - Sadhna Focused */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 sm:p-10 shadow-2xl shadow-red-500/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Flame className="text-energy-coral" size={28} fill="currentColor" />
                <span className="text-sm font-bold text-energy-coral uppercase tracking-widest">🔥 SADHNA - Build Your Streak</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 leading-tight">
                {isNewUser ? (
                  <>
                    Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-energy-coral via-energy-pink to-energy-gold">{displayName || 'Champion'}</span>
                  </>
                ) : (
                  <>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-energy-coral via-energy-pink to-energy-gold">Welcome back</span>, {displayName || 'Champion'}!
                  </>
                )}
              </h1>
              <p className="text-energy-cyan text-lg font-semibold">
                {currentStreak > 0 
                  ? `🚀 Keep your ${currentStreak}-day streak alive! One check-in today keeps momentum going.` 
                  : '✨ It\'s time to start building your first streak today!'}
              </p>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleFullscreen}
                className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard/streaks')}
                className="flex-1 sm:flex-none flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-energy-coral to-energy-pink text-white rounded-xl font-bold hover:shadow-xl hover:shadow-energy-coral/50 transition-all"
              >
                <Flame size={20} fill="currentColor" />
                My Streaks
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard/todos')}
                className="flex-1 sm:flex-none flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-energy-gold to-energy-coral text-white rounded-xl font-bold hover:shadow-xl hover:shadow-energy-gold/50 transition-all"
              >
                <CheckCheck size={20} />
                Today's Todos
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 📊 SADHNA STATS GRID */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Current Streak */}
          <motion.button
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => navigate('/dashboard/streaks')}
            className="glass-card border-energy-coral/50 bg-gradient-to-br from-sadhna-red/20 to-energy-coral/10 p-6 rounded-2xl group hover:shadow-2xl hover:shadow-energy-coral/40 transition-all text-left cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider">🔥 Current Streak</p>
                <h3 className="text-5xl font-black bg-gradient-to-r from-energy-coral to-energy-pink bg-clip-text text-transparent mt-2">{currentStreak}</h3>
                <p className="text-xs text-energy-coral font-semibold mt-2">Days Consistent</p>
              </div>
              <Flame className="text-energy-coral group-hover:scale-110 transition-transform" size={28} fill="currentColor" />
            </div>
          </motion.button>

          {/* Check-ins This Week */}
          <motion.button
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => navigate('/dashboard/analytics')}
            className="glass-card border-energy-cyan/50 bg-gradient-to-br from-sadhna-navy/20 to-energy-cyan/10 p-6 rounded-2xl group hover:shadow-2xl hover:shadow-energy-cyan/40 transition-all text-left cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider">📅 This Week</p>
                <h3 className="text-5xl font-black bg-gradient-to-r from-energy-cyan to-energy-lime bg-clip-text text-transparent mt-2">
                  {history.filter(h => new Date(h.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </h3>
                <p className="text-xs text-energy-cyan font-semibold mt-2">Interviews Done</p>
              </div>
              <Calendar className="text-energy-cyan group-hover:scale-110 transition-transform" size={28} />
            </div>
          </motion.button>

          {/* Average Score */}
          <motion.button
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => navigate('/dashboard/analytics')}
            className="glass-card border-energy-gold/50 bg-gradient-to-br from-energy-gold/10 to-energy-coral/5 p-6 rounded-2xl group hover:shadow-2xl hover:shadow-energy-gold/40 transition-all text-left cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider">🎯 Avg Score</p>
                <h3 className="text-5xl font-black bg-gradient-to-r from-energy-gold to-energy-coral bg-clip-text text-transparent mt-2">{averageScore}%</h3>
                <p className="text-xs text-energy-gold font-semibold mt-2">{averageScore >= 80 ? '⭐ Excellent' : averageScore >= 60 ? '👍 Good' : '💪 Keep Going'}</p>
              </div>
              <TrendingUp className="text-energy-gold group-hover:scale-110 transition-transform" size={28} />
            </div>
          </motion.button>

          {/* Total Check-ins */}
          <motion.button
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => navigate('/dashboard/analytics')}
            className="glass-card border-energy-lime/50 bg-gradient-to-br from-energy-lime/10 to-energy-cyan/5 p-6 rounded-2xl group hover:shadow-2xl hover:shadow-energy-lime/40 transition-all text-left cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider">✅ Total Interviews</p>
                <h3 className="text-5xl font-black bg-gradient-to-r from-energy-lime to-energy-cyan bg-clip-text text-transparent mt-2">{history.length}</h3>
                <p className="text-xs text-energy-lime font-semibold mt-2">Sessions Completed</p>
              </div>
              <CheckCircle2 className="text-energy-lime group-hover:scale-110 transition-transform" size={28} />
            </div>
          </motion.button>
        </motion.div>

        {/* 🎯 QUICK ACTION BUTTONS - Enhanced */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/setup')}
            className="group glass-card border-energy-coral/50 bg-gradient-to-br from-energy-coral/20 to-energy-pink/10 p-6 rounded-2xl hover:shadow-2xl hover:shadow-energy-coral/40"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-energy-coral/40 group-hover:bg-energy-coral/60 flex items-center justify-center group-hover:scale-110 transition-all">
                <Play className="text-energy-coral" size={24} fill="currentColor" />
              </div>
              <div>
                <p className="font-bold text-white">Start Interview</p>
                <p className="text-xs text-gray-300">Practice now</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/streaks')}
            className="group glass-card border-energy-pink/50 bg-gradient-to-br from-energy-pink/20 to-energy-coral/10 p-6 rounded-2xl hover:shadow-2xl hover:shadow-energy-pink/40"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-energy-pink/40 group-hover:bg-energy-pink/60 flex items-center justify-center group-hover:scale-110 transition-all">
                <Flame className="text-energy-pink" size={24} fill="currentColor" />
              </div>
              <div>
                <p className="font-bold text-white">Create Streak</p>
                <p className="text-xs text-gray-300">New habit</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/daily-todos')}
            className="group glass-card border-energy-gold/50 bg-gradient-to-br from-energy-gold/20 to-energy-lime/10 p-6 rounded-2xl hover:shadow-2xl hover:shadow-energy-gold/40"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-energy-gold/40 group-hover:bg-energy-gold/60 flex items-center justify-center group-hover:scale-110 transition-all">
                <CheckCheck className="text-energy-gold" size={24} />
              </div>
              <div>
                <p className="font-bold text-white">Daily Todos</p>
                <p className="text-xs text-gray-300">Today's tasks</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/analytics')}
            className="group glass-card border-energy-cyan/50 bg-gradient-to-br from-energy-cyan/20 to-energy-lime/10 p-6 rounded-2xl hover:shadow-2xl hover:shadow-energy-cyan/40"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-energy-cyan/40 group-hover:bg-energy-cyan/60 flex items-center justify-center group-hover:scale-110 transition-all">
                <BarChart3 className="text-energy-cyan" size={24} />
              </div>
              <div>
                <p className="font-bold text-white">Analytics</p>
                <p className="text-xs text-gray-300">Track progress</p>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* 🎁 ACHIEVEMENTS & MILESTONES */}
        <motion.div
          variants={itemVariants}
          className="glass-card border-energy-gold/50 bg-gradient-to-r from-sadhna-red/20 via-energy-gold/10 to-sadhna-navy/20 glow-blue-hover p-8 rounded-2xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <Gift className="text-energy-gold" size={28} fill="currentColor" />
            <h2 className="text-2xl font-bold text-white">🏆 Milestones & Achievements</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '🌱 Strong Start', days: 7, achieved: currentStreak >= 7, color: '#39FF14' },
              { label: '🔥 One Month', days: 30, achieved: currentStreak >= 30, color: '#FFD700' },
              { label: '💯 Century', days: 100, achieved: currentStreak >= 100, color: '#FF1493' },
              { label: '👑 Year Legend', days: 365, achieved: currentStreak >= 365, color: '#00D9FF' }
            ].map((milestone, idx) => (
              <motion.div
                key={idx}
                className={`p-4 rounded-xl border-2 transition-all ${
                  milestone.achieved 
                    ? `border-[${milestone.color}]/60 bg-[${milestone.color}]/15 shadow-lg` 
                    : 'border-gray-700/50 bg-gray-800/20'
                }`}
                style={{
                  borderColor: milestone.achieved ? milestone.color : 'rgb(55, 65, 81, 0.5)',
                  backgroundColor: milestone.achieved ? `${milestone.color}26` : 'rgb(31, 41, 55, 0.2)'
                }}
              >
                <div className="text-center">
                  <p className="text-2xl mb-1">{milestone.label.split(' ')[0]}</p>
                  <p className="font-bold text-white mb-1">{milestone.label.split(' ').slice(1).join(' ')}</p>
                  <p className={`text-sm font-bold ${milestone.achieved ? 'text-energy-lime' : 'text-gray-400'}`}>
                    {milestone.achieved ? '✅ Unlocked!' : `${Math.min(currentStreak, milestone.days)}/${milestone.days} days`}
                  </p>
                  {!milestone.achieved && currentStreak > 0 && (
                    <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-gradient-to-r from-energy-coral to-energy-pink h-1.5 rounded-full transition-all"
                        style={{ width: `${(currentStreak / milestone.days) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 📚 RECENT PRACTICE SESSIONS */}
        <motion.div
          variants={itemVariants}
          className="glass-card border-energy-cyan/40 glow-blue-hover p-8 rounded-2xl bg-gradient-to-br from-sadhna-navy/20 to-sadhna-red/10 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="text-energy-cyan" size={28} />
              <h2 className="text-2xl font-bold text-white">📚 Recent Practice Sessions</h2>
            </div>
            {history.length > 0 && (
              <Link to="/dashboard/analytics" className="text-energy-cyan hover:text-energy-lime text-sm font-semibold flex items-center gap-1 transition-colors">
                View All <ChevronRight size={16} />
              </Link>
            )}
          </div>

          {history.length > 0 ? (
            <div className="space-y-3">
              {history
                .slice()
                .reverse()
                .slice(0, 5)
                .map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ x: 8 }}
                    className="group flex justify-between items-center p-4 glass-card border-white/10 hover:border-energy-cyan/50 glow-blue-hover rounded-xl cursor-pointer"
                    onClick={() => {
                      if (item.fullResults) {
                        viewPastResult(item.fullResults, item.role, item.problem);
                        navigate('/dashboard/feedback');
                      }
                    }}
                  >
                    <div className="flex gap-4 items-center flex-1">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-12 h-12 rounded-xl font-bold text-lg group-hover:shadow-lg transition-all flex items-center justify-center text-white ${
                          item.score >= 80 
                            ? 'bg-gradient-to-br from-energy-lime to-energy-cyan' 
                            : item.score >= 60 
                            ? 'bg-gradient-to-br from-energy-cyan to-energy-gold'
                            : 'bg-gradient-to-br from-energy-coral to-energy-pink'
                        }`}
                      >
                        {item.score}%
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white group-hover:text-energy-cyan transition-colors">{item.role}</h4>
                        <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()} • {item.problem}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.score >= 80 && <Star className="text-energy-gold" size={18} fill="currentColor" />}
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this session record?')) {
                            deleteHistoryItem(item.id);
                          }
                        }}
                        className="p-2 hover:text-energy-coral hover:bg-energy-coral/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Record"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-energy-cyan/20 flex items-center justify-center mx-auto mb-4">
                <Play className="text-energy-cyan" size={32} />
              </div>
              <p className="text-gray-300 text-lg mb-4">No practice sessions yet</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/dashboard/setup')}
                className="inline-flex items-center gap-2 px-6 py-2 bg-energy-coral/20 hover:bg-energy-coral/30 border border-energy-coral/50 rounded-lg text-energy-coral font-semibold transition-all hover:shadow-lg hover:shadow-energy-coral/30"
              >
                Start Your First Interview <Play size={16} />
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* 💡 MOTIVATIONAL & TIPS */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="glass-card bg-gradient-to-r from-energy-cyan/20 via-energy-lime/10 to-sadhna-navy/20 border-energy-cyan/40 glow-blue p-8 rounded-2xl shadow-xl">
            <div className="flex items-start gap-4">
              <Sparkles className="text-energy-cyan flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">✨ Daily Motivation</h3>
                <p className="text-gray-200 leading-relaxed text-sm">
                  {currentStreak > 0 
                    ? `🔥 You're on a ${currentStreak}-day streak! Consistency is the key to mastery. Keep pushing and stay motivated!` 
                    : '✨ Start your first streak today and unlock your potential! Every great journey begins with a single step.'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card bg-gradient-to-r from-energy-pink/20 via-energy-coral/10 to-energy-gold/20 border-energy-pink/40 glow-blue p-8 rounded-2xl shadow-xl">
            <div className="flex items-start gap-4">
              <Zap className="text-energy-coral flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">⚡ Pro Tip</h3>
                <p className="text-gray-200 leading-relaxed text-sm">
                  Practice interviews regularly to build unshakeable confidence and improve your communication skills. Focus on clear explanation and problem-solving approach for maximum results!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
