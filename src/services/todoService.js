import { supabase, isSupabaseConfigured } from './supabase';

// Safe wrapper for database operations
const withDbCheck = async (operation, operationName) => {
  if (!isSupabaseConfigured) {
    console.warn(`⚠️ ${operationName} skipped - Database not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local`);
    return {
      success: false,
      error: `Database not available. ${operationName} requires Supabase.`,
      data: null
    };
  }
  try {
    return await operation();
  } catch (error) {
    console.error(`Error in ${operationName}:`, error);
    return {
      success: false,
      error: error.message || `Failed to ${operationName}`,
      data: null
    };
  }
};

export const todoService = {
  // Create a new todo
  async createTodo(userId, todoData) {
    try {
      const { data, error } = await supabase
        .from('daily_todos')
        .insert({
          user_id: userId,
          title: todoData.title,
          description: todoData.description || '',
          related_streak_id: todoData.related_streak_id || null,
          priority: todoData.priority || 'medium',
          due_date: todoData.due_date || new Date().toISOString().split('T')[0],
          is_completed: false,
        })
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating todo:', error);
      return { success: false, error: error.message };
    }
  },

  // Get todos for a specific date
  async getTodosByDate(userId, date) {
    try {
      const { data, error } = await supabase
        .from('daily_todos')
        .select('*')
        .eq('user_id', userId)
        .eq('due_date', date)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching todos for date:', error);
      return { success: false, error: error.message };
    }
  },

  // Get today's todos
  async getTodaysTodos(userId) {
    const today = new Date().toISOString().split('T')[0];
    return this.getTodosByDate(userId, today);
  },

  // Get todos for date range
  async getTodosByDateRange(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('daily_todos')
        .select('*')
        .eq('user_id', userId)
        .gte('due_date', startDate)
        .lte('due_date', endDate)
        .order('due_date', { ascending: false })
        .order('is_completed', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching todos for date range:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all todos for a user
  async getAllTodos(userId) {
    try {
      const { data, error } = await supabase
        .from('daily_todos')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching all todos:', error);
      return { success: false, error: error.message };
    }
  },

  // Update todo
  async updateTodo(todoId, updates) {
    try {
      const { data, error } = await supabase
        .from('daily_todos')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', todoId)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error updating todo:', error);
      return { success: false, error: error.message };
    }
  },

  // Toggle todo completion
  async toggleTodo(todoId) {
    try {
      // First get the current state
      const { data: todo, error: fetchError } = await supabase
        .from('daily_todos')
        .select('is_completed')
        .eq('id', todoId)
        .single();

      if (fetchError) throw fetchError;

      const isCompleted = !todo.is_completed;
      const completedAt = isCompleted ? new Date().toISOString() : null;

      const { data, error } = await supabase
        .from('daily_todos')
        .update({
          is_completed: isCompleted,
          completed_at: completedAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', todoId)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error toggling todo:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete todo
  async deleteTodo(todoId) {
    try {
      const { error } = await supabase
        .from('daily_todos')
        .delete()
        .eq('id', todoId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting todo:', error);
      return { success: false, error: error.message };
    }
  },

  // Get todo statistics
  async getTodoStats(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('daily_todos')
        .select('*')
        .eq('user_id', userId)
        .gte('due_date', startDate)
        .lte('due_date', endDate);

      if (error) throw error;

      const total = data.length;
      const completed = data.filter((t) => t.is_completed).length;
      const pending = data.filter((t) => !t.is_completed).length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        success: true,
        stats: {
          total,
          completed,
          pending,
          completionRate,
        },
      };
    } catch (error) {
      console.error('Error fetching todo stats:', error);
      return { success: false, error: error.message };
    }
  },

  // Get this week's todos
  async getWeeklyTodos(userId) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return this.getTodosByDateRange(
      userId,
      startOfWeek.toISOString().split('T')[0],
      endOfWeek.toISOString().split('T')[0]
    );
  },

  // Get this month's todos
  async getMonthlyTodos(userId) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return this.getTodosByDateRange(
      userId,
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    );
  },
};
