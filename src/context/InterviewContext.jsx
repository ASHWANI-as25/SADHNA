import React, { createContext, useContext, useState, useEffect } from 'react';
import { databaseService, realtimeService, isSupabaseConfigured } from '../services/supabase';
import { localInterviewService } from '../services/localInterviews';
import { useAuth } from './AuthContext';

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const { user } = useAuth();
  const [session, setSession] = useState({
    role: 'Software Engineer',
    difficulty: 'Medium',
    resumeText: '',
    resumeHash: null, // Unique hash for resume to track questions
    problem: null,
    transcript: [],
    results: null,
    duration: 30 // Interview duration in minutes (default 30min)
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load history from localStorage or Supabase when user changes
  useEffect(() => {
    if (user) {
      loadInterviewHistory();
      
      // Only subscribe to real-time updates if Supabase is configured
      if (isSupabaseConfigured) {
        const subscription = realtimeService.subscribeToInterviews(user.id, (payload) => {
          loadInterviewHistory();
        });
        return () => {
          realtimeService.unsubscribe(subscription);
        };
      }
    } else {
      setHistory([]);
    }
  }, [user]);

  const loadInterviewHistory = async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      // Use local storage if Supabase is not configured
      if (!isSupabaseConfigured) {
        const interviews = localInterviewService.getUserInterviews(user.id);
        setHistory(interviews);
      } else {
        const { data, error } = await databaseService.getUserInterviews(user.id);
        if (!error && data) {
          setHistory(data);
        }
      }
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (updates) => {
    setSession((prev) => {
      const newSession = { ...prev, ...updates };
      
      // If we are updating results, it means an interview finished, so save to database
      if (updates.results && user) {
        const interviewData = {
          role: newSession.role,
          problem: updates.problemTitle || 'Behavioral',
          score: updates.results.score,
          technicalScore: updates.results.technical || updates.results.leadership,
          communicationScore: updates.results.communication,
          isBehavioral: updates.results.isBehavioral || false,
          actualDuration: updates.actualDuration || newSession.duration,
          codeQualityScore: updates.codeQualityScore || null,
          difficulty: newSession.difficulty,
          strengths: updates.results.strengths || [],
          improvements: updates.results.improvements || [],
          transcript: newSession.transcript
        };

        // Save to localStorage or Supabase (async, non-blocking)
        if (!isSupabaseConfigured) {
          localInterviewService.saveInterview(user.id, interviewData)
            .then(() => {
              loadInterviewHistory(); // Refresh history
            })
            .catch(err => console.error('Error saving interview:', err));
        } else {
          databaseService.saveInterview(user.id, interviewData)
            .then(() => {
              loadInterviewHistory(); // Refresh history
            })
            .catch(err => console.error('Error saving interview:', err));
        }
      }
      
      return newSession;
    });
  };

  const viewPastResult = (result, role, problem) => {
    setSession(prev => ({
      ...prev,
      role,
      results: result
    }));
  };

  const deleteHistoryItem = async (id) => {
    try {
      if (!isSupabaseConfigured) {
        localInterviewService.deleteInterview(id);
      } else {
        await databaseService.deleteInterview(id);
      }
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting interview:', err);
    }
  };

  const addMessage = (role, content) => {
    setSession((prev) => ({
      ...prev,
      transcript: [...prev.transcript, { role, content }]
    }));
  };

  return (
    <InterviewContext.Provider value={{ session, updateSession, addMessage, history, viewPastResult, deleteHistoryItem }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
