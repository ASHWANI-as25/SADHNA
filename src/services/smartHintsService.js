/**
 * Smart Hints System - Progressive hints based on code analysis
 */

/**
 * Smart Hints Manager
 */
export class SmartHintsManager {
  constructor() {
    this.hintsUsed = [];
    this.hintsAvailable = 3;
    this.lastAnalysis = null;
    this.hintHistory = {};
  }

  /**
   * Get hint based on current code
   */
  getHint(code, difficulty, problemId, currentHintLevel = 0) {
    if (this.hintsUsed.length >= this.hintsAvailable) {
      return {
        hint: '❌ No more hints available!',
        level: 'exhausted',
        isAvailable: false
      };
    }

    const analysis = this.analyzeCodeIssues(code, difficulty);
    const hint = this.generateHintFromAnalysis(analysis, difficulty, currentHintLevel);

    this.hintsUsed.push({
      problemId,
      timestamp: Date.now(),
      level: currentHintLevel,
      hint
    });

    return {
      hint: hint.text,
      level: hint.level,
      category: hint.category,
      isAvailable: true,
      hintsRemaining: this.hintsAvailable - this.hintsUsed.length
    };
  }

  /**
   * Analyze code to identify issues
   */
  analyzeCodeIssues(code, difficulty) {
    const issues = {
      logic: { detected: false, severity: 'low' },
      performance: { detected: false, severity: 'medium' },
      edgeCase: { detected: false, severity: 'high' },
      syntax: { detected: false, severity: 'critical' },
      structure: { detected: false, severity: 'medium' }
    };

    // Check for empty code
    if (!code || code.trim().length === 0) {
      issues.syntax.detected = true;
      return issues;
    }

    // Check for common logic errors
    if (code.includes('===') && code.includes('==')) {
      issues.logic.detected = true;
    }

    // Check for O(n²) or worse complexity
    if (code.match(/for.*for|while.*while/g)) {
      issues.performance.detected = true;
    }

    // Check for missing edge cases
    if (!code.includes('null') && !code.includes('undefined') && !code.includes('length') && difficulty !== 'easy') {
      issues.edgeCase.detected = true;
    }

    // Check for array/string methods not used
    if (difficulty === 'medium' || difficulty === 'hard') {
      if (!code.includes('map') && !code.includes('filter') && !code.includes('reduce')) {
        issues.structure.detected = true;
      }
    }

    // Check for proper return statements
    if (code.includes('function') && !code.includes('return')) {
      issues.logic.detected = true;
    }

    return issues;
  }

  /**
   * Generate hint from analysis
   */
  generateHintFromAnalysis(analysis, difficulty, level) {
    const hints = {
      logic: [
        {
          level: 1,
          text: '💡 Hint: Check your logic flow. Have you tested with simple examples?'
        },
        {
          level: 2,
          text: '💡 Hint: Consider edge cases like empty input, null values, or single elements.'
        },
        {
          level: 3,
          text: '💡 Hint: Try walking through your solution step-by-step on paper with a test case.'
        }
      ],
      performance: [
        {
          level: 1,
          text: '⚡ Performance Hint: Your solution might be too slow. Look for nested loops.'
        },
        {
          level: 2,
          text: '⚡ Performance Hint: Consider using a hash map or Set to reduce time complexity.'
        },
        {
          level: 3,
          text: '⚡ Performance Hint: Try sorting the input or using a two-pointer approach.'
        }
      ],
      edgeCase: [
        {
          level: 1,
          text: '🎯 Edge Case Hint: What happens with an empty input or single element?'
        },
        {
          level: 2,
          text: '🎯 Edge Case Hint: Don\'t forget to handle null, undefined, or negative numbers.'
        },
        {
          level: 3,
          text: '🎯 Edge Case Hint: Test with boundary values: 0, 1, -1, and the maximum size.'
        }
      ],
      syntax: [
        {
          level: 1,
          text: '❌ Syntax Issue: Check your parentheses, brackets, and semicolons.'
        },
        {
          level: 2,
          text: '❌ Syntax Issue: Make sure all opening braces have matching closing braces.'
        },
        {
          level: 3,
          text: '❌ Syntax Issue: Enable code formatting to highlight any syntax errors.'
        }
      ],
      structure: [
        {
          level: 1,
          text: '📐 Structure Hint: Your code structure could be optimized. Use array methods like map, filter, or reduce.'
        },
        {
          level: 2,
          text: '📐 Structure Hint: Consider breaking this into smaller helper functions.'
        },
        {
          level: 3,
          text: '📐 Structure Hint: Use functional programming patterns for cleaner code.'
        }
      ]
    };

    // Find the most relevant issue
    const primaryIssue = Object.keys(analysis).find(issue => analysis[issue].detected);
    
    if (!primaryIssue || !hints[primaryIssue]) {
      return {
        level: 'general',
        text: this.getGeneralHint(difficulty, level),
        category: 'general'
      };
    }

    const issueHints = hints[primaryIssue];
    const hintToReturn = issueHints[Math.min(level, issueHints.length - 1)];

    return {
      level: primaryIssue,
      text: hintToReturn.text,
      category: primaryIssue
    };
  }

  /**
   * Get general hint based on difficulty
   */
  getGeneralHint(difficulty, level) {
    const hints = {
      easy: [
        '💡 Start with the simplest approach. What\'s the most straightforward solution?',
        '💡 Try breaking the problem into smaller steps.',
        '💡 Use basic operations first, optimize later.'
      ],
      medium: [
        '💡 What data structure would make this more efficient?',
        '💡 Can you solve this with a single pass through the data?',
        '💡 Consider common patterns: sliding window, two pointers, or hash map.'
      ],
      hard: [
        '💡 This might require dynamic programming or a clever insight.',
        '💡 What\'s the mathematical property or pattern here?',
        '💡 Try working backwards from the desired output.'
      ]
    };

    const difficultyHints = hints[difficulty] || hints.medium;
    return difficultyHints[level % difficultyHints.length];
  }

  /**
   * Get focused hints for specific scenarios
   */
  getFocusedHint(problemType, difficulty, attemptCount = 0) {
    const focusedHints = {
      'two-sum': {
        easy: [
          '💡 Try iterating through the array and checking if the complement exists.',
          '💡 Use a Set or Map to store seen numbers.',
          '💡 For each number, check if (target - number) exists.'
        ],
        medium: [
          '💡 Can you sort the array and use two pointers?',
          '💡 Time complexity should be O(n), not O(n²).',
          '💡 Consider the trade-off between time and space.'
        ]
      },
      'array-manipulation': {
        easy: [
          '💡 Can you modify the array in-place?',
          '💡 Do you need extra space?',
          '💡 Try iterating from start or end?'
        ],
        medium: [
          '💡 Can you do this without creating a new array?',
          '💡 Watch out for off-by-one errors.',
          '💡 Consider using indices vs creating new structures.'
        ]
      },
      'string-problem': {
        easy: [
          '💡 Remember strings are immutable in JavaScript.',
          '💡 Try converting to an array first.',
          '💡 Use string methods like split(), join(), etc.'
        ],
        medium: [
          '💡 Can you avoid creating many intermediate strings?',
          '💡 Consider palindrome checking or pattern matching.',
          '💡 Use regular expressions if appropriate.'
        ]
      },
      'tree-traversal': {
        medium: [
          '💡 Should you use DFS or BFS?',
          '💡 Remember to track visited nodes.',
          '💡 Consider both recursive and iterative solutions.'
        ],
        hard: [
          '💡 Watch the space complexity of your recursion stack.',
          '💡 Is there a pattern in the tree structure you can exploit?',
          '💡 Consider backtracking if you need to explore all paths.'
        ]
      },
      'dynamic-programming': {
        medium: [
          '💡 Define the state: what does dp[i] represent?',
          '💡 Identify the recurrence relation.',
          '💡 What are your base cases?'
        ],
        hard: [
          '💡 Try solving small examples manually first.',
          '💡 Can you optimize space complexity?',
          '💡 Is memoization enough or do you need bottom-up DP?'
        ]
      }
    };

    const typeHints = focusedHints[problemType]?.[difficulty] || [];
    if (typeHints.length === 0) return this.getGeneralHint(difficulty, attemptCount);

    return typeHints[attemptCount % typeHints.length];
  }

  /**
   * Check if code is on right track
   */
  isCodeOnTrack(code, expectedPatterns) {
    let matchCount = 0;

    expectedPatterns.forEach(pattern => {
      if (code.includes(pattern) || new RegExp(pattern).test(code)) {
        matchCount++;
      }
    });

    const matchPercentage = (matchCount / expectedPatterns.length) * 100;

    return {
      onTrack: matchPercentage >= 50,
      matchPercentage,
      message: matchPercentage >= 75
        ? '✅ Great! You\'re on the right track!'
        : matchPercentage >= 50
        ? '🟡 You\'re heading in the right direction...'
        : '❌ Not quite on track. Review the hint above.'
    };
  }

  /**
   * Get solution overview (non-spoiling)
   */
  getSolutionOverview(problemType) {
    const overviews = {
      'two-sum': 'Use a helper data structure to store seen values, then check complements.',
      'array-manipulation': 'Consider whether you need extra space or can modify in-place.',
      'string-problem': 'Remember string operations; consider array conversion for manipulation.',
      'tree-traversal': 'Choose between depth-first (stack) and breadth-first (queue) approaches.',
      'dynamic-programming': 'Break into subproblems and build up solutions from smaller cases.',
      'sliding-window': 'Maintain a window of fixed or variable size; expand/contract as needed.',
      'graph': 'Model entities as nodes and relationships as edges; use appropriate traversal.'
    };

    return overviews[problemType] || 'Break this into smaller steps and solve incrementally.';
  }

  /**
   * Reset hints for new problem
   */
  resetHints() {
    this.hintsUsed = [];
    this.hintsAvailable = 3;
  }

  /**
   * Get hint statistics
   */
  getStatistics() {
    return {
      hintsUsed: this.hintsUsed.length,
      hintsAvailable: this.hintsAvailable,
      hintsRemaining: this.hintsAvailable - this.hintsUsed.length,
      usageHistory: this.hintsUsed
    };
  }
}

// Export factory function
export const createSmartHintsManager = () => new SmartHintsManager();

export default {
  SmartHintsManager,
  createSmartHintsManager
};
