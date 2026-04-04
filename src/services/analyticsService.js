/**
 * Analytics Service - Performance metrics calculations and insights
 * Provides comprehensive analytics data from interview history
 */

export const calculateDetailedStats = (history) => {
  if (!history || history.length === 0) {
    return {
      totalInterviews: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      totalTime: 0,
      completionRate: 100,
      averageTechnical: 0,
      averageCommunication: 0,
      scoreDistribution: { excellent: 0, good: 0, average: 0, poor: 0 },
      rolePerformance: {},
      recentTrend: 0
    };
  }

  const scores = history.map(h => h.score || 0);
  const technicalScores = history.map(h => h.fullResults?.technical || h.fullResults?.leadership || 0);
  const communicationScores = history.map(h => h.fullResults?.communication || 0);

  // Score distribution
  const scoreDistribution = {
    excellent: scores.filter(s => s >= 80).length,
    good: scores.filter(s => s >= 60 && s < 80).length,
    average: scores.filter(s => s >= 40 && s < 60).length,
    poor: scores.filter(s => s < 40).length
  };

  // Role-based performance
  const rolePerformance = {};
  history.forEach(interview => {
    const role = interview.role || 'Unknown';
    if (!rolePerformance[role]) {
      rolePerformance[role] = { interviews: 0, totalScore: 0, scores: [] };
    }
    rolePerformance[role].interviews += 1;
    rolePerformance[role].totalScore += interview.score || 0;
    rolePerformance[role].scores.push(interview.score || 0);
  });

  Object.keys(rolePerformance).forEach(role => {
    rolePerformance[role].averageScore = Math.round(rolePerformance[role].totalScore / rolePerformance[role].interviews);
  });

  // Recent trend (last 5 vs previous average)
  const recentScores = scores.slice(-5);
  const recentAvg = recentScores.length > 0 ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length) : 0;
  const previousAvg = scores.length > 5 ? Math.round(scores.slice(0, -5).reduce((a, b) => a + b, 0) / (scores.length - 5)) : 0;
  const recentTrend = previousAvg > 0 ? Math.round(((recentAvg - previousAvg) / previousAvg) * 100) : 0;

  return {
    totalInterviews: history.length,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    bestScore: Math.max(...scores),
    worstScore: Math.min(...scores),
    totalTime: history.reduce((sum, h) => sum + (h.actualDuration || 45), 0),
    completionRate: 100,
    averageTechnical: Math.round(technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length),
    averageCommunication: Math.round(communicationScores.reduce((a, b) => a + b, 0) / communicationScores.length),
    scoreDistribution,
    rolePerformance,
    recentTrend,
    scoreHistory: scores,
    technicalHistory: technicalScores,
    communicationHistory: communicationScores,
    problemFrequency: calculateProblemFrequency(history),
    strengthsAggregated: aggregateStrengths(history),
    improvementsAggregated: aggregateImprovements(history)
  };
};

export const calculateProblemFrequency = (history) => {
  const frequency = {};
  history.forEach(interview => {
    const problem = interview.problem || 'Unknown';
    frequency[problem] = (frequency[problem] || 0) + 1;
  });
  return frequency;
};

export const aggregateStrengths = (history) => {
  const strengths = {};
  history.forEach(interview => {
    if (interview.fullResults?.strengths && Array.isArray(interview.fullResults.strengths)) {
      interview.fullResults.strengths.forEach(strength => {
        strengths[strength] = (strengths[strength] || 0) + 1;
      });
    }
  });
  return Object.entries(strengths)
    .map(([strength, count]) => ({ strength, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

export const aggregateImprovements = (history) => {
  const improvements = {};
  history.forEach(interview => {
    if (interview.fullResults?.improvements && Array.isArray(interview.fullResults.improvements)) {
      interview.fullResults.improvements.forEach(improvement => {
        improvements[improvement] = (improvements[improvement] || 0) + 1;
      });
    }
  });
  return Object.entries(improvements)
    .map(([improvement, count]) => ({ improvement, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

export const getScoreTrend = (history, lastN = 10) => {
  return history
    .slice(-lastN)
    .map((h, idx) => ({
      x: idx + 1,
      y: h.score || 0,
      label: h.problem
    }));
};

export const getRoleBreakdown = (history) => {
  const breakdown = {};
  history.forEach(interview => {
    const role = interview.role || 'Unknown';
    if (!breakdown[role]) {
      breakdown[role] = 0;
    }
    breakdown[role] += 1;
  });
  return Object.entries(breakdown).map(([name, value]) => ({
    name,
    value,
    percentage: Math.round((value / history.length) * 100)
  }));
};

export const filterInterviewsByRole = (history, role) => {
  return history.filter(h => h.role === role);
};

export const filterInterviewsByDateRange = (history, startDate, endDate) => {
  return history.filter(h => {
    const interviewDate = new Date(h.date);
    return interviewDate >= startDate && interviewDate <= endDate;
  });
};

export const getPerformanceInsights = (stats) => {
  const insights = [];

  if (stats.recentTrend > 5) {
    insights.push({ type: 'positive', message: `🚀 Great progress! Your recent scores improved by ${stats.recentTrend}%` });
  } else if (stats.recentTrend < -5) {
    insights.push({ type: 'warning', message: `📉 Recent performance dipped by ${Math.abs(stats.recentTrend)}%. Focus on fundamentals.` });
  }

  if (stats.scoreDistribution.excellent >= stats.totalInterviews * 0.5) {
    insights.push({ type: 'positive', message: '⭐ Over 50% of your interviews scored excellent! Keep it up!' });
  }

  if (stats.averageTechnical > stats.averageCommunication + 10) {
    insights.push({ type: 'info', message: '💡 Your technical skills are strong. Consider focusing on communication skills.' });
  } else if (stats.averageCommunication > stats.averageTechnical + 10) {
    insights.push({ type: 'info', message: '🗣️ Great communication! Now focus on strengthening technical depth.' });
  }

  const worstDifference = stats.bestScore - stats.worstScore;
  if (worstDifference > 30) {
    insights.push({ type: 'warning', message: `📊 High variance in scores (${worstDifference}%). Aim for consistency.` });
  }

  return insights;
};

export const getRecommendations = (stats, aggregatedImprovements) => {
  const recommendations = [];

  if (aggregatedImprovements.length > 0) {
    recommendations.push({
      priority: 'high',
      area: aggregatedImprovements[0].improvement,
      count: aggregatedImprovements[0].count,
      message: `Focus on: ${aggregatedImprovements[0].improvement} (mentioned ${aggregatedImprovements[0].count} times)`
    });
  }

  if (stats.averageScore < 60) {
    recommendations.push({
      priority: 'high',
      area: 'Overall Performance',
      message: 'Your average score is below 60. Review fundamentals and practice more problems.'
    });
  }

  if (stats.averageTechnical < 50) {
    recommendations.push({
      priority: 'high',
      area: 'Technical Skills',
      message: 'Strengthen your technical knowledge with targeted practice.'
    });
  }

  if (stats.averageCommunication < 50) {
    recommendations.push({
      priority: 'medium',
      area: 'Communication',
      message: 'Practice articulating your thought process clearly during interviews.'
    });
  }

  return recommendations.slice(0, 4);
};

export const getDetailedProblemStats = (history, problemName) => {
  const problemInterviews = history.filter(h => h.problem === problemName);
  if (problemInterviews.length === 0) return null;

  const scores = problemInterviews.map(h => h.score || 0);
  return {
    problem: problemName,
    attempts: problemInterviews.length,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    bestScore: Math.max(...scores),
    worstScore: Math.min(...scores),
    scores,
    firstAttempt: scores[0],
    lastAttempt: scores[scores.length - 1],
    improvement: scores[scores.length - 1] - scores[0]
  };
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};
