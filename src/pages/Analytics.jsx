import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, TrendingUp, Award, Clock, Download, Moon, Sun, Zap, Target, Lightbulb, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { downloadCSVHistory } from '../services/pdfExport';
import EmptyState from '../components/EmptyState';
import { 
  calculateDetailedStats, 
  getRoleBreakdown, 
  getPerformanceInsights, 
  getRecommendations,
  formatDuration,
  getScoreTrend
} from '../services/analyticsService';

const Analytics = () => {
  const navigate = useNavigate();
  const { history } = useInterview();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', '7d', '30d'
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [roleBreakdown, setRoleBreakdown] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  // Filter history by time period
  const getFilteredHistory = (rawHistory, period) => {
    if (period === 'all') return rawHistory;
    
    const now = new Date();
    let cutoffDate;
    
    if (period === '7d') {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return rawHistory.filter(item => new Date(item.date) >= cutoffDate);
  };

  useEffect(() => {
    if (history && history.length > 0) {
      const filtered = getFilteredHistory(history, timeFilter);
      setFilteredHistory(filtered);

      let toAnalyze = filtered;
      if (selectedRole && selectedRole !== 'all') {
        toAnalyze = filtered.filter(h => h.role === selectedRole);
      }

      const calculatedStats = calculateDetailedStats(toAnalyze);
      setStats(calculatedStats);
      setInsights(getPerformanceInsights(calculatedStats));
      setRecommendations(getRecommendations(calculatedStats, calculatedStats.improvementsAggregated));
      setRoleBreakdown(getRoleBreakdown(filtered));
    }
  }, [history, timeFilter, selectedRole]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
    if (score >= 60) return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    return 'from-red-500/20 to-orange-500/20 border-red-500/30';
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return '✨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💡';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'warning': return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 'info': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      default: return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
    }
  };

  const downloadReport = () => {
    downloadCSVHistory(history);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-background' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border-b backdrop-blur-xl sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Performance Analytics</h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your interview insights</p>
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
            <button onClick={downloadReport} className="p-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-all" title="Download Report">
              <Download size={20} />
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-white/10 text-yellow-400' : 'bg-gray-200 text-gray-800'}`}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => navigate('/setup')} className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              New Interview <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {!stats ? (
          <EmptyState
            icon={BarChart3}
            title="No Interview History Yet"
            description="Start your first mock interview to see detailed performance analytics and insights."
            action={() => navigate('/dashboard/setup')}
            actionText="Take First Interview"
          />
        ) : (
          <>
            {/* Time Period Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex gap-2">
                {[
                  { label: 'Last 7 Days', value: '7d' },
                  { label: 'Last 30 Days', value: '30d' },
                  { label: 'All Time', value: 'all' }
                ].map(filter => (
                  <motion.button
                    key={filter.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeFilter(filter.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      timeFilter === filter.value
                        ? 'bg-accent text-white'
                        : isDarkMode
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>
              {selectedRole && selectedRole !== 'all' && (
                <motion.button
                  onClick={() => setSelectedRole(null)}
                  className="px-4 py-2 rounded-lg font-medium bg-orange-500/20 border border-orange-500/30 hover:bg-orange-500/30 transition-all"
                >
                  Clear: {selectedRole}
                </motion.button>
              )}
            </div>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
              {[
                { icon: BarChart3, label: 'Interviews', value: stats.totalInterviews, color: 'from-blue-500/20 to-cyan-500/20' },
                { icon: TrendingUp, label: 'Avg Score', value: `${stats.averageScore}%`, color: 'from-green-500/20 to-emerald-500/20' },
                { icon: Award, label: 'Best Score', value: `${stats.bestScore}%`, color: 'from-purple-500/20 to-pink-500/20' },
                { icon: AlertCircle, label: 'Worst Score', value: `${stats.worstScore}%`, color: 'from-orange-500/20 to-red-500/20' },
                { icon: Clock, label: 'Total Time', value: formatDuration(stats.totalTime), color: 'from-yellow-500/20 to-orange-500/20' },
                { icon: Zap, label: 'Recent Trend', value: `${stats.recentTrend > 0 ? '+' : ''}${stats.recentTrend}%`, color: stats.recentTrend > 0 ? 'from-green-500/20 to-emerald-500/20' : 'from-red-500/20 to-orange-500/20' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-panel p-4 ${isDarkMode ? '' : 'bg-white border-gray-200'}`}
                >
                  <stat.icon size={18} className="text-accent mb-2" />
                  <h3 className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</h3>
                  <p className="text-xl font-bold mt-1">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Performance Breakdown & Role Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Technical vs Communication */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-panel p-6 ${isDarkMode ? '' : 'bg-white border-gray-200'}`}
              >
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Target size={20} /> Performance Breakdown
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Technical Skills</span>
                      <span className="text-lg font-bold text-blue-400">{stats.averageTechnical}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.averageTechnical}%` }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Communication Skills</span>
                      <span className="text-lg font-bold text-purple-400">{stats.averageCommunication}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.averageCommunication}%` }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Score Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`glass-panel p-6 ${isDarkMode ? '' : 'bg-white border-gray-200'}`}
              >
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <BarChart3 size={20} /> Score Distribution
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Excellent (80+)', count: stats.scoreDistribution.excellent, color: 'from-green-500/20 to-emerald-500/20 bg-green-500' },
                    { label: 'Good (60-79)', count: stats.scoreDistribution.good, color: 'from-yellow-500/20 to-amber-500/20 bg-yellow-500' },
                    { label: 'Average (40-59)', count: stats.scoreDistribution.average, color: 'from-orange-500/20 to-red-500/20 bg-orange-500' },
                    { label: 'Poor (<40)', count: stats.scoreDistribution.poor, color: 'from-red-500/20 to-pink-500/20 bg-red-500' }
                  ].map((dist, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-semibold">{dist.label}</span>
                        <span className="text-xs font-bold">{dist.count}</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.totalInterviews > 0 ? (dist.count / stats.totalInterviews) * 100 : 0}%` }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                          className={`h-full rounded-full ${dist.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Score Trend Visualization */}
            {stats.scoreHistory && stats.scoreHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className={`glass-panel p-6 mb-8 ${isDarkMode ? '' : 'bg-white border-gray-200'}`}
              >
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <TrendingUp size={20} /> Score Trend
                </h3>
                <div className="relative h-64 w-full">
                  <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="10" x2="100" y2="10" stroke="white" strokeOpacity="0.1" strokeWidth="0.1" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="white" strokeOpacity="0.1" strokeWidth="0.1" />
                    <line x1="0" y1="40" x2="100" y2="40" stroke="white" strokeOpacity="0.1" strokeWidth="0.1" />
                    
                    {/* Score line */}
                    <polyline
                      points={stats.scoreHistory.map((val, idx) => `${(idx / (stats.scoreHistory.length - 1)) * 100},${50 - (val * 0.5)}`).join(' ')}
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="0.5"
                      vectorEffect="non-scaling-stroke"
                    />
                    
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>

                    {/* Score dots */}
                    {stats.scoreHistory.map((val, idx) => (
                      <circle
                        key={idx}
                        cx={(idx / (stats.scoreHistory.length - 1)) * 100}
                        cy={50 - (val * 0.5)}
                        r="0.5"
                        fill={val >= 80 ? '#10b981' : val >= 60 ? '#f59e0b' : '#ef4444'}
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  </svg>
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </motion.div>
            )}

            {/* Insights & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Performance Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`glass-panel p-6 ${isDarkMode ? '' : 'bg-white border-gray-200'}`}
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Lightbulb size={20} /> Performance Insights
                </h3>
                <div className="space-y-3">
                  {insights.length > 0 ? (
                    insights.map((insight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className={`p-3 rounded-lg border bg-gradient-to-r ${getInsightColor(insight.type)}`}
                      >
                        <p className="text-sm">{insight.message}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">Take more interviews to see insights!</p>
                  )}
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`glass-panel p-6 ${isDarkMode ? '' : 'bg-white border-gray-200'}`}
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Zap size={20} /> Recommendations
                </h3>
                <div className="space-y-3">
                  {recommendations.length > 0 ? (
                    recommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className={`p-3 rounded-lg border ${rec.priority === 'high' ? 'from-red-500/20 to-orange-500/20 border-red-500/30' : 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'} bg-gradient-to-r`}
                      >
                        <p className="text-xs font-bold uppercase mb-1 text-gray-400">
                          {rec.priority === 'high' ? '🔴' : '🔵'} {rec.area}
                        </p>
                        <p className="text-sm">{rec.message}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No recommendations yet.</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Strengths & Areas for Improvement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Strengths */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`glass-panel p-6 ${isDarkMode ? '' : 'bg-white border-gray-200'}`}
              >
                <h3 className="font-bold text-lg mb-4">✨ Top Strengths</h3>
                {stats.strengthsAggregated.length > 0 ? (
                  <div className="space-y-2">
                    {stats.strengthsAggregated.map((strength, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                      >
                        <span className="text-sm font-semibold">{strength.strength}</span>
                        <span className="bg-green-500/30 px-2 py-1 rounded text-xs font-bold">{strength.count}x</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Take more interviews to identify strengths.</p>
                )}
              </motion.div>

              {/* Areas for Improvement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`glass-panel p-6 ${isDarkMode ? '' : 'bg-white border-gray-200'}`}
              >
                <h3 className="font-bold text-lg mb-4">📈 Areas to Improve</h3>
                {stats.improvementsAggregated.length > 0 ? (
                  <div className="space-y-2">
                    {stats.improvementsAggregated.map((improvement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.05 }}
                        className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20"
                      >
                        <span className="text-sm font-semibold">{improvement.improvement}</span>
                        <span className="bg-yellow-500/30 px-2 py-1 rounded text-xs font-bold">{improvement.count}x</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Keep practicing to identify areas for growth!</p>
                )}
              </motion.div>
            </div>

            {/* Role Performance Breakdown */}
            {roleBreakdown.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className={`glass-panel p-6 mb-8 ${isDarkMode ? '' : 'bg-white border-gray-200'}`}
              >
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Award size={20} /> Interview Breakdown by Role
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {roleBreakdown.map((role, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.08 }}
                      onClick={() => setSelectedRole(selectedRole === role.name ? null : role.name)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg ${
                        selectedRole === role.name 
                          ? 'bg-accent/20 border-accent/60' 
                          : 'bg-white/5 border-white/10 hover:border-accent/40'
                      }`}
                    >
                      <p className="text-sm font-semibold truncate">{role.name}</p>
                      <p className="text-2xl font-bold mt-2">{role.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{role.percentage}% of interviews</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Interviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`glass-panel p-8 ${isDarkMode ? '' : 'bg-white border-gray-200'}`}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Clock size={24} /> Recent Interviews
              </h2>
              
              <div className="space-y-3">
                {[...history].reverse().slice(0, 15).map((interview, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.03 }}
                    className={`p-4 rounded-lg border backdrop-blur-sm transition-all hover:shadow-lg bg-gradient-to-r ${getScoreBg(interview.score)}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{interview.role}</h3>
                          {interview.score >= 80 && <span className="text-xs bg-green-500/30 px-2 py-1 rounded">Excellent</span>}
                          {interview.score >= 60 && interview.score < 80 && <span className="text-xs bg-yellow-500/30 px-2 py-1 rounded">Good</span>}
                          {interview.score < 60 && <span className="text-xs bg-red-500/30 px-2 py-1 rounded">Needs Work</span>}
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {interview.problem} • {new Date(interview.date).toLocaleDateString()}
                        </p>
                        {interview.fullResults && (
                          <div className="flex gap-4 mt-2 text-xs">
                            <span>👨‍💻 Technical: <span className="font-bold">{interview.fullResults.technical || interview.fullResults.leadership || 'N/A'}</span></span>
                            <span>🗣️ Communication: <span className="font-bold">{interview.fullResults.communication || 'N/A'}</span></span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-4xl font-bold ${getScoreColor(interview.score)}`}>{interview.score}%</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
