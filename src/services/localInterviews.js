/**
 * Local Interview Service
 * Stores interview history in localStorage
 * Works alongside local authentication system
 */

const INTERVIEWS_KEY = 'app_interviews';

// Initialize interviews database if empty
const initializeInterviewsDB = () => {
  if (!localStorage.getItem(INTERVIEWS_KEY)) {
    localStorage.setItem(INTERVIEWS_KEY, JSON.stringify([]));
  }
};

export const localInterviewService = {
  // Get all interviews for a user
  getUserInterviews: (userId) => {
    try {
      initializeInterviewsDB();
      const allInterviews = JSON.parse(localStorage.getItem(INTERVIEWS_KEY)) || [];
      return allInterviews.filter(interview => interview.user_id === userId);
    } catch (err) {
      console.error('Error getting interviews:', err);
      return [];
    }
  },

  // Save a new interview
  saveInterview: async (userId, interviewData) => {
    try {
      initializeInterviewsDB();
      const allInterviews = JSON.parse(localStorage.getItem(INTERVIEWS_KEY)) || [];
      
      const newInterview = {
        id: `interview_${userId}_${Date.now()}`,
        user_id: userId,
        role: interviewData.role,
        problem: interviewData.problem,
        difficulty: interviewData.difficulty,
        score: interviewData.score,
        technical_score: interviewData.technicalScore,
        communication_score: interviewData.communicationScore,
        is_behavioral: interviewData.isBehavioral,
        actual_duration: interviewData.actualDuration,
        code_quality_score: interviewData.codeQualityScore,
        strengths: interviewData.strengths || [],
        improvements: interviewData.improvements || [],
        transcript: interviewData.transcript || [],
        created_at: new Date().toISOString()
      };
      
      allInterviews.push(newInterview);
      localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(allInterviews));
      return { data: newInterview, error: null };
    } catch (err) {
      console.error('Error saving interview:', err);
      return { data: null, error: err.message };
    }
  },

  // Get a single interview
  getInterview: (interviewId) => {
    try {
      initializeInterviewsDB();
      const allInterviews = JSON.parse(localStorage.getItem(INTERVIEWS_KEY)) || [];
      const interview = allInterviews.find(i => i.id === interviewId);
      return { data: interview || null };
    } catch (err) {
      console.error('Error getting interview:', err);
      return { data: null };
    }
  },

  // Delete an interview
  deleteInterview: async (interviewId) => {
    try {
      initializeInterviewsDB();
      let allInterviews = JSON.parse(localStorage.getItem(INTERVIEWS_KEY)) || [];
      allInterviews = allInterviews.filter(i => i.id !== interviewId);
      localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(allInterviews));
      return { error: null };
    } catch (err) {
      console.error('Error deleting interview:', err);
      return { error: err.message };
    }
  },

  // Delete all interviews for a user (for cleanup)
  deleteUserInterviews: async (userId) => {
    try {
      initializeInterviewsDB();
      let allInterviews = JSON.parse(localStorage.getItem(INTERVIEWS_KEY)) || [];
      allInterviews = allInterviews.filter(i => i.user_id !== userId);
      localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(allInterviews));
      return { error: null };
    } catch (err) {
      console.error('Error deleting user interviews:', err);
      return { error: err.message };
    }
  },

  // Update an interview
  updateInterview: async (interviewId, updates) => {
    try {
      initializeInterviewsDB();
      let allInterviews = JSON.parse(localStorage.getItem(INTERVIEWS_KEY)) || [];
      const index = allInterviews.findIndex(i => i.id === interviewId);
      
      if (index === -1) {
        return { data: null, error: 'Interview not found' };
      }
      
      allInterviews[index] = { ...allInterviews[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(allInterviews));
      return { data: allInterviews[index], error: null };
    } catch (err) {
      console.error('Error updating interview:', err);
      return { data: null, error: err.message };
    }
  }
};
