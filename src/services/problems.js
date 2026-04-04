export const PROBLEMS = {
  'Software Engineer': {
    'Easy': [
      {
        title: 'Two Sum',
        statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        defaultCode: 'function twoSum(nums, target) {\n  // Write your solution here\n}',
        testCases: [{ input: [[2, 7, 11, 15], 9], expected: [0, 1] }, { input: [[3, 2, 4], 6], expected: [1, 2] }],
        hints: [
          'Try using a hash map to store values you have seen and their indices',
          'For each number, check if (target - number) exists in the hash map',
          'Time complexity should be O(n), Space complexity O(n)'
        ],
        examples: `// Example 1:
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] == 9, return [0, 1]

// Example 2:
Input: nums = [3, 2, 4], target = 6
Output: [1, 2]
Explanation: nums[1] + nums[2] == 6, return [1, 2]

// Approach: Use a hash map
const map = {};
for (let i = 0; i < nums.length; i++) {
  const complement = target - nums[i];
  if (map[complement] !== undefined) {
    return [map[complement], i];
  }
  map[nums[i]] = i;
}`
      },
      {
        title: 'Is Palindrome Number',
        statement: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
        defaultCode: 'function isPalindrome(x) {\n  // Write your solution here\n}',
        testCases: [{ input: [121], expected: true }, { input: [-121], expected: false }, { input: [10], expected: false }],
        hints: [
          'Negative numbers are never palindromes',
          'You could reverse the number and compare, or convert to string',
          'Consider: what about numbers ending in 0? (e.g., 10, 120)'
        ],
        examples: `// Example 1:
Input: x = 121
Output: true
Explanation: 121 reads the same forwards and backwards

// Example 2:
Input: x = -121
Output: false
Explanation: Negatives are not palindromes

// Approach 1: Convert to String
function isPalindrome(x) {
  if (x < 0) return false;
  const str = x.toString();
  return str === str.split('').reverse().join('');
}

// Approach 2: Math (reverse the number)
function isPalindrome(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let reversed = 0;
  while (x > reversed) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === reversed || x === Math.floor(reversed / 10);
}`
      },
      {
        title: 'Valid Parentheses',
        statement: 'Given a string containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
        defaultCode: 'function isValid(s) {\n  // Write your solution here\n}',
        testCases: [{ input: ["()[]{}"], expected: true }, { input: ["(]"], expected: false }, { input: ["([)]"], expected: false }],
        hints: [
          'Use a Stack data structure',
          'When you see an opening bracket, push it to stack',
          'When you see a closing bracket, check if it matches the top of stack',
          'At the end, the stack should be empty'
        ],
        examples: `// Example 1:
Input: s = "()[]"
Output: true

// Example 2:
Input: s = "([)]"
Output: false
Explanation: "[" is closed by ")" instead of "]"

// Solution using Stack:
function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };
  
  for (let char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`
      },
      {
        title: 'Merge Two Sorted Lists',
        statement: 'Merge two sorted arrays and return it as a new sorted array.',
        defaultCode: 'function mergeTwoLists(l1, l2) {\n  // Write your solution here\n}',
        testCases: [{ input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] }],
        hints: [
          'Use two pointers, one for each array',
          'Compare elements at both pointers and append the smaller one',
          'Move the pointer for the array from which you took the element',
          'After one array is exhausted, append all remaining elements from the other'
        ],
        examples: `// Example:
Input: l1 = [1, 2, 4], l2 = [1, 3, 4]
Output: [1, 1, 2, 3, 4, 4]

// Two Pointer Approach:
function mergeTwoLists(l1, l2) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < l1.length && j < l2.length) {
    if (l1[i] <= l2[j]) {
      result.push(l1[i++]);
    } else {
      result.push(l2[j++]);
    }
  }
  
  return result.concat(l1.slice(i)).concat(l2.slice(j));
}`
      },
      {
        title: 'Maximum Subarray',
        statement: 'Find the contiguous subarray which has the largest sum and return its sum.',
        defaultCode: 'function maxSubArray(nums) {\n  // Write your solution here\n}',
        testCases: [{ input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 }],
        hints: [
          'This is the classic Kadane\'s algorithm problem',
          'Keep track of the maximum sum ending at current position',
          'At each position, decide whether to extend the existing subarray or start new',
          'Time complexity: O(n), Space complexity: O(1)'
        ],
        examples: `// Example:
Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6
Explanation: [4, -1, 2, 1] has the largest sum = 6

// Kadane's Algorithm:
function maxSubArray(nums) {
  let maxCurrent = nums[0];
  let maxGlobal = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    maxCurrent = Math.max(nums[i], maxCurrent + nums[i]);
    if (maxCurrent > maxGlobal) {
      maxGlobal = maxCurrent;
    }
  }
  return maxGlobal;
}`
      },
      {
        title: 'Contains Duplicate',
        statement: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        defaultCode: 'function containsDuplicate(nums) {\n  // Write your solution here\n}',
        testCases: [{ input: [[1, 2, 3, 1]], expected: true }, { input: [[1, 2, 3, 4]], expected: false }],
        hints: [
          'Use a Set data structure to track seen numbers',
          'If a number is already in the set, return true',
          'If we complete the loop without finding duplicates, return false'
        ],
        examples: `// Example:
Input: nums = [1, 2, 3, 1]
Output: true

// Solution using Set:
function containsDuplicate(nums) {
  const seen = new Set();
  for (let num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}`
      },
      {
        title: 'Reverse String',
        statement: 'Write a function that reverses a string. The input string is given as an array of characters s.',
        defaultCode: 'function reverseString(s) {\n  // Write your solution here\n}',
        testCases: [{ input: [['h', 'e', 'l', 'l', 'o']], expected: ['o', 'l', 'l', 'e', 'h'] }],
        hints: [
          'Use two pointers: one at start, one at end',
          'Swap characters and move inward',
          'Can also use built-in reverse method'
        ],
        examples: `// Example:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]

// Two Pointer Approach:
function reverseString(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}`
      }
    ],
    'Medium': [
      {
        title: 'Group Anagrams',
        statement: 'Given an array of strings strs, group the anagrams together.',
        defaultCode: 'function groupAnagrams(strs) {\n  // Write your solution here\n}',
        testCases: [{ input: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] }],
        hints: [
          'Anagrams have the same characters when sorted',
          'Sort each string and use it as a key in a hash map',
          'Group strings by their sorted form',
          'Alternative: use character count as key'
        ],
        examples: `// Example:
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

// Solution using sorted strings as key:
function groupAnagrams(strs) {
  const map = {};
  
  for (let str of strs) {
    const sorted = str.split('').sort().join('');
    if (!map[sorted]) {
      map[sorted] = [];
    }
    map[sorted].push(str);
  }
  
  return Object.values(map);
}`
      },
      {
        title: '3Sum',
        statement: 'Return all unique triplets that sum to zero.',
        defaultCode: 'function threeSum(nums) {\n  // Write your solution here\n}',
        testCases: [{ input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] }]
      },
      {
        title: 'Longest Substring',
        statement: 'Find the length of the longest substring without repeating characters.',
        defaultCode: 'function lengthOfLongestSubstring(s) {\n  // Write your solution here\n}',
        testCases: [{ input: ["abcabcbb"], expected: 3 }],
        hints: [
          'Use the Sliding Window technique with two pointers',
          'Use a Set or Map to track characters in current window',
          'Move right pointer to expand window, left pointer when duplicate found',
          'Track maximum length seen'
        ],
        examples: `// Example:
Input: s = "abcabcbb"
Output: 3
Explanation: "abc" is the longest without repeating characters

// Sliding Window Solution:
function lengthOfLongestSubstring(s) {
  const charIndex = {};
  let maxLength = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    if (charIndex[s[right]] !== undefined && charIndex[s[right]] >= left) {
      left = charIndex[s[right]] + 1;
    }
    charIndex[s[right]] = right;
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}`
      },
      {
        title: 'Binary Tree Level Order',
        statement: 'Return the level order traversal of a tree (represented as [val, left, right]).',
        defaultCode: 'function levelOrder(root) {\n  // Write your solution here\n}',
        testCases: [{ input: [[3, [9, null, null], [20, [15, null, null], [7, null, null]]]], expected: [[3], [9, 20], [15, 7]] }]
      },
      {
        title: 'Course Schedule',
        statement: 'Check if you can finish all courses given prerequisites.',
        defaultCode: 'function canFinish(numCourses, prerequisites) {\n  // Write your solution here\n}',
        testCases: [{ input: [2, [[1, 0]]], expected: true }]
      },
      {
        title: 'Add Two Numbers (Linked Lists)',
        statement: 'You are given two non-empty linked lists representing two non-negative integers in reverse order. Add them together and return the sum as a linked list.',
        defaultCode: 'function addTwoNumbers(l1, l2) {\n  // Write your solution here\n}',
        testCases: [{ input: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] }],
        hints: [
          'Traverse both lists simultaneously',
          'Keep track of carry for each digit',
          'Handle the final carry if it exists'
        ]
      },
      {
        title: 'Rotate Array',
        statement: 'Rotate the array to the right by k steps.',
        defaultCode: 'function rotate(nums, k) {\n  // Write your solution here\n}',
        testCases: [{ input: [[1, 2, 3, 4, 5], 2], expected: [4, 5, 1, 2, 3] }],
        hints: [
          'Consider reversing the array parts',
          'Reverse first k elements from the end, then the rest, then the whole array'
        ]
      },
      {
        title: 'Intersection of Two Arrays',
        statement: 'Given two integer arrays nums1 and nums2, return an array of their intersection.',
        defaultCode: 'function intersection(nums1, nums2) {\n  // Write your solution here\n}',
        testCases: [{ input: [[1, 2, 2, 1], [2, 2]], expected: [2] }],
        hints: [
          'Convert one array to a Set for O(1) lookup',
          'Iterate through the other array and find common elements'
        ]
      }
    ],
    'Hard': [
      {
        title: 'Trapping Rain Water',
        statement: 'Compute how much water an elevation map can trap.',
        defaultCode: 'function trap(height) {\n  // Write your solution here\n}',
        testCases: [{ input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 }]
      },
      {
        title: 'Median of Two Sorted Arrays',
        statement: 'Return the median of two sorted arrays.',
        defaultCode: 'function findMedianSortedArrays(nums1, nums2) {\n  // Write your solution here\n}',
        testCases: [{ input: [[1, 3], [2]], expected: 2.0 }]
      },
      {
        title: 'Merge k Sorted Lists',
        statement: 'Merge k sorted arrays into one.',
        defaultCode: 'function mergeKLists(lists) {\n  // Write your solution here\n}',
        testCases: [{ input: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] }]
      },
      {
        title: 'Word Search II',
        statement: 'Find all words on an m x n board of characters.',
        defaultCode: 'function findWords(board, words) {\n  // Write your solution here\n}',
        testCases: [{ input: [[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"]], expected: ["oath","eat"] }]
      },
      {
        title: 'Regex Matching',
        statement: 'Implement support for "." and "*".',
        defaultCode: 'function isMatch(s, p) {\n  // Write your solution here\n}',
        testCases: [{ input: ["aa", "a*"], expected: true }]
      },
      {
        title: 'Wildcard Matching',
        statement: 'Given an input string s and a pattern p, implement wildcard pattern matching with support for \'?\' and \'*\'.',
        defaultCode: 'function isMatch(s, p) {\n  // Write your solution here\n}',
        testCases: [{ input: ["aa", "a"], expected: false }, { input: ["aa", "*"], expected: true }],
        hints: [
          'Use dynamic programming',
          'Track matching state for both string and pattern positions'
        ]
      },
      {
        title: 'Serialize and Deserialize Binary Tree',
        statement: 'Design an algorithm to serialize and deserialize a binary tree.',
        defaultCode: 'function serialize(root) {} function deserialize(data) {}',
        testCases: [{ input: [], expected: "function" }],
        hints: [
          'Consider level-order traversal or pre-order traversal',
          'Handle null nodes appropriately'
        ]
      },
      {
        title: 'LRU Cache',
        statement: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
        defaultCode: 'class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, value) {}\n}',
        testCases: [{ input: [], expected: "object" }],
        hints: [
          'Use a HashMap and a Doubly Linked List',
          'HashMap provides O(1) lookup, Linked List maintains order'
        ]
      }
    ]
  },
  'Frontend Engineer': {
    'Easy': [
      {
        title: 'Hex to RGB Converter',
        statement: 'Convert hex code to rgb string.',
        defaultCode: 'function hexToRgb(hex) {\n  // Write your solution here\n}',
        testCases: [{ input: ["#ffffff"], expected: "rgb(255, 255, 255)" }, { input: ["#000000"], expected: "rgb(0, 0, 0)" }]
      },
      {
        title: 'Array Filter Polyfill',
        statement: 'Implement Array.prototype.myFilter.',
        defaultCode: 'Array.prototype.myFilter = function(cb) {\n  const res = [];\n  for(let i=0; i<this.length; i++) if(cb(this[i])) res.push(this[i]);\n  return res;\n};\nfunction test(a) { return a.myFilter(x => x > 1); }',
        testCases: [{ input: [[1, 2, 3]], expected: [2, 3] }]
      },
      {
        title: 'Flatten Array',
        statement: 'Recursively flatten a nested array.',
        defaultCode: 'function flatten(arr) {\n  // Write your solution here\n}',
        testCases: [{ input: [[1, [2, [3, 4]]]], expected: [1, 2, 3, 4] }]
      },
      {
        title: 'CSS Counter Unit',
        statement: 'Check if a string is a valid CSS length unit (px, rem, em, %).',
        defaultCode: 'function isValidUnit(s) {\n  // Write your solution here\n}',
        testCases: [{ input: ["10px"], expected: true }, { input: ["abc"], expected: false }]
      },
      {
        title: 'RGB to Hex',
        statement: 'Convert rgb(r, g, b) to hex.',
        defaultCode: 'function rgbToHex(r, g, b) {\n  // Write your solution here\n}',
        testCases: [{ input: [255, 255, 255], expected: "#ffffff" }]
      },
      {
        title: 'String to Number',
        statement: 'Convert a string to a number. Return 0 for invalid input.',
        defaultCode: 'function stringToNumber(s) {\n  // Write your solution here\n}',
        testCases: [{ input: ["123"], expected: 123 }, { input: ["abc"], expected: 0 }]
      },
      {
        title: 'Is Valid Email',
        statement: 'Check if a string is a valid email address.',
        defaultCode: 'function isValidEmail(email) {\n  // Write your solution here\n}',
        testCases: [{ input: ["user@example.com"], expected: true }, { input: ["invalid.email"], expected: false }]
      }
    ],
    'Medium': [
      {
        title: 'Debounce',
        statement: 'Implementation of debounce.',
        defaultCode: 'function debounce(fn, t) {\n  // Write your solution here\n}',
        testCases: [{ input: [() => {}, 100], expected: "function" }]
      },
      {
        title: 'Deep Clone',
        statement: 'Implementation of deep clone.',
        defaultCode: 'function deepClone(obj) {\n  // Write your solution here\n}',
        testCases: [{ input: [{ a: 1 }], expected: { a: 1 } }]
      },
      {
        title: 'EventEmitter',
        statement: 'Simple event emitter class.',
        defaultCode: 'class EventEmitter {\n  on(n, c) {}\n  emit(n, ...a) {}\n}',
        testCases: [{ input: [], expected: "object" }]
      },
      {
        title: 'Query String Manager',
        statement: 'Parse and stringify query params.',
        defaultCode: 'function qs(o) {\n  // Write your solution here\n}',
        testCases: [{ input: [{ a: 1 }], expected: "?a=1" }]
      },
      {
        title: 'Star Rating Logic',
        statement: 'Calculate star width percentage.',
        defaultCode: 'function stars(r) {\n  // Write your solution here\n}',
        testCases: [{ input: [3.5], expected: "70%" }]
      },
      {
        title: 'Throttle',
        statement: 'Implementation of throttle function.',
        defaultCode: 'function throttle(fn, delay) {\n  // Write your solution here\n}',
        testCases: [{ input: [() => {}, 200], expected: "function" }],
        hints: [
          'Throttle allows function to be called at most once per time period',
          'Track last execution time'
        ]
      },
      {
        title: 'Curry',
        statement: 'Transform a function with multiple arguments into a function that takes single arguments sequentially.',
        defaultCode: 'function curry(fn) {\n  // Write your solution here\n}',
        testCases: [{ input: [], expected: "function" }],
        hints: [
          'Return a new function that accumulates arguments',
          'Call the original function once we have all arguments'
        ]
      },
      {
        title: 'Promisify',
        statement: 'Convert a callback-based function to a promise-based function.',
        defaultCode: 'function promisify(fn) {\n  // Write your solution here\n}',
        testCases: [{ input: [], expected: "function" }]
      }
    ],
    'Hard': [
      {
        title: 'V-DOM Diff',
        statement: 'Basic tree diffing.',
        defaultCode: 'function diff(a, b) {\n  // Write your solution here\n}',
        testCases: [{ input: [1, 2], expected: "UPDATE" }]
      },
      {
        title: 'useFetch Hook Logic',
        statement: 'Simulate async hook states.',
        defaultCode: 'function useFetch(u) {\n  // Write your solution here\n}',
        testCases: [{ input: ["/"], expected: "object" }]
      },
      {
        title: 'Task Scheduler',
        statement: 'Manage concurrent tasks.',
        defaultCode: 'class Scheduler {\n  add(t) {}\n}',
        testCases: [{ input: [], expected: "object" }]
      },
      {
        title: 'Rich Text Parser',
        statement: 'Parse bold markdown.',
        defaultCode: 'function parse(s) {\n  // Write your solution here\n}',
        testCases: [{ input: ["**a**"], expected: "<b>a</b>" }]
      },
      {
        title: 'Masonry Layout Math',
        statement: 'Calculate column indices.',
        defaultCode: 'function masonry(h, c) {\n  // Write your solution here\n}',
        testCases: [{ input: [[10, 20], 2], expected: [0, 1] }]
      },
      {
        title: 'Intersection Observer Implementation',
        statement: 'Create a simple intersection observer to detect when elements enter viewport.',
        defaultCode: 'class SimpleObserver {\n  constructor(callback) {}\n  observe(element) {}\n  unobserve(element) {}\n}',
        testCases: [{ input: [], expected: "object" }],
        hints: [
          'Track element positions relative to viewport',
          'Implement getBoundingClientRect logic'
        ]
      },
      {
        title: 'Memoization with Cache',
        statement: 'Implement a memoization function that caches expensive computations.',
        defaultCode: 'function memoize(fn) {\n  // Write your solution here\n}',
        testCases: [{ input: [], expected: "function" }],
        hints: [
          'Use a Map or object to store computed results',
          'Return cached result if arguments have been seen before'
        ]
      }
    ]
  },
  'Backend Engineer': {
    'Easy': [
      {
        title: 'Query Parser',
        statement: 'Parse URL query string to object.',
        defaultCode: 'function parse(s) {\n  // Write your solution here\n}',
        testCases: [{ input: ["?a=1"], expected: { a: "1" } }]
      },
      {
        title: 'JWT Token Decoder',
        statement: 'Decode JWT payload.',
        defaultCode: 'function decode(t) {\n  // Write your solution here\n}',
        testCases: [{ input: ["a.eyJiIjoyfQ.c"], expected: { b: 2 } }]
      },
      {
        title: 'CSV Parser',
        statement: 'Convert CSV to JSON.',
        defaultCode: 'function csv(s) {\n  // Write your solution here\n}',
        testCases: [{ input: ["a,b\n1,2"], expected: [{ a: "1", b: "2" }] }]
      },
      {
        title: 'Anagram Check',
        statement: 'Check if two strings are anagrams.',
        defaultCode: 'function isAnagram(s, t) {\n  // Write your solution here\n}',
        testCases: [{ input: ["a", "a"], expected: true }]
      },
      {
        title: 'FizzBuzz',
        statement: 'Return fizzbuzz array.',
        defaultCode: 'function fizz(n) {\n  // Write your solution here\n}',
        testCases: [{ input: [3], expected: [1, 2, "Fizz"] }]
      },
      {
        title: 'JSON Parser',
        statement: 'Parse a JSON-like string into an object.',
        defaultCode: 'function parseJSON(s) {\n  // Write your solution here\n}',
        testCases: [{ input: ['{"a":1}'], expected: { a: 1 } }],
        hints: [
          'Handle strings, numbers, booleans, null, arrays, and objects',
          'Use recursion for nested structures'
        ]
      },
      {
        title: 'URL Parser',
        statement: 'Parse a URL string into components.',
        defaultCode: 'function parseURL(url) {\n  // Write your solution here\n}',
        testCases: [{ input: ["https://example.com:8080/path?query=1"], expected: "object" }],
        hints: [
          'Extract protocol, domain, port, path, and query string',
          'Handle optional components'
        ]
      }
    ],
    'Medium': [
      {
        title: 'Promise.all',
        statement: 'Polyfill for Promise.all.',
        defaultCode: 'function all(p) {\n  // Write your solution here\n}',
        testCases: [{ input: [[]], expected: [] }]
      },
      {
        title: 'Express Middleware',
        statement: 'Run middleware chain.',
        defaultCode: 'function run(req, res, stack) {\n  // Write your solution here\n}',
        testCases: [{ input: [{}, {}, []], expected: true }]
      },
      {
        title: 'Memoize',
        statement: 'Cache function results.',
        defaultCode: 'function memo(f) {\n  // Write your solution here\n}',
        testCases: [{ input: [x => x], expected: "function" }]
      },
      {
        title: 'Token Bucket',
        statement: 'Basic rate limit logic.',
        defaultCode: 'class Bucket {\n  consume() {}\n}',
        testCases: [{ input: [], expected: "object" }]
      },
      {
        title: 'SQL Builder',
        statement: 'Build SELECT query.',
        defaultCode: 'class SQL {\n  build() {}\n}',
        testCases: [{ input: [], expected: "string" }]
      },
      {
        title: 'HTTP Cache Headers',
        statement: 'Determine if cached response is still valid.',
        defaultCode: 'function isValidCache(headers, age) {\n  // Write your solution here\n}',
        testCases: [{ input: [{ "cache-control": "max-age=3600" }, 1800], expected: true }],
        hints: [
          'Parse Cache-Control headers',
          'Compare current age with max-age'
        ]
      },
      {
        title: 'Connection Pool',
        statement: 'Manage a pool of database connections.',
        defaultCode: 'class ConnectionPool {\n  getConnection() {}\n  releaseConnection(conn) {}\n}',
        testCases: [{ input: [], expected: "object" }]
      }
    ],
    'Hard': [
      {
        title: 'LRU Cache',
        statement: 'O(1) cache structure.',
        defaultCode: 'class LRU {\n  get(k) {}\n  put(k, v) {}\n}',
        testCases: [{ input: [2], expected: "object" }]
      },
      {
        title: 'Snowflake IDs',
        statement: 'Unique ID generation.',
        defaultCode: 'function snowflake() {\n  // Write your solution here\n}',
        testCases: [{ input: [], expected: "string" }]
      },
      {
        title: 'Pub/Sub Topics',
        statement: 'Topic-based messaging.',
        defaultCode: 'class PS {\n  pub(t, d) {}\n  sub(t, c) {}\n}',
        testCases: [{ input: [], expected: "object" }]
      },
      {
        title: 'Reverse Proxy',
        statement: 'Path based routing.',
        defaultCode: 'function proxy(p, t) {\n  // Write your solution here\n}',
        testCases: [{ input: ["/a", {"/a": "s1"}], expected: "s1" }]
      },
      {
        title: 'DI Container',
        statement: 'Register and resolve deps.',
        defaultCode: 'class DI {\n  reg(n, d) {}\n  get(n) {}\n}',
        testCases: [{ input: [], expected: "object" }]
      },
      {
        title: 'Message Queue System',
        statement: 'Implement a basic pub/sub message queue.',
        defaultCode: 'class MessageQueue {\n  publish(topic, message) {}\n  subscribe(topic, handler) {}\n}',
        testCases: [{ input: [], expected: "object" }],
        hints: [
          'Use a Map to store subscribers',
          'Notify all subscribers when message is published'
        ]
      },
      {
        title: 'Database Query Optimizer',
        statement: 'Analyze and optimize a database query plan.',
        defaultCode: 'function optimizeQuery(query) {\n  // Write your solution here\n}',
        testCases: [{ input: [], expected: "string" }],
        hints: [
          'Consider index usage, join order, filtering',
          'Estimate cost and suggest improvements'
        ]
      }
    ]
  },
  'HR Manager': {
    'Easy': [
      { 
        title: 'Communication & Clarity', 
        isBehavioral: true, 
        statement: 'Describe a time when you had to explain a complex concept to someone with little technical background. How did you ensure they understood?' 
      },
      { 
        title: 'Teamwork & Collaboration', 
        isBehavioral: true, 
        statement: 'Tell me about a project where you worked with a team that had different working styles. How did you adapt and collaborate?' 
      },
      { 
        title: 'Handling Feedback', 
        isBehavioral: true, 
        statement: 'Share an experience where you received critical feedback from a colleague or manager. How did you respond and what did you learn?' 
      },
      { 
        title: 'Time Management', 
        isBehavioral: true, 
        statement: 'Tell me about a time when you had to juggle multiple priorities. How did you manage your time to meet all deadlines?' 
      },
      { 
        title: 'Learning & Growth', 
        isBehavioral: true, 
        statement: 'Describe a skill you wanted to learn. What steps did you take to develop it and what was the outcome?' 
      },
      { 
        title: 'Problem Solving', 
        isBehavioral: true, 
        statement: 'Tell me about a challenge you faced at work and how you solved it. What would you do differently now?' 
      }
    ],
    'Medium': [
      { 
        title: 'Conflict Resolution', 
        isBehavioral: true, 
        statement: 'Describe a situation where you had to resolve a conflict between team members. How did you approach it to ensure a positive outcome?' 
      },
      { 
        title: 'Leadership & Influence', 
        isBehavioral: true, 
        statement: 'Tell me about a time you led a project or initiative. How did you inspire and motivate your team?' 
      },
      { 
        title: 'Cross-functional Collaboration', 
        isBehavioral: true, 
        statement: 'Share an example where you had to work with people from different departments. How did you bridge the differences and achieve the goal?' 
      },
      { 
        title: 'Handling Change', 
        isBehavioral: true, 
        statement: 'Describe a significant change in your workplace. How did you adapt to it and help others adapt?' 
      },
      { 
        title: 'Initiative & Ownership', 
        isBehavioral: true, 
        statement: 'Tell me about a time you took ownership of a project beyond your job description. What motivated you and what was the result?' 
      },
      { 
        title: 'Decision Making Under Pressure', 
        isBehavioral: true, 
        statement: 'Describe a situation where you had to make a quick decision with incomplete information. What was your approach and outcome?' 
      }
    ],
    'Hard': [
      { 
        title: 'Ethical Dilemma', 
        isBehavioral: true, 
        statement: 'Tell me about a time you faced an ethical dilemma at work. How did you handle it and what was the result? What would you do differently?' 
      },
      { 
        title: 'Strategic Thinking', 
        isBehavioral: true, 
        statement: 'Describe a time when you had to develop a long-term strategy for an initiative. How did you align it with organizational goals?' 
      },
      { 
        title: 'High-Stakes Stakeholder Management', 
        isBehavioral: true, 
        statement: 'Share an experience managing a critical project with multiple stakeholders having conflicting interests. How did you balance them?' 
      },
      { 
        title: 'Organizational Change Leadership', 
        isBehavioral: true, 
        statement: 'Tell me about a time you led or influenced a major organizational change. How did you overcome resistance and drive adoption?' 
      },
      { 
        title: 'Mentoring & Development', 
        isBehavioral: true, 
        statement: 'Describe your approach to mentoring or developing junior team members. Tell me about someone you\'ve helped grow and the impact.' 
      },
      { 
        title: 'Crisis Management', 
        isBehavioral: true, 
        statement: 'Share an experience where you had to manage a crisis or critical incident. How did you stay calm and lead the team to resolution?' 
      }
    ]
  }
};
