/**
 * Interview Playback & Review System
 * Allows users to watch and review their interview recordings
 */

export class InterviewPlaybackManager {
  constructor(sessionData) {
    this.sessionData = sessionData;
    this.currentTime = 0;
    this.isPlaying = false;
    this.playbackSpeed = 1;
    this.transcript = sessionData.transcript || [];
    this.codeSnapshots = sessionData.codeSnapshots || [];
    this.metrics = sessionData.metrics || {};
  }

  /**
   * Get transcript with timestamps
   */
  getTranscriptWithTimestamps() {
    return this.transcript.map(entry => ({
      ...entry,
      speaker: entry.speaker, // 'interviewer' or 'candidate'
      text: entry.text,
      timestamp: entry.timestamp,
      timeFormatted: this.formatTime(entry.timestamp)
    }));
  }

  /**
   * Get code at specific time
   */
  getCodeAtTime(timestamp) {
    // Find the last code snapshot before or at this timestamp
    const snapshot = this.codeSnapshots
      .filter(s => s.timestamp <= timestamp)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    return snapshot ? {
      code: snapshot.code,
      language: snapshot.language,
      timestamp: snapshot.timestamp,
      timeFormatted: this.formatTime(snapshot.timestamp)
    } : null;
  }

  /**
   * Get all code snapshots with timeline
   */
  getCodeTimeline() {
    return this.codeSnapshots.map(snapshot => ({
      ...snapshot,
      timeFormatted: this.formatTime(snapshot.timestamp)
    }));
  }

  /**
   * Get performance metrics at time
   */
  getMetricsAtTime(timestamp) {
    if (!this.metrics.timeline) return null;

    const metricsAtTime = this.metrics.timeline
      .filter(m => m.timestamp <= timestamp)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    return metricsAtTime || null;
  }

  /**
   * Format time in MM:SS format
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Get transcript segments
   */
  getTranscriptSegments(startTime, endTime) {
    return this.transcript.filter(
      entry => entry.timestamp >= startTime && entry.timestamp <= endTime
    );
  }

  /**
   * Get interview analysis
   */
  getInterviewAnalysis() {
    const analysis = {
      totalDuration: this.sessionData.duration || 0,
      candidateSpeakingTime: this.calculateSpeakingTime('candidate'),
      interviewerSpeakingTime: this.calculateSpeakingTime('interviewer'),
      questionCount: this.getQuestionCount(),
      codeChanges: this.codeSnapshots.length,
      averageCodeQuality: this.calculateAverageCodeQuality(),
      keyMoments: this.identifyKeyMoments()
    };

    return analysis;
  }

  calculateSpeakingTime(speaker) {
    let totalTime = 0;

    for (let i = 0; i < this.transcript.length; i++) {
      if (this.transcript[i].speaker === speaker) {
        const currentEntry = this.transcript[i];
        const nextEntry = this.transcript[i + 1];
        
        if (nextEntry) {
          totalTime += (nextEntry.timestamp - currentEntry.timestamp);
        }
      }
    }

    return totalTime;
  }

  getQuestionCount() {
    return this.transcript.filter(
      entry => entry.speaker === 'interviewer' && entry.text.includes('?')
    ).length;
  }

  calculateAverageCodeQuality() {
    if (this.codeSnapshots.length === 0) return 0;

    const totalQuality = this.codeSnapshots.reduce(
      (sum, snapshot) => sum + (snapshot.quality || 0),
      0
    );

    return Math.round(totalQuality / this.codeSnapshots.length);
  }

  identifyKeyMoments() {
    const moments = [];

    // First question
    const firstQuestion = this.transcript.find(e => e.speaker === 'interviewer');
    if (firstQuestion) {
      moments.push({
        timestamp: firstQuestion.timestamp,
        type: 'QUESTION_START',
        description: 'Interview started',
        importance: 'high'
      });
    }

    // Code quality peaks
    const peakQuality = Math.max(...this.codeSnapshots.map(s => s.quality || 0));
    const qualityPeaks = this.codeSnapshots.filter(s => s.quality === peakQuality);
    qualityPeaks.slice(0, 3).forEach(peak => {
      moments.push({
        timestamp: peak.timestamp,
        type: 'CODE_QUALITY_PEAK',
        description: 'High quality code moment',
        importance: 'medium'
      });
    });

    // Candidate struggles (long pauses)
    for (let i = 0; i < this.transcript.length; i++) {
      const current = this.transcript[i];
      const next = this.transcript[i + 1];
      
      if (next && (next.timestamp - current.timestamp) > 30) { // 30+ second gap
        moments.push({
          timestamp: current.timestamp,
          type: 'STRUGGLE_MOMENT',
          description: 'Candidate took time to respond',
          importance: 'low'
        });
      }
    }

    return moments.sort((a, b) => b.importance.localeCompare(a.importance));
  }

  /**
   * Get review summary
   */
  getReviewSummary() {
    const analysis = this.getInterviewAnalysis();

    return {
      duration: `${this.formatTime(analysis.totalDuration)}`,
      candidateSpeakingPercentage: Math.round(
        (analysis.candidateSpeakingTime / analysis.totalDuration) * 100
      ),
      questionsAsked: analysis.questionCount,
      codeIterations: analysis.codeChanges,
      avgCodeQuality: analysis.averageCodeQuality,
      score: this.sessionData.score || 0,
      feedback: this.sessionData.feedback,
      keyHighlights: this._generateHighlights(analysis)
    };
  }

  _generateHighlights(analysis) {
    const highlights = [];

    if (analysis.candidateSpeakingPercentage > 70) {
      highlights.push('✅ Good communication - talked most of the time');
    }

    if (analysis.averageCodeQuality >= 75) {
      highlights.push('✅ High code quality maintained throughout');
    }

    if (analysis.codeChanges > 5) {
      highlights.push('✅ Multiple approaches explored - shows flexibility');
    }

    if (analysis.candidateSpeakingPercentage < 30) {
      highlights.push('⚠️ Low communication - could explain more');
    }

    if (analysis.averageCodeQuality < 50) {
      highlights.push('⚠️ Code quality needs improvement');
    }

    return highlights;
  }

  /**
   * Export transcript as text
   */
  exportTranscript() {
    let text = `Interview Transcript - ${this.sessionData.date}\n`;
    text += `Duration: ${this.formatTime(this.sessionData.duration || 0)}\n`;
    text += '='.repeat(50) + '\n\n';

    this.transcript.forEach(entry => {
      const speaker = entry.speaker === 'candidate' ? '👤 Candidate' : '👨‍💼 Interviewer';
      text += `[${this.formatTime(entry.timestamp)}] ${speaker}:\n${entry.text}\n\n`;
    });

    return text;
  }

  /**
   * Compare with previous interviews
   */
  compareWithPrevious(previousSession) {
    if (!previousSession) return null;

    const previous = previousSession instanceof InterviewPlaybackManager 
      ? previousSession.getInterviewAnalysis()
      : previousSession;

    const current = this.getInterviewAnalysis();

    return {
      scoreChange: (this.sessionData.score || 0) - (previous.score || 0),
      speedChange: current.totalDuration - (previous.totalDuration || 0),
      codeQualityChange: current.averageCodeQuality - (previous.averageCodeQuality || 0),
      communicationChange: current.candidateSpeakingTime - (previous.candidateSpeakingTime || 0),
      improvements: this._identifyImprovements(previous, current)
    };
  }

  _identifyImprovements(previous, current) {
    const improvements = [];

    if (current.averageCodeQuality > previous.averageCodeQuality) {
      improvements.push('📈 Code quality improved');
    }

    if (current.totalDuration < previous.totalDuration && current.averageCodeQuality >= previous.averageCodeQuality) {
      improvements.push('⚡ Solved faster without quality compromise');
    }

    if (current.candidateSpeakingTime > previous.candidateSpeakingTime) {
      improvements.push('🗣️ Better communication');
    }

    return improvements;
  }
}

/**
 * Create playback session from interview data
 */
export const createPlaybackSession = (interviewData) => {
  return new InterviewPlaybackManager(interviewData);
};

/**
 * Generate review suggestions
 */
export const generateReviewSuggestions = (playbackManager) => {
  const analysis = playbackManager.getInterviewAnalysis();
  const suggestions = [];

  const speakingPercentage = (analysis.candidateSpeakingTime / analysis.totalDuration) * 100 || 0;

  if (speakingPercentage < 40) {
    suggestions.push({
      area: 'Communication',
      suggestion: 'Try to speak more during interviews - explain your thought process',
      priority: 'high'
    });
  }

  if (analysis.codeChanges < 2) {
    suggestions.push({
      area: 'Problem-Solving',
      suggestion: 'Refactor or improve your solution after getting it to work',
      priority: 'medium'
    });
  }

  if (analysis.averageCodeQuality < 60) {
    suggestions.push({
      area: 'Code Quality',
      suggestion: 'Focus on writing cleaner, more readable code',
      priority: 'high'
    });
  }

  return suggestions;
};

export default {
  InterviewPlaybackManager,
  createPlaybackSession,
  generateReviewSuggestions
};
