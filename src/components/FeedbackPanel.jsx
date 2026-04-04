import React, { useState, useEffect } from 'react';
import { createInterviewFeedbackEngine } from '../services/interviewFeedback';
import './feedback-panel.css';

const FeedbackPanel = ({ transcript, code, duration, currentPhase }) => {
  const [feedbackEngine] = useState(createInterviewFeedbackEngine());
  const [feedback, setFeedback] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [communicationMetrics, setCommunicationMetrics] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    if (transcript && transcript.length > 0 && duration > 0) {
      updateFeedback();
    }
  }, [transcript, duration]);

  useEffect(() => {
    if (currentPhase) {
      const nextSuggestions = feedbackEngine.getNextStepSuggestions(
        currentPhase,
        communicationMetrics?.communicationScore || 50,
        communicationMetrics?.communicationScore || 50
      );
      setSuggestions(nextSuggestions);
    }
  }, [currentPhase]);

  const updateFeedback = () => {
    const analysis = feedbackEngine.analyzeCommunication(transcript, code, duration);
    setCommunicationMetrics(analysis);
    setFeedback(analysis.feedback);
    setUpdateCount(updateCount + 1);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  };

  const getMetricIcon = (metric) => {
    switch (metric) {
      case 'clarity':
        return '📢';
      case 'pace':
        return '⏱️';
      case 'vocabulary':
        return '📚';
      case 'structure':
        return '📐';
      case 'codeExplanation':
        return '💻';
      case 'confidenceLevel':
        return '💪';
      default:
        return '📊';
    }
  };

  const getMetricLabel = (metric) => {
    const labels = {
      clarity: 'Clarity',
      pace: 'Pace',
      vocabulary: 'Vocabulary',
      structure: 'Structure',
      codeExplanation: 'Code Explanation',
      confidenceLevel: 'Confidence'
    };
    return labels[metric] || metric;
  };

  return (
    <div className="feedback-panel glass-card">
      <div className="feedback-header">
        <h3>📊 Real-Time Feedback</h3>
        <div className="feedback-timestamp">
          Update #{updateCount}
        </div>
      </div>

      {communicationMetrics ? (
        <>
          {/* Overall Score */}
          <div className="communication-score-card">
            <div className="score-display">
              <div className={`score-number ${getScoreColor(communicationMetrics.overallCommunication)}`}>
                {communicationMetrics.overallCommunication}
              </div>
              <div className="score-label">Communication Score</div>
            </div>
            <div className="score-gauge">
              <div
                className="gauge-fill"
                style={{
                  width: `${communicationMetrics.overallCommunication}%`
                }}
              ></div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            {Object.entries(communicationMetrics)
              .filter(([key]) => !['overallCommunication', 'feedback', 'confidence'].includes(key))
              .map(([key, value]) => (
                <div key={key} className={`metric-card ${getScoreColor(value)}`}>
                  <div className="metric-icon">{getMetricIcon(key)}</div>
                  <div className="metric-label">{getMetricLabel(key)}</div>
                  <div className="metric-value">{typeof value === 'number' ? value : 'N/A'}</div>
                  <div className="metric-bar">
                    <div
                      className="bar-fill"
                      style={{ width: `${typeof value === 'number' ? value : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>

          {/* Confidence Level */}
          <div className="confidence-indicator">
            <span className="confidence-label">Speaking Confidence:</span>
            <span
              className={`confidence-badge ${communicationMetrics.confidenceLevel.toLowerCase()}`}
            >
              {communicationMetrics.confidenceLevel.toUpperCase()}
            </span>
          </div>

          {/* Live Feedback */}
          {feedback && feedback.length > 0 && (
            <div className="feedback-items">
              <h4>💬 Live Suggestions</h4>
              <div className="feedback-list">
                {feedback.map((item, index) => (
                  <div key={index} className={`feedback-item ${item.type}`}>
                    <div className="feedback-priority">
                      <span className={`priority-badge ${item.priority}`}>
                        {item.priority.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="feedback-content">
                      <p>{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          {suggestions && suggestions.length > 0 && (
            <div className="next-steps">
              <h4>🎯 Next Steps for {currentPhase?.replace('-', ' ')}</h4>
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="feedback-placeholder">
          <p>Start speaking to get real-time feedback...</p>
          <small>We analyze your communication, pace, clarity, and code explanation</small>
        </div>
      )}

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat">
          <span className="stat-label">Words Spoken:</span>
          <span className="stat-value">
            {transcript ? transcript.split(/\s+/).length : 0}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Duration:</span>
          <span className="stat-value">{duration}s</span>
        </div>
        {transcript && duration > 0 && (
          <div className="stat">
            <span className="stat-label">WPM:</span>
            <span className="stat-value">
              {Math.round((transcript.split(/\s+/).length / duration) * 60)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPanel;
