import React, { useState, useEffect } from 'react';
import './leaderboard.css';

const LeaderboardDisplay = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('global');
  const [loading, setLoading] = useState(false);

  // Demo data - Replace with real Supabase calls later
  const demoLeaderboard = [
    { rank: 1, userName: 'Ashwani Singh', userEmail: 'ashwani@example.com', score: 95, technicalScore: 98, communicationScore: 92, date: '2025-03-25', badge: '🥇' },
    { rank: 2, userName: 'Raj Kumar', userEmail: 'raj@example.com', score: 88, technicalScore: 85, communicationScore: 91, date: '2025-03-24', badge: '🥈' },
    { rank: 3, userName: 'Priya Sharma', userEmail: 'priya@example.com', score: 82, technicalScore: 80, communicationScore: 85, date: '2025-03-23', badge: '🥉' },
    { rank: 4, userName: 'Vikram Patel', userEmail: 'vikram@example.com', score: 78, technicalScore: 75, communicationScore: 80, date: '2025-03-22', badge: '⭐' },
    { rank: 5, userName: 'Neha Gupta', userEmail: 'neha@example.com', score: 76, technicalScore: 74, communicationScore: 78, date: '2025-03-21', badge: '⭐' },
  ];

  const demoTrending = [
    { userId: 'user1', userName: 'Ashwani Singh', improvement: 15, currentScore: 95, trend: 'up' },
    { userId: 'user2', userName: 'Raj Kumar', improvement: 12, currentScore: 88, trend: 'up' },
    { userId: 'user3', userName: 'Priya Sharma', improvement: 8, currentScore: 82, trend: 'up' },
  ];

  const userRanking = userId ? {
    userId,
    averageScore: 92,
    rank: 1,
    totalUsers: 1250,
    percentile: 99,
    interviewsCount: 5
  } : null;

  return (
    <div className="leaderboard-container glass-card">
      <div className="leaderboard-header">
        <h2>🏆 Leaderboard</h2>
        <div className="leaderboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'global' ? 'active' : ''}`}
            onClick={() => setActiveTab('global')}
          >
            Global
          </button>
          <button
            className={`tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly
          </button>
          <button
            className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
            onClick={() => setActiveTab('trending')}
          >
            Trending 🔥
          </button>
        </div>
      </div>

      {userRanking && (
        <div className="user-rank-card">
          <div className="rank-stat">
            <span className="label">Your Rank</span>
            <span className="value">#{userRanking.rank}</span>
          </div>
          <div className="rank-stat">
            <span className="label">Percentile</span>
            <span className="value">{userRanking.percentile}%</span>
          </div>
          <div className="rank-stat">
            <span className="label">Avg Score</span>
            <span className="value">{userRanking.averageScore}</span>
          </div>
          <div className="rank-stat">
            <span className="label">Interviews</span>
            <span className="value">{userRanking.interviewsCount}</span>
          </div>
        </div>
      )}

      {activeTab === 'trending' ? (
        <div className="trending-list">
          {demoTrending.map((performer, index) => (
            <div key={index} className="trending-card">
              <div className="trending-rank">{index + 1}</div>
              <div className="trending-info">
                <h4>{performer.userName}</h4>
                <p className="improvement">
                  📈 +{performer.improvement} points improvement
                </p>
              </div>
              <div className="trending-score">{performer.currentScore} pts</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="leaderboard-table">
          <div className="table-header">
            <div className="col-rank">Rank</div>
            <div className="col-name">Name</div>
            <div className="col-score">Score</div>
            <div className="col-date">Date</div>
          </div>
          <div className="table-body">
            {demoLeaderboard.map((entry) => (
              <div
                key={entry.rank}
                className="table-row"
              >
                <div className="col-rank">
                  <span className="rank-badge">
                    {entry.badge}
                  </span>
                </div>
                <div className="col-name">
                  <span className="name">{entry.userName}</span>
                </div>
                <div className="col-score">{entry.score}</div>
                <div className="col-date">
                  {entry.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardDisplay;
