import { supabase, isSupabaseConfigured } from './supabase';

const TODOS_KEY = 'app_todos';

const initializeTodosDB = () => {
  if (!localStorage.getItem(TODOS_KEY)) {
    localStorage.setItem(TODOS_KEY, JSON.stringify([]));
  }
};

const getTodosFromLocal = () => {
  initializeTodosDB();
  return JSON.parse(localStorage.getItem(TODOS_KEY)) || [];
};

const saveTodosToLocal = (todos) => {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};

export const todoService = {
  // Create a new todo
  async createTodo(userId, todoData) {
    try {
      if (!isSupabaseConfigured) {
        // Use localStorage fallback
        const todos = getTodosFromLocal();
        const newTodo = {
          id: `${userId}-${Date.now()}`,
          user_id: userId,
          title: todoData.title,
          description: todoData.description || '',
          related_streak_id: todoData.related_streak_id || null,
          priority: todoData.priority || 'medium',
          due_date: todoData.due_date || new Date().toISOString().split('T')[0],
          is_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        todos.push(newTodo);
        saveTodosToLocal(todos);
        return { success: true, data: newTodo };
      }

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
      if (!isSupabaseConfigured) {
        const todos = getTodosFromLocal()
          .filter(t => t.user_id === userId && t.due_date === date)
          .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0) ||
                   new Date(b.created_at) - new Date(a.created_at);
          });
        return { success: true, data: todos };
      }

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
      if (!isSupabaseConfigured) {
        const todos = getTodosFromLocal()
          .filter(t => t.user_id === userId && t.due_date >= startDate && t.due_date <= endDate)
          .sort((a, b) => new Date(b.due_date) - new Date(a.due_date) ||
                         (a.is_completed ? 1 : -1) - (b.is_completed ? 1 : -1));
        return { success: true, data: todos };
      }

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
      if (!isSupabaseConfigured) {
        const todos = getTodosFromLocal()
          .filter(t => t.user_id === userId)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return { success: true, data: todos };
      }

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
      if (!isSupabaseConfigured) {
        const todos = getTodosFromLocal();
        const index = todos.findIndex(t => t.id === todoId);
        if (index === -1) {
          return { success: false, error: 'Todo not found' };
        }
        todos[index] = {
          ...todos[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        saveTodosToLocal(todos);
        return { success: true, data: todos[index] };
      }

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
      if (!isSupabaseConfigured) {
        const todos = getTodosFromLocal();
        const index = todos.findIndex(t => t.id === todoId);
        if (index === -1) {
          return { success: false, error: 'Todo not found' };
        }
        todos[index].is_completed = !todos[index].is_completed;
        todos[index].completed_at = todos[index].is_completed ? new Date().toISOString() : null;
        todos[index].updated_at = new Date().toISOString();
        saveTodosToLocal(todos);
        return { success: true, data: todos[index] };
      }

      const todos = getTodosFromLocal();
      const localTodo = todos.find(t => t.id === todoId);
      const currentState = localTodo ? localTodo.is_completed : undefined;

      const { data, error } = await supabase
        .from('daily_todos')
        .update({
          is_completed: currentState !== undefined ? !currentState : true,
          completed_at: currentState !== undefined && currentState ? null : new Date().toISOString(),
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
      if (!isSupabaseConfigured) {
        const todos = getTodosFromLocal().filter(t => t.id !== todoId);
        saveTodosToLocal(todos);
        return { success: true };
      }

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
      let todos;

      if (!isSupabaseConfigured) {
        todos = getTodosFromLocal()
          .filter(t => t.user_id === userId && t.due_date >= startDate && t.due_date <= endDate);
      } else {
        const { data, error } = await supabase
          .from('daily_todos')
          .select('*')
          .eq('user_id', userId)
          .gte('due_date', startDate)
          .lte('due_date', endDate);

        if (error) throw error;
        todos = data;
      }

      const total = todos.length;
      const completed = todos.filter((t) => t.is_completed).length;
      const pending = todos.filter((t) => !t.is_completed).length;
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

