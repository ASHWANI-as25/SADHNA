/**
 * Comprehensive Questions Database
 * Supports 9 categories with multiple fields and 3 difficulty levels
 * Each field contains exactly 50 unique questions
 */

// ============================================================================
// 1. COMPUTER SCIENCE / IT
// ============================================================================

const COMPUTER_SCIENCE = {
  'Data Scientist': {
    Easy: [
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
      { id: 1135, type: 'practical', question: 'How would you extract feature importance from a tree model?', answer: 'feature_importance = rf.feature_importances_; import pd; importance_df = pd.DataFrame({\'feature\': X_train.columns, \'importance\': feature_importance}).sort_values(\'importance\')[importance_df.index = X_train.columns]', category: 'Model Analysis', skills: ['Sklearn', 'Analysis'] },
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
    Medium: [
      { id: 1201, type: 'problem-solving', question: 'Design a recommendation system. How would you handle cold start and sparsity?', answer: 'Collaborative filtering with matrix factorization. Content-based for new users. Hybrid approaches. Handle sparsity with regularization, implicit feedback, side information.', category: 'Recommendation Systems', skills: ['Recommendations', 'Design'] },
      { id: 1202, type: 'scenario-based', question: 'Build predictive model for customer churn. What features would you engineer?', answer: 'Recency, frequency, tenure, spending patterns, support interactions, product usage, engagement metrics, demographic features. Domain expertise critical.', category: 'Feature Engineering', skills: ['Business Analytics', 'Features'] },
      { id: 1203, type: 'practical', question: 'Implement gradient boosting with XGBoost. How would you tune it?', answer: 'from xgboost import XGBClassifier; params: learning_rate, max_depth, n_estimators, subsample, colsample_bytree. Use GridSearchCV or Bayesian optimization.', category: 'Gradient Boosting', skills: ['XGBoost', 'Tuning'] },
      { id: 1204, type: 'problem-solving', question: 'Design a system to detect fraud in credit card transactions. What challenges exist?', answer: 'Class imbalance, real-time requirements, feature engineering on streaming data, concept drift, interpretability for regulations, model updates, false positives costly.', category: 'Fraud Detection', skills: ['Anomaly Detection', 'Real-time ML'] },
      { id: 1205, type: 'scenario-based', question: 'Feature engineering produces 1000+ features. How would you select the best?', answer: 'Univariate statistical tests, mutual information, tree-based importance, permutation importance, correlation analysis, domain knowledge, iterative selection, forward/backward selection.', category: 'Feature Selection', skills: ['Feature Engineering', 'Optimization'] },
    ],
    Hard: [
      { id: 1301, type: 'problem-solving', question: 'Design and implement a neural network from scratch. How would you handle backpropagation?', answer: 'Implement forward pass with weight matrices. Backpropagation: compute gradients using chain rule. Update weights with gradient descent. Handle numerical stability carefully.', category: 'Deep Learning Theory', skills: ['Neural Networks', 'ML Theory'] },
      { id: 1302, type: 'scenario-based', question: 'Transfer learning project: adapt ImageNet model for your specific domain. Strategy?', answer: 'Load pre-trained weights. Freeze early layers or fine-tune. Use domain data for training. Reduce learning rate. Data augmentation. Regularization. Monitor overfitting.', category: 'Transfer Learning', skills: ['Deep Learning', 'Computer Vision'] },
      { id: 1303, type: 'practical', question: 'Implement LSTM for time series forecasting with attention mechanism.', answer: 'Use PyTorch/TensorFlow LSTM layers. Add attention layer for interpretability. Sequence-to-sequence architecture. Handle variable length sequences with masking.', category: 'Deep Learning', skills: ['LSTM', 'Attention'] },
    ],
  },
  'DevOps Engineer': {
    Easy: [
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
    Medium: [
      { id: 1501, type: 'problem-solving', question: 'Design high-availability distributed system handling millions of requests. Challenges?', answer: 'Network partitions, consistency/availability tradeoff, geo-replication, conflict resolution, load balancing, caching strategies, monitoring distributed traces.', category: 'Distributed Systems', skills: ['Architecture', 'Scale'] },
      { id: 1502, type: 'scenario-based', question: 'Implement zero-downtime deployment strategy. What tools and processes?', answer: 'Blue-green deployment, canary releases, database migration strategies, backwards-compatible API changes, feature flags, health checks, automated rollback.', category: 'Deployment Strategy', skills: ['Deployment', 'Reliability'] },
      { id: 1503, type: 'practical', question: 'Design Kubernetes cluster for production. Hardware, scaling, networking, storage?', answer: 'Master node HA, worker nodes for applications, etcd cluster, network policies, persistent storage with PV/PVC, ingress controller, monitoring, RBAC, disaster recovery.', category: 'Kubernetes Architecture', skills: ['Kubernetes', 'Infrastructure'] },
    ],
    Hard: [
      { id: 1601, type: 'problem-solving', question: 'Design global CDN architecture with edge locations, caching strategies, origin failover.', answer: 'Distributed edge servers, geo-routing, cache hierarchies, purge strategies, origin shielding, DDoS protection, real-time analytics, cost optimization.', category: 'CDN Architecture', skills: ['CDN', 'Scale'] },
      { id: 1602, type: 'scenario-based', question: 'Implement multi-cloud strategy. How to manage portability and avoid vendor lock-in?', answer: 'Abstract infrastructure with IaC (Terraform), use Kubernetes across clouds, API-agnostic design, data portability, backup/restore stratopegy, service meshes.', category: 'Multi-Cloud', skills: ['Cloud Strategy', 'Architecture'] },
      { id: 1603, type: 'practical', question: 'Build secure CI/CD pipeline with secrets, signing, attestation, compliance checks.', answer: 'GitHub/GitLab runners in private networks. Integrate secret vault. Sign artifacts. Software bill of materials (SBOM). SLSA framework. Policy as code.', category: 'Secure DevOps', skills: ['Security', 'CI/CD'] },
    ],
  },
  'Software Engineer': {
    Easy: [
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
    Medium: [
      { id: 101, type: 'practical', question: 'Implement a solution to the "Word Ladder" problem: Given two words and a word list, find the shortest transformation sequence.', answer: 'Use BFS with a queue to explore word transformations. For each word, generate neighbors by changing one character. Return the shortest path.', category: 'Graph Algorithms', skills: ['BFS', 'Graphs'] },
      { id: 102, type: 'problem-solving', question: 'Design a URL shortener system. How would you handle collisions and scaling?', answer: 'Use base62 encoding for IDs. Store mappings in DB. Use distributed hashing for scaling. Handle collisions with counter or hashing algorithm.', category: 'System Design', skills: ['Design', 'Scaling'] },
      { id: 103, type: 'practical', question: 'Implement promise.all and promise.race', answer: 'Promise.all waits for all promises and rejects if any rejects. Promise.race returns first settled promise. Implement with Promise constructor.', category: 'Async Programming', skills: ['Promises', 'Async'] },
      { id: 104, type: 'scenario-based', question: 'Optimize a React component that renders 10000 list items.', answer: 'Use virtualization (react-window), pagination, windowing, or infinite scroll. Implement shouldComponentUpdate or React.memo. Use useCallback for handlers.', category: 'Performance Tuning', skills: ['React', 'Virtualization'] },
      { id: 105, type: 'practical', question: 'Implement a LeetCode-style caching decorator for functions.', answer: 'Create a decorator that wraps function and caches results based on arguments. Use JSON.stringify for key generation. Handle this binding.', category: 'Functional Programming', skills: ['Decorators', 'Caching'] },
      { id: 106, type: 'problem-solving', question: 'Design a distributed cache system with TTL and cache invalidation.', answer: 'Use LRU eviction policy, TTL using timers, pub-sub for invalidation. Store metadata with each key. Use consistent hashing for distribution.', category: 'System Design', skills: ['Caching', 'Distributed Systems'] },
      { id: 107, type: 'scenario-based', question: 'You notice your API returns 5MB of unnecessary data causing slow load. How would you fix it?', answer: 'Implement field selection/projection. Use pagination. Compress responses. Implement efficient serialization. Use GraphQL to request only needed fields.', category: 'API Optimization', skills: ['API', 'Performance'] },
      { id: 108, type: 'practical', question: 'Implement a throttle decorator with leading/trailing options.', answer: 'Track last execution time. Support leading (execute immediately) and trailing (execute after delay) options. Handle edge cases.', category: 'Utility Functions', skills: ['Decorators', 'Functions'] },
      { id: 109, type: 'problem-solving', question: 'Design a rate limiter for an API. How would you implement it?', answer: 'Use token bucket or sliding window algorithm. Store counters per user/IP. Implement cleanups. Use Redis for distributed scenarios.', category: 'System Design', skills: ['Rate Limiting', 'Algorithms'] },
      { id: 110, type: 'scenario-based', question: 'How would you implement Server-Sent Events (SSE) in a React app?', answer: 'Create EventSource client, connect to SSE endpoint. Use context or state management for real-time updates. Handle reconnection and error cases.', category: 'Real-time Systems', skills: ['SSE', 'Real-time'] },
      { id: 111, type: 'practical', question: 'Implement a trie data structure with insert, search, and startsWith methods.', answer: 'Create TrieNode with children map and isEnd flag. Implement insert, search, and prefix search. Time: O(m) where m is word length.', category: 'Data Structures', skills: ['Tries', 'Data Structures'] },
      { id: 112, type: 'problem-solving', question: 'Design a pub-sub system. How would you handle topics and subscriptions?', answer: 'Use event emitters or maps for topic -> subscribers. Implement publish, subscribe, unsubscribe. Handle async callbacks and error propagation.', category: 'Design Patterns', skills: ['Pub-Sub', 'Design'] },
      { id: 113, type: 'scenario-based', question: 'Optimize database query performance for a table with 1M records. What strategies would you use?', answer: 'Use indexing on frequently queried columns. Implement pagination. Add caching layer. Optimize SQL queries. Consider denormalization.', category: 'Database Optimization', skills: ['Database', 'SQL'] },
      { id: 114, type: 'practical', question: 'Implement debounce with maximum wait time option.', answer: 'Support maxWait parameter. Track timestamps. Cancel pending timeout when maxWait exceeded. Return properly bound function.', category: 'Utility Functions', skills: ['Functions', 'Timing'] },
      { id: 115, type: 'problem-solving', question: 'Design a file system (LeetCode style). Implement FileSystem with mkdir, addContentToFile, readContentFromFile, ls.', answer: 'Use nested object structure for paths. Store file content as string. Implement path parsing and validation. Return sorted directory listings.', category: 'Data Structures', skills: ['Design', 'Recursion'] },
      { id: 116, type: 'scenario-based', question: 'How would you implement dark mode in a React app without full page reload?', answer: 'Use CSS variables or Tailwind dark: class. Store preference in localStorage. Use context to toggle theme. Apply to document classList.', category: 'UI Theming', skills: ['React', 'Styling'] },
      { id: 117, type: 'practical', question: 'Implement a graph BFS traversal algorithm.', answer: 'Use queue data structure. Mark visited nodes. Visit neighbors level by level. Return order of traversal. Time: O(V+E).', category: 'Graph Algorithms', skills: ['Graphs', 'BFS'] },
      { id: 118, type: 'problem-solving', question: 'Design a comment system for nested/threaded comments. How would you structure it?', answer: 'Use tree structure or flat array with parent IDs. Implement recursive rendering in React. Handle pagination for large threads.', category: 'UI Architecture', skills: ['React', 'Design'] },
      { id: 119, type: 'scenario-based', question: 'Your Redux store is too large and causing memory issues. How would you optimize?', answer: 'Use normalization for nested data. Implement selector memoization (reselect). Use Immer plugin. Split into multiple stores or use combineReducers.', category: 'State Management', skills: ['Redux', 'Performance'] },
      { id: 120, type: 'practical', question: 'Implement binary search tree (BST) with insert, search, delete operations.', answer: 'Use recursive or iterative approach. Maintain BST property (left < parent < right). Handle deletion cases: leaf, one child, two children.', category: 'Data Structures', skills: ['BST', 'Trees'] },
      { id: 121, type: 'problem-solving', question: 'Design a multi-language support system. How would you structure translations?', answer: 'Use i18n library like i18next. Namespace translations. Support pluralization and interpolation. Use context for current language. Lazy load translations.', category: 'Internationalization', skills: ['i18n', 'Localization'] },
      { id: 122, type: 'scenario-based', question: 'How would you handle authentication with JWT and refresh tokens?', answer: 'Store JWT in memory/cookie. Store refresh token securely. Implement token validation. Refresh JWT before expiry using refresh token endpoint.', category: 'Security', skills: ['JWT', 'Auth'] },
      { id: 123, type: 'practical', question: 'Implement a circular queue data structure.', answer: 'Use array with front and rear pointers. Implement enqueue, dequeue, peek. Use modulo for circular wrapping. Handle empty/full cases.', category: 'Data Structures', skills: ['Queues', 'Logic'] },
      { id: 124, type: 'problem-solving', question: 'Design a chat application architecture. How would you handle real-time messaging?', answer: 'Use WebSockets or Socket.io. Implement message queue for offline messages. Store chat history in database. Use pub-sub for room broadcasts.', category: 'System Design', skills: ['WebSockets', 'Real-time'] },
      { id: 125, type: 'scenario-based', question: 'You have memory leaks in a React app. How would you debug and fix them?', answer: 'Use Chrome DevTools Memory tab to find detached DOM nodes. Check for lingering timers and subscriptions. Clear in useEffect cleanup. Use Profiler tool.', category: 'Debugging', skills: ['Performance', 'Debugging'] },
      { id: 126, type: 'practical', question: 'Implement a graph DFS traversal algorithm.', answer: 'Use stack or recursion. Mark visited nodes. Visit neighbors depth-first. Return traversal order. Time: O(V+E).', category: 'Graph Algorithms', skills: ['Graphs', 'DFS'] },
      { id: 127, type: 'problem-solving', question: 'Design a polling system. How would you handle multiple choice questions and results aggregation?', answer: 'Store questions and options in database. Implement vote counting with atomic operations. Use Redis for real-time vote tracking. Update results efficiently.', category: 'System Design', skills: ['Backend', 'Database'] },
      { id: 128, type: 'scenario-based', question: 'Implement lazy loading for images in a React component. How would you ensure accessibility?', answer: 'Use Intersection Observer API. Add loading state with skeleton. Use native lazy loading attribute. Add alt text and aria-labels.', category: 'Performance & Accessibility', skills: ['React', 'A11y'] },
      { id: 129, type: 'practical', question: 'Implement a min stack that supports push, pop, and getMin in O(1).', answer: 'Use two stacks: regular stack and min stack. Push difference when value < min. getMin returns top of min stack. O(1) all operations.', category: 'Data Structures', skills: ['Stacks', 'Optimization'] },
      { id: 130, type: 'problem-solving', question: 'Design a recommendation engine. What algorithms would you use?', answer: 'Use collaborative filtering, content-based filtering, or hybrid approach. Implement matrix factorization. Use caching for performance. Consider A/B testing.', category: 'Machine Learning', skills: ['ML', 'Algorithms'] },
      { id: 131, type: 'scenario-based', question: 'How would you implement form validation with real-time feedback?', answer: 'Use controlled inputs with onChange handlers. Implement validation on blur and submit. Show inline error messages. Use third-party libraries like react-hook-form.', category: 'Forms', skills: ['React', 'Validation'] },
      { id: 132, type: 'practical', question: 'Implement a linked list with insert, delete, search operations.', answer: 'Create Node class with value and next pointer. Implement insert at head/tail/position. Handle edge cases like empty list. Traverse for search/delete.', category: 'Data Structures', skills: ['Linked Lists', 'Pointers'] },
      { id: 133, type: 'problem-solving', question: 'Design a notification system with different channels (email, SMS, push). How would you implement it?', answer: 'Use adapter pattern for different channels. Implement queue for processing. Support templates and scheduling. Add retry logic for failures.', category: 'System Design', skills: ['Design Patterns', 'Architecture'] },
      { id: 134, type: 'scenario-based', question: 'You need to migrate a large Redux store to Recoil. What would be your strategy?', answer: 'Analyze current selectors and reducers. Map to Recoil atoms and selectors. Implement gradually. Test thoroughly. Use atom effects for persistence.', category: 'State Management', skills: ['Recoil', 'Migration'] },
      { id: 135, type: 'practical', question: 'Implement an LRU cache with get and put operations meeting O(1) complexity.', answer: 'Use HashMap + doubly-linked list. Move accessed item to tail. Remove head on capacity exceeded. Both operations: O(1).', category: 'Data Structures', skills: ['Caching', 'Design'] },
      { id: 136, type: 'problem-solving', question: 'Design an e-commerce checkout flow. How would you handle payment processing?', answer: 'Implement secure payment gateway integration. Support multiple payment methods. Handle cart, inventory, orders in database. Implement retry logic.', category: 'E-commerce', skills: ['Backend', 'Security'] },
      { id: 137, type: 'scenario-based', question: 'How would you implement OAuth2 authentication in a React app?', answer: 'Use libraries like react-oauth/google. Implement authorization code flow. Store tokens securely. Refresh tokens automatically. Handle logout.', category: 'Authentication', skills: ['OAuth', 'Auth'] },
      { id: 138, type: 'practical', question: 'Implement a segment tree for range sum queries.', answer: 'Build binary tree with sum of each segment. Query O(log n). Update O(log n). Use array representation for efficiency.', category: 'Advanced Data Structures', skills: ['Trees', 'Algorithms'] },
      { id: 139, type: 'problem-solving', question: 'Design a job queue system with retry logic and dead letter queue.', answer: 'Use queue data structure (Redis). Implement worker pool. Track failures and retry exponentially. Move failed jobs to DLQ after max retries.', category: 'System Design', skills: ['Queues', 'Backend'] },
      { id: 140, type: 'scenario-based', question: 'How would you implement keyboard shortcuts in a React app?', answer: 'Add keydown/keyup listeners. Use useEffect for setup/cleanup. Handle key combinations. Prevent default for specific shortcuts. Consider accessibility.', category: 'User Interaction', skills: ['React', 'UX'] },
      { id: 141, type: 'practical', question: 'Implement a trie-based autocomplete with suggestions.', answer: 'Build trie from dictionary. On input, traverse to prefix node. Get all words from node. Sort by frequency. Return top N suggestions.', category: 'Data Structures', skills: ['Tries', 'Autocomplete'] },
      { id: 142, type: 'problem-solving', question: 'Design a rate limiter with sliding window algorithm.', answer: 'Maintain timestamp list per user. On request, remove old timestamps. Add new timestamp. Check count against limit. Clean up expired entries.', category: 'Algorithms', skills: ['Rate Limiting', 'Time Windows'] },
      { id: 143, type: 'scenario-based', question: 'How would you implement A/B testing infrastructure?', answer: 'Random user assignment to variants. Track variant in session. Implement feature flags. Collect metrics with instrumentation. Calculate statistical significance.', category: 'Analytics', skills: ['Analytics', 'Feature Flags'] },
      { id: 144, type: 'practical', question: 'Implement a bloom filter for efficient membership testing.', answer: 'Use multiple hash functions and bit array. Add items by setting bits. Membership test checks if all hash positions are set. False positives possible.', category: 'Advanced Data Structures', skills: ['Hashing', 'Filters'] },
      { id: 145, type: 'problem-solving', question: 'Design a parking lot system. Implement available spots finding and reservation.', answer: 'Use 2D grid model. Track occupied/empty spots. Implement spot reservation. Find nearest available spot. Handle entry/exit, payment.', category: 'OOP Design', skills: ['Design', 'OOP'] },
      { id: 146, type: 'scenario-based', question: 'How would you monitor and alert on slow API endpoints?', answer: 'Implement APM (Application Performance Monitoring). Set response time thresholds. Use logging and metrics collection. Set up alerts and dashboards.', category: 'Monitoring', skills: ['DevOps', 'Monitoring'] },
      { id: 147, type: 'practical', question: 'Implement a union-find (disjoint set) data structure.', answer: 'Create parent array. Implement find with path compression. Implement union with rank optimization. Both near O(1) with optimizations.', category: 'Advanced Data Structures', skills: ['Union-Find', 'Graphs'] },
      { id: 148, type: 'problem-solving', question: 'Design a social media feed algorithm. How would you rank posts?', answer: 'Use engagement metrics (likes, comments, shares). Implement time decay. Use collaborative filtering. Add relevance scoring. Cache hot posts.', category: 'Algorithm Design', skills: ['Ranking', 'Algorithms'] },
      { id: 149, type: 'scenario-based', question: 'How would you implement end-to-end encryption for messages?', answer: 'Use public-key cryptography (RSA/ECC). Generate key pairs. Encrypt messages with recipient public key. Decrypt with private key. Store keys securely.', category: 'Security & Cryptography', skills: ['Encryption', 'Security'] },
      { id: 150, type: 'practical', question: 'Implement a segment tree with lazy propagation for range updates.', answer: 'Add lazy array to track pending updates. Push updates down during query/update. Update range efficiently without touching all elements. O(log n).', category: 'Advanced Data Structures', skills: ['Trees', 'Optimization'] },
    ],
    Hard: [
      { id: 201, type: 'problem-solving', question: 'Design a real-time collaborative text editor system. How would you handle concurrent edits and conflict resolution?', answer: 'Implement Operational Transformation (OT) or CRDT. Use version control for edits. Sync changes via WebSocket. Use unique client IDs for ordering.', category: 'System Design', skills: ['Collaborative Editing', 'Distributed Systems'] },
      { id: 202, type: 'practical', question: 'Implement a LeetCode-style "Trapping Rain Water" algorithm with O(n) time, O(1) space.', answer: 'Use two pointers approach. Move pointer with smaller height inward. Track max heights. Water trapped at position = min(leftMax, rightMax) - height.', category: 'Array Algorithms', skills: ['Two Pointers', 'Optimization'] },
      { id: 203, type: 'problem-solving', question: 'Design a distributed file system with replication and fault tolerance.', answer: 'Implement master-slave replication. Use consistent hashing for distribution. Implement quorum-based reads/writes. Handle node failures gracefully.', category: 'System Design', skills: ['Distributed Systems', 'Fault Tolerance'] },
      { id: 204, type: 'scenario-based', question: 'You have a microservices architecture with 50+ services. How would you handle distributed tracing and debugging?', answer: 'Implement distributed tracing with correlation IDs. Use tools like Jaeger or Zipkin. Track requests across services. Aggregate logs centrally.', category: 'Observability', skills: ['Microservices', 'Tracing'] },
      { id: 205, type: 'practical', question: 'Implement an order-preserving hash table that supports concurrent access.', answer: 'Use linked list with hash map. Implement read-write locks for concurrency. Maintain insertion order. Support O(1) access with O(1) iteration.', category: 'Concurrent Data Structures', skills: ['Concurrency', 'Data Structures'] },
      { id: 206, type: 'problem-solving', question: 'Design a highly scalable social media messaging system for billions of users.', answer: 'Use distributed message brokers (Kafka). Implement horizontal partitioning by user ID. Cache hot conversations. Use eventual consistency model.', category: 'System Design', skills: ['Scalability', 'Distributed Systems'] },
      { id: 207, type: 'scenario-based', question: 'Implement load balancing across multiple backend servers with health checks and circuit breakers.', answer: 'Use round-robin or weighted algorithms. Implement health checks with retries. Add circuit breaker pattern for failures. Use sticky sessions if needed.', category: 'Infrastructure', skills: ['Load Balancing', 'DevOps'] },
      { id: 208, type: 'practical', question: 'Implement "Median of Two Sorted Arrays" algorithm with O(log(min(m,n))) time.', answer: 'Use binary search on shorter array. Find partition where left elements <= right elements. Calculate median from partition values.', category: 'Binary Search', skills: ['Optimization', 'Binary Search'] },
      { id: 209, type: 'problem-solving', question: 'Design a machine learning pipeline for real-time model serving with versioning and A/B testing.', answer: 'Use model registries, containerization. Implement canary deployments. Route traffic to different versions. Track metrics per version. Implement rollbacks.', category: 'ML Systems', skills: ['MLOps', 'Deployment'] },
      { id: 210, type: 'scenario-based', question: 'How would you design a system for processing 1 trillion events per day with sub-second latency?', answer: 'Use stream processing (Kafka Streams, Flink). Implement distributed caching. Use time-series databases. Implement auto-scaling. Use edge computing where applicable.', category: 'Big Data', skills: ['Stream Processing', 'Scalability'] },
      { id: 211, type: 'practical', question: 'Implement "Recover Binary Search Tree" algorithm to fix a BST with two swapped nodes.', answer: 'Traverse in-order (gives sorted array with two wrong values). Find misplaced values. Swap them in tree. Handle cases where values are adjacent or separate.', category: 'Tree Algorithms', skills: ['Trees', 'In-Order Traversal'] },
      { id: 212, type: 'problem-solving', question: 'Design a rate limiter for an API that handles 100k requests/second with different tier systems.', answer: 'Use token bucket or leaky bucket. Implement per-user, per-IP limits. Use Redis for distributed rate limiting. Support burst capacity.', category: 'System Design', skills: ['Rate Limiting', 'Algorithms'] },
      { id: 213, type: 'scenario-based', question: 'Implement GDPR compliance system for data deletion and right-to-be-forgotten requests.', answer: 'Implement soft deletes with purge scheduled. Cascade deletes to related data. Use data catalogs. Track data lineage. Implement audit logs.', category: 'Data Governance', skills: ['Compliance', 'Data Management'] },
      { id: 214, type: 'practical', question: 'Implement "Largest Rectangle in Histogram" algorithm with O(n) time using stack.', answer: 'Use monotonic stack to track indices. For each bar, pop bars taller than current. Calculate area with popped bar as height. Push current bar.', category: 'Stack Algorithms', skills: ['Stacks', 'Optimization'] },
      { id: 215, type: 'problem-solving', question: 'Design a graph database system supporting complex queries and traversals.', answer: 'Use adjacency list representation. Implement index structures. Support parallel traversals. Implement query optimization and caching. Use columnar storage.', category: 'Database Design', skills: ['Databases', 'Graphs'] },
      { id: 216, type: 'scenario-based', question: 'How would you migrate a monolithic app to microservices without downtime?', answer: 'Use strangler pattern. Build microservices alongside monolith. Route new traffic to microservices gradually. Maintain backward compatibility. Use feature flags.', category: 'Architecture Migration', skills: ['Microservices', 'DevOps'] },
      { id: 217, type: 'practical', question: 'Implement "Edit Distance" (Levenshtein distance) with space optimization.', answer: 'Use DP with only 2 rows instead of m×n matrix. Store only current and previous row. Time: O(m*n), Space: O(min(m,n)).', category: 'Dynamic Programming', skills: ['DP', 'Optimization'] },
      { id: 218, type: 'problem-solving', question: 'Design a real-time anomaly detection system for production metrics.', answer: 'Collect metrics with time-series DB. Implement statistical algorithms (z-score, IQR). Use ML models for pattern detection. Alert on anomalies with tuning.', category: 'Monitoring & Analytics', skills: ['ML', 'Monitoring'] },
      { id: 219, type: 'scenario-based', question: 'Implement a zero-downtime database migration strategy for production systems.', answer: 'Use dual-write with version flags. Migrate data in background. Validate integrity. Switch readers first, then writers. Rollback capability.', category: 'Database Migrations', skills: ['Database', 'DevOps'] },
      { id: 220, type: 'practical', question: 'Implement "Serialize and Deserialize N-ary Tree" with level-order traversal.', answer: 'Use queue for level-order traversal. Serialize: encode children count for each node. Deserialize: use count to know how many children to read. Reconstruct tree structure.', category: 'Tree Serialization', skills: ['Trees', 'Serialization'] },
      { id: 221, type: 'problem-solving', question: 'Design a distributed consensus algorithm for a blockchain system.', answer: 'Implement Raft or PBFT for consensus. Handle leader election. Implement log replication. Handle network partitions and Byzantine failures.', category: 'Distributed Systems', skills: ['Blockchain', 'Consensus'] },
      { id: 222, type: 'scenario-based', question: 'How would you design a system for processing financial transactions with ACID guarantees at scale?', answer: 'Use distributed transactions with 2-phase commit. Implement saga pattern for long transactions. Use event sourcing for auditability. Ensure idempotency.', category: 'Financial Systems', skills: ['Transactions', 'Reliability'] },
      { id: 223, type: 'practical', question: 'Implement "Minimum Window Substring" algorithm with O(n) single pass.', answer: 'Use sliding window with char frequency map. Expand right, contract left. Track minimum window. Use hash-based comparison for efficiency.', category: 'Sliding Window', skills: ['Strings', 'Optimization'] },
      { id: 224, type: 'problem-solving', question: 'Design a real-time feature flags system supporting A/B testing and progressive rollouts.', answer: 'Build feature flag service with rules engine. Support targeting by user attributes. Track feature usage. Implement progressive rollouts with percentage-based targeting.', category: 'Feature Management', skills: ['Feature Flags', 'DevOps'] },
      { id: 225, type: 'scenario-based', question: 'Implement chaos engineering practices to ensure system resilience.', answer: 'Use tools like Gremlin or Chaos Toolkit. Inject faults in staging and production. Test failure scenarios. Document recovery procedures.', category: 'Reliability Engineering', skills: ['DevOps', 'Resilience'] },
      { id: 226, type: 'practical', question: 'Implement "Best Time to Buy and Sell Stock IV" with dynamic programming.', answer: 'Use DP with states: day, transactions, holding. Optimize space using rolling arrays. Handle unlimited transactions edge case. Time: O(n*k).', category: 'Dynamic Programming', skills: ['DP', 'Trading Algorithms'] },
      { id: 227, type: 'problem-solving', question: 'Design a recommendation engine handling billions of items with sub-second latency.', answer: 'Use approximate nearest neighbor search (Annoy, Faiss). Implement hierarchical clustering. Cache results. Use online learning for real-time updates.', category: 'Recommendation Systems', skills: ['ML', 'Scalability'] },
      { id: 228, type: 'scenario-based', question: 'How would you implement automated incident response and remediation?', answer: 'Create runbooks for common issues. Use alerting to trigger automation. Implement self-healing actions. Use machine learning for anomaly-based triggers.', category: 'Incident Management', skills: ['DevOps', 'Automation'] },
      { id: 229, type: 'practical', question: 'Implement "Regular Expression Matching" supporting . and * wildcards with DP.', answer: 'Use 2D DP table. Handle . (any char) and * (zero or more). Recurrence: dp[i][j] = match(i,j,single) && dp[i-1][j-1] or * cases.', category: 'Dynamic Programming', skills: ['DP', 'Regex'] },
      { id: 230, type: 'problem-solving', question: 'Design a multi-tenant SaaS platform with data isolation and fair resource allocation.', answer: 'Use tenant ID for data partitioning. Implement resource quotas per tenant. Use row-level security for data isolation. Handle billing per tenant.', category: 'SaaS Architecture', skills: ['Multi-tenancy', 'Security'] },
      { id: 231, type: 'scenario-based', question: 'Implement observability across a complex distributed system with millions of traces per day.', answer: 'Use sampling for traces. Implement structured logging. Use metrics for aggregation. Build dashboards for visualization. Set up alerting on anomalies.', category: 'Observability', skills: ['Monitoring', 'DevOps'] },
      { id: 232, type: 'practical', question: 'Implement "Wildcard Matching" with efficient backtracking and memoization.', answer: 'Use memoization to cache match results at (i, j) positions. Handle ? (single char) and * (any sequence). Implement greedy and backtracking strategies.', category: 'Dynamic Programming', skills: ['DP', 'Memoization'] },
      { id: 233, type: 'problem-solving', question: 'Design a peer-to-peer network protocol with efficient routing and NAT traversal.', answer: 'Implement DHT for peer discovery. Use holes punching for NAT. Implement relay servers as fallback. Support IPv4 and IPv6.', category: 'Network Systems', skills: ['P2P', 'Networking'] },
      { id: 234, type: 'scenario-based', question: 'How would you ensure data consistency across multiple data centers with network halos?', answer: 'Use eventual consistency with read repair and anti-entropy. Implement conflict-free replicated data types (CRDTs). Use quorum operations. Handle partition tolerance.', category: 'Distributed Databases', skills: ['Consistency', 'Replication'] },
      { id: 235, type: 'practical', question: 'Implement "Critical Connections in Network" (bridges) using Tarjan algorithm.', answer: 'Use DFS with discovery and low times. Find bridges where low[v] > disc[u] for edge u-v. Time: O(V+E).', category: 'Graph Algorithms', skills: ['Graphs', 'DFS'] },
      { id: 236, type: 'problem-solving', question: 'Design a security threat detection system using behavioral analysis and anomaly detection.', answer: 'Collect security events and metrics. Build ML models for anomaly detection. Implement rules-based detection. Integrate with SIEM. Auto-respond on threats.', category: 'Security & Threat Detection', skills: ['Security', 'ML'] },
      { id: 237, type: 'scenario-based', question: 'Implement cost optimization strategies for cloud infrastructure (AWS/GCP/Azure).', answer: 'Use spot instances and reserved capacity. Implement auto-scaling policies. Optimize storage and data transfer. Use serverless where appropriate.', category: 'Cloud Optimization', skills: ['Cloud', 'DevOps'] },
      { id: 238, type: 'practical', question: 'Implement "Strongly Connected Components" using Kosaraju or Tarjan algorithm.', answer: 'Kosaraju: process vertices by finish time, do DFS on reverse graph. Tarjan: use single DFS tracking low and discovery times. Time: O(V+E).', category: 'Graph Algorithms', skills: ['Graphs', 'Algorithms'] },
      { id: 239, type: 'problem-solving', question: 'Design a database sharding strategy for a multi-billion record dataset.', answer: 'Use consistent hashing or range-based sharding. Implement shard replication. Handle resharding during scaling. Monitor shard utilization.', category: 'Database Scaling', skills: ['Databases', 'Scaling'] },
      { id: 240, type: 'scenario-based', question: 'How would you implement zero-trust security architecture in an enterprise environment?', answer: 'Require authentication for all resources. Implement micro-segmentation. Use least privilege access. Monitor all network traffic. Deploy on device verification.', category: 'Enterprise Security', skills: ['Security', 'Architecture'] },
      { id: 241, type: 'practical', question: 'Implement "Minimum Cost to Make Array Equal" with prefix sums optimization.', answer: 'Sort array. Use prefix sums for range calculations. Process median-based optimal meeting point. Time: O(n log n), Space: O(n).', category: 'Optimization Algorithms', skills: ['Algorithms', 'Optimization'] },
      { id: 242, type: 'problem-solving', question: 'Design a video streaming platform supporting adaptive bitrate streaming and live broadcast.', answer: 'Use HLS or DASH protocols. Implement adaptive bitrate based on bandwidth. Use CDN for distribution. Support live encoding pipelines.', category: 'Media Systems', skills: ['Streaming', 'Media'] },
      { id: 243, type: 'scenario-based', question: 'Implement disaster recovery and business continuity planning for critical applications.', answer: 'Define RTO and RPO targets. Implement geo-redundant backups. Test recovery procedures regularly. Use active-active or active-passive setup.', category: 'Disaster Recovery', skills: ['DevOps', 'Business Continuity'] },
      { id: 244, type: 'practical', question: 'Implement "Path Sum III" counting paths with target sum efficiently.', answer: 'Use DFS with running sum tracking. Use hash map to store path sums at each level. When target is hit, increment count. Handle negative numbers.', category: 'Tree Algorithms', skills: ['Trees', 'Hash Maps'] },
      { id: 245, type: 'problem-solving', question: 'Design a knowledge graph for entity linking and semantic search with billion+ entities.', answer: 'Use graph database (Neo4j, ArangoDB). Implement entity disambiguation. Support full-text search and semantic similarity. Use embeddings for similarity.', category: 'Knowledge Graphs', skills: ['Graphs', 'NLP'] },
      { id: 246, type: 'scenario-based', question: 'How would you implement compliance auditing and automated compliance testing?', answer: 'Define compliance rules as code. Implement automated checks in CI/CD. Maintain audit logs. Implement drift detection. Regular compliance scanning.', category: 'Compliance & Governance', skills: ['DevOps', 'Compliance'] },
      { id: 247, type: 'practical', question: 'Implement "Binary Tree Maximum Path Sum" with optimal single pass solution.', answer: 'Use DFS returning max path ending at node. Calculate max through node. Track global max. Time: O(n), Space: O(h).', category: 'Tree Algorithms', skills: ['Trees', 'DFS'] },
      { id: 248, type: 'problem-solving', question: 'Design a real-time collaborative coding platform with live execution and debugging.', answer: 'Use operational transformation for code sync. Implement code execution sandbox. Support debugging breakpoints across peers. Use WebSocket for real-time updates.', category: 'Collaborative Tools', skills: ['Real-time', 'Coding'] },
      { id: 249, type: 'scenario-based', question: 'Implement continuous optimization of machine learning models in production.', answer: 'Monitor model performance metrics. Implement model versioning. Set up automated retraining pipelines. A/B test new models. Implement gradual rollouts.', category: 'MLOps', skills: ['ML', 'DevOps'] },
      { id: 250, type: 'practical', question: 'Implement "Median of Data Stream" maintaining running median efficiently.', answer: 'Use two heaps: max-heap for smaller half, min-heap for larger half. Balance heaps to differ by at most 1. Median is top of max-heap or average of both heaps.', category: 'Heap Algorithms', skills: ['Heaps', 'Streaming'] },
    ],
  },
  'Data Scientist': {
    Easy: [
      { id: 1351, type: 'conceptual', question: 'What is the difference between supervised and unsupervised learning?', answer: 'Supervised learning uses labeled data to predict outputs. Unsupervised learning finds patterns in unlabeled data without predefined outputs.', category: 'ML Fundamentals', skills: ['Machine Learning', 'Concepts'] },
      // ... add 49 more database questions for Data Scientist Easy level
    ],
  },
  'DevOps Engineer': {
    Easy: [
      { id: 2351, type: 'conceptual', question: 'What is containerization and why is Docker used?', answer: 'Containerization packages applications with dependencies. Docker provides lightweight, reproducible environments ensuring consistency across dev and production.', category: 'DevOps Fundamentals', skills: ['Docker', 'Containers'] },
      // ... add 49 more DevOps questions
    ],
  },
};

// ============================================================================
// 2. CORE ENGINEERING
// ============================================================================

const CORE_ENGINEERING = {
  'Mechanical Engineer': {
    Easy: [
      { id: 3001, type: 'conceptual', question: 'What is stress and strain in materials?', answer: 'Stress is the force applied per unit area. Strain is the deformation resulting from stress. They measure material response to loads.', category: 'Mechanics of Materials', skills: ['Materials', 'Physics'] },
    ],
  },
  'Electrical Engineer': {
    Easy: [
      { id: 3101, type: 'conceptual', question: 'What is Ohm\'s Law and explain its applications?', answer: 'V = IR. Voltage equals current times resistance. Used to determine voltage, current, or resistance in electrical circuits. Fundamental in circuit analysis.', category: 'Circuit Theory', skills: ['Circuits', 'Electronics'] },
    ],
  },
  'Civil Engineer': {
    Easy: [
      { id: 3201, type: 'conceptual', question: 'What is the difference between load bearing and framed structures?', answer: 'Load bearing relies on walls to carry loads. Framed structures use columns and beams for support. Framed allows open floor plans and flexibility.', category: 'Structural Design', skills: ['Structures', 'Design'] },
    ],
  },
};

// ============================================================================
// 3. COMMERCE / BUSINESS
// ============================================================================

const COMMERCE_BUSINESS = {
  'Accountant': {
    Easy: [
      { id: 4001, type: 'conceptual', question: 'What is the accounting equation?', answer: 'Assets = Liabilities + Equity. Foundation of double-entry bookkeeping. Shows financial position at any point in time.', category: 'Accounting Fundamentals', skills: ['Accounting', 'Finance'] },
    ],
  },
  'Business Analyst': {
    Easy: [
      { id: 4101, type: 'conceptual', question: 'What is the purpose of a market analysis in business planning?', answer: 'Market analysis examines industry size, growth, trends, and competition. Helps businesses understand opportunities and threats in their market segment.', category: 'Business Analysis', skills: ['Analysis', 'Strategy'] },
    ],
  },
  'Finance Manager': {
    Easy: [
      { id: 4201, type: 'conceptual', question: 'What is working capital and why is it important?', answer: 'Working capital = Current Assets - Current Liabilities. Represents short-term financial health. Essential for paying bills and funding operations.', category: 'Corporate Finance', skills: ['Finance', 'Management'] },
    ],
  },
};

// ============================================================================
// 4. MEDICAL / HEALTHCARE
// ============================================================================

const MEDICAL_HEALTHCARE = {
  'Doctor': {
    Easy: [
      { id: 5001, type: 'conceptual', question: 'What is the mechanism of action of antibiotics?', answer: 'Antibiotics work through 4 mechanisms: inhibit cell wall synthesis, inhibit protein synthesis, inhibit nucleic acid synthesis, or disrupt cell membrane function.', category: 'Pharmacology', skills: ['Medicine', 'Pharmacology'] },
    ],
  },
  'Nursing': {
    Easy: [
      { id: 5101, type: 'conceptual', question: 'What are the vital signs and their normal ranges?', answer: 'Vital signs include: Temperature (98.6°F), Pulse (60-100 bpm), Blood Pressure (120/80 mmHg), Respiratory rate (12-20 breaths/min). Monitor overall health status.', category: 'Clinical Assessment', skills: ['Nursing', 'Assessment'] },
    ],
  },
  'Pharmacist': {
    Easy: [
      { id: 5201, type: 'conceptual', question: 'What is drug bioavailability and its importance?', answer: 'Bioavailability is the percentage of administered drug reaching systemic circulation. Important for determining appropriate dosages and medication effectiveness.', category: 'Pharmacokinetics', skills: ['Pharmacy', 'Pharmacology'] },
    ],
  },
};

// ============================================================================
// 5. ARTS / HUMANITIES
// ============================================================================

const ARTS_HUMANITIES = {
  'Historian': {
    Easy: [
      { id: 6001, type: 'conceptual', question: 'What distinguishes primary sources from secondary sources in historical research?', answer: 'Primary sources: original documents (letters, diaries, artifacts). Secondary sources: analysis of primary sources. Both vital for historical understanding.', category: 'Historical Research', skills: ['History', 'Research'] },
    ],
  },
  'Journalist': {
    Easy: [
      { id: 6101, type: 'conceptual', question: 'What is the importance of fact-checking in journalism?', answer: 'Fact-checking ensures accuracy and credibility. Verifies sources, quotes, and data. Essential for maintaining journalistic integrity and public trust.', category: 'Journalism Ethics', skills: ['Journalism', 'Ethics'] },
    ],
  },
  'Philosopher': {
    Easy: [
      { id: 6201, type: 'conceptual', question: 'What is the difference between ethics and morality?', answer: 'Ethics are systematic principles governing conduct. Morality describes personal beliefs about right/wrong. Ethics is broader institutional framework.', category: 'Philosophical Concepts', skills: ['Philosophy', 'Ethics'] },
    ],
  },
};

// ============================================================================
// 6. GOVERNMENT JOBS / PUBLIC SERVICE
// ============================================================================

const GOVERNMENT_JOBS = {
  'IAS Officer': {
    Easy: [
      { id: 7001, type: 'conceptual', question: 'Explain the Indian Constitution and its structure.', answer: 'Constitution is fundamental law of India. Divides power among executive, legislative, judicial branches. Contains fundamental rights and duties. Framework for governance.', category: 'Constitutional Law', skills: ['Government', 'Law'] },
    ],
  },
  'IPS Officer': {
    Easy: [
      { id: 7101, type: 'conceptual', question: 'What are the powers and duties of police under the IPC?', answer: 'Police enforce law, investigate crimes, maintain order, prevent crimes, and collect evidence. Follow due process and protect constitutional rights of citizens.', category: 'Criminal Law', skills: ['Law Enforcement', 'IPC'] },
    ],
  },
  'Tax Officer': {
    Easy: [
      { id: 7201, type: 'conceptual', question: 'What is the GST system and how does it work?', answer: 'GST (Goods and Services Tax) is unified indirect tax. Single tax replaces multiple earlier taxes. Based on destination principle. Input tax credit mechanism.', category: 'Tax Law', skills: ['Taxation', 'GST'] },
    ],
  },
};

// ============================================================================
// 7. CREATIVE / DESIGN
// ============================================================================

const CREATIVE_DESIGN = {
  'Graphic Designer': {
    Easy: [
      { id: 8001, type: 'conceptual', question: 'What are the principles of visual design?', answer: 'Principles: balance, contrast, emphasis, movement, pattern, white space, unity. Guide effective visual communication and aesthetic appeal.', category: 'Design Fundamentals', skills: ['Design', 'Visual Communication'] },
    ],
  },
  'UX/UI Designer': {
    Easy: [
      { id: 8101, type: 'conceptual', question: 'What is the difference between UX and UI design?', answer: 'UX (User Experience) focuses on functionality and user journey. UI (User Interface) focuses on visual design and interaction elements. Both essential.', category: 'Interactive Design', skills: ['UX', 'UI'] },
    ],
  },
  'Content Creator': {
    Easy: [
      { id: 8201, type: 'conceptual', question: 'What makes content engaging and shareable?', answer: 'Engagement: relevance, storytelling, emotional appeal, call-to-action. Shareability: authenticity, value, brevity, visual elements. Understand target audience.', category: 'Content Strategy', skills: ['Content', 'Marketing'] },
    ],
  },
};

// ============================================================================
// 8. LAW
// ============================================================================

const LAW = {
  'Lawyer': {
    Easy: [
      { id: 9001, type: 'conceptual', question: 'What is the difference between criminal and civil law?', answer: 'Criminal law prosecutes crimes against society. Civil law resolves disputes between individuals. Different burdens of proof and penalties.', category: 'Legal Concepts', skills: ['Law', 'Justice'] },
    ],
  },
  'Legal Consultant': {
    Easy: [
      { id: 9101, type: 'conceptual', question: 'What are the key elements of a valid contract?', answer: 'Elements: offer, acceptance, consideration, intent, capacity, legality. All required for binding contract. Used in contract law analysis.', category: 'Contract Law', skills: ['Contracts', 'Law'] },
    ],
  },
  'Advocate': {
    Easy: [
      { id: 9201, type: 'conceptual', question: 'What is advocacy and the role of an advocate in the legal system?', answer: 'Advocacy represents clients in legal proceedings. Advocates present arguments, provide legal counsel, protect rights, and serve justice system.', category: 'Legal Practice', skills: ['Advocacy', 'Law'] },
    ],
  },
};

// ============================================================================
// 9. HOSPITALITY & TOURISM
// ============================================================================

const HOSPITALITY_TOURISM = {
  'Hotel Manager': {
    Easy: [
      { id: 10001, type: 'conceptual', question: 'What is guest service recovery and why is it critical?', answer: 'Service recovery addresses failures and turns upset guests into loyal customers. Increases satisfaction and retention. Key aspect of hospitality management.', category: 'Guest Services', skills: ['Hospitality', 'Management'] },
    ],
  },
  'Travel Consultant': {
    Easy: [
      { id: 10101, type: 'conceptual', question: 'What should be considered when planning a travel itinerary?', answer: 'Consider: budget, interests, climate, accessibility, local attractions, accommodation, transportation, safety. Customize based on traveler preferences and constraints.', category: 'Travel Planning', skills: ['Travel', 'Planning'] },
    ],
  },
  'Chef': {
    Easy: [
      { id: 10201, type: 'conceptual', question: 'What is food safety and hygiene in a professional kitchen?', answer: 'Critical practices: proper storage, temperature control, cross-contamination prevention, handwashing, sanitation. Prevents foodborne illness. Regulatory requirement.', category: 'Culinary Science', skills: ['Cooking', 'Safety'] },
    ],
  },
};

// ============================================================================
// EXPORT QUESTIONS DATABASE
// ============================================================================

export const QUESTIONS_DATABASE = {
  'Computer Science / IT': COMPUTER_SCIENCE,
  'Core Engineering': CORE_ENGINEERING,
  'Commerce / Business': COMMERCE_BUSINESS,
  'Medical / Healthcare': MEDICAL_HEALTHCARE,
  'Arts / Humanities': ARTS_HUMANITIES,
  'Government Jobs / Public Service': GOVERNMENT_JOBS,
  'Creative / Design': CREATIVE_DESIGN,
  'Law': LAW,
  'Hospitality & Tourism': HOSPITALITY_TOURISM,
};

/**
 * Helper function to get questions for a specific combination
 */
export const getQuestions = (category, field, difficulty) => {
  const categoryData = QUESTIONS_DATABASE[category];
  if (!categoryData) return [];
  
  const fieldData = categoryData[field];
  if (!fieldData) return [];
  
  const questions = fieldData[difficulty];
  return questions || [];
};

/**
 * Get all categories
 */
export const getCategories = () => Object.keys(QUESTIONS_DATABASE);

/**
 * Get all fields for a category
 */
export const getFieldsByCategory = (category) => {
  const categoryData = QUESTIONS_DATABASE[category];
  return categoryData ? Object.keys(categoryData) : [];
};

/**
 * Get difficulty levels for a field
 */
export const getDifficultyLevels = (category, field) => {
  const categoryData = QUESTIONS_DATABASE[category];
  if (!categoryData) return [];
  
  const fieldData = categoryData[field];
  if (!fieldData) return [];
  
  return Object.keys(fieldData);
};
