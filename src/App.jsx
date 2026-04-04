import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InterviewProvider } from './context/InterviewContext';
import { AssessmentProvider } from './context/AssessmentContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/ToastContainer';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ProctoringDashboard from './pages/ProctoringDashboard';
import SetupRoom from './pages/SetupRoom';
import InterviewRoom from './pages/InterviewRoom';
import Feedback from './pages/Feedback';
import Assessment from './pages/Assessment';
import Streaks from './pages/Streaks';
import DailyTodos from './pages/DailyTodos';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <InterviewProvider>
          <AssessmentProvider>
            <ToastContainer />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* OAuth Callback Routes */}
                <Route path="/auth/google/callback" element={<OAuthCallback />} />
                <Route path="/auth/github/callback" element={<OAuthCallback />} />
                <Route path="/auth/linkedin/callback" element={<OAuthCallback />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="proctoring" element={<ProctoringDashboard />} />
                  <Route path="setup" element={<SetupRoom />} />
                  <Route path="interview" element={<InterviewRoom />} />
                  <Route path="feedback" element={<Feedback />} />
                  <Route path="assessment" element={<Assessment />} />
                  <Route path="streaks" element={<Streaks />} />
                  <Route path="todos" element={<DailyTodos />} />
                </Route>
              </Routes>
            </AssessmentProvider>
          </InterviewProvider>
        </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
