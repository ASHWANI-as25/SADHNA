import React, { useState, useEffect } from 'react';
import { SmartHintsManager } from '../services/smartHintsService';
import './hints-panel.css';

const HintsPanel = ({ code, difficulty, problemId, problemType }) => {
  const [hintsManager] = useState(new SmartHintsManager());
  const [currentHints, setCurrentHints] = useState([]);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [hintLevel, setHintLevel] = useState(0);
  const [codeStatus, setCodeStatus] = useState(null);

  useEffect(() => {
    if (code && code.length > 0) {
      analyzeCode();
    }
  }, [code]);

  const analyzeCode = () => {
    const expectedPatterns = getExpectedPatterns(problemType);
    if (expectedPatterns.length > 0) {
      const status = hintsManager.isCodeOnTrack(code, expectedPatterns);
      setCodeStatus(status);
    }
  };

  const getExpectedPatterns = (type) => {
    const patterns = {
      'two-sum': ['for', 'map', 'Set', 'indexOf', 'includes'],
      'array-manipulation': ['splice', 'slice', 'push', 'pop', 'shift'],
      'string-problem': ['split', 'join', 'substring', 'charAt', 'replace'],
      'tree-traversal': ['left', 'right', 'node', 'queue', 'stack'],
      'dynamic-programming': ['dp', 'memo', 'cache', 'bottom', 'recurrence']
    };
    return patterns[type] || [];
  };

  const handleGetHint = () => {
    if (hintsRemaining > 0) {
      const hint = hintsManager.getHint(code, difficulty, problemId, hintLevel);
      setCurrentHints([...currentHints, hint]);
      setHintsRemaining(hint.hintsRemaining);
      setHintLevel(hintLevel + 1);
    }
  };

  const handleFocusedHint = () => {
    if (hintsRemaining > 0 && problemType) {
      const hint = hintsManager.getFocusedHint(problemType, difficulty, hintLevel);
      setCurrentHints([...currentHints, { hint, level: 'focused', isAvailable: true }]);
      setHintsRemaining(hintsRemaining - 1);
      setHintLevel(hintLevel + 1);
    }
  };

  const handleGetOverview = () => {
    const overview = hintsManager.getSolutionOverview(problemType);
    setCurrentHints([...currentHints, { hint: overview, level: 'overview', isAvailable: true }]);
  };

  const getRiskIndicator = () => {
    if (!codeStatus) return null;
    if (codeStatus.matchPercentage >= 75) return '✅ Great!';
    if (codeStatus.matchPercentage >= 50) return '🟡 On track';
    return '❌ Not quite';
  };

  return (
    <div className="hints-panel glass-card">
      <div className="hints-header">
        <h3>💡 Hints & Guidance</h3>
        <div className="hints-badge">
          {hintsRemaining} / 3 remaining
        </div>
      </div>

      {codeStatus && (
        <div className={`code-status ${codeStatus.onTrack ? 'on-track' : 'off-track'}`}>
          <div className="status-indicator">{getRiskIndicator()}</div>
          <div className="status-message">{codeStatus.message}</div>
          <div className="status-bar">
            <div
              className="status-fill"
              style={{ width: `${codeStatus.matchPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="hints-controls">
        <button
          className="hint-btn primary"
          onClick={handleGetHint}
          disabled={hintsRemaining === 0}
          title={hintsRemaining === 0 ? 'No hints remaining' : 'Get an AI-generated hint'}
        >
          {hintsRemaining === 0 ? '❌ No Hints' : '💡 Get Hint'}
        </button>
        {problemType && (
          <button
            className="hint-btn secondary"
            onClick={handleFocusedHint}
            disabled={hintsRemaining === 0}
            title="Get a hint specific to this problem type"
          >
            {hintsRemaining === 0 ? '❌ Focused' : '🎯 Focused'}
          </button>
        )}
        <button
          className="hint-btn tertiary"
          onClick={handleGetOverview}
          title="Get a solution approach overview (non-spoiling)"
        >
          📋 Overview
        </button>
      </div>

      <div className="hints-content">
        {currentHints.length === 0 ? (
          <div className="empty-hints">
            <p>👈 Click a button to get started</p>
            <small>You have {hintsRemaining} hints available</small>
          </div>
        ) : (
          <div className="hints-list">
            {currentHints.map((item, index) => (
              <div key={index} className={`hint-item level-${item.level}`}>
                <div className="hint-number">Hint {index + 1}</div>
                <div className="hint-text">{item.hint}</div>
                {item.level === 'overview' && (
                  <small className="hint-note">This is a general approach, not the solution!</small>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hints-tips">
        <div className="tip">
          <span className="tip-icon">💭</span>
          <span>Progressive hints get more specific with each level</span>
        </div>
        <div className="tip">
          <span className="tip-icon">🔍</span>
          <span>Analyze your code to understand what you're missing</span>
        </div>
        <div className="tip">
          <span className="tip-icon">⏰</span>
          <span>Using hints doesn't penalize your score</span>
        </div>
      </div>
    </div>
  );
};

export default HintsPanel;
