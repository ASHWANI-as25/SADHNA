// PDF Report Generation Service
export const generatePDFReport = (interviewData) => {
  const { role, difficulty, score, strengths, improvements, date, duration, problemsSolved } = interviewData;
  
  const content = `
╔════════════════════════════════════════════════════════════════╗
║                 SADHNA PERFORMANCE REPORT                     ║
╚════════════════════════════════════════════════════════════════╝

INTERVIEW DETAILS
─────────────────────────────────────────────────────────────────
Role:              ${role}
Difficulty:        ${difficulty}
Date:              ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}
Duration:          ${duration} minutes
Overall Score:     ${score}%

PERFORMANCE METRICS
─────────────────────────────────────────────────────────────────
Problems Solved:   ${problemsSolved || 0}
Performance:       ${getPerformanceLevel(score)}

STRENGTHS (Keep doing these!)
─────────────────────────────────────────────────────────────────
${strengths?.map((s, i) => `${i + 1}. ${s}`).join('\n') || 'No data available'}

AREAS FOR IMPROVEMENT
─────────────────────────────────────────────────────────────────
${improvements?.map((i, idx) => `${idx + 1}. ${i}`).join('\n') || 'No data available'}

RECOMMENDATIONS
─────────────────────────────────────────────────────────────────
• Practice more problems at this difficulty level
• Review the concepts that were challenging
• Focus on time management during coding
• Improve communication of your thought process

Generated: ${new Date().toLocaleString()}
Platform: SADHNA Habit Tracker powered by Groq & Llama 3
  `;

  return content;
};

export const getPerformanceLevel = (score) => {
  if (score >= 90) return 'Excellent - Ready for interviews!';
  if (score >= 80) return 'Very Good - Minor improvements needed';
  if (score >= 70) return 'Good - Continue practicing';
  if (score >= 60) return 'Average - More practice recommended';
  return 'Needs Improvement - Focus on fundamentals';
};

export const downloadTextReport = (content, filename = 'interview_report.txt') => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadCSVHistory = (history) => {
  const headers = ['Date', 'Role', 'Problem', 'Difficulty', 'Score', 'Duration'].join(',');
  const rows = history.map(h => 
    [
      new Date(h.date).toLocaleDateString(),
      h.role,
      h.problem,
      h.difficulty,
      h.score,
      h.duration || 30
    ].join(',')
  );
  
  const content = [headers, ...rows].join('\n');
  downloadTextReport(content, 'interview_history.csv');
};
