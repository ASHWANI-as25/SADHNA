/**
 * Enhanced Proctoring System
 * Monitors suspicious activities during interviews
 */

export class ProctorMonitor {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.suspiciousActivities = [];
    this.warnings = 0;
    this.tabSwitches = 0;
    this.isVisible = true;
    this.lastInteractionTime = Date.now();
    this.isInterviewActive = false;

    this.initializeMonitoring();
  }

  initializeMonitoring() {
    // Tab visibility detection
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    
    // Focus detection
    window.addEventListener('focus', () => this.handleWindowFocus());
    window.addEventListener('blur', () => this.handleWindowBlur());
    
    // Activity tracking
    document.addEventListener('keydown', () => this.recordActivity());
    document.addEventListener('mousemove', () => this.recordActivity());
    document.addEventListener('click', () => this.recordActivity());
    
    // Right-click detection
    document.addEventListener('contextmenu', (e) => this.handleRightClick(e));
    
    // Copy/paste detection
    document.addEventListener('copy', (e) => this.handleCopy(e));
    document.addEventListener('paste', (e) => this.handlePaste(e));
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.tabSwitches++;
      this.isVisible = false;
      this.logActivity('TAB_SWITCH', 'User switched to another tab');
      
      if (this.tabSwitches >= 3) {
        this.addWarning('EXCESSIVE_TAB_SWITCHING', 'Excessive tab switching detected', 'high');
      }
    } else {
      this.isVisible = true;
    }
  }

  handleWindowFocus() {
    this.recordActivity();
  }

  handleWindowBlur() {
    this.logActivity('WINDOW_BLUR', 'Interview window lost focus');
  }

  handleRightClick(e) {
    // Allow right-click but log it
    this.logActivity('RIGHT_CLICK', 'Right-click detected');
  }

  handleCopy(e) {
    const selectedText = window.getSelection().toString();
    if (selectedText && selectedText.length > 50) {
      this.logActivity('BULK_COPY', `Copied ${selectedText.length} characters`);
      this.addWarning('CODE_COPY', 'Large code copy detected', 'medium');
    }
  }

  handlePaste(e) {
    this.logActivity('PASTE', 'Paste event detected');
    this.addWarning('CODE_PASTE', 'Paste detected - ensure you\'re not using external solutions', 'medium');
  }

  recordActivity() {
    this.lastInteractionTime = Date.now();
  }

  logActivity(type, description) {
    this.suspiciousActivities.push({
      type,
      description,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    });
  }

  addWarning(type, description, severity = 'medium') {
    this.warnings++;
    this.suspiciousActivities.push({
      type: 'WARNING',
      warningType: type,
      description,
      severity,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    });

    // Trigger notification
    this.showWarningNotification(description);
  }

  showWarningNotification(message) {
    // Could integrate with toast notification system
    console.warn('🚨 Proctoring Warning:', message);
  }

  /**
   * Check for inactivity
   */
  checkInactivity(inactivityTimeout = 300000) { // 5 minutes default
    const timeSinceLastActivity = Date.now() - this.lastInteractionTime;
    
    if (timeSinceLastActivity > inactivityTimeout && this.isInterviewActive) {
      this.addWarning('INACTIVITY', 'No activity detected for 5 minutes', 'high');
      return true;
    }
    
    return false;
  }

  /**
   * Detect if multiple monitors
   */
  detectMultipleMonitors() {
    // Browser doesn't provide direct multiple monitor detection
    // But we can check screen dimensions
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const outerWidth = window.outerWidth;
    const outerHeight = window.outerHeight;

    const suspiciousWidth = screenWidth > 2560; // Common multi-monitor setup
    
    if (suspiciousWidth) {
      this.logActivity('MULTIPLE_MONITORS', 'Suspiciously wide screen detected');
      return true;
    }

    return false;
  }

  /**
   * Get proctoring report
   */
  generateReport() {
    const report = {
      sessionId: this.sessionId,
      totalWarnings: this.warnings,
      tabSwitches: this.tabSwitches,
      suspiciousActivities: this.suspiciousActivities,
      riskLevel: this.calculateRiskLevel(),
      recommendations: this.generateRecommendations(),
      generatedAt: new Date().toISOString()
    };

    return report;
  }

  calculateRiskLevel() {
    let score = 0;

    // Tab switches
    score += this.tabSwitches * 10;

    // Warnings count
    score += this.warnings * 20;

    // Suspicious activities
    const highRiskActivities = this.suspiciousActivities.filter(
      a => a.severity === 'high'
    ).length;
    score += highRiskActivities * 30;

    // Convert to risk level
    if (score >= 100) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.tabSwitches >= 3) {
      recommendations.push('Minimize tab switching - keep focused on the interview');
    }

    if (this.suspiciousActivities.some(a => a.type === 'CODE_COPY')) {
      recommendations.push('Avoid copying code externally - write your own solution');
    }

    if (this.suspiciousActivities.some(a => a.type === 'MULTIPLE_MONITORS')) {
      recommendations.push('Use a single monitor for fair interview conditions');
    }

    if (this.warnings >= 5) {
      recommendations.push('Multiple warnings detected - ensure you follow interview guidelines');
    }

    return recommendations;
  }

  /**
   * Start monitoring
   */
  startMonitoring() {
    this.isInterviewActive = true;
    this.lastInteractionTime = Date.now();
    this.logActivity('INTERVIEW_STARTED', 'Interview session started');
    this.detectMultipleMonitors();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    this.isInterviewActive = false;
    this.logActivity('INTERVIEW_ENDED', 'Interview session ended');
  }

  /**
   * Check if user is paying attention (simple attention scoring)
   */
  getAttentionScore() {
    const baseScore = 100;
    let score = baseScore;

    // Deduct for tab switches
    score -= this.tabSwitches * 5;

    // Deduct for inactivity
    const timeSinceLastActivity = Date.now() - this.lastInteractionTime;
    if (timeSinceLastActivity > 60000) { // 1 minute
      score -= 10;
    }

    // Deduct for window blur
    if (!this.isVisible) {
      score -= 20;
    }

    return Math.max(0, Math.min(100, score));
  }
}

/**
 * Enhanced proctoring alerts
 */
export const createProctoringAlert = (type, severity = 'warning') => {
  const alerts = {
    TAB_SWITCH: {
      icon: '⚠️',
      message: 'Please stay on this window',
      action: null
    },
    EXCESSIVE_TAB_SWITCHING: {
      icon: '⛔',
      message: 'Multiple tab switches detected. This may impact your score.',
      action: 'acknowledged'
    },
    CODE_COPY: {
      icon: '🚨',
      message: 'Copying code is not allowed during the interview',
      action: 'stop'
    },
    CODE_PASTE: {
      icon: '⚠️',
      message: 'Please write your own solution instead of pasting code',
      action: 'stop'
    },
    INACTIVITY: {
      icon: '😴',
      message: 'No activity detected. Are you still there?',
      action: 'acknowledge'
    },
    MULTIPLE_MONITORS: {
      icon: '🖥️',
      message: 'Multiple monitors detected. Use a single screen for fairness.',
      action: 'acknowledge'
    }
  };

  return alerts[type] || {
    icon: 'ℹ️',
    message: 'Interview continues...',
    action: null
  };
};

/**
 * Get proctoring status summary
 */
export const getProctoringStatus = (proctoringReport) => {
  const { riskLevel, totalWarnings, tabSwitches } = proctoringReport;

  const statusMap = {
    'LOW': { color: '🟢', message: 'Interview proceeding normally' },
    'MEDIUM': { color: '🟡', message: 'Some warnings detected' },
    'HIGH': { color: '🔴', message: 'Multiple violations detected' },
    'CRITICAL': { color: '🚨', message: 'Critical violations - may affect score' }
  };

  return {
    ...statusMap[riskLevel],
    details: `Warnings: ${totalWarnings} | Tab Switches: ${tabSwitches}`,
    riskLevel
  };
};

export default {
  ProctorMonitor,
  createProctoringAlert,
  getProctoringStatus
};
