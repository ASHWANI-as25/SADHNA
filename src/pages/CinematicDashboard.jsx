import React from 'react';
import { Zap, TrendingUp, Brain } from 'lucide-react';
import '../styles/cinematic-dashboard.css';

/**
 * Cinematic Dashboard
 * Ultra-premium UI experience with:
 * - SADHNA logo with floating glow effect
 * - Immersive space theme
 * - Glassmorphic components
 * - Smooth micro-interactions
 * - Real-time animations
 */

const CinematicDashboard = () => {
  return (
    <div className="cinematic-dashboard">
      {/* Logo Section - Floating in space */}
      <div className="logo-section">
        <div className="logo-glow" />
        <h1 className="logo">SADHNA</h1>
        <p className="logo-subtitle">StreakMaster</p>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2>Welcome back</h2>
        <p>
          Stay focused. Build momentum. Transform your habits into lasting change.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Streak Card - Hero Element */}
        <div className="card card-lg streak-card float" style={{ animationDelay: '0.4s' }}>
          <div className="card-header">
            <h3>Your Streak</h3>
            <span className="badge">Active</span>
          </div>

          <div className="streak-display">
            <div className="streak-number">12</div>
            <div className="streak-label">Days</div>
          </div>

          <div className="streak-info">
            <div className="info-stat">
              <div className="info-stat-value">87%</div>
              <div className="info-stat-label">This Month</div>
            </div>
            <div className="info-stat">
              <div className="info-stat-value">84</div>
              <div className="info-stat-label">Total Days</div>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>
            <Zap size={16} />
            Check In Today
          </button>
        </div>

        {/* Quick Stats */}
        <div className="card card-lg stats-card" style={{ animationDelay: '0.5s' }}>
          <h3>Quick Stats</h3>

          <div className="stat-item">
            <div className="stat-icon">
              <TrendingUp size={20} className="text-gradient" />
            </div>
            <div className="stat-content">
              <div className="stat-value">+12%</div>
              <div className="stat-label">vs Last Week</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">
              <Brain size={20} className="text-gradient-accent" />
            </div>
            <div className="stat-content">
              <div className="stat-value">98%</div>
              <div className="stat-label">Focus Score</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">
              <Zap size={20} style={{ color: '#FFA500' }} />
            </div>
            <div className="stat-content">
              <div className="stat-value">7/7</div>
              <div className="stat-label">This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart Section */}
      <div className="chart-section">
        <h3>This Week's Activity</h3>

        <div className="chart-container card">
          <div className="chart-bars">
            {[65, 88, 72, 95, 100, 85, 78].map((height, i) => (
              <div
                key={i}
                className="chart-bar"
                style={{
                  height: `${height}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              >
                <div className="chart-bar-fill" />
              </div>
            ))}
          </div>
          <div className="chart-labels">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <span key={i}>{day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="insights-section">
        <div className="card card-lg ai-insights">
          <div className="insights-header">
            <Brain size={20} className="text-gradient" />
            <h3>AI Insights</h3>
          </div>

          <div className="insights-list">
            <div className="insight-item fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="insight-title">Your Pattern</div>
              <p className="insight-text">
                You're most consistent in the mornings. Schedule habits between 6-8 AM.
              </p>
            </div>

            <div className="insight-item fade-in-up" style={{ animationDelay: '0.7s' }}>
              <div className="insight-title">Next Milestone</div>
              <p className="insight-text">
                2 days away from a 2-week streak. Unlock a new achievement.
              </p>
            </div>

            <div className="insight-item fade-in-up" style={{ animationDelay: '0.8s' }}>
              <div className="insight-title">Recommendation</div>
              <p className="insight-text">
                Add "Health Check" to your routine. Complements perfectly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicDashboard;
