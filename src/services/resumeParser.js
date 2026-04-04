/**
 * Smart Resume Parser Service
 * Extracts structured data from resume text using AI + regex patterns
 */

export const parseResume = (resumeText) => {
  if (!resumeText || typeof resumeText !== 'string') {
    return { error: 'No resume text provided' };
  }

  const text = resumeText.toLowerCase();
  
  try {
    // Extract skills
    const skills = extractSkills(text);
    
    // Extract experience
    const experience = extractExperience(text);
    
    // Extract education
    const education = extractEducation(text);
    
    // Extract years of experience
    const yearsOfExperience = calculateYearsOfExperience(text, experience);
    
    // Identify role match
    const roleMatch = identifyRoleMatch(text);
    
    // Generate focus areas
    const focusAreas = generateFocusAreas(skills, roleMatch);

    return {
      skills,
      experience,
      education,
      yearsOfExperience,
      roleMatch,
      focusAreas,
      summary: generateSummary(skills, experience, yearsOfExperience)
    };
  } catch (error) {
    console.error('Resume parsing error:', error);
    return { error: error.message };
  }
};

const extractSkills = (text) => {
  const skillPatterns = {
    // Programming Languages
    'languages': ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'typescript', 'kotlin', 'swift', 'php', 'scala'],
    
    // Frontend
    'frontend': ['react', 'vue', 'angular', 'svelte', 'html', 'css', 'tailwind', 'bootstrap', 'material-ui', 'next.js', 'gatsby'],
    
    // Backend
    'backend': ['nodejs', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'fastapi', 'graphql', 'rest api'],
    
    // Databases
    'databases': ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'firebase', 'supabase', 'dynamodb', 'elasticsearch'],
    
    // Cloud & DevOps
    'devops': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'ansible', 'git'],
    
    // Data & AI
    'data': ['machine learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'sql', 'tableau', 'power bi'],
    
    // Soft Skills
    'soft': ['leadership', 'communication', 'teamwork', 'problem solving', 'project management', 'agile']
  };

  const foundSkills = {};

  for (const [category, skills] of Object.entries(skillPatterns)) {
    foundSkills[category] = [];
    for (const skill of skills) {
      const regex = new RegExp(`\\b${skill}\\b`, 'gi');
      if (regex.test(text)) {
        foundSkills[category].push(skill);
      }
    }
  }

  return foundSkills;
};

const extractExperience = (text) => {
  const experiences = [];
  
  // Pattern: Company Name, Position, Duration
  const experiencePattern = /(?:at|company|worked at|employed at)\s+([a-z\s,]+?)\s+(?:as|position|role)\s+([a-z\s,]+?)(?:\s*\(|,|\.|year|month|from)/gi;
  
  let match;
  while ((match = experiencePattern.exec(text)) !== null) {
    experiences.push({
      company: match[1].trim(),
      position: match[2].trim()
    });
  }

  // Year-based pattern
  const yearPattern = /\d{4}\s*-\s*(?:\d{4}|present)/gi;
  const years = text.match(yearPattern) || [];
  
  return {
    totalRoles: experiences.length,
    companies: [...new Set(experiences.map(e => e.company))],
    roles: [...new Set(experiences.map(e => e.position))],
    timeframes: years
  };
};

const extractEducation = (text) => {
  const educationKeywords = ['bachelor', 'master', 'phd', 'btech', 'mtech', 'bsc', 'msc', 'diploma', 'graduation', 'degree'];
  
  const education = [];
  
  for (const keyword of educationKeywords) {
    const regex = new RegExp(`${keyword}[^.!?]*`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(match => {
        if (!education.includes(match.trim())) {
          education.push(match.trim());
        }
      });
    }
  }

  return education.slice(0, 3); // Top 3 education entries
};

const calculateYearsOfExperience = (text, experience) => {
  const yearPattern = /(\d{4})\s*-\s*(?:(\d{4})|present)/gi;
  let totalYears = 0;
  let match;

  while ((match = yearPattern.exec(text)) !== null) {
    const startYear = parseInt(match[1]);
    const endYear = match[2] ? parseInt(match[2]) : new Date().getFullYear();
    totalYears += (endYear - startYear);
  }

  return totalYears > 0 ? totalYears : experience.timeframes.length * 2 || 0;
};

const identifyRoleMatch = (text) => {
  const roles = {
    'Software Engineer': {
      keywords: ['software', 'engineer', 'developer', 'backend', 'full stack', 'fullstack'],
      weight: 1
    },
    'Data Scientist': {
      keywords: ['data', 'scientist', 'machine learning', 'ml', 'analytics', 'data analyst'],
      weight: 1
    },
    'DevOps Engineer': {
      keywords: ['devops', 'infrastructure', 'cloud', 'kubernetes', 'docker', 'deployment'],
      weight: 1
    },
    'Frontend Engineer': {
      keywords: ['frontend', 'react', 'vue', 'angular', 'ui', 'ux'],
      weight: 1
    },
    'Product Manager': {
      keywords: ['product', 'manager', 'pm', 'leadership', 'strategy'],
      weight: 1
    }
  };

  const matches = {};
  for (const [role, { keywords }] of Object.entries(roles)) {
    let score = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matchCount = (text.match(regex) || []).length;
      score += matchCount;
    }
    if (score > 0) {
      matches[role] = score;
    }
  }

  const topMatch = Object.entries(matches).sort((a, b) => b[1] - a[1])[0];
  return topMatch ? topMatch[0] : 'Software Engineer';
};

const generateFocusAreas = (skills, roleMatch) => {
  const focusMap = {
    'Software Engineer': ['Code Architecture', 'Algorithms & Data Structures', 'System Design', 'SOLID Principles'],
    'Data Scientist': ['Statistics', 'Feature Engineering', 'Model Selection', 'Data Visualization'],
    'DevOps Engineer': ['Infrastructure as Code', 'Containerization', 'CI/CD Pipelines', 'Monitoring'],
    'Frontend Engineer': ['Component Design', 'Performance Optimization', 'State Management', 'Accessibility'],
    'Product Manager': ['Product Strategy', 'User Research', 'Metrics & Analytics', 'Cross-functional Communication']
  };

  return focusMap[roleMatch] || focusMap['Software Engineer'];
};

const generateSummary = (skills, experience, yearsOfExperience) => {
  const langCount = (skills.languages || []).length;
  const frontendCount = (skills.frontend || []).length;
  const backendCount = (skills.backend || []).length;
  const dbCount = (skills.databases || []).length;

  const strengths = [];
  
  if (langCount >= 3) strengths.push(`Multi-language proficiency (${langCount}+ languages)`);
  if (frontendCount >= 2) strengths.push('Strong frontend skills');
  if (backendCount >= 2) strengths.push('Solid backend expertise');
  if (dbCount >= 2) strengths.push('Database knowledge');
  if (yearsOfExperience >= 5) strengths.push(`${yearsOfExperience}+ years of experience`);

  return strengths.join(' • ');
};

/**
 * Match resume skills against role requirements
 */
export const matchSkillsToRole = (resumeSkills, roleRequirements) => {
  if (!resumeSkills || !roleRequirements) return 0;

  let matchedSkills = 0;
  let totalRequired = roleRequirements.length;

  for (const required of roleRequirements) {
    const allSkills = Object.values(resumeSkills).flat();
    if (allSkills.some(skill => skill.toLowerCase().includes(required.toLowerCase()))) {
      matchedSkills++;
    }
  }

  return Math.round((matchedSkills / totalRequired) * 100);
};

/**
 * Get interview focus recommendations
 */
export const getInterviewFocusRecommendations = (parsedResume) => {
  const { skills, focusAreas, yearsOfExperience } = parsedResume;

  const recommendations = [];

  // Check for gaps
  if (yearsOfExperience < 2) {
    recommendations.push({
      type: 'gap',
      message: '👤 Early in career - focus on fundamentals and learning mindset',
      priority: 'high'
    });
  }

  if (!skills.databases || skills.databases.length === 0) {
    recommendations.push({
      type: 'gap',
      message: '📊 Limited database experience - prepare for data modeling questions',
      priority: 'medium'
    });
  }

  if (!skills.devops || skills.devops.length === 0) {
    recommendations.push({
      type: 'gap',
      message: '🚀 No DevOps/Cloud experience - may encounter deployment questions',
      priority: 'low'
    });
  }

  // Strengths to build on
  if (skills.languages && skills.languages.length >= 3) {
    recommendations.push({
      type: 'strength',
      message: '⭐ Strong programming fundamentals - can tackle complex problems',
      priority: 'high'
    });
  }

  return recommendations;
};

export default {
  parseResume,
  matchSkillsToRole,
  getInterviewFocusRecommendations
};
