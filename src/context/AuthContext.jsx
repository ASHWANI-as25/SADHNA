import React, { createContext, useContext, useEffect, useState } from 'react';
import { localAuthService } from '../services/localAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkUser = async () => {
      try {
        const currentUser = localAuthService.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          
          // Fetch user profile
          const { data: profile } = localAuthService.getUserProfile(currentUser.id);
          if (profile) {
            setUserProfile(profile);
          }
          
          // Check if user is new (just created)
          const hasVisited = localStorage.getItem('user_has_visited');
          setIsNewUser(!hasVisited);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signup = async (email, password, profileData) => {
    try {
      setError(null);
      const { user: newUser, error: signupError } = await localAuthService.signup(
        email,
        password,
        profileData?.fullName
      );

      if (signupError) {
        setError(signupError);
        return { error: signupError };
      }

      setUser(newUser);
      setIsNewUser(true); // Mark as new user on signup
      localStorage.setItem('user_signup_timestamp', new Date().toISOString());
      
      const { data: profile } = localAuthService.getUserProfile(newUser.id);
      if (profile) {
        setUserProfile(profile);
      }

      return { user: newUser, error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const { user: loginUser, error: loginError } = await localAuthService.login(email, password);

      if (loginError) {
        setError(loginError);
        return { error: loginError };
      }

      setUser(loginUser);
      const { data: profile } = localAuthService.getUserProfile(loginUser.id);
      if (profile) {
        setUserProfile(profile);
      }

      return { user: loginUser, error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error: logoutError } = localAuthService.logout();

      if (logoutError) throw logoutError;

      setUser(null);
      setUserProfile(null);
      setIsNewUser(false);
      localStorage.removeItem('user_has_visited');
      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      setError(null);
      const { user: updatedUser, error: updateError } = localAuthService.updateUserProfile(user.id, updates);

      if (updateError) throw updateError;

      setUser(updatedUser);
      const { data: profile } = localAuthService.getUserProfile(updatedUser.id);
      if (profile) {
        setUserProfile(profile);
      }

      return { user: updatedUser, error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  const markUserAsVisited = () => {
    localStorage.setItem('user_has_visited', 'true');
    setIsNewUser(false);
  };

  const oauthLogin = async (provider, oauthData = {}) => {
    try {
      setError(null);
      
      // Use provided email/name from OAuth, or generate demo
      const email = oauthData.email || `${provider}-${Date.now()}@oauth.sadhna.com`;
      const fullName = oauthData.name || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
      const password = `oauth_${provider}_${Math.random().toString(36).slice(2, 10)}`;
      
      const { user: newUser, error: signupError } = await localAuthService.signup(
        email,
        password,
        fullName
      );

      if (signupError) {
        setError(signupError);
        return { error: signupError, user: null };
      }

      setUser(newUser);
      setIsNewUser(true);
      
      // Store OAuth provider info and user email for welcome back greeting
      localStorage.setItem(`oauth_provider_${newUser.id}`, provider);
      localStorage.setItem(`oauth_email_${newUser.id}`, email);
      localStorage.setItem(`oauth_name_${newUser.id}`, fullName);
      localStorage.setItem('user_signup_timestamp', new Date().toISOString());
      
      const { data: profile } = localAuthService.getUserProfile(newUser.id);
      if (profile) {
        setUserProfile(profile);
      }

      return { user: newUser, error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message, user: null };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signup,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isNewUser,
    markUserAsVisited,
    oauthLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
