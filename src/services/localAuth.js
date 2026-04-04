/**
 * Simple Local Authentication Service
 * Stores users in localStorage (simulated database)
 * No Supabase required - works immediately!
 */

const USERS_KEY = 'app_users';
const CURRENT_USER_KEY = 'current_user';

// Initialize users database if empty
const initializeUsersDB = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
};

export const localAuthService = {
  // Get all users
  getAllUsers: () => {
    initializeUsersDB();
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  },

  // Save user to database
  saveUser: (user) => {
    const users = localAuthService.getAllUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Find user by email
  findUserByEmail: (email) => {
    const users = localAuthService.getAllUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  // Sign up - create new user
  signup: async (email, password, fullName = 'User') => {
    try {
      if (!email || !password || !fullName) {
        return { error: 'Email, password, and name are required' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: 'Invalid email format' };
      }

      // Validate password strength
      if (password.length < 8) {
        return { error: 'Password must be at least 8 characters' };
      }
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        return { error: 'Password must contain uppercase, lowercase, and number' };
      }

      const existingUser = localAuthService.findUserByEmail(email);
      if (existingUser) {
        return { error: '❌ User already exists. Try logging in!' };
      }

      // TODO: In production, use bcryptjs to hash password
      // import * as bcrypt from 'bcryptjs';
      // const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      // For now, warning in console
      console.warn('⚠️ SECURITY WARNING: Password stored without hashing. Install bcryptjs for production: npm install bcryptjs');

      const newUser = {
        id: `user_${Date.now()}`,
        email: email.trim(),
        password: password, // TODO: Replace with hashed password
        fullName: (fullName || email.split('@')[0]).trim(),
        createdAt: new Date().toISOString(),
        avatar: null,
        difficulty_level: 'medium'
      };

      localAuthService.saveUser(newUser);
      const safeUser = { ...newUser };
      delete safeUser.password;

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      return { user: safeUser, error: null };
    } catch (err) {
      return { error: err.message };
    }
  },

  // Login - verify email and password
  login: async (email, password) => {
    try {
      // Validate inputs
      if (!email || !password) {
        return { error: 'Email and password are required' };
      }

      const user = localAuthService.findUserByEmail(email);

      if (!user) {
        return { error: '❌ User not found. Please sign up first!' };
      }

      if (user.password !== password) {
        return { error: '❌ Wrong password. Try again!' };
      }

      // Create a safe user object without password
      const safeUser = { ...user };
      delete safeUser.password;
      
      // Set as current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

      return { user: safeUser, error: null };
    } catch (err) {
      return { error: err.message };
    }
  },

  // Get current logged-in user
  getCurrentUser: () => {
    try {
      const currentUser = localStorage.getItem(CURRENT_USER_KEY);
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (err) {
      console.error('Error parsing current user:', err);
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }
  },

  // Logout
  logout: () => {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem('demo_mode');
      localStorage.removeItem('demo_user');
      localStorage.removeItem('demo_profile');
      return { error: null };
    } catch (err) {
      console.error('Logout error:', err);
      return { error: err.message };
    }
  },

  // Update user profile
  updateUserProfile: (userId, updates) => {
    const users = localAuthService.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Update current user if it's the same user
      const currentUser = localAuthService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]));
      }

      return { user: users[userIndex], error: null };
    }

    return { error: 'User not found' };
  },

  // Get user profile
  getUserProfile: (userId) => {
    const users = localAuthService.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      const { password, ...profile } = user;
      return { data: profile, error: null };
    }
    return { data: null, error: 'User not found' };
  }
};

export default localAuthService;
