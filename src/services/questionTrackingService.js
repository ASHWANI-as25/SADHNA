/**
 * Question Tracking Service
 * Ensures unique questions per resume upload across all difficulty levels
 * Tracks: Resume fingerprint, used questions per resume per role/difficulty
 */

// Generate a SHA256-like hash from resume text/file
// Using simple string-based hash for browser compatibility
export const generateResumeHash = async (file) => {
  if (!file) {
    return `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `resume_${hashHex}`;
  } catch (err) {
    console.warn('Error generating hash, using fallback:', err);
    return `resume_${file.name}_${file.size}_${Date.now()}`;
  }
};

// Get storage key for tracking used questions
const getStorageKey = (resumeHash, role, difficulty) => {
  return `question_tracking_${resumeHash}_${role}_${difficulty}`;
};

// Get all used questions for a resume/role/difficulty combination
export const getUsedQuestions = (resumeHash, role, difficulty) => {
  if (!resumeHash) return [];
  
  const key = getStorageKey(resumeHash, role, difficulty);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

// Mark a question as used for a resume/role/difficulty combination
export const markQuestionAsUsed = (resumeHash, role, difficulty, questionTitle) => {
  if (!resumeHash) return;
  
  const key = getStorageKey(resumeHash, role, difficulty);
  const usedQuestions = getUsedQuestions(resumeHash, role, difficulty);
  
  if (!usedQuestions.includes(questionTitle)) {
    usedQuestions.push(questionTitle);
    localStorage.setItem(key, JSON.stringify(usedQuestions));
  }
};

// Get next available question index (not yet used for this resume)
// Returns the index of a question that hasn't been used yet
export const getNextAvailableQuestionIndex = (resumeHash, role, difficulty, allProblems) => {
  const usedQuestions = getUsedQuestions(resumeHash, role, difficulty);
  
  // Find first problem not in usedQuestions
  for (let i = 0; i < allProblems.length; i++) {
    if (!usedQuestions.includes(allProblems[i].title)) {
      return i;
    }
  }
  
  // If all used, reset and return first one (full cycle)
  if (usedQuestions.length > 0 && usedQuestions.length >= allProblems.length) {
    clearResumeSessionQuestions(resumeHash, role, difficulty);
    return 0;
  }
  
  return 0;
};

// Get a randomized list of available question indices (for variety)
export const getShuffledAvailableQuestions = (resumeHash, role, difficulty, allProblems) => {
  const usedQuestions = getUsedQuestions(resumeHash, role, difficulty);
  
  // Get available indices
  const availableIndices = [];
  for (let i = 0; i < allProblems.length; i++) {
    if (!usedQuestions.includes(allProblems[i].title)) {
      availableIndices.push(i);
    }
  }
  
  // If all questions are used, reset and return all
  if (availableIndices.length === 0) {
    clearResumeSessionQuestions(resumeHash, role, difficulty);
    return Array.from({ length: allProblems.length }, (_, i) => i);
  }
  
  // Shuffle available indices
  for (let i = availableIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
  }
  
  return availableIndices;
};

// Pick a random available question from shuffled list
export const getRandomAvailableQuestionIndex = (resumeHash, role, difficulty, allProblems) => {
  const shuffledIndices = getShuffledAvailableQuestions(resumeHash, role, difficulty, allProblems);
  return shuffledIndices[0] || 0;
};

// Clear all tracked questions for a specific resume/role/difficulty
export const clearResumeSessionQuestions = (resumeHash, role, difficulty) => {
  const key = getStorageKey(resumeHash, role, difficulty);
  localStorage.removeItem(key);
};

// Clear all tracked questions for a specific resume
export const clearResumeAllQuestions = (resumeHash) => {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes(`question_tracking_${resumeHash}`)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

// Get statistics for a resume
export const getResumeQuestionStats = (resumeHash) => {
  const stats = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes(`question_tracking_${resumeHash}`)) {
      const [_, __, role, difficulty] = key.split('_');
      if (role && difficulty) {
        const combinedKey = `${role}_${difficulty}`;
        stats[combinedKey] = JSON.parse(localStorage.getItem(key)).length;
      }
    }
  }
  return stats;
};

export default {
  generateResumeHash,
  getUsedQuestions,
  markQuestionAsUsed,
  getNextAvailableQuestionIndex,
  getShuffledAvailableQuestions,
  getRandomAvailableQuestionIndex,
  clearResumeSessionQuestions,
  clearResumeAllQuestions,
  getResumeQuestionStats
};
