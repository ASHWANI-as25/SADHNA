import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ChevronRight, Home, User, Target, Zap, Code } from 'lucide-react';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import LeaderboardDisplay from '../components/LeaderboardDisplay';

const Feedback = () => {
  const { session } = useInterview();
  const { userProfile } = useAuth();
  
  // Use AI result if available, otherwise fallback to mock
  const report = session?.results || {
    score: 0,
    technical: 0,
    communication: 0,
    leadership: 0,
    strengths: ['No interview data available'],
    improvements: ['Complete an interview to see detailed feedback.'],
    alternativeApproach: "Start a new interview session to get personalized feedback."
  };

  // Show loading state if no session
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-blue-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Session Data</h2>
          <p className="text-gray-400 mb-6">Please start an interview first to see feedback.</p>
          <Link
            to="/dashboard/setup"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            Start Interview
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sadhna-red via-sadhna-navy to-sadhna-black pt-8 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel overflow-hidden"
        >
        <div className="bg-accent/10 p-8 border-b border-white/10 flex justify-between items-center">
          <div>
             <h1 className="text-3xl font-bold mb-2">Interview Report</h1>
             <p className="text-gray-400">{session.role} • {session.difficulty} Difficulty</p>
          </div>
          <div className="text-right">
             <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
               {report.score}%
             </div>
             <p className="text-sm text-gray-400 font-medium">Overall Score</p>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                Strengths
              </h3>
              <ul className="space-y-3">
                {report.strengths.map((str, i) => (
                  <li key={i} className="flex gap-3 text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                    <ChevronRight className="text-green-400 shrink-0 mt-0.5" size={16} />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-yellow-400">
                <AlertTriangle size={20} />
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {report.improvements.map((imp, i) => (
                  <li key={i} className="flex gap-3 text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                    <ChevronRight className="text-yellow-400 shrink-0 mt-0.5" size={16} />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
             {/* Test Results Section - for technical interviews */}
             {!report.isBehavioral && report.testsTotal && (
               <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/30">
                 <h3 className="font-semibold mb-4 text-blue-300 flex items-center gap-2">
                   <Target size={20} />
                   Test Cases Performance
                 </h3>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-gray-300">Passed Test Cases</span>
                     <span className="font-mono text-lg font-bold text-green-400">
                       {report.testsPassed}/{report.testsTotal}
                     </span>
                   </div>
                   <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all" 
                       style={{ width: `${(report.testsPassed / report.testsTotal) * 100}%` }}
                     />
                   </div>
                   <p className="text-sm text-gray-400 mt-2">
                     {report.testsPassed === report.testsTotal 
                       ? "🎯 All test cases passed - Excellent logic!" 
                       : report.testsPassed > report.testsTotal * 0.75
                       ? "👍 Strong partial implementation - Focus on edge cases"
                       : report.testsPassed > report.testsTotal * 0.5
                       ? "📐 Good foundation - More debugging needed"
                       : "💡 Keep working - Review the problem approach"}
                   </p>
                 </div>
               </div>
             )}
             
             <div className="bg-white/5 rounded-xl p-6 border border-white/10">
               <h3 className="font-semibold mb-4 text-gray-200">Metrics Breakdown</h3>
               <div className="space-y-4">
                 <div>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-400 flex items-center gap-2">
                       <Code size={16} />
                       {report.isBehavioral ? "Emotional Intelligence & Leadership" : "Technical Correctness"}
                     </span>
                     <span className="font-mono text-green-400">{Math.round(report.isBehavioral ? report.leadership : report.technical)}%</span>
                   </div>
                   <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 rounded-full" style={{ width: `${report.isBehavioral ? report.leadership : report.technical}%` }}></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-400 flex items-center gap-2">
                       <Zap size={16} />
                       Communication & Reasoning
                     </span>
                     <span className="font-mono text-yellow-400">{Math.round(report.communication)}%</span>
                   </div>
                   <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${report.communication}%` }}></div>
                   </div>
                 </div>
               </div>
             </div>

             <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
               <h3 className="font-semibold mb-2 text-blue-300">💡 Alternative Approach</h3>
               <p className="text-sm text-blue-100/80 leading-relaxed">
                 {report.alternativeApproach}
               </p>
             </div>
          </div>
        </div>
        
        <div className="p-6 bg-black/20 border-t border-white/10 flex justify-end">
          <Link 
            to="/"
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Home size={18} />
            Back to Dashboard
          </Link>
        </div>
      </motion.div>

      {/* Leaderboard Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12"
      >
        <LeaderboardDisplay userId={userProfile?.id} />
      </motion.div>
      </div>
    </div>
  );
};

export default Feedback;
