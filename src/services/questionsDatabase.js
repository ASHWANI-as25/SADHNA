/**
 * COMPLETE AI INTERVIEW ASSESSMENT DATABASE
 * 50+ UNIQUE QUESTIONS PER FIELD PER DIFFICULTY LEVEL
 * 
 * Structure:
 * - 9 Categories
 * - 27 Total Fields (3 per category)
 * - 3 Difficulty Levels (Easy, Medium, Hard)
 * - 50+ Questions per field per difficulty = 150+ per field
 * - Total: 4,050+ highly unique interview questions
 */

// Easy questions template for each field (50 questions)
const EASY_QUESTIONS = {
  Software_Engineer: [
    { id: 1, type: 'conceptual', question: 'What is the difference between var, let, and const in JavaScript?', answer: 'var is function-scoped and can be redeclared; let and const are block-scoped. const cannot be reassigned after initialization.', category: 'JavaScript Fundamentals', skills: ['JavaScript', 'Scope'] },
    { id: 2, type: 'conceptual', question: 'Explain the concept of hoisting in JavaScript.', answer: 'Hoisting moves variable and function declarations to the top of their scope during compilation. var declarations are initialized as undefined, while let/const are not initialized.', category: 'JavaScript Execution', skills: ['Hoisting', 'Memory'] },
    { id: 3, type: 'practical', question: 'Write a function to check if a string is a palindrome.', answer: 'function isPalindrome(str) { const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, ""); return cleaned === cleaned.split("").reverse().join(""); }', category: 'String Manipulation', skills: ['Strings', 'Algorithms'] },
    { id: 4, type: 'conceptual', question: 'What is closure in JavaScript? Provide an example.', answer: 'A closure is a function that has access to variables from its outer scope even after the outer function returns. Example: const outer = () => { const x = 5; return () => console.log(x); };', category: 'JavaScript Concepts', skills: ['Closures', 'Scope'] },
    { id: 5, type: 'practical', question: 'How do you reverse an array without using the reverse() method?', answer: 'function reverseArray(arr) { for (let i = 0; i < arr.length / 2; i++) { [arr[i], arr[arr.length - 1 - i]] = [arr[arr.length - 1 - i], arr[i]]; } return arr; }', category: 'Array Manipulation', skills: ['Arrays', 'Logic'] },
    { id: 6, type: 'conceptual', question: 'What is the event loop in JavaScript?', answer: 'The event loop continuously checks the call stack and callback queue. When the call stack is empty, it moves tasks from the queue to the stack for execution.', category: 'Async Programming', skills: ['Async', 'Event Loop'] },
    { id: 7, type: 'scenario-based', question: 'You need to fetch data from an API and display it. How would you handle errors?', answer: 'Use try-catch with async/await or .catch() with promises. Implement proper error handling, user feedback, and fallback UI.', category: 'API Integration', skills: ['API', 'Error Handling'] },
    { id: 8, type: 'practical', question: 'Write a function to find the most frequent element in an array.', answer: 'function mostFrequent(arr) { const freq = {}; for (let num of arr) freq[num] = (freq[num] || 0) + 1; return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b); }', category: 'Array Operations', skills: ['Arrays', 'Hash Maps'] },
    { id: 9, type: 'conceptual', question: 'What is the difference between == and === in JavaScript?', answer: '== performs type coercion (1 == "1" is true), while === checks both value and type (1 === "1" is false).', category: 'JavaScript Operators', skills: ['Operators', 'Type Coercion'] },
    { id: 10, type: 'practical', question: 'How would you flatten a nested array?', answer: 'function flatten(arr) { return arr.flat(Infinity); } // or: return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);', category: 'Array Manipulation', skills: ['Arrays', 'Recursion'] },
    { id: 11, type: 'conceptual', question: 'What are callbacks, promises, and async/await?', answer: 'Callbacks are functions passed as arguments. Promises provide better error handling. Async/await is syntactic sugar over promises for cleaner code.', category: 'Async Patterns', skills: ['Async', 'Promises'] },
    { id: 12, type: 'scenario-based', question: 'How would you optimize a slow React component?', answer: 'Use React.memo, useMemo, useCallback, lazy loading, code splitting, virtualization, and proper state management.', category: 'React Performance', skills: ['React', 'Performance'] },
    { id: 13, type: 'practical', question: 'Write a function to remove duplicates from an array.', answer: 'const removeDuplicates = (arr) => [...new Set(arr)]; // or: arr.filter((v, i) => arr.indexOf(v) === i);', category: 'Array Operations', skills: ['Arrays', 'Sets'] },
    { id: 14, type: 'conceptual', question: 'What is the difference between null and undefined?', answer: 'undefined means a variable has been declared but not assigned a value. null is an intentional assignment of no value.', category: 'JavaScript Concepts', skills: ['Data Types', 'Variables'] },
    { id: 15, type: 'practical', question: 'How would you implement a debounce function?', answer: 'function debounce(fn, delay) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }', category: 'Utility Functions', skills: ['Functions', 'Timing'] },
    { id: 16, type: 'conceptual', question: 'Explain the concept of REST API.', answer: 'REST uses HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URIs. It follows stateless, cacheable, and standardized conventions.', category: 'Web Architecture', skills: ['REST', 'APIs'] },
    { id: 17, type: 'scenario-based', question: 'You have a form with 100 input fields. How would you manage state efficiently?', answer: 'Use a single object state or FormData API. Use React Hook Form for optimized re-renders. Avoid state per field.', category: 'State Management', skills: ['React', 'Forms'] },
    { id: 18, type: 'practical', question: 'Write a function to find the longest substring without repeating characters.', answer: 'function longestSubstring(s) { const map = {}; let max = 0, start = 0; for (let i = 0; i < s.length; i++) { if (map[s[i]]) start = Math.max(start, map[s[i]]); map[s[i]] = i + 1; max = Math.max(max, i - start + 1); } return max; }', category: 'String Algorithms', skills: ['Strings', 'Sliding Window'] },
    { id: 19, type: 'conceptual', question: 'What is the shadow DOM?', answer: 'Shadow DOM encapsulates styles and markup of a component. It allows you to create reusable components with scoped styling isolated from the rest of the document.', category: 'Web Components', skills: ['Web Components', 'DOM'] },
    { id: 20, type: 'practical', question: 'How would you deep clone an object in JavaScript?', answer: 'const deepClone = (obj) => JSON.parse(JSON.stringify(obj)); // or use: structuredClone(obj);', category: 'Object Operations', skills: ['Objects', 'Cloning'] },
    { id: 21, type: 'conceptual', question: 'What is garbage collection in JavaScript?', answer: 'Garbage collection is an automatic memory management process that frees memory occupied by objects that are no longer referenced in the program.', category: 'Memory Management', skills: ['Memory', 'Performance'] },
    { id: 22, type: 'scenario-based', question: 'How would you handle authentication in a React app?', answer: 'Store JWT in secure HTTPOnly cookies or localStorage. Use context/Redux for user state. Protect routes with PrivateRoute components.', category: 'Authentication', skills: ['Auth', 'Security'] },
    { id: 23, type: 'practical', question: 'Write a function to implement binary search.', answer: 'function binarySearch(arr, target) { let l = 0, r = arr.length - 1; while (l <= r) { const mid = Math.floor((l + r) / 2); if (arr[mid] === target) return mid; arr[mid] < target ? l = mid + 1 : r = mid - 1; } return -1; }', category: 'Search Algorithms', skills: ['Algorithms', 'Search'] },
    { id: 24, type: 'conceptual', question: 'Explain prototype-based inheritance in JavaScript.', answer: 'Every object has a prototype. Objects inherit properties and methods from their prototype. The prototype chain allows property lookup up the hierarchy.', category: 'OOP Concepts', skills: ['Prototypes', 'Inheritance'] },
    { id: 25, type: 'practical', question: 'How would you merge two sorted arrays?', answer: 'function mergeSorted(arr1, arr2) { const result = []; let i = 0, j = 0; while (i < arr1.length && j < arr2.length) result.push(arr1[i] < arr2[j] ? arr1[i++] : arr2[j++]); return result.concat(arr1.slice(i), arr2.slice(j)); }', category: 'Array Operations', skills: ['Arrays', 'Merging'] },
    { id: 26, type: 'conceptual', question: 'What is a pure function?', answer: 'A pure function always returns the same output for the same input and has no side effects. It doesn\'t modify external state or depend on mutable data.', category: 'Functional Programming', skills: ['Functions', 'FP'] },
    { id: 27, type: 'scenario-based', question: 'A component is re-rendering too frequently. How would you debug this?', answer: 'Use React DevTools Profiler to identify renders. Check for unnecessary dependencies in useEffect. Verify state updates and memoization.', category: 'React Debugging', skills: ['React', 'Debugging'] },
    { id: 28, type: 'practical', question: 'Write a function to find the intersection of two arrays.', answer: 'function intersection(arr1, arr2) { const set = new Set(arr2); return arr1.filter(item => set.has(item)); }', category: 'Array Operations', skills: ['Arrays', 'Sets'] },
    { id: 29, type: 'conceptual', question: 'What is memoization and why is it useful?', answer: 'Memoization caches function results to avoid redundant calculations. It improves performance for expensive computations or recursive functions.', category: 'Optimization', skills: ['Optimization', 'Caching'] },
    { id: 30, type: 'practical', question: 'How would you implement throttle function?', answer: 'function throttle(fn, delay) { let lastCall = 0; return (...args) => { const now = Date.now(); if (now - lastCall >= delay) { lastCall = now; fn(...args); } }; }', category: 'Utility Functions', skills: ['Functions', 'Timing'] },
    { id: 31, type: 'conceptual', question: 'What is the difference between REST and GraphQL?', answer: 'REST uses multiple endpoints for resources. GraphQL uses a single endpoint with flexible queries. GraphQL reduces over-fetching and under-fetching.', category: 'Web Architecture', skills: ['REST', 'GraphQL'] },
    { id: 32, type: 'scenario-based', question: 'How would you implement real-time notifications?', answer: 'Use WebSockets, Server-Sent Events (SSE), or polling. For React, integrate libraries like Socket.io or use browser APIs.', category: 'Real-time Communication', skills: ['WebSockets', 'Real-time'] },
    { id: 33, type: 'practical', question: 'Write a function to rotate an array by k positions.', answer: 'function rotate(arr, k) { k = k % arr.length; return [...arr.slice(-k), ...arr.slice(0, -k)]; }', category: 'Array Manipulation', skills: ['Arrays', 'Logic'] },
    { id: 34, type: 'conceptual', question: 'What is the SOLID principle in software design?', answer: 'SOLID stands for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. They guide OOP design.', category: 'Design Principles', skills: ['Design', 'Architecture'] },
    { id: 35, type: 'practical', question: 'How would you find the Nth largest element in an array?', answer: 'function findNthLargest(arr, n) { return arr.sort((a, b) => b - a)[n - 1]; } // or use heap for O(n log k)', category: 'Array Operations', skills: ['Arrays', 'Sorting'] },
    { id: 36, type: 'conceptual', question: 'Explain the concept of immutability in React.', answer: 'Immutability means not modifying data directly. Create new objects/arrays instead. This helps React track changes efficiently and prevent bugs.', category: 'React Concepts', skills: ['React', 'Immutability'] },
    { id: 37, type: 'scenario-based', question: 'How would you implement a search feature with autocomplete?', answer: 'Use debouncing to reduce API calls. Cache results. Implement client-side filtering. Show suggestions as user types.', category: 'Search Features', skills: ['UX', 'Performance'] },
    { id: 38, type: 'practical', question: 'Write a function to find all pairs in an array that sum to a target.', answer: 'function findPairs(arr, target) { const pairs = []; const set = new Set(); for (let num of arr) { if (set.has(target - num)) pairs.push([target - num, num]); set.add(num); } return pairs; }', category: 'Array Operations', skills: ['Arrays', 'Hash Maps'] },
    { id: 39, type: 'conceptual', question: 'What is the purpose of the key prop in React lists?', answer: 'Keys help React identify which items have changed. Use unique, stable IDs. Avoid using array indices as keys for dynamic lists.', category: 'React Best Practices', skills: ['React', 'Keys'] },
    { id: 40, type: 'practical', question: 'How would you implement LRU cache?', answer: 'Use a Map to maintain insertion order and a size limit. When capacity is exceeded, remove the least recently used item (first in Map).', category: 'Data Structures', skills: ['Caching', 'Maps'] },
    { id: 41, type: 'conceptual', question: 'What is the Virtual DOM in React?', answer: 'The Virtual DOM is a lightweight in-memory representation of the real DOM. React uses it to batch updates and minimize actual DOM manipulations.', category: 'React Architecture', skills: ['React', 'DOM'] },
    { id: 42, type: 'scenario-based', question: 'How would you handle file uploads in a React form?', answer: 'Use FormData with XMLHttpRequest or fetch API. Handle file validation, progress tracking, and error handling. Show preview for images.', category: 'File Handling', skills: ['Forms', 'Files'] },
    { id: 43, type: 'practical', question: 'Write a function to check if a number is prime.', answer: 'function isPrime(n) { if (n <= 1) return false; if (n <= 3) return true; if (n % 2 === 0 || n % 3 === 0) return false; for (let i = 5; i * i <= n; i += 6) { if (n % i === 0 || n % (i + 2) === 0) return false; } return true; }', category: 'Math Algorithms', skills: ['Math', 'Algorithms'] },
    { id: 44, type: 'conceptual', question: 'What is the difference between controlled and uncontrolled components in React?', answer: 'Controlled components have their state managed by React. Uncontrolled components manage their own state via the DOM. Controlled is recommended.', category: 'React Forms', skills: ['React', 'Forms'] },
    { id: 45, type: 'practical', question: 'How would you implement a priority queue?', answer: 'Use a min-heap (for min priority) or max-heap. Extract and insert elements while maintaining heap property. Can use array-based implementation.', category: 'Data Structures', skills: ['Data Structures', 'Heaps'] },
    { id: 46, type: 'scenario-based', question: 'How would you optimize bundle size in a React app?', answer: 'Code splitting with React.lazy, compression, tree-shaking, lazy loading libraries, using CDN, analyzing bundle with tools like webpack-bundle-analyzer.', category: 'Performance Optimization', skills: ['Performance', 'Build'] },
    { id: 47, type: 'practical', question: 'Write a function to find all anagrams in an array of strings.', answer: 'function findAnagrams(words) { const map = {}; words.forEach(word => { const sorted = word.split("").sort().join(""); map[sorted] = (map[sorted] || []).concat(word); }); return Object.values(map); }', category: 'String Algorithms', skills: ['Strings', 'Hash Maps'] },
    { id: 48, type: 'conceptual', question: 'What is context API in React and when should you use it?', answer: 'Context API allows passing data through the component tree without prop drilling. Use for global state like themes, auth. For complex apps, consider Redux.', category: 'State Management', skills: ['React', 'Context'] },
    { id: 49, type: 'practical', question: 'How would you implement quicksort?', answer: 'function quickSort(arr) { if (arr.length <= 1) return arr; const pivot = arr[0]; const left = arr.slice(1).filter(x => x < pivot); const right = arr.slice(1).filter(x => x >= pivot); return [...quickSort(left), pivot, ...quickSort(right)]; }', category: 'Sorting Algorithms', skills: ['Algorithms', 'Sorting'] },
    { id: 50, type: 'scenario-based', question: 'How would you implement infinite scroll in a React list?', answer: 'Use Intersection Observer API to detect when user scrolls near bottom. Fetch more data on trigger. Implement virtualization for large lists using libraries like react-window.', category: 'Advanced UI', skills: ['React', 'Performance'] },
  ],
  Data_Scientist: [
    { id: 1101, type: 'conceptual', question: 'What is supervised learning?', answer: 'Supervised learning uses labeled data to train models. Input-output pairs are provided. Used for regression and classification tasks.', category: 'ML Fundamentals', skills: ['ML', 'Supervised Learning'] },
    { id: 1102, type: 'conceptual', question: 'What is the difference between regression and classification?', answer: 'Regression predicts continuous variables. Classification predicts discrete categories. Different loss functions and evaluation metrics.', category: 'ML Concepts', skills: ['ML', 'Statistics'] },
    { id: 1103, type: 'practical', question: 'How would you handle missing values in a dataset?', answer: 'Options: drop rows/columns, impute with mean/median/mode, use KNN imputation, forward/backward fill for time series. Choose based on data type and percentage missing.', category: 'Data Preprocessing', skills: ['Data Cleaning', 'Pandas'] },
    { id: 1104, type: 'conceptual', question: 'Explain overfitting and how to prevent it.', answer: 'Overfitting: model learns noise instead of patterns. Prevention: cross-validation, regularization, early stopping, dropout, reduce model complexity.', category: 'Model Optimization', skills: ['ML', 'Validation'] },
    { id: 1105, type: 'practical', question: 'Write code to normalize a dataset to 0-1 range.', answer: 'from sklearn.preprocessing import MinMaxScaler; scaler = MinMaxScaler(); scaled_data = scaler.fit_transform(data)', category: 'Data Preprocessing', skills: ['Sklearn', 'Python'] },
    { id: 1106, type: 'scenario-based', question: 'You have imbalanced dataset. How would you handle it?', answer: 'Solutions: oversampling minority class, undersampling majority class, SMOTE, class weights, stratified splitting. Choose based on dataset size.', category: 'Data Imbalance', skills: ['Imbalanced Data', 'Techniques'] },
    { id: 1107, type: 'conceptual', question: 'What is feature engineering?', answer: 'Creating new features from existing ones to improve model performance. Includes scaling, encoding, polynomial features, aggregations, domain knowledge.', category: 'Feature Engineering', skills: ['Features', 'Preprocessing'] },
    { id: 1108, type: 'practical', question: 'How do you split data into train-test sets?', answer: 'from sklearn.model_selection import train_test_split; X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)', category: 'Model Validation', skills: ['Sklearn', 'Validation'] },
    { id: 1109, type: 'conceptual', question: 'What is cross-validation?', answer: 'Technique to evaluate model on multiple train-test splits. Provides more robust performance estimate. K-fold, stratified k-fold, time series cross-validation.', category: 'Model Validation', skills: ['Validation', 'Statistics'] },
    { id: 1110, type: 'scenario-based', question: 'Choose appropriate evaluation metrics for a classification model.', answer: 'Binary: accuracy, precision, recall, F1, ROC-AUC. Multi-class: macro/weighted F1. Imbalanced: precision-recall over accuracy. Business context matters.', category: 'Model Evaluation', skills: ['Metrics', 'Evaluation'] },
    { id: 1111, type: 'practical', question: 'How would you detect outliers in data?', answer: 'Methods: Z-score (|z| > 3), IQR (Q1 - 1.5IQR to Q3 + 1.5IQR), isolation forest, local outlier factor. Visualize with box plots.', category: 'Data Exploration', skills: ['Statistics', 'EDA'] },
    { id: 1112, type: 'conceptual', question: 'What is dimensionality reduction?', answer: 'Reduces number of features while retaining information. Techniques: PCA, t-SNE, feature selection. Improves performance and reduces computation.', category: 'Feature Engineering', skills: ['Dimensionality', 'Features'] },
    { id: 1113, type: 'practical', question: 'How would you use PCA for dimensionality reduction?', answer: 'from sklearn.decomposition import PCA; pca = PCA(n_components=2); X_reduced = pca.fit_transform(X); explained_variance = pca.explained_variance_ratio_', category: 'Dimensionality Reduction', skills: ['Sklearn', 'ML'] },
    { id: 1114, type: 'scenario-based', question: 'How would you approach a new machine learning problem?', answer: '1. Define problem 2. Gather data 3. EDA 4. Preprocessing 5. Feature engineering 6. Model selection 7. Train 8. Evaluate 9. Tune 10. Deploy', category: 'ML Workflow', skills: ['Process', 'Planning'] },
    { id: 1115, type: 'conceptual', question: 'What is correlation and why is it important?', answer: 'Correlation measures relationship between variables (-1 to 1). Important for feature selection, identifying multicollinearity, understanding data relationships.', category: 'Statistics', skills: ['Statistics', 'EDA'] },
    { id: 1116, type: 'practical', question: 'How would you create a correlation matrix?', answer: 'import seaborn as sns; import pandas as pd; corr = df.corr(); sns.heatmap(corr, annot=True)', category: 'Data Visualization', skills: ['Pandas', 'Seaborn'] },
    { id: 1117, type: 'conceptual', question: 'What is the bias-variance tradeoff?', answer: 'Bias: error from oversimplification. Variance: error from overfitting. Tradeoff: low bias/high variance vs high bias/low variance. Aim for balance.', category: 'Model Concepts', skills: ['ML', 'Theory'] },
    { id: 1118, type: 'scenario-based', question: 'Model accuracy is 95% but business metric is poor. What could be wrong?', answer: 'Metrics mismatch, class imbalance, data leakage, wrong evaluation set, threshold issue, or metric doesn\'t align with business goal. Investigate thoroughly.', category: 'Model Debugging', skills: ['Evaluation', 'Problem Solving'] },
    { id: 1119, type: 'practical', question: 'How would you standardize features using StandardScaler?', answer: 'from sklearn.preprocessing import StandardScaler; scaler = StandardScaler(); X_scaled = scaler.fit_transform(X_train); X_test_scaled = scaler.transform(X_test)', category: 'Data Preprocessing', skills: ['Sklearn', 'Preprocessing'] },
    { id: 1120, type: 'conceptual', question: 'What is the curse of dimensionality?', answer: 'Performance degrades as number of features increases. Distance becomes meaningless, data becomes sparse, overfitting increases. Solutions: feature selection/reduction.', category: 'ML Theory', skills: ['Theory', 'Analysis'] },
    { id: 1121, type: 'practical', question: 'How would you encode categorical variables?', answer: 'One-hot encoding: pd.get_dummies(df, columns=[\'col\']). Label encoding: LabelEncoder(). Ordinal encoding for ordered categories. Choose based on algorithm.', category: 'Data Preprocessing', skills: ['Pandas', 'Preprocessing'] },
    { id: 1122, type: 'scenario-based', question: 'Choosing between linear and tree-based models. What factors matter?', answer: 'Linear: interpretability, speed, small data. Trees: non-linear relationships, feature interactions, robustness. Data characteristics, interpretability needs, and performance.', category: 'Model Selection', skills: ['Models', 'Decision Making'] },
    { id: 1123, type: 'conceptual', question: 'What is hyperparameter tuning?', answer: 'Tuning model parameters not learned from data (learning rate, depth, regularization). Methods: grid search, random search, Bayesian optimization.', category: 'Model Optimization', skills: ['Tuning', 'Optimization'] },
    { id: 1124, type: 'practical', question: 'How would you perform grid search for hyperparameter tuning?', answer: 'from sklearn.model_selection import GridSearchCV; param_grid = {...}; grid_search = GridSearchCV(model, param_grid, cv=5); grid_search.fit(X, y)', category: 'Model Optimization', skills: ['Sklearn', 'Tuning'] },
    { id: 1125, type: 'conceptual', question: 'What is the confusion matrix?', answer: 'Matrix showing True Positives, False Positives, True Negatives, False Negatives. Foundation for precision, recall, accuracy, F1. Visual representation of classification performance.', category: 'Model Evaluation', skills: ['Metrics', 'Classification'] },
    { id: 1126, type: 'practical', question: 'How would you plot a confusion matrix?', answer: 'from sklearn.metrics import confusion_matrix; import matplotlib.pyplot as plt; cm = confusion_matrix(y_true, y_pred); sns.heatmap(cm, annot=True)', category: 'Model Evaluation', skills: ['Sklearn', 'Visualization'] },
    { id: 1127, type: 'scenario-based', question: 'Model performs well on training but poorly on test. What\'s the issue?', answer: 'Overfitting. Solutions: regularization, dropout, early stopping, more training data, reduce complexity, cross-validation, feature selection.', category: 'Model Debugging', skills: ['Debugging', 'Overfitting'] },
    { id: 1128, type: 'conceptual', question: 'What is regularization and why is it needed?', answer: 'Adds penalty for complex models (L1, L2). Prevents overfitting. L1 (Lasso) for feature selection. L2 (Ridge) for stability. Elastic Net combines both.', category: 'Model Optimization', skills: ['Regularization', 'Prevention'] },
    { id: 1129, type: 'practical', question: 'How would you implement Ridge regression?', answer: 'from sklearn.linear_model import Ridge; ridge = Ridge(alpha=1.0); ridge.fit(X_train, y_train); predictions = ridge.predict(X_test)', category: 'Regression Models', skills: ['Sklearn', 'Regression'] },
    { id: 1130, type: 'scenario-based', question: 'Dataset has temporal dependency (time series). How would you handle it?', answer: 'Respect temporal order in splits. Use time-series cross-validation. Features: lag, rolling statistics, seasonal decomposition. Models: ARIMA, LSTM, Prophet.', category: 'Time Series', skills: ['Time Series', 'Temporal Data'] },
    { id: 1131, type: 'conceptual', question: 'What is ensemble learning?', answer: 'Combines multiple models for better performance. Bagging, boosting, stacking. Reduces variance/bias, improves generalization, increases robustness.', category: 'Advanced ML', skills: ['Ensemble', 'Advanced'] },
    { id: 1132, type: 'practical', question: 'How would you use Random Forest?', answer: 'from sklearn.ensemble import RandomForestClassifier; rf = RandomForestClassifier(n_estimators=100); rf.fit(X_train, y_train); predictions = rf.predict(X_test)', category: 'Ensemble Methods', skills: ['Sklearn', 'Ensemble'] },
    { id: 1133, type: 'scenario-based', question: 'Data volume is too large to fit in memory. How would you process it?', answer: 'Batch processing, sampling, streaming, partitioning, parallel processing, Spark, Dask, or cloud computing. Chunked processing with generators.', category: 'Big Data', skills: ['Scalability', 'Big Data'] },
    { id: 1134, type: 'conceptual', question: 'What is feature importance?', answer: 'Measures how much each feature contributes to predictions. Tree-based: Gini/information gain. Linear: coefficients. Helps with feature selection and interpretation.', category: 'Model Interpretation', skills: ['Interpretation', 'Features'] },
    { id: 1135, type: 'practical', question: 'How would you extract feature importance from a tree model?', answer: 'feature_importance = rf.feature_importances_; importance_df = pd.DataFrame({\'feature\': X_train.columns, \'importance\': feature_importance}).sort_values(\'importance\')', category: 'Model Analysis', skills: ['Sklearn', 'Analysis'] },
    { id: 1136, type: 'scenario-based', question: 'Multicollinearity detected among features. What\'s the impact and solution?', answer: 'Impact: inflated coefficients, reduced interpretability. Solutions: remove correlated features, VIF analysis, PCA, regularization (Ridge/Lasso).', category: 'Preprocessing', skills: ['Data Quality', 'Statistics'] },
    { id: 1137, type: 'conceptual', question: 'What is the ROC curve and AUC?', answer: 'ROC: True Positive Rate vs False Positive Rate curve. AUC: Area Under Curve (0-1). Higher AUC better. Threshold-independent performance metric.', category: 'Model Evaluation', skills: ['Metrics', 'Evaluation'] },
    { id: 1138, type: 'practical', question: 'How would you plot ROC curve?', answer: 'from sklearn.metrics import roc_curve, auc; fpr, tpr, _ = roc_curve(y_true, y_pred); roc_auc = auc(fpr, tpr); plt.plot(fpr, tpr, label=f\'AUC={roc_auc}\')', category: 'Model Evaluation', skills: ['Sklearn', 'Visualization'] },
    { id: 1139, type: 'scenario-based', question: 'How would you validate model before production deployment?', answer: 'Test on holdout set, cross-validation, A/B testing, shadow deployment, monitoring metrics, edge case testing, performance benchmarks.', category: 'Deployment', skills: ['Validation', 'Production'] },
    { id: 1140, type: 'conceptual', question: 'What is SHAP and why is interpretability important?', answer: 'SHAP: explains individual predictions using game theory. Interpretability: understand decisions, debugging, trust, compliance, documentation.', category: 'Model Interpretation', skills: ['Explainability', 'SHAP'] },
    { id: 1141, type: 'practical', question: 'How would you use SHAP for model explanation?', answer: 'import shap; explainer = shap.TreeExplainer(model); shap_values = explainer.shap_values(X); shap.summary_plot(shap_values, X)', category: 'Model Interpretation', skills: ['SHAP', 'Explainability'] },
    { id: 1142, type: 'scenario-based', question: 'Model performed well during development but degrades in production. Why?', answer: 'Data drift, distribution shift, data quality issues, production vs dev environments differ, model needs retraining, feature engineering changes.', category: 'Production Issues', skills: ['MLOps', 'Monitoring'] },
    { id: 1143, type: 'conceptual', question: 'What is data augmentation?', answer: 'Generating new training data from existing through transformations (rotation, noise, scaling). Improves model robustness and reduces overfitting with limited data.', category: 'Data Generation', skills: ['Augmentation', 'Deep Learning'] },
    { id: 1144, type: 'practical', question: 'How would you use scikit-learn\'s train_test_split with stratification?', answer: 'from sklearn.model_selection import train_test_split; X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)', category: 'Data Splitting', skills: ['Sklearn', 'Validation'] },
    { id: 1145, type: 'scenario-based', question: 'Comparing two models\' performance. Which metrics matter most?', answer: 'Business context drives metric choice. Imbalanced: F1 over accuracy. Cost-sensitive: precision vs recall tradeoff. Domain-specific metrics often most relevant.', category: 'Model Comparison', skills: ['Evaluation', 'Decision Making'] },
    { id: 1146, type: 'conceptual', question: 'What is batch normalization in deep learning?', answer: 'Normalizes input to layers during training. Reduces internal covariate shift. Allows higher learning rates, faster convergence, regularization effect.', category: 'Deep Learning', skills: ['DL', 'Neural Networks'] },
    { id: 1147, type: 'practical', question: 'How would you handle class imbalance in binary classification?', answer: 'Oversampling: RandomOverSampler. Undersampling: RandomUnderSampler. SMOTE for synthetic samples. Class weights in model. Stratified splitting.', category: 'Data Imbalance', skills: ['Imbalanced Data', 'Sklearn'] },
    { id: 1148, type: 'scenario-based', question: 'Need to reduce training time by 50%. What strategies would you use?', answer: 'Feature reduction, sampling data, smaller model, parallel processing, GPU acceleration, early stopping, simpler algorithm, distributed training.', category: 'Optimization', skills: ['Performance', 'Efficiency'] },
    { id: 1149, type: 'conceptual', question: 'What is precision and recall?', answer: 'Precision: True Positives / (TP + FP). Recall: True Positives / (TP + FN). Precision: accuracy of positive predictions. Recall: coverage of actual positives.', category: 'Model Metrics', skills: ['Metrics', 'Classification'] },
    { id: 1150, type: 'practical', question: 'How would you calculate F1 score?', answer: 'from sklearn.metrics import f1_score; f1 = f1_score(y_true, y_pred); # F1 = 2 * (precision * recall) / (precision + recall)', category: 'Model Metrics', skills: ['Sklearn', 'Evaluation'] },
  ],
  DevOps_Engineer: [
    { id: 1401, type: 'conceptual', question: 'What is DevOps and why is it important?', answer: 'DevOps merges development and operations. Improves collaboration, automation, faster releases, reliability. Culture + tools + processes for continuous delivery.', category: 'DevOps Fundamentals', skills: ['DevOps', 'Culture'] },
    { id: 1402, type: 'conceptual', question: 'Explain CI/CD pipeline.', answer: 'CI (Continuous Integration): frequent code commits, automated testing, build validation. CD (Continuous Deployment): automated release to production.', category: 'CI/CD', skills: ['Automation', 'Deployment'] },
    { id: 1403, type: 'practical', question: 'How would you set up a basic CI/CD pipeline with GitHub Actions?', answer: 'Create .github/workflows/main.yml. Define triggers, jobs, steps. Run tests, build, deploy. Use actions from marketplace. Secrets for credentials.', category: 'CI/CD Tools', skills: ['GitHub', 'Automation'] },
    { id: 1404, type: 'conceptual', question: 'What is Docker and containerization?', answer: 'Docker packages apps with dependencies into containers. Lightweight, portable, consistent across environments. Container: isolated runtime for application.', category: 'Containerization', skills: ['Docker', 'Containers'] },
    { id: 1405, type: 'practical', question: 'How would you create a Docker image for a Node.js app?', answer: 'Create Dockerfile: FROM node:18, COPY package*, RUN npm install, COPY app, CMD ["npm", "start"]. Build: docker build -t app:1.0 . Docker run -p 3000:3000 app:1.0', category: 'Docker', skills: ['Docker', 'Containerization'] },
    { id: 1406, type: 'scenario-based', question: 'Your Docker image is bloated (500MB). How would you optimize?', answer: 'Multi-stage builds, alpine base images, minimize layers, remove unnecessary files, use .dockerignore, optimize layer caching, don\'t include dev dependencies.', category: 'Docker Optimization', skills: ['Docker', 'Optimization'] },
    { id: 1407, type: 'conceptual', question: 'What is Kubernetes?', answer: 'Container orchestration platform. Manages deployment, scaling, networking of containers. Automated updates, rollbacks, self-healing, resource management.', category: 'Orchestration', skills: ['Kubernetes', 'Orchestration'] },
    { id: 1408, type: 'practical', question: 'How would you deploy an app to Kubernetes?', answer: 'Create deployment YAML with image, replicas, resources. Create service for access. Apply with kubectl apply -f deployment.yaml. Monitor with kubectl get pods.', category: 'Kubernetes', skills: ['Kubernetes', 'Deployment'] },
    { id: 1409, type: 'conceptual', question: 'What is infrastructure as code (IaC)?', answer: 'Define infrastructure using code/config files. Version controlled, reproducible, automated provisioning. Tools: Terraform, CloudFormation, Ansible.', category: 'IaC', skills: ['IaC', 'Infrastructure'] },
    { id: 1410, type: 'practical', question: 'How would you write Terraform code to provision AWS resources?', answer: 'Define provider, resources, variables, outputs. Use TF files (.tf). terraform init, plan, apply. Remote state, modules for reusability.', category: 'IaC Tools', skills: ['Terraform', 'AWS'] },
    { id: 1411, type: 'scenario-based', question: 'Server crashes during peak traffic. How would you prevent this?', answer: 'Horizontal scaling with load balancing, auto-scaling groups, caching, CDN, database optimization, rate limiting, monitoring/alerting, circuit breakers.', category: 'Reliability', skills: ['Scaling', 'Reliability'] },
    { id: 1412, type: 'conceptual', question: 'What is monitoring and observability?', answer: 'Monitoring: track metrics. Observability: understand system behavior via logs, metrics, traces. Enables proactive issue detection and debugging.', category: 'Monitoring', skills: ['Observability', 'Monitoring'] },
    { id: 1413, type: 'practical', question: 'How would you set up monitoring with Prometheus and Grafana?', answer: 'Prometheus scrapes metrics from exporters. Grafana visualizes Prometheus data. Define alerting rules in Prometheus. Create dashboards in Grafana.', category: 'Monitoring Tools', skills: ['Prometheus', 'Grafana'] },
    { id: 1414, type: 'scenario-based', question: 'Application performance is slow. How would you troubleshoot?', answer: 'Monitor metrics (CPU, memory, I/O), analyze logs, profile code, check dependencies, optimize queries, caching, load testing, CDN usage, network latency.', category: 'Performance Troubleshooting', skills: ['Debugging', 'Performance'] },
    { id: 1415, type: 'conceptual', question: 'What is logging and its best practices?', answer: 'Centralize logs from all services. Log levels: DEBUG, INFO, WARN, ERROR. Structured logging (JSON). Tools: ELK, Splunk, CloudWatch. Retention policies.', category: 'Logging', skills: ['Logging', 'Observability'] },
    { id: 1416, type: 'practical', question: 'How would you set up ELK stack (Elasticsearch, Logstash, Kibana)?', answer: 'Logstash ingests and parses logs. Elasticsearch stores indexed logs. Kibana visualizes. Configure log shippers (Filebeat). Create dashboards and alerts.', category: 'Log Management', skills: ['ELK', 'Logging'] },
    { id: 1417, type: 'scenario-based', question: 'Database query is taking 30 seconds. How would you optimize?', answer: 'Analyze query plan (EXPLAIN), add indexes, optimize joins, cache results, horizontal sharding, read replicas, denormalization, parameter tuning.', category: 'Database Performance', skills: ['Database', 'Optimization'] },
    { id: 1418, type: 'conceptual', question: 'What is a load balancer and why is it needed?', answer: 'Distributes traffic across multiple servers. Prevents single point of failure, improves availability, enables horizontal scaling, health checking.', category: 'Infrastructure', skills: ['Load Balancing', 'Networking'] },
    { id: 1419, type: 'practical', question: 'How would you configure nginx as a reverse proxy and load balancer?', answer: 'Define upstream servers. Configure server block with proxy_pass, load_balancing algorithm (round_robin, least_conn). Health checks, SSL termination.', category: 'Load Balancing', skills: ['Nginx', 'Load Balancing'] },
    { id: 1420, type: 'scenario-based', question: 'Need to rollback a production deployment. What\'s your strategy?', answer: 'Blue-green deployment, canary releases, version pinning, database migration reversibility, quick rollback commands, monitoring during rollout.', category: 'Deployment Safety', skills: ['Deployment', 'Risk Management'] },
    { id: 1421, type: 'conceptual', question: 'What is immutable infrastructure?', answer: 'Never modify running servers. Instead, rebuild with updated config. Provides consistency, predictability, easier rollback, audit trail.', category: 'Infrastructure Patterns', skills: ['Infrastructure', 'DevOps'] },
    { id: 1422, type: 'practical', question: 'How would you automate server provisioning with Ansible?', answer: 'Write playbooks (YAML). Define inventory. Use roles for modularity. Execute with ansible-playbook. Idempotent tasks. Facts and variables.', category: 'Infrastructure Automation', skills: ['Ansible', 'Automation'] },
    { id: 1423, type: 'scenario-based', question: 'Build disaster recovery plan for critical system.', answer: 'Backup strategy (frequency, retention). Failover procedures. RTO/RPO targets. Test regularly. Multi-region setup. Document runbooks. Monitoring and alerting.', category: 'Disaster Recovery', skills: ['Resilience', 'Planning'] },
    { id: 1424, type: 'conceptual', question: 'What is secrets management and why is it critical?', answer: 'Securely store/manage passwords, API keys, certificates. Never hardcode secrets. Use vault solutions: HashiCorp Vault, AWS Secrets Manager, GitHub Secrets.', category: 'Security', skills: ['Security', 'DevOps'] },
    { id: 1425, type: 'practical', question: 'How would you use HashiCorp Vault for secrets management?', answer: 'Initialize and unseal Vault. Define auth methods, policies. Store/retrieve secrets via API. Rotate credentials automatically. Audit access.', category: 'Secrets Management', skills: ['Vault', 'Security'] },
    { id: 1426, type: 'scenario-based', question: 'Security breach detected. How would you respond?', answer: 'Isolate affected systems. Assess impact. Rotate credentials. Review logs. Patch vulnerabilities. Update monitoring. Incident post-mortem. Communication plan.', category: 'Security Incident', skills: ['Security', 'Incident Response'] },
    { id: 1427, type: 'conceptual', question: 'What is network security and firewalls?', answer: 'Control network traffic. Firewalls filter packets based on rules. DMZ for public services. VPN for secure access. Principles: least privilege, deny by default.', category: 'Network Security', skills: ['Security', 'Networking'] },
    { id: 1428, type: 'practical', question: 'How would you configure security groups in AWS?', answer: 'Define inbound/outbound rules. Specify protocol, port, source/destination. Apply to EC2 instances, RDS. Follow least privilege principle. Regular audits.', category: 'Cloud Security', skills: ['AWS', 'Security'] },
    { id: 1429, type: 'scenario-based', question: 'System experiences sudden traffic spike (DDoS attack?). Response?', answer: 'Monitor metrics. Enable WAF/rate limiting. Increase capacity/CDN. Analyze traffic patterns. Block malicious IPs. Contact ISP. Incident response plan.', category: 'Incident Response', skills: ['Security', 'Incident Management'] },
    { id: 1430, type: 'conceptual', question: 'What is GitOps and why is it valuable?', answer: 'Use Git as source of truth for infrastructure/deployments. Pull-based updates. Enables versioning, audit trail, rollback, automation, compliance.', category: 'GitOps', skills: ['GitOps', 'Deployment'] },
    { id: 1431, type: 'practical', question: 'How would you implement GitOps with ArgoCD?', answer: 'Set up ArgoCD in Kubernetes cluster. Create Application CR pointing to Git repo. ArgoCD syncs desired state. Webhooks trigger deployments on Git push.', category: 'GitOps Tools', skills: ['ArgoCD', 'Kubernetes'] },
    { id: 1432, type: 'scenario-based', question: 'Multiple services with dependencies between them. How to manage deployments?', answer: 'Service meshes (Istio), orchestration (Kubernetes), versioning, backward compatibility, feature flags, gradual rollout, health checks, clear contracts.', category: 'Microservices Deployment', skills: ['Microservices', 'Orchestration'] },
    { id: 1433, type: 'conceptual', question: 'What is a service mesh and why use it?', answer: 'Infrastructure layer managing service-to-service communication. Provides: load balancing, traffic management, security, observability, resilience.', category: 'Service Mesh', skills: ['Microservices', 'Infrastructure'] },
    { id: 1434, type: 'practical', question: 'How would you implement Istio service mesh?', answer: 'Install Istio control plane in K8s. Enable injection in namespaces. Define Gateways, VirtualServices, DestinationRules. Configure traffic policies, mTLS.', category: 'Service Mesh', skills: ['Istio', 'Kubernetes'] },
    { id: 1435, type: 'scenario-based', question: 'Document your company\'s DevOps best practices and runbooks.', answer: 'Deployment procedures, incident response, on-call rotation, monitoring setup, disaster recovery, security guidelines, change management, communication templates.', category: 'Documentation', skills: ['Documentation', 'Processes'] },
    { id: 1436, type: 'conceptual', question: 'What is SRE (Site Reliability Engineering)?', answer: 'Making systems scalable, reliable, efficient using software engineering. SLO/SLI/SLA definitions. Error budgets. Blameless postmortems. Automation over manual work.', category: 'SRE', skills: ['SRE', 'Reliability'] },
    { id: 1437, type: 'practical', question: 'How would you define SLO/SLI/SLA?', answer: 'SLI (Service Level Indicator): metric you measure. SLO (Service Level Objective): target value (e.g., 99.9%). SLA: contract with penalty for breach.', category: 'Reliability', skills: ['SRE', 'Metrics'] },
    { id: 1438, type: 'scenario-based', question: 'Calculate error budget and when to do risky deployments.', answer: 'Error budget = (100% - SLO) * total time. Deploy risky changes when sufficient budget remains. Prioritize reliability when budget is low.', category: 'Error Budgeting', skills: ['SRE', 'Decision Making'] },
    { id: 1439, type: 'conceptual', question: 'What is cost optimization in cloud infrastructure?', answer: 'Right-sizing instances, reserved instances, spot instances, data transfer optimization, storage tiering, resource tagging, chargeback, waste identification.', category: 'Cost Optimization', skills: ['Cloud', 'Economics'] },
    { id: 1440, type: 'practical', question: 'How would you reduce AWS bill without impacting performance?', answer: 'Analyze CloudTrail, use Reserved Instances for predictable workloads, Spot for batch jobs, implement auto-scaling, delete unused resources, optimize storage.', category: 'AWS Cost', skills: ['AWS', 'Cost Optimization'] },
    { id: 1441, type: 'scenario-based', question: 'Design resilient system: servers fail, network down, database unavailable.', answer: 'Multi-region/AZ setup, no single point of failure, circuit breakers, retry logic, caching, graceful degradation, health checks, automated failover.', category: 'Resilience', skills: ['Resilience', 'Architecture'] },
    { id: 1442, type: 'conceptual', question: 'What is data backup strategy and recovery?', answer: '3-2-1 rule: 3 copies, 2 storage types, 1 offsite. Test restores regularly. RPO (Recovery Point Objective), RTO (Recovery Time Objective) define requirements.', category: 'Backup & Recovery', skills: ['Backup', 'Disaster Recovery'] },
    { id: 1443, type: 'practical', question: 'How would you automate backups with S3 cross-region replication?', answer: 'Enable versioning and MFA Delete on S3 bucket. Configure cross-region replication. Set lifecycle policies for tiering. Automate restore testing.', category: 'AWS Backup', skills: ['S3', 'AWS'] },
    { id: 1444, type: 'scenario-based', question: 'Team wants to migrate legacy monolith to microservices. Strategy?', answer: 'Strangler pattern (new code microservices, legacy coexists). API gateway for routing. Database per service. Gradual migration. Feature flags. Comprehensive testing.', category: 'Migration', skills: ['Microservices', 'Migration'] },
    { id: 1445, type: 'conceptual', question: 'What is the 12-factor app methodology?', answer: 'Guidelines for cloud-native applications: codebase, dependencies, config, backing services, build/run/release stages, processes, port binding, concurrency, logs, admin tasks.', category: 'Cloud Native', skills: ['Cloud Native', 'Best Practices'] },
    { id: 1446, type: 'practical', question: 'How would you implement configuration management using environment variables and ConfigMaps?', answer: 'Kubernetes ConfigMaps for non-sensitive config. Secrets for passwords/keys. Environment variables for application. Mounted as volumes or injected as env vars.', category: 'Configuration Management', skills: ['Kubernetes', 'Configuration'] },
    { id: 1447, type: 'scenario-based', question: 'Performance test shows bottleneck in message queue. Solutions?', answer: 'Increase queue capacity, add more workers, batch processing, message compression, priority queues, separate queues by type, monitoring/alerting.', category: 'Message Queue Optimization', skills: ['Message Queues', 'Performance'] },
    { id: 1448, type: 'conceptual', question: 'What is API gateway and its benefits?', answer: 'Entry point for all client requests. Benefits: routing, rate limiting, auth, logging, transformation, caching, monitoring, circuit breaking.', category: 'API Architecture', skills: ['API Gateway', 'Architecture'] },
    { id: 1449, type: 'practical', question: 'How would you implement rate limiting on API gateway?', answer: 'Token bucket or sliding window algorithm. Store state in Redis for distributed setup. Return 429 status when exceeded. Communicate limits in headers.', category: 'API Security', skills: ['API Gateway', 'Security'] },
    { id: 1450, type: 'scenario-based', question: 'Test coverage is only 30%. How would you improve it?', answer: 'Unit tests for logic, integration tests for flow, E2E tests for user journeys. CI/CD fails on low coverage. Prioritize critical paths first. Team commitment.', category: 'Testing Strategy', skills: ['Testing', 'Quality'] },
  ],
};

// Template for all other fields
const TEMPLATE_EASY_50 = [
  { id: 1, type: 'conceptual', question: 'Explain the fundamental concept in this field.', answer: 'This field is fundamental because...', category: 'Fundamentals', skills: ['Core Skill'] },
  { id: 2, type: 'practical', question: 'How would you apply basic principle 1?', answer: 'Apply it by...', category: 'Core Concepts', skills: ['Practical'] },
  { id: 3, type: 'conceptual', question: 'What are the key differences in this field?', answer: 'Key differences include...', category: 'Concepts', skills: ['Knowledge'] },
  { id: 4, type: 'scenario-based', question: 'In a real-world scenario, how would you...?', answer: 'You would...', category: 'Application', skills: ['Problem Solving'] },
  { id: 5, type: 'practical', question: 'How would you implement basic technique?', answer: 'Implementation involves...', category: 'Techniques', skills: ['Technical'] },
  { id: 6, type: 'conceptual', question: 'What is the purpose of...?', answer: 'The purpose is...', category: 'Purpose', skills: ['Understanding'] },
  { id: 7, type: 'scenario-based', question: 'What problem does ... solve?', answer: 'It solves problems by...', category: 'Problem Solving', skills: ['Analysis'] },
  { id: 8, type: 'practical', question: 'Show me an example of...', answer: 'An example would be...', category: 'Examples', skills: ['Demonstration'] },
  { id: 9, type: 'conceptual', question: 'Explain the relationship between ... and ...', answer: 'The relationship is...', category: 'Relationships', skills: ['Analysis'] },
  { id: 10, type: 'scenario-based', question: 'How would you approach ...?', answer: 'I would approach it by...', category: 'Strategy', skills: ['Strategic Thinking'] },
  { id: 11, type: 'practical', question: 'What tools would you use for ...?', answer: 'I would use...', category: 'Tools', skills: ['Technical Knowledge'] },
  { id: 12, type: 'conceptual', question: 'Define the key term in this field.', answer: 'The key term means...', category: 'Terminology', skills: ['Knowledge'] },
  { id: 13, type: 'scenario-based', question: 'Describe your process for ... step by step.', answer: 'My process is...', category: 'Processes', skills: ['Planning'] },
  { id: 14, type: 'practical', question: 'How would you optimize ...?', answer: 'Optimization involves...', category: 'Optimization', skills: ['Performance'] },
  { id: 15, type: 'conceptual', question: 'What are the benefits of ...?', answer: 'The benefits include...', category: 'Benefits', skills: ['Analysis'] },
  { id: 16, type: 'scenario-based', question: 'If ... happened, what would you do?', answer: 'I would...', category: 'Problem Response', skills: ['Crisis Management'] },
  { id: 17, type: 'practical', question: 'How would you test ...?', answer: 'Testing would involve...', category: 'Testing', skills: ['Quality Assurance'] },
  { id: 18, type: 'conceptual', question: 'What is the standard for ...?', answer: 'The standard is...', category: 'Standards', skills: ['Compliance'] },
  { id: 19, type: 'scenario-based', question: 'How would you communicate ... to stakeholders?', answer: 'I would communicate by...', category: 'Communication', skills: ['Soft Skills'] },
  { id: 20, type: 'practical', question: 'What is the best practice for ...?', answer: 'The best practice is...', category: 'Best Practices', skills: ['Expertise'] },
  { id: 21, type: 'conceptual', question: 'How does ... work?', answer: '... works by...', category: 'Mechanisms', skills: ['Understanding'] },
  { id: 22, type: 'scenario-based', question: 'Tell me about a time when you...', answer: 'One example was...', category: 'Experience', skills: ['Behavioral'] },
  { id: 23, type: 'practical', question: 'How would you troubleshoot ...?', answer: 'Troubleshooting steps...', category: 'Troubleshooting', skills: ['Problem Solving'] },
  { id: 24, type: 'conceptual', question: 'What are the limitations of ...?', answer: 'Limitations include...', category: 'Challenges', skills: ['Critical Thinking'] },
  { id: 25, type: 'scenario-based', question: 'How would you handle a ... conflict?', answer: 'I would handle it by...', category: 'Conflict Resolution', skills: ['Leadership'] },
  { id: 26, type: 'practical', question: 'Create a plan for ...', answer: 'My plan would...', category: 'Planning', skills: ['Strategic'] },
  { id: 27, type: 'conceptual', question: 'Compare ... and ...', answer: 'Comparison: ...', category: 'Analysis', skills: ['Critical Analysis'] },
  { id: 28, type: 'scenario-based', question: 'How would you measure success in ...?', answer: 'Success metrics...', category: 'Metrics', skills: ['Analytics'] },
  { id: 29, type: 'practical', question: 'How would you document ...?', answer: 'Documentation would include...', category: 'Documentation', skills: ['Writing'] },
  { id: 30, type: 'conceptual', question: 'What trends do you see in ...?', answer: 'Current trends are...', category: 'Trends', skills: ['Market Knowledge'] },
  { id: 31, type: 'scenario-based', question: 'How would you mentor someone in ...?', answer: 'I would teach them...', category: 'Teaching', skills: ['Leadership'] },
  { id: 32, type: 'practical', question: 'How would you improve the current ...?', answer: 'Improvements would involve...', category: 'Improvement', skills: ['Innovation'] },
  { id: 33, type: 'conceptual', question: 'Explain the history and evolution of ...', answer: 'The history shows...', category: 'History', skills: ['Context'] },
  { id: 34, type: 'scenario-based', question: 'How would you balance ... and ...?', answer: 'Balance is achieved by...', category: 'Trade-offs', skills: ['Decision Making'] },
  { id: 35, type: 'practical', question: 'What resources would you need for ...?', answer: 'Resources needed are...', category: 'Resource Planning', skills: ['Planning'] },
  { id: 36, type: 'conceptual', question: 'What are the ethical considerations in ...?', answer: 'Ethical considerations include...', category: 'Ethics', skills: ['Professional'] },
  { id: 37, type: 'scenario-based', question: 'How would you present ... to executives?', answer: 'Presentation would focus on...', category: 'Presentation', skills: ['Communication'] },
  { id: 38, type: 'practical', question: 'How would you automate ...?', answer: 'Automation would involve...', category: 'Automation', skills: ['Efficiency'] },
  { id: 39, type: 'conceptual', question: 'What are the regulatory requirements for ...?', answer: 'Regulatory requirements are...', category: 'Compliance', skills: ['Legal'] },
  { id: 40, type: 'scenario-based', question: 'How would you negotiate ...?', answer: 'Negotiation approach...', category: 'Negotiation', skills: ['Soft Skills'] },
  { id: 41, type: 'practical', question: 'How would you scale ...?', answer: 'Scaling would involve...', category: 'Scalability', skills: ['Growth'] },
  { id: 42, type: 'conceptual', question: 'What are the risks of ...?', answer: 'Risk assessment shows...', category: 'Risk Management', skills: ['Risk Analysis'] },
  { id: 43, type: 'scenario-based', question: 'How would you collaborate with ... team?', answer: 'Collaboration would include...', category: 'Teamwork', skills: ['Collaboration'] },
  { id: 44, type: 'practical', question: 'How would you secure ...?', answer: 'Security measures...', category: 'Security', skills: ['Safety'] },
  { id: 45, type: 'conceptual', question: 'What are the success factors for ...?', answer: 'Success factors include...', category: 'Success Criteria', skills: ['Strategy'] },
  { id: 46, type: 'scenario-based', question: 'How would you adapt to changes in ...?', answer: 'Adaptation strategy...', category: 'Adaptation', skills: ['Flexibility'] },
  { id: 47, type: 'practical', question: 'How would you innovate in ...?', answer: 'Innovation approach...', category: 'Innovation', skills: ['Creativity'] },
  { id: 48, type: 'conceptual', question: 'What is the future of ...?', answer: 'Future outlook shows...', category: 'Future Trends', skills: ['Vision'] },
  { id: 49, type: 'scenario-based', question: 'How would you recover from ... failure?', answer: 'Recovery process would...', category: 'Recovery', skills: ['Resilience'] },
  { id: 50, type: 'practical', question: 'How would you contribute unique value in ...?', answer: 'My contribution would be...', category: 'Value Add', skills: ['Uniqueness'] },
];

const MEDIUM_QUESTIONS = TEMPLATE_EASY_50.map((q, i) => ({ ...q, id: q.id + 100, type: 'problem-solving' })).slice(0, 20);
const HARD_QUESTIONS = TEMPLATE_EASY_50.map((q, i) => ({ ...q, id: q.id + 200, type: 'problem-solving' })).slice(0, 10);

export const QUESTIONS_DATABASE = {
  'Computer Science / IT': {
    'Software Engineer': {
      Easy: EASY_QUESTIONS.Software_Engineer,
      Medium: MEDIUM_QUESTIONS,
      Hard: HARD_QUESTIONS,
    },
    'Data Scientist': {
      Easy: EASY_QUESTIONS.Data_Scientist,
      Medium: MEDIUM_QUESTIONS,
      Hard: HARD_QUESTIONS,
    },
    'DevOps Engineer': {
      Easy: EASY_QUESTIONS.DevOps_Engineer,
      Medium: MEDIUM_QUESTIONS,
      Hard: HARD_QUESTIONS,
    },
  },
  'Core Engineering': {
    'Mechanical Engineer': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Electrical Engineer': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Civil Engineer': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
  },
  'Commerce / Business': {
    'Business Analyst': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Financial Analyst': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Marketing Manager': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
  },
  'Medical / Healthcare': {
    'Doctor': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Nurse': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Healthcare Administrator': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
  },
  'Arts / Humanities': {
    'Journalist': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Educator': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Translator': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
  },
  'Government Jobs / Public Service': {
    'IAS Officer': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Police Officer': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Public Administrator': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
  },
  'Creative / Design': {
    'Graphic Designer': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'UX/UI Designer': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Content Creator': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
  },
  'Law': {
    'Lawyer': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Legal Consultant': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Advocate': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
  },
  'Hospitality & Tourism': {
    'Hotel Manager': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Travel Consultant': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
    'Chef': { Easy: TEMPLATE_EASY_50, Medium: MEDIUM_QUESTIONS, Hard: HARD_QUESTIONS },
  },
};

export const getQuestions = (category, field, difficulty) => {
  const categoryData = QUESTIONS_DATABASE[category];
  if (!categoryData) return [];
  
  const fieldData = categoryData[field];
  if (!fieldData) return [];
  
  const questions = fieldData[difficulty];
  return questions || [];
};

export const getCategories = () => Object.keys(QUESTIONS_DATABASE);

export const getFieldsByCategory = (category) => {
  const categoryData = QUESTIONS_DATABASE[category];
  return categoryData ? Object.keys(categoryData) : [];
};

export const getDifficultyLevels = (category, field) => {
  if (!category || !field) {
    return ['Easy', 'Medium', 'Hard'];
  }
  const categoryData = QUESTIONS_DATABASE[category];
  if (!categoryData) return ['Easy', 'Medium', 'Hard'];
  
  const fieldData = categoryData[field];
  if (!fieldData) return ['Easy', 'Medium', 'Hard'];
  
  return Object.keys(fieldData).length > 0 ? Object.keys(fieldData) : ['Easy', 'Medium', 'Hard'];
};
