import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Trash2, Calendar, AlertCircle, CheckCircle2, Circle, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { todoService } from '../services/todoService';
import { streakManagementService } from '../services/streakManagementService';
import GlowButton from '../components/GlowButton';
import { CardSkeleton, StatsSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { toast } from '../services/toastService';
import { validate } from '../services/validationService';
import { fullscreenService } from '../services/fullscreenService';
import '../styles/daily-todos.css';

const DailyTodos = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [streaks, setStreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTodoData, setNewTodoData] = useState({
    title: '',
    description: '',
    related_streak_id: null,
    priority: 'medium',
  });
  const [viewMode, setViewMode] = useState('today'); // today, weekly, monthly
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user?.id, selectedDate, viewMode]);

  // Listen for fullscreen changes
  useEffect(() => {
    return fullscreenService.onFullscreenChange((isActive) => {
      setIsFullscreen(isActive);
    });
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Load streaks for relationship
      const streaksResult = await streakManagementService.getUserStreaks(user.id);
      if (streaksResult.success) {
        setStreaks(streaksResult.data);
      }

      // Load todos based on view mode
      let todosResult;
      if (viewMode === 'today') {
        todosResult = await todoService.getTodosByDate(user.id, selectedDate);
      } else if (viewMode === 'weekly') {
        todosResult = await todoService.getWeeklyTodos(user.id);
      } else {
        todosResult = await todoService.getMonthlyTodos(user.id);
      }

      if (todosResult.success) {
        setTodos(todosResult.data);
      }

      // Load stats for the month
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];

      const statsResult = await todoService.getTodoStats(user.id, startDate, endDate);
      if (statsResult.success) {
        setStats(statsResult.stats);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, selectedDate, viewMode]);

  const handleCreateTodo = async () => {
    // Validation
    const titleError = validate.required(newTodoData.title, 'Todo title');
    if (titleError) {
      toast.error(titleError);
      return;
    }

    if (newTodoData.title.length > 500) {
      toast.error('Todo title cannot exceed 500 characters');
      return;
    }

    try {
      const result = await todoService.createTodo(user.id, {
        ...newTodoData,
        due_date: selectedDate,
      });

      if (result.success) {
        setShowCreateModal(false);
        setNewTodoData({
          title: '',
          description: '',
          related_streak_id: null,
          priority: 'medium',
        });
        toast.success('✅ Todo created successfully!');
        loadAllData();
      } else {
        toast.error('Failed to create todo. Please try again.');
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      toast.error('Error creating todo. Please try again.');
    }
  };

  const handleToggleTodo = async (todoId) => {
    try {
      const result = await todoService.toggleTodo(todoId);
      if (result.success) {
        toast.success(result.data.is_completed ? '✅ Task marked complete!' : '🔄 Task marked incomplete');
        loadAllData();
      } else {
        toast.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error('Error updating todo');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        const result = await todoService.deleteTodo(todoId);
        if (result.success) {
          toast.success('🗑️ Todo deleted successfully');
          loadAllData();
        } else {
          toast.error('Failed to delete todo');
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
        toast.error('Error deleting todo');
      }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-pink-600';
      case 'medium':
        return 'from-amber-500 to-orange-600';
      case 'low':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-cyan-500 to-blue-600';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴 High';
      case 'medium':
        return '🟡 Medium';
      case 'low':
        return '🟢 Low';
      default:
        return '⚪ Normal';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sadhna-red via-sadhna-navy to-sadhna-black p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 space-y-2">
            <StatsSkeleton count={4} />
          </div>
          <CardSkeleton count={5} />
        </div>
      </div>
    );
  }

  const completedCount = todos.filter((t) => t.is_completed).length;
  const completionPercentage = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sadhna-red via-sadhna-navy to-sadhna-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-8">
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Calendar className="text-energy-gold" size={40} />
                Daily Todo List
              </h1>
              <p className="text-gray-300">Organize your tasks and stay productive every day</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleFullscreen}
                className="p-3 rounded-xl glass-panel hover:bg-white/20 transition-all duration-300 text-energy-gold hover:text-energy-coral"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <GlowButton
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                Add Todo
              </GlowButton>
            </div>
          </motion.div>

          {/* Stats Cards */}
          {stats && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            >
              {[
                {
                  label: 'Total Tasks',
                  value: stats.total,
                  color: 'from-cyan-500 to-blue-600',
                  icon: '📋',
                },
                {
                  label: 'Completed',
                  value: stats.completed,
                  color: 'from-emerald-500 to-teal-600',
                  icon: '✅',
                },
                {
                  label: 'Pending',
                  value: stats.pending,
                  color: 'from-amber-500 to-orange-600',
                  icon: '⏳',
                },
                {
                  label: 'Completion Rate',
                  value: `${stats.completionRate}%`,
                  color: 'from-purple-500 to-pink-600',
                  icon: '📊',
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className={`bg-gradient-to-br ${stat.color} p-4 rounded-lg text-white shadow-lg`}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <p className="text-sm opacity-80 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* View Mode Selector */}
          <motion.div variants={itemVariants} className="flex gap-2 mb-8">
            {['today', 'weekly', 'monthly'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  viewMode === mode
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Date Selector for Today View */}
          {viewMode === 'today' && (
            <motion.div variants={itemVariants} className="mb-8 flex items-center gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
              />
              <span className="text-slate-400">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Todos List */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {todos.length > 0 ? (
            <div className="space-y-4">
              {todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  variants={itemVariants}
                  className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleTodo(todo.id)}
                      className="mt-1 flex-shrink-0 focus:outline-none"
                    >
                      {todo.is_completed ? (
                        <CheckCircle2 size={24} className="text-emerald-500" />
                      ) : (
                        <Circle size={24} className="text-slate-500 hover:text-cyan-500" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3
                          className={`text-lg font-semibold ${
                            todo.is_completed
                              ? 'text-slate-500 line-through'
                              : 'text-white'
                          }`}
                        >
                          {todo.title}
                        </h3>
                        <div className="flex-shrink-0">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getPriorityColor(
                              todo.priority
                            )}`}
                          >
                            {getPriorityLabel(todo.priority)}
                          </span>
                        </div>
                      </div>

                      {todo.description && (
                        <p className="text-slate-400 text-sm mb-2">{todo.description}</p>
                      )}

                      {todo.related_streak_id && (
                        <div className="text-xs text-cyan-400 mb-2">
                          🔗 Linked to streak
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {new Date(todo.due_date + 'T00:00:00').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        {todo.completed_at && (
                          <span className="text-xs text-emerald-400">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="flex-shrink-0 p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-red-500 hover:text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-600"
            >
              <EmptyState
                icon={Calendar}
                title={viewMode === 'today' ? 'No todos for today' : `No todos for this ${viewMode}`}
                description="Create your first todo to get started and stay productive!"
                action={() => setShowCreateModal(true)}
                actionText="📝 Create Your First Todo"
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Create Todo Modal */}
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
            className="bg-gradient-to-br from-sadhna-navy to-sadhna-black border border-energy-gold/30 rounded-2xl p-8 max-w-lg w-full my-8"
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-1">📝 Add New Todo</h2>
              <p className="text-slate-400">Create a task for {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}</p>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTodoData.title}
                  onChange={(e) =>
                    setNewTodoData({ ...newTodoData, title: e.target.value })
                  }
                  placeholder="e.g., Complete LeetCode problem, Workout, Read chapter"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">
                  Description (Optional)
                </label>
                <textarea
                  value={newTodoData.description}
                  onChange={(e) =>
                    setNewTodoData({ ...newTodoData, description: e.target.value })
                  }
                  placeholder="Add details about this task..."
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 h-20 resize-none transition-all"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() =>
                        setNewTodoData({ ...newTodoData, priority })
                      }
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        newTodoData.priority === priority
                          ? `bg-gradient-to-r ${getPriorityColor(priority)} text-white shadow-lg`
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {getPriorityLabel(priority)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Link Streak */}
              {streaks.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">
                    Link to Streak (Optional)
                  </label>
                  <select
                    value={newTodoData.related_streak_id || ''}
                    onChange={(e) =>
                      setNewTodoData({
                        ...newTodoData,
                        related_streak_id: e.target.value || null,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
                  >
                    <option value="">No streak</option>
                    {streaks.map((streak) => (
                      <option key={streak.id} value={streak.id}>
                        {streak.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
                <GlowButton onClick={handleCreateTodo} className="flex-1">
                  ✓ Add Todo
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DailyTodos;
