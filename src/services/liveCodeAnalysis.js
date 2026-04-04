/**
 * Live Code Quality Analysis Engine
 * Real-time analysis of code while user types
 */

export const analyzeLiveCode = (code) => {
  if (!code || code.trim().length === 0) {
    return { complexity: 'N/A', issues: [], suggestions: [], score: 0 };
  }

  const analysis = {
    complexity: analyzeComplexity(code),
    issues: findIssues(code),
    suggestions: generateSuggestions(code),
    patterns: detectPatterns(code),
    metrics: calculateMetrics(code)
  };

  // Calculate overall score
  analysis.score = calculateScore(analysis);

  return analysis;
};

const analyzeComplexity = (code) => {
  let timeComplexity = 'O(1)';
  let spaceComplexity = 'O(1)';
  let complexityLevel = 'Constant';

  // Check for nested loops
  const forLoops = (code.match(/for\s*\(/g) || []).length;
  const whileLoops = (code.match(/while\s*\(/g) || []).length;
  const totalLoops = forLoops + whileLoops;

  if (totalLoops >= 2) {
    timeComplexity = `O(n^${totalLoops})`;
    complexityLevel = 'Polynomial';
  } else if (totalLoops === 1) {
    if (code.includes('.sort(') || code.includes('sort(')) {
      timeComplexity = 'O(n log n)';
      complexityLevel = 'Linearithmic';
    } else {
      timeComplexity = 'O(n)';
      complexityLevel = 'Linear';
    }
  }

  // Check for recursion
  const functionName = code.match(/function\s+(\w+)|const\s+(\w+)\s*=/)?.[1] || code.match(/const\s+(\w+)\s*=/)?.[2];
  if (functionName && code.includes(functionName + '(')) {
    timeComplexity += ' (recursive)';
    spaceComplexity = 'O(n) call stack';
  }

  // Check for collections/space
  if (code.includes('new Array') || code.includes('new Map') || code.includes('new Set')) {
    spaceComplexity = spaceComplexity === 'O(1)' ? 'O(n)' : 'O(n)';
  }

  return {
    time: timeComplexity,
    space: spaceComplexity,
    level: complexityLevel
  };
};

const findIssues = (code) => {
  const issues = [];

  // Check for common anti-patterns
  const patterns = [
    {
      pattern: /var\s+\w+/,
      issue: 'Using `var` instead of `let`/`const`',
      severity: 'warning',
      replacement: 'Use `let` or `const` for better scoping'
    },
    {
      pattern: /==(?!=)/,
      issue: 'Using loose equality `==`',
      severity: 'error',
      replacement: 'Use strict equality `===`'
    },
    {
      pattern: /\.length\s*===\s*0/,
      issue: 'Checking array length instead of using `.length === 0`',
      severity: 'info',
      replacement: 'Array methods like `.some()` or `.isEmpty()` might be cleaner'
    },
    {
      pattern: /console\.log/,
      issue: 'Debug `console.log` left in code',
      severity: 'warning',
      replacement: 'Remove console logs before production'
    },
    {
      pattern: /try\s*\{.*?\}\s*catch\s*\(\s*e\s*\)\s*\{\s*\}/,
      issue: 'Empty catch block',
      severity: 'error',
      replacement: 'Handle the error or at least log it'
    },
    {
      pattern: /function\s+\w+.*?\{[\s\S]*?\}.*?\{[\s\S]*?\}.*?\{[\s\S]*?\}/,
      issue: 'Deeply nested code (3+ levels)',
      severity: 'warning',
      replacement: 'Extract logic into separate functions'
    }
  ];

  for (const { pattern, issue, severity, replacement } of patterns) {
    if (pattern.test(code)) {
      issues.push({ issue, severity, replacement });
    }
  }

  // Check for unused variables
  const unusedVars = findUnusedVariables(code);
  unusedVars.forEach(varName => {
    issues.push({
      issue: `Variable '${varName}' is declared but never used`,
      severity: 'info',
      replacement: 'Remove unused variable'
    });
  });

  return issues;
};

const findUnusedVariables = (code) => {
  const unused = [];
  const varPattern = /(?:const|let|var)\s+(\w+)\s*=/g;
  const vars = new Set();
  let match;

  while ((match = varPattern.exec(code)) !== null) {
    vars.add(match[1]);
  }

  for (const varName of vars) {
    // Count uses (excluding declaration)
    const useCount = (code.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length;
    if (useCount === 1) {
      unused.push(varName);
    }
  }

  return unused;
};

const generateSuggestions = (code) => {
  const suggestions = [];

  // Check for common optimizations
  if (code.includes('for (')) {
    const forLoops = code.match(/for\s*\([^)]*\)/g) || [];
    if (forLoops.length > 1) {
      suggestions.push({
        type: 'optimization',
        message: 'Consider combining nested loops if applicable',
        impact: 'Could improve time complexity'
      });
    }
  }

  // Check for use of modern ES6+ features
  if (!code.includes('=>') && code.includes('function')) {
    suggestions.push({
      type: 'modernization',
      message: 'Consider using arrow functions',
      impact: 'More concise and cleaner syntax'
    });
  }

  if (!code.includes('...') && code.includes('concat') || code.includes('Array.from')) {
    suggestions.push({
      type: 'modernization',
      message: 'Consider using spread operator (...)',
      impact: 'More readable and elegant'
    });
  }

  // Suggest specific patterns
  if (code.includes('map(') && code.includes('filter(')) {
    suggestions.push({
      type: 'pattern',
      message: 'Good use of functional programming patterns',
      impact: 'Code is easier to understand and maintain'
    });
  }

  if (code.includes('reduce(')) {
    suggestions.push({
      type: 'pattern',
      message: 'Advanced pattern detected: `reduce()` usage',
      impact: 'Shows good functional programming knowledge'
    });
  }

  return suggestions;
};

const detectPatterns = (code) => {
  const patterns = {
    'functional': code.includes('map(') || code.includes('filter(') || code.includes('reduce('),
    'recursive': code.includes('function') && code.match(/(\w+)\s*\(\s*\)/) && code.includes(RegExp.$1),
    'dynamic_programming': code.includes('memo') || code.includes('dp['),
    'bit_manipulation': code.includes('&') || code.includes('|') || code.includes('^'),
    'tree': code.includes('left') && code.includes('right'),
    'graph': code.includes('adjace') || code.includes('edge'),
    'sorting': code.includes('sort(') || code.includes('sorted'),
    'searching': code.includes('indexOf') || code.includes('includes') || code.includes('find'),
  };

  return Object.entries(patterns)
    .filter(([_, detected]) => detected)
    .map(([pattern]) => pattern);
};

const calculateMetrics = (code) => {
  const lines = code.split('\n').length;
  const functions = (code.match(/function\s+\w+|const\s+\w+\s*=/g) || []).length;
  const comments = (code.match(/\/\//g) || []).length + (code.match(/\/\*/g) || []).length;
  const avgLinesPerFunction = functions > 0 ? Math.round(lines / functions) : lines;

  return {
    totalLines: lines,
    functions,
    comments,
    avgLinesPerFunction,
    isWellCommented: comments >= Math.floor(lines / 10),
    readability: calculateReadability(lines, functions, comments)
  };
};

const calculateReadability = (lines, functions, comments) => {
  let score = 100;

  // Penalize for too many lines
  if (lines > 50) score -= 20;
  if (lines > 100) score -= 15;

  // Reward for functions (modularity)
  if (functions >= lines / 10) score += 10;

  // Reward for comments
  if (comments >= lines / 20) score += 15;

  return Math.max(0, Math.min(100, score));
};

const calculateScore = (analysis) => {
  let score = 100;

  // Reduce for issues
  const criticalIssues = (analysis.issues || []).filter(i => i.severity === 'error' || i.severity === 'warning').length;
  score -= criticalIssues * 10;

  // Bonus for complex but well-written code
  if (analysis.complexity.level !== 'Constant' && analysis.metrics.isWellCommented) {
    score += 5;
  }

  // Bonus for good patterns
  const patternBonus = (analysis.patterns || []).length * 3;
  score += patternBonus;

  // Check readability
  score = Math.max(0, Math.min(100, score + (analysis.metrics.readability / 10)));

  return Math.round(score);
};

/**
 * Get real-time suggestions for improvement
 */
export const getLiveCodeSuggestions = (code, difficulty = 'Medium') => {
  const analysis = analyzeLiveCode(code);
  const suggestions = [];

  if (analysis.score < 50) {
    suggestions.push({
      priority: 'high',
      message: 'Try to improve code quality - focus on handling edge cases',
      areas: ['error-handling', 'null-checks']
    });
  }

  if (analysis.complexity.level === 'Polynomial' && difficulty !== 'Hard') {
    suggestions.push({
      priority: 'medium',
      message: 'Complexity seems high for this difficulty. Can you optimize?',
      area: 'complexity'
    });
  }

  if (analysis.issues.length > 3) {
    suggestions.push({
      priority: 'high',
      message: `${analysis.issues.length} issues found. Fix the critical ones first.`,
      area: 'code-quality'
    });
  }

  return {
    analysis,
    suggestions
  };
};

export default {
  analyzeLiveCode,
  getLiveCodeSuggestions
};
