import { motion } from 'framer-motion';
import { Share2, Download, RotateCcw, Trophy, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { formatScore, getPerformanceBadge, calculateRanking } from '../services/assessmentService';
import { useAssessment } from '../context/AssessmentContext';

const AssessmentResults = ({ results, onRetry }) => {
  const { leaderboard } = useAssessment();

  if (!results) {
    return (
      <div className="results-container glass-card">
        <p>Loading results...</p>
      </div>
    );
  }

  // Ensure results has required properties
  if (results.totalScore === null || results.totalScore === undefined || results.maxScore === null || results.maxScore === undefined) {
    console.error('Invalid results data:', results);
    return (
      <div className="results-container glass-card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '2rem'}}>
        <div style={{textAlign: 'center'}}>
          <h2 style={{color: '#ef4444', marginBottom: '1rem'}}>❌ Error Loading Results</h2>
          <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '2rem'}}>Unable to load scorecard. Please try again.</p>
        </div>
        <button onClick={onRetry} className="btn-primary glow-blue" style={{padding: '0.8rem 2rem'}}>
          <RotateCcw size={20} />
          Try Again
        </button>
      </div>
    );
  }

  const badge = getPerformanceBadge(results.totalScore || 0, results.maxScore || 1);
  const ranking = calculateRanking(results.totalScore || 0, leaderboard || []);
  const scorePercentage = results.maxScore ? (results.totalScore / results.maxScore) * 100 : 0;

  // Find user in leaderboard
  const userPosition = leaderboard && leaderboard.length > 0 ? leaderboard.findIndex(
    (entry) => entry.name === 'Current User'
  ) + 1 : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="results-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Score Card */}
      <motion.div className="glass-card score-card" variants={itemVariants}>
        <div className="score-display">
          <motion.div
            className="score-circle"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <span className="score-value">{results.totalScore || 0}</span>
            <span className="score-max">/{results.maxScore || 0}</span>
          </motion.div>

          <div className="score-info">
            <h1 className="text-gradient">{badge.level}</h1>
            <p className="score-percentage">{formatScore(results.totalScore, results.maxScore)}</p>
            <p className="score-accuracy">
              Accuracy: <strong>{(results.accuracy || 0).toFixed(1)}%</strong>
            </p>
          </div>
        </div>

        <div className="score-breakdown">
          <div className="breakdown-item correct-item">
            <Target size={24} />
            <div>
              <span className="label">Correct</span>
              <span className="value">{results.correct || 0}</span>
            </div>
          </div>
          <div className="breakdown-item wrong-item">
            <TrendingUp size={24} />
            <div>
              <span className="label">Wrong</span>
              <span className="value">{results.wrong || 0}</span>
            </div>
          </div>
          <div className="breakdown-item skipped-item">
            <BarChart3 size={24} />
            <div>
              <span className="label">Skipped</span>
              <span className="value">{results.skipped || 0}</span>
            </div>
          </div>
        </div>

        {/* Difficulty-Weighted Progress Section */}
        <div className="weighted-progress-section">
          <div className="progress-header">
            <h3>Overall Progress (Difficulty Adjusted)</h3>
          </div>
          <div className="progress-metrics">
            <div className="metric-row">
              <span className="metric-label">Test Score:</span>
              <span className="metric-value">
                {results.weightedProgress?.rawScore?.toFixed(1) || formatScore(results.totalScore, results.maxScore)}%
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Difficulty:</span>
              <span className="metric-value badge-difficulty">
                {results.difficulty}
                <span className="weight-label">(×{results.weightedProgress?.weight || 1})</span>
              </span>
            </div>
            <div className="metric-row total-progress">
              <span className="metric-label">Overall Progress:</span>
              <span className="metric-value highlight">
                {results.weightedProgress?.overallProgress?.toFixed(1) || formatScore(results.totalScore, results.maxScore)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Analysis */}
      <div className="results-grid">
        {/* Strengths */}
        <motion.div className="glass-card analysis-card" variants={itemVariants}>
          <h2 className="card-title">💪 Strengths</h2>
          <ul className="analysis-list">
            {results.strengths && results.strengths.length > 0 ? (
              results.strengths.map((strength, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="analysis-item"
                >
                  <span className="badge-success">✓</span>
                  {strength}
                </motion.li>
              ))
            ) : (
              <li className="analysis-item">Keep improving!</li>
            )}
          </ul>
        </motion.div>

        {/* Weaknesses */}
        <motion.div className="glass-card analysis-card" variants={itemVariants}>
          <h2 className="card-title">🎯 Areas for Improvement</h2>
          <ul className="analysis-list">
            {results.weaknesses && results.weaknesses.length > 0 ? (
              results.weaknesses.map((weakness, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="analysis-item"
                >
                  <span className="badge-warning">!</span>
                  {weakness}
                </motion.li>
              ))
            ) : (
              <li className="analysis-item">Excellent performance!</li>
            )}
          </ul>
        </motion.div>

        {/* Improvement Tips */}
        <motion.div className="glass-card analysis-card full-width" variants={itemVariants}>
          <h2 className="card-title">📚 Recommendations</h2>
          <ul className="analysis-list">
            {results.improvementTips && results.improvementTips.length > 0 ? (
              results.improvementTips.map((tip, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="analysis-item"
                >
                  <span className="badge-info">{idx + 1}</span>
                  {tip}
                </motion.li>
              ))
            ) : (
              <li className="analysis-item">Continue practicing!</li>
            )}
          </ul>
        </motion.div>
      </div>

      {/* Leaderboard */}
      <motion.div className="glass-card leaderboard-card" variants={itemVariants}>
        <div className="leaderboard-header">
          <h2 className="card-title">
            <Trophy size={24} />
            Leaderboard
          </h2>
          <div className="ranking-info">
            <div className="ranking-item">
              <span className="label">Your Rank</span>
              <span className="value">#{userPosition}</span>
            </div>
            <div className="ranking-item">
              <span className="label">Percentile</span>
              <span className="value">{ranking.percentile}%</span>
            </div>
            <div className="ranking-item">
              <span className="label">Level</span>
              <span className="value">{ranking.performance}</span>
            </div>
          </div>
        </div>

        <div className="leaderboard-table">
          <div className="table-header">
            <div className="col-rank">Rank</div>
            <div className="col-name">Name</div>
            <div className="col-score">Score</div>
            <div className="col-accuracy">Accuracy</div>
          </div>

          {(leaderboard || []).map((entry, idx) => (
            <motion.div
              key={idx}
              className={`table-row ${entry?.name === 'Current User' ? 'highlight' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <div className="col-rank">
                {idx === 0 && '🥇'}
                {idx === 1 && '🥈'}
                {idx === 2 && '🥉'}
                {idx > 2 && `#${idx + 1}`}
              </div>
              <div className="col-name">{entry?.name || 'N/A'}</div>
              <div className="col-score">
                {entry?.totalScore || 0}/{entry?.maxScore || 0}
              </div>
              <div className="col-accuracy">{(entry?.accuracy || 0).toFixed(1)}%</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Test Details */}
      <motion.div className="glass-card test-details" variants={itemVariants}>
        <h3>Test Details</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Category:</span>
            <span className="value">{results.category || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Field:</span>
            <span className="value">{results.field || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Difficulty:</span>
            <span className="value">{results.difficulty || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="label">Attempted:</span>
            <span className="value">{(results.attempted || 0)} / {(results.attempted || 0) + (results.skipped || 0)}</span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div className="action-buttons-group" variants={itemVariants}>
        <button
          onClick={() => {
            // Generate PDF or share report
            alert('Report sharing feature coming soon!');
          }}
          className="btn-secondary glow-purple"
        >
          <Share2 size={20} />
          Share Report
        </button>

        <button
          onClick={() => {
            // Download as PDF
            alert('Download feature coming soon!');
          }}
          className="btn-secondary glow-cyan"
        >
          <Download size={20} />
          Download Report
        </button>

        <button onClick={onRetry} className="btn-primary glow-blue">
          <RotateCcw size={20} />
          Retry Assessment
        </button>
      </motion.div>

      {/* Performance Meter */}
      <motion.div className="glass-card performance-meter" variants={itemVariants}>
        <h3>Performance Breakdown by Type</h3>
        {results.byType &&
          Object.entries(results.byType).map(([type, stats]) => {
            const accuracy = (stats.correct / stats.total) * 100;
            return (
              <div key={type} className="meter-item">
                <span className="meter-label">{type}</span>
                <div className="meter-bar">
                  <motion.div
                    className="meter-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${accuracy}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                      background: accuracy >= 80 ? '#10b981' : accuracy >= 60 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <span className="meter-value">{accuracy.toFixed(1)}%</span>
              </div>
            );
          })}
      </motion.div>
    </motion.div>
  );
};

export default AssessmentResults;
