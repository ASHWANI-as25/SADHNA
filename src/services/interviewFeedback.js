/**
 * Real-Time Interview Feedback System
 * Provides live feedback during interview sessions
 */

export class InterviewFeedbackEngine {
  constructor() {
    this.feedbackHistory = [];
    this.sessionMetrics = {};
    this.communicationScore = 0;
  }

  /**
   * Analyze communication in real-time
   */
  analyzeCommunication(transcript, code, duration) {
    const metrics = {
      clarity: this.analyzeClarityScore(transcript),
      pace: this.analyzePaceScore(transcript, duration),
      vocabulary: this.analyzeVocabulary(transcript),
      structure: this.analyzeStructure(transcript),
      codeExplanation: this.analyzeCodeExplanation(transcript, code),
      confidenceLevel: this.detectConfidenceLevel(transcript)
    };

    const overallCommunication = Math.round(
      (metrics.clarity + metrics.pace + metrics.vocabulary + metrics.structure) / 4
    );

    this.communicationScore = overallCommunication;

    return {
      overallCommunication,
      ...metrics,
      feedback: this.generateCommunicationFeedback(metrics)
    };
  }

  /**
   * Analyze clarity score 0-100
   */
  analyzeClarityScore(transcript) {
    if (!transcript || transcript.length === 0) return 0;

    let score = 50; // baseline

    // Check for filler words
    const fillerWords = ['um', 'uh', 'uh...', 'hmm', 'like', 'basically', 'literally'];
    const fillerCount = (transcript.toLowerCase().match(/\b(um|uh|hmm|like|basically|literally)\b/g) || []).length;
    const fillerPenalty = Math.min(fillerCount * 2, 20); // -2 per filler, max -20
    score -= fillerPenalty;

    // Check for repetition
    const words = transcript.toLowerCase().split(/\s+/);
    const wordFreq = {};
    words.forEach(word => {
      if (word.length > 4) { // ignore small words
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const highlyRepeated = Object.values(wordFreq).filter(count => count > 5).length;
    score -= highlyRepeated * 3;

    // Check for complete sentences
    const sentences = transcript.match(/[.!?]+/g) || [];
    const sentenceRatio = sentences.length / Math.max(words.length / 10, 1);
    if (sentenceRatio > 0.1) score += 15;

    // Check for technical terms
    if (this.hasTechnicalTerms(transcript)) score += 10;

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Analyze pace score
   */
  analyzePaceScore(transcript, durationSeconds) {
    if (!transcript) return 50;

    const words = transcript.trim().split(/\s+/).length;
    const wordsPerMinute = (words / durationSeconds) * 60;

    // Ideal WPM is 120-150 for interviews
    let score = 75;

    if (wordsPerMinute < 80) score -= 15; // too slow
    if (wordsPerMinute > 200) score -= 10; // too fast
    if (wordsPerMinute >= 100 && wordsPerMinute <= 150) score += 25; // ideal range

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Analyze vocabulary richness
   */
  analyzeVocabulary(transcript) {
    if (!transcript) return 50;

    const words = transcript.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);

    const diversity = (uniqueWords.size / words.length) * 100;
    let score = 50;

    // Vocabulary diversity score
    if (diversity > 60) score += 30;
    else if (diversity > 50) score += 20;
    else if (diversity > 40) score += 10;
    else score -= 10;

    // Check for sophisticated vocabulary
    const sophisticatedWords = ['architecture', 'optimization', 'scalability', 'efficiency', 'implement', 'analysis', 'approach', 'solution', 'problem-solving'];
    const hasAdvanced = sophisticatedWords.filter(w => transcript.toLowerCase().includes(w)).length;
    score += hasAdvanced * 3;

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Analyze structure and organization
   */
  analyzeStructure(transcript) {
    if (!transcript) return 50;

    let score = 60;

    // Check for clear introduction
    if (transcript.toLowerCase().includes('approach') || 
        transcript.toLowerCase().includes('solution') ||
        transcript.toLowerCase().includes('let me explain')) {
      score += 15;
    }

    // Check for step-by-step explanation
    const stepIndicators = ['first', 'then', 'next', 'after', 'finally', 'step'];
    const stepsCount = stepIndicators.filter(s => transcript.toLowerCase().includes(s)).length;
    if (stepsCount > 2) score += 15;

    // Check for examples
    if (transcript.toLowerCase().includes('example') || 
        transcript.toLowerCase().includes('for instance')) {
      score += 10;
    }

    // Check for conclusion
    if (transcript.toLowerCase().includes('summary') || 
        transcript.toLowerCase().includes('conclude') ||
        transcript.toLowerCase().includes('time complexity')) {
      score += 10;
    }

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Analyze code explanation quality
   */
  analyzeCodeExplanation(transcript, code) {
    if (!transcript || !code) return 50;

    let score = 50;

    // Check if code elements are mentioned in explanation
    const codeElements = code.match(/\b[a-zA-Z_]\w*\b/g) || [];
    const uniqueCodeElements = new Set(codeElements);

    const mentionedElements = Array.from(uniqueCodeElements).filter(elem =>
      transcript.toLowerCase().includes(elem.toLowerCase())
    ).length;

    const mentionRatio = mentionedElements / uniqueCodeElements.size;
    score += mentionRatio * 30;

    // Check for complexity analysis
    if (transcript.toLowerCase().includes('time complexity') || 
        transcript.toLowerCase().includes('space complexity')) {
      score += 15;
    }

    // Check for edge cases mention
    if (transcript.toLowerCase().includes('edge case') || 
        transcript.toLowerCase().includes('corner case') ||
        transcript.toLowerCase().includes('null') ||
        transcript.toLowerCase().includes('empty')) {
      score += 10;
    }

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Detect confidence level
   */
  detectConfidenceLevel(transcript) {
    if (!transcript) return 'medium';

    const hesitationWordCount = (transcript.toLowerCase().match(/\b(i think|maybe|probably|i'm not sure|might|could)\b/g) || []).length;
    const assertiveWordCount = (transcript.toLowerCase().match(/\b(definitely|certainly|obviously|clearly|definitely|absolutely)\b/g) || []).length;

    if (assertiveWordCount > hesitationWordCount * 2) return 'high';
    if (hesitationWordCount > assertiveWordCount * 2) return 'low';
    return 'medium';
  }

  /**
   * Generate real-time feedback
   */
  generateCommunicationFeedback(metrics) {
    const feedback = [];

    if (metrics.clarity < 60) {
      feedback.push({
        type: 'warning',
        message: '📢 Try to speak more clearly. Reduce filler words like "um" and "uh".',
        priority: 'high'
      });
    }

    if (metrics.pace < 50) {
      feedback.push({
        type: 'tip',
        message: '⏱️ You\'re speaking slowly. Try to increase your pace slightly.',
        priority: 'medium'
      });
    }

    if (metrics.pace > 90) {
      feedback.push({
        type: 'tip',
        message: '⏱️ Slow down a bit. Give the interviewer time to follow your explanation.',
        priority: 'medium'
      });
    }

    if (metrics.vocabulary < 50) {
      feedback.push({
        type: 'suggestion',
        message: '📚 Use more varied vocabulary. You\'re repeating words frequently.',
        priority: 'low'
      });
    }

    if (metrics.structure < 60) {
      feedback.push({
        type: 'suggestion',
        message: '📐 Organize your explanation better: start with approach, then details.',
        priority: 'medium'
      });
    }

    if (metrics.codeExplanation < 60) {
      feedback.push({
        type: 'tip',
        message: '💻 Explain your code more thoroughly. Reference variable names and logic.',
        priority: 'high'
      });
    }

    if (metrics.confidenceLevel === 'low') {
      feedback.push({
        type: 'encouragement',
        message: '💪 Speak with more confidence! You know your solution.',
        priority: 'low'
      });
    }

    return feedback;
  }

  /**
   * Get real-time performance snapshot
   */
  getPerformanceSnapshot() {
    return {
      communicationScore: this.communicationScore,
      codeQuality: this.sessionMetrics.codeQuality || 0,
      timestamp: Date.now(),
      overallScore: Math.round((this.communicationScore + (this.sessionMetrics.codeQuality || 0)) / 2)
    };
  }

  /**
   * Provide next step suggestions
   */
  getNextStepSuggestions(currentPhase, codeQuality, communicationScore) {
    const suggestions = [];

    if (currentPhase === 'problem-understanding') {
      suggestions.push('Ask clarifying questions about constraints and requirements.');
      suggestions.push('Confirm your understanding by repeating the problem in your own words.');
    }

    if (currentPhase === 'approach-discussion') {
      suggestions.push('Explain your approach before diving into code.');
      suggestions.push('Discuss time and space complexity of your proposed solution.');
      suggestions.push('Consider mentioning alternative approaches.');
    }

    if (currentPhase === 'coding') {
      if (codeQuality < 60) {
        suggestions.push('Focus on writing clean, readable code.');
        suggestions.push('Add comments for complex logic.');
      }
      suggestions.push('Test edge cases as you code.');
      suggestions.push('Explain what you\'re doing as you type.');
    }

    if (currentPhase === 'testing') {
      suggestions.push('Test with various inputs: normal, edge cases, and large inputs.');
      suggestions.push('Walk through your code with test cases.');
      suggestions.push('Check for off-by-one errors and null handling.');
    }

    if (currentPhase === 'optimization') {
      if (codeQuality > 75) {
        suggestions.push('Discuss possible optimizations.');
        suggestions.push('Compare your solution\'s complexity with others.');
      }
    }

    return suggestions;
  }

  /**
   * Check if candidate needs intervention
   */
  needsIntervention(metrics) {
    const failurePoints = [];

    if (metrics.communicationScore < 30) failurePoints.push('Critical: Communication severely impacting score');
    if (metrics.codeQuality < 20) failurePoints.push('Critical: Code quality is very low');
    if (metrics.clarityScore < 40) failurePoints.push('Warning: Clarity is significantly low');

    return {
      needsHelp: failurePoints.length > 0,
      interventions: failurePoints
    };
  }

  /**
   * Generate comprehensive feedback report
   */
  generateFeedbackReport(session) {
    return {
      communicationScore: this.communicationScore,
      strengths: [
        ...(this.communicationScore > 70 ? ['Excellent communication skills'] : []),
        ...(session.codeQuality > 75 ? ['High-quality code'] : []),
        ...(session.completeness > 90 ? ['Complete solution'] : [])
      ],
      improvements: [
        ...(this.communicationScore < 60 ? ['Work on clarity and pace'] : []),
        ...(session.codeQuality < 70 ? ['Refactor for better readability'] : []),
        ...(session.completeness < 80 ? ['Ensure all edge cases are handled'] : [])
      ],
      nextSteps: [
        'Practice explaining solutions out loud',
        'Record yourself and listen for filler words',
        'Study complex data structures and algorithms',
        'Work on time management during coding'
      ]
    };
  }

  /**
   * Helper: Check for technical terms
   */
  hasTechnicalTerms(transcript) {
    const technicalTerms = ['algorithm', 'data structure', 'complexity', 'optimization', 'recursion', 'dynamic programming', 'binary', 'sort', 'hash'];
    return technicalTerms.some(term => transcript.toLowerCase().includes(term));
  }
}

export const createInterviewFeedbackEngine = () => new InterviewFeedbackEngine();

export default {
  InterviewFeedbackEngine,
  createInterviewFeedbackEngine
};
