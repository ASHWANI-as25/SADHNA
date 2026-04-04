import React from 'react';
import { Zap, TrendingUp, Brain } from 'lucide-react';
import '../styles/premium-dashboard.css';

/**
 * Premium Dashboard
 * World-class UI/UX for SADHNA - StreakMaster
 * 
 * Philosophy:
 * - Apple's minimalism meets SpaceX's futurism
 * - Every element intentional, zero clutter
 * - Calm, focused, intelligent aesthetic
 */

const PremiumDashboard = () => {
  return (
    <div className="hero-section">
      {/* Hero Header */}
      <div className="hero-header">
        <h1>Welcome back</h1>
        <p>
          Stay focused. Build momentum. Transform your habits into lasting change.
        </p>
      </div>

      {/* Streak Display - Hero Element */}
      <div className="streak-display">
        {/* Streak Counter */}
        <div className="streak-counter-box">
          <div className="streak-number">12</div>
          <div className="streak-label">Day Streak</div>

          {/* Info Stats */}
          <div className="streak-info" style={{ marginTop: '24px' }}>
            <div className="info-stat">
              <div className="info-stat-value">87%</div>
              <div className="info-stat-label">Consistency</div>
            </div>
            <div className="info-stat">
              <div className="info-stat-value">84</div>
              <div className="info-stat-label">Total Days Complete</div>
            </div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="progress-ring-container">
          <div className="progress-ring">
            <div className="progress-ring-bg" />
            <div className="progress-ring-fill" />
            <div className="progress-ring-label">
              <div className="progress-ring-value">87%</div>
              <div className="progress-ring-text">this month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Check-In Call to Action */}
      <button className="checkin-button">
        <Zap size={18} />
        Check In Today
      </button>

      {/* Analytics Section */}
      <div>
        <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>
          This Week's Activity
        </h2>
        <div className="analytics-grid">
          {/* Activity Chart */}
          <div className="analytic-card">
            <div className="analytic-card-title">Daily Check-ins</div>
            <div className="analytic-chart">
              {[65, 88, 72, 95, 100, 85, 78].map((height, i) => (
                <div
                  key={i}
                  className="chart-bar"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="analytic-card">
            <div className="analytic-card-title">Key Metrics</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="info-stat">
                <div className="info-stat-value">7</div>
                <div className="info-stat-label">Check-ins This Week</div>
              </div>
              <div className="info-stat">
                <div className="info-stat-value">+12%</div>
                <div className="info-stat-label">vs Last Week</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="ai-insights">
        <div className="ai-insights-header">
          <div className="ai-insights-icon">
            <Brain size={18} />
          </div>
          <div className="ai-insights-title">AI Insights</div>
        </div>

        <div className="ai-insights-content">
          <div className="insight-item">
            <div className="insight-item-title">Your Pattern</div>
            <div className="insight-item-text">
              You're most consistent in the mornings. Consider scheduling your
              habits between 6-8 AM for better results.
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-item-title">Next Milestone</div>
            <div className="insight-item-text">
              You're 2 days away from a 2-week streak. Keep your momentum to
              unlock a new achievement.
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-item-title">Recommendation</div>
            <div className="insight-item-text">
              Add "Health Check" to your routine. It complements your current
              habits perfectly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;
