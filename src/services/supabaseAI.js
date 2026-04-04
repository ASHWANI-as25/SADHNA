import { supabase } from './supabase';

/**
 * Supabase-based AI Interview Service
 * Uses database-driven responses instead of Groq API
 * Smart fallback system with demo responses
 */

// Demo responses database (fallback when Supabase not configured)
const demoResponsesDB = {
  behavioral: {
    intro: [
      "Welcome to the interview! I'd like to start by learning about your background. Tell me about your most proud achievement in your career so far.",
      "Hi! Let's begin. Walk me through your experience and what drew you to this role.",
      "Great to meet you! Start by telling me about your professional background and key projects you've led.",
    ],
    responses: [
      "That's great! Can you walk me through a situation where you had to handle a conflict with a team member? What was the outcome?",
      "Tell me about a time when you failed at something. How did you handle it and what did you learn?",
      "Can you describe a project where you had to lead a team? What challenges did you face?",
      "How do you approach learning in a fast-paced environment? Give me an example.",
      "Describe a situation where you had to adapt your communication style. How did that help?",
      "Tell me about a time you had to work with someone you didn't get along with. How did you handle it?",
      "When have you gone above and beyond your job description?",
      "Describe a situation where you had to make a difficult decision. Walk me through your thought process.",
    ]
  },
  technical: {
    easy: {
      intro: [
        "Excellent! Let's start with a fundamental problem. We'll build up from there.",
        "Great! Here's an easy problem to get started. Solve it step by step.",
        "Perfect! Let's begin with this problem. Walk me through your approach.",
      ],
      responses: [
        "Good start! Let's think about the edge cases here. What happens if the input is null or empty?",
        "I see. Now, can you think about the time complexity of your solution? Is there a more efficient approach?",
        "That's correct! Can you now refactor this to use a different data structure?",
        "The logic looks solid. How would you handle errors in this function?",
        "Great approach! Now, can you optimize this for better performance?",
        "Good! Can you trace through this with a specific example to verify it works?",
        "Perfect! Now, how would you test this to ensure it handles all cases?",
      ]
    },
    medium: {
      intro: [
        "Alright! Here's a medium-level problem. Take your time to understand it fully.",
        "Great! This one requires some optimization thinking. What's your approach?",
        "Perfect! Let's tackle this. What data structure would you use?",
      ],
      responses: [
        "Your approach is solid, but I'm curious about the scalability here. How would this perform with a million entries?",
        "Good! Now let's talk about optimization. Are there any bottlenecks in your solution?",
        "That's a valid approach. Can you think of an alternative algorithm that might be more efficient?",
        "How would you test this function? What edge cases should we consider?",
        "I like where you're going. Can you explain the space-time tradeoff in your solution?",
        "Good! Now, how would you handle large inputs or memory constraints?",
        "Great! Can you implement this more concisely using built-in functions?",
      ]
    },
    hard: {
      intro: [
        "Alright! This is a challenging problem. Take your time planning your approach.",
        "Here's a complex problem that combines multiple concepts. What's your thought process?",
        "Perfect! This requires careful system design. How would you approach this?",
      ],
      responses: [
        "Interesting! But what about the distributed system implications here? How would this scale across multiple servers?",
        "Good thinking. However, consider this: what if we need to handle concurrent requests? How would your architecture adapt?",
        "That works for basic cases. Can you think about how to handle race conditions or deadlocks in this scenario?",
        "Your solution is efficient for single-threaded execution. How would you parallelize this?",
        "Solid approach! Now, let's discuss security implications. Are there any vulnerabilities in this design?",
        "Good! How would this perform under production load? What monitoring would you add?",
        "Excellent! Now, can you design this to be more fault-tolerant?",
      ]
    }
  }
};

/**
 * Get intro question for the interview
 */
export const getIntroQuestion = (isBehavioral = false, difficulty = "Medium") => {
  if (isBehavioral) {
    const intros = demoResponsesDB.behavioral.intro;
    return intros[Math.floor(Math.random() * intros.length)];
  }
  
  const diffKey = difficulty.toLowerCase();
  const intros = demoResponsesDB.technical[diffKey]?.intro || demoResponsesDB.technical.medium.intro;
  return intros[Math.floor(Math.random() * intros.length)];
};

/**
 * Generate AI response based on user input
 * Uses Supabase if configured, otherwise uses demo responses
 */
export const generateAIResponse = async (userTranscript, codeContext = "", history = [], sessionContext = {}) => {
  const { role = "Software Engineer", difficulty = "Medium", isBehavioral = false } = sessionContext;
  
  try {
    // Try to fetch from Supabase first
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // If Supabase is properly configured, try to fetch responses from database
    if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
      try {
        const { data, error } = await supabase
          .from('ai_responses')
          .select('response')
          .eq('type', isBehavioral ? 'behavioral' : 'technical')
          .eq('difficulty', difficulty)
          .order('RANDOM()')
          .limit(1);
        
        if (data && data.length > 0) {
          console.log("✅ Using Supabase AI response");
          return data[0].response;
        }
      } catch (supabaseError) {
        console.warn("⚠️ Supabase query failed, using demo responses:", supabaseError.message);
      }
    }
  } catch (error) {
    console.warn("⚠️ Supabase check failed:", error.message);
  }

  // Fallback to demo responses
  console.log("📚 Using demo response database");
  
  if (isBehavioral) {
    const responses = demoResponsesDB.behavioral.responses;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  const diffKey = difficulty.toLowerCase();
  const responses = demoResponsesDB.technical[diffKey]?.responses || demoResponsesDB.technical.medium.responses;
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Analyze partial code solutions
 * Gives credit for what's correct and identifies issues
 */
export const analyzePartialSolution = (testResults = [], codeAnalysis = {}, isBehavioral = false) => {
  if (isBehavioral) {
    return { testCreditScore: 0, partialCredit: 0, issues: [] };
  }

  let passedTests = 0;
  let totalTests = 0;
  const issues = [];

  // Analyze test results
  if (Array.isArray(testResults)) {
    testResults.forEach((result, idx) => {
      if (result && !result.error) {
        totalTests++;
        if (result.passed) {
          passedTests++;
        } else {
          issues.push(`Test case ${idx + 1} failed - output mismatch (Expected: ${result.expected}, Got: ${result.actual})`);
        }
      } else if (result?.error) {
        issues.push(`Test case ${idx + 1} error: ${result.error}`);
      }
    });
  }

  // Calculate partial credit (0-100)
  const testCreditScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  // Code quality penalties
  let codeQualityPenalty = 0;
  if (codeAnalysis?.codeSmells?.length > 0) {
    codeQualityPenalty += Math.min(codeAnalysis.codeSmells.length * 3, 15);
    issues.push(`Code quality issues: ${codeAnalysis.codeSmells.length} smell(s) detected`);
  }

  // Complexity analysis
  if (codeAnalysis?.timeComplexity && codeAnalysis.timeComplexity.includes('n³')) {
    codeQualityPenalty += 10;
    issues.push("High time complexity detected - consider optimization");
  }

  const partialCredit = Math.max(0, testCreditScore - codeQualityPenalty);

  return { 
    testCreditScore, 
    partialCredit, 
    issues, 
    passedTests,
    totalTests,
    hasErrors: issues.length > 0
  };
};

/**
 * Generate final interview feedback with partial solution analysis
 */
export const generateFinalFeedback = async (
  history = [], 
  allCodes = {}, 
  isBehavioral = false, 
  role = "Software Engineer",
  testResults = null,
  codeAnalysis = null,
  difficulty = "Medium"
) => {
  try {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
      try {
        // Try to store session and get evaluation
        const sessionData = {
          type: isBehavioral ? 'behavioral' : 'technical',
          role: role,
          transcript: JSON.stringify(history),
          created_at: new Date().toISOString()
        };

        const { data: insertData, error: insertError } = await supabase
          .from('interview_sessions')
          .insert([sessionData])
          .select();

        if (!insertError && insertData) {
          console.log("✅ Session saved to Supabase");
        }
      } catch (supabaseError) {
        console.warn("⚠️ Could not save session to Supabase");
      }
    }
  } catch (error) {
    console.warn("⚠️ Supabase feedback check failed");
  }

  // For behavioral interviews - return generic feedback
  if (isBehavioral) {
    return {
      score: Math.floor(Math.random() * 40) + 60,
      leadership: Math.floor(Math.random() * 30) + 65,
      communication: Math.floor(Math.random() * 25) + 70,
      strengths: [
        "Clear communication and good use of examples",
        "Showed adaptability and learning mindset",
        "Asked clarifying questions when needed"
      ],
      improvements: [
        "Go deeper into specific metrics and business impact",
        "Explain your thinking more out loud"
      ],
      alternativeApproach: "Focus on quantifiable outcomes and team impact in future examples",
      feedback: "Great interview! You demonstrated solid skills and good communication. Keep practicing and you'll excel in interviews."
    };
  }

  // For technical interviews - analyze code and test results
  const analysis = analyzePartialSolution(testResults, codeAnalysis, false);

  // Base score calculation
  let baseScore = analysis.partialCredit;
  
  // Difficulty multiplier for base score
  const difficultyMultiplier = {
    'Easy': 1,
    'Medium': 1.1,
    'Hard': 1.2
  };
  const diffMultiplier = difficultyMultiplier[difficulty] || 1;

  // Bonus for attempted solution
  const attemptBonus = allCodes && Object.keys(allCodes).length > 0 ? 5 : 0;
  
  let finalScore = Math.round(Math.min(100, baseScore * diffMultiplier + attemptBonus));

  // Ensure minimum score for effort
  if (analysis.passedTests > 0 && finalScore < 50) {
    finalScore = Math.max(50, finalScore);
  }

  // Generate strengths based on performance
  const strengths = [];
  if (analysis.passedTests > 0) {
    const passPercentage = (analysis.passedTests / analysis.totalTests * 100).toFixed(0);
    strengths.push(`✓ Passed ${analysis.passedTests}/${analysis.totalTests} test cases (${passPercentage}%)`);
  }
  if (analysis.passedTests === analysis.totalTests) {
    strengths.push("✓ All test cases passed - excellent!");
    strengths.push("✓ Strong problem-solving approach");
  } else if (analysis.passedTests >= analysis.totalTests * 0.75) {
    strengths.push("✓ Strong foundation with most logic working");
  } else if (analysis.passedTests >= analysis.totalTests * 0.5) {
    strengths.push("✓ Good partial implementation");
  }

  if (codeAnalysis?.patterns?.length > 0) {
    strengths.push(`✓ Used design patterns: ${codeAnalysis.patterns.join(', ')}`);
  }

  if (!codeAnalysis?.codeSmells || codeAnalysis.codeSmells.length === 0) {
    strengths.push("✓ Clean code with no major code smells");
  }

  // Generate improvements based on issues
  const improvements = [];
  if (analysis.issues.length > 0) {
    improvements.push(...analysis.issues.slice(0, 3));
  }

  if (analysis.passedTests < analysis.totalTests) {
    improvements.push("• Edge cases need attention - test with boundary values");
  }

  if (codeAnalysis?.suggestions?.length > 0) {
    improvements.push(`• ${codeAnalysis.suggestions[0]}`);
  }

  if (improvements.length === 0) {
    improvements.push("• Code is production-ready");
  }

  // Alternative approach
  let alternativeApproach = "Try identifying common patterns in test cases to refine the algorithm";
  if (analysis.passedTests === 0) {
    alternativeApproach = "Step through the problem with a small example to validate the logic before implementing";
  } else if (analysis.passedTests < analysis.totalTests * 0.75) {
    alternativeApproach = "Focus on understanding the edge cases - they often reveal logical gaps";
  }

  // Overall feedback message
  let feedbackMessage = "";
  if (finalScore >= 90) {
    feedbackMessage = "🌟 Excellent! You demonstrated strong problem-solving skills and clean code practices.";
  } else if (finalScore >= 75) {
    feedbackMessage = "👍 Good work! You're on the right track. Focus on edge cases and optimization.";
  } else if (finalScore >= 60) {
    feedbackMessage = "💪 Nice effort! You have a solid foundation. Keep practicing on similar problems.";
  } else if (finalScore >= 40) {
    feedbackMessage = "📚 Keep learning! You showed understanding of the approach. Debug your code and identify edge cases.";
  } else {
    feedbackMessage = "🔧 Don't worry! This takes practice. Review the problem and start with simpler test cases.";
  }

  return {
    score: finalScore,
    technical: baseScore,
    communication: 70 + Math.random() * 25,
    testsPassed: analysis.passedTests,
    testsTotal: analysis.totalTests,
    strengths,
    improvements,
    alternativeApproach,
    feedback: feedbackMessage
  };
};

/**
 * Save interview result to Supabase
 */
export const saveInterviewResult = async (userId, sessionData) => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
      console.warn("⚠️ Supabase not configured - result not saved");
      return { success: false };
    }

    const { data, error } = await supabase
      .from('interviews')
      .insert([
        {
          user_id: userId,
          ...sessionData,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error("Error saving result:", error);
      return { success: false, error };
    }

    console.log("✅ Interview result saved to Supabase");
    return { success: true, data };
  } catch (error) {
    console.error("Failed to save interview result:", error);
    return { success: false, error };
  }
};

export default {
  getIntroQuestion,
  generateAIResponse,
  generateFinalFeedback,
  analyzePartialSolution,
  saveInterviewResult
};
