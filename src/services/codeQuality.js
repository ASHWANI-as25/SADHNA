// Advanced Code Quality Analysis Service
// Analyzes code for complexity, patterns, and suggestions

export const analyzeCodeQuality = (code) => {
  if (!code || typeof code !== 'string') {
    return {
      score: 0,
      timeComplexity: 'N/A',
      spaceComplexity: 'N/A',
      patterns: [],
      codeSmells: [],
      suggestions: [],
      metrics: {
        lines: 0,
        functions: 0,
        comments: 0
      }
    };
  }

  let analysis = {
    score: 100,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    patterns: [],
    codeSmells: [],
    suggestions: [],
    metrics: {
      lines: code.split('\n').length,
      functions: (code.match(/function\s+\w+|const\s+\w+\s*=\s*(?:function|\()/g) || []).length,
      comments: (code.match(/\/\/|\/\*|\*\//g) || []).length / 2
    }
  };

  // Analyze Time Complexity
  const timeComplexity = detectTimeComplexity(code);
  analysis.timeComplexity = timeComplexity.complexity;
  if (timeComplexity.issues > 0) {
    analysis.score -= timeComplexity.issues * 5;
  }

  // Analyze Space Complexity
  const spaceComplexity = detectSpaceComplexity(code);
  analysis.spaceComplexity = spaceComplexity.complexity;
  if (spaceComplexity.issues > 0) {
    analysis.score -= spaceComplexity.issues * 3;
  }

  // Detect Design Patterns
  analysis.patterns = detectPatterns(code);

  // Detect Code Smells
  analysis.codeSmells = detectCodeSmells(code);
  analysis.score -= analysis.codeSmells.length * 4;

  // Generate Suggestions
  analysis.suggestions = generateSuggestions(code, analysis);

  // Ensure score is between 0-100
  analysis.score = Math.max(0, Math.min(100, analysis.score));

  return analysis;
};

// Detect Time Complexity patterns
function detectTimeComplexity(code) {
  let complexity = 'O(1)';
  let issues = 0;

  // Check for nested loops
  const nestedLoops = (code.match(/for\s*\(|while\s*\(/g) || []).length;
  if (nestedLoops >= 3) {
    complexity = 'O(n³)';
    issues = 3;
  } else if (nestedLoops === 2) {
    complexity = 'O(n²)';
    issues = 2;
  } else if (nestedLoops === 1) {
    complexity = 'O(n)';
    issues = 1;
  }

  // Check for recursive calls
  if (code.includes('recursion') || /function\s+\w+\s*\([^)]*\)\s*{[\s\S]*?return[\s\S]*?\1\s*\(/.test(code)) {
    if (complexity === 'O(1)') {
      complexity = 'O(n)';
      issues = 1;
    } else {
      complexity = complexity.replace('n', 'n²');
      issues += 1;
    }
  }

  return { complexity, issues };
}

// Detect Space Complexity
function detectSpaceComplexity(code) {
  let complexity = 'O(1)';
  let issues = 0;

  // Check for array/object creation
  if (code.includes('new Array') || code.includes('[]') || code.includes('{}')) {
    const arrayCreations = (code.match(/new Array|push\(|Array\.from/g) || []).length;
    if (arrayCreations > 5) {
      complexity = 'O(n²)';
      issues = 2;
    } else if (arrayCreations > 0) {
      complexity = 'O(n)';
      issues = 1;
    }
  }

  return { complexity, issues };
}

// Detect design patterns
function detectPatterns(code) {
  const patterns = [];

  if (code.includes('class ') && code.includes('extends')) {
    patterns.push({
      name: 'Inheritance Pattern',
      description: 'Using class inheritance for code reuse'
    });
  }

  if (code.includes('singleton') || /const\s+\w+\s*=\s*\{\s*\.*/i.test(code)) {
    patterns.push({
      name: 'Singleton Pattern',
      description: 'Single instance pattern detected'
    });
  }

  if (code.includes('filter') || code.includes('map') || code.includes('reduce')) {
    patterns.push({
      name: 'Functional Programming',
      description: 'Using functional methods for data transformation'
    });
  }

  if (code.includes('promise') || code.includes('async') || code.includes('await')) {
    patterns.push({
      name: 'Async/Promise Pattern',
      description: 'Using promises and async/await for asynchronous operations'
    });
  }

  if (code.includes('callback') || /function\s*\(\s*\w+\s*\)\s*{[\s\S]*?\1\s*\(/.test(code)) {
    patterns.push({
      name: 'Callback Pattern',
      description: 'Using callbacks for asynchronous operations'
    });
  }

  return patterns;
}

// Detect code smells
function detectCodeSmells(code) {
  const smells = [];

  // Check for magic numbers
  if (/\b\d{3,}\b/.test(code) && !code.includes('const') && !code.includes('let')) {
    smells.push({
      type: 'Magic Numbers',
      severity: 'Low',
      description: 'Hard-coded numbers should be named constants'
    });
  }

  // Check for long functions
  const lines = code.split('\n').length;
  if (lines > 50) {
    smells.push({
      type: 'Long Function',
      severity: 'Medium',
      description: `Function is ${lines} lines. Consider breaking into smaller functions`
    });
  }

  // Check for deep nesting
  const maxNesting = getMaxNestingLevel(code);
  if (maxNesting > 4) {
    smells.push({
      type: 'Deep Nesting',
      severity: 'Medium',
      description: `Nesting level of ${maxNesting}. Consider refactoring for clarity`
    });
  }

  // Check for unused variables
  const variables = code.match(/const\s+\w+|let\s+\w+|var\s+\w+/g) || [];
  if (variables.length > 10) {
    smells.push({
      type: 'Too Many Variables',
      severity: 'Low',
      description: 'Consider consolidating or passing as objects'
    });
  }

  // Check for missing error handling
  if (code.includes('try') && !code.includes('catch')) {
    smells.push({
      type: 'Missing Error Handling',
      severity: 'High',
      description: 'Try block without catch. Add error handling'
    });
  }

  return smells;
}

// Helper: Calculate max nesting level
function getMaxNestingLevel(code) {
  let maxLevel = 0;
  let currentLevel = 0;
  
  for (let char of code) {
    if (char === '{' || char === '[' || char === '(') {
      currentLevel++;
      maxLevel = Math.max(maxLevel, currentLevel);
    } else if (char === '}' || char === ']' || char === ')') {
      currentLevel--;
    }
  }
  
  return maxLevel;
}

// Generate actionable suggestions
function generateSuggestions(code, analysis) {
  const suggestions = [];

  // Complexity suggestions
  if (analysis.timeComplexity && analysis.timeComplexity.includes('³')) {
    suggestions.push({
      priority: 'High',
      suggestion: 'Reduce time complexity from O(n³) to O(n²) or O(n log n)',
      action: 'Use efficient algorithms like sorting or hashing instead of triple nested loops'
    });
  }

  if (analysis.timeComplexity && analysis.timeComplexity.includes('²')) {
    suggestions.push({
      priority: 'Medium',
      suggestion: 'Consider optimizing from O(n²) to O(n log n)',
      action: 'Use divide-and-conquer or dynamic programming approaches'
    });
  }

  // Code smell suggestions
  analysis.codeSmells.forEach(smell => {
    if (smell.type === 'Long Function') {
      suggestions.push({
        priority: 'Medium',
        suggestion: 'Break down long function',
        action: 'Extract methods with single responsibilities (SRP)'
      });
    }
    if (smell.type === 'Deep Nesting') {
      suggestions.push({
        priority: 'Medium',
        suggestion: 'Reduce nesting complexity',
        action: 'Use early returns or extract helper functions'
      });
    }
  });

  // Style suggestions
  if (!code.includes('const ') && !code.includes('let ')) {
    suggestions.push({
      priority: 'Low',
      suggestion: 'Use const/let instead of var',
      action: 'Modern JavaScript prefers const/let for block scoping'
    });
  }

  if (!code.includes('{') || !code.includes('return')) {
    if (analysis.metrics.functions > 5) {
      suggestions.push({
        priority: 'Low',
        suggestion: 'Add return statements for clarity',
        action: 'Explicit returns make code flow easier to follow'
      });
    }
  }

  return suggestions.slice(0, 5); // Return top 5 suggestions
}

// Get complexity summary
export const getComplexitySummary = (analysis) => {
  return {
    timeComplexity: analysis.timeComplexity,
    spaceComplexity: analysis.spaceComplexity,
    totalIssues: analysis.codeSmells.length,
    patternsUsed: analysis.patterns.length,
    overallScore: analysis.score,
    rating: analysis.score >= 80 ? 'Excellent' : 
            analysis.score >= 60 ? 'Good' : 
            analysis.score >= 40 ? 'Fair' : 'Needs Improvement'
  };
};

// Format analysis for display
export const formatAnalysisReport = (analysis) => {
  return `
CODE QUALITY ANALYSIS REPORT
================================
Overall Score: ${analysis.score}/100

COMPLEXITY METRICS:
- Time Complexity: ${analysis.timeComplexity}
- Space Complexity: ${analysis.spaceComplexity}

CODE METRICS:
- Lines of Code: ${analysis.metrics.lines}
- Functions: ${analysis.metrics.functions}
- Comments: ${analysis.metrics.comments}

DESIGN PATTERNS DETECTED: ${analysis.patterns.length}
${analysis.patterns.map(p => `  ✓ ${p.name}: ${p.description}`).join('\n')}

CODE SMELLS: ${analysis.codeSmells.length}
${analysis.codeSmells.map(s => `  ⚠ ${s.type} (${s.severity}): ${s.description}`).join('\n')}

TOP SUGGESTIONS:
${analysis.suggestions.map((s, i) => `  ${i + 1}. [${s.priority}] ${s.suggestion}\n     → ${s.action}`).join('\n')}
`.trim();
};
