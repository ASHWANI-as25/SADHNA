import { useState, useEffect } from 'react';
import { Eye, AlertTriangle, CheckCircle, Clock, Users, Zap, Download, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const ProctoringDashboard = () => {
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      role: 'Software Engineer',
      difficulty: 'Medium',
      startTime: new Date(Date.now() - 600000),
      duration: 30,
      testsSubmitted: 5,
      warnings: 0,
      alerts: [
        { type: 'tab-switch', time: '2 min ago', message: 'Switched tabs' },
        { type: 'no-face', time: '5 sec ago', message: 'Face not detected briefly' }
      ],
      faceDetected: true,
      recordingStatus: 'recording'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      role: 'Frontend Engineer',
      difficulty: 'Hard',
      startTime: new Date(Date.now() - 1200000),
      duration: 60,
      testsSubmitted: 8,
      warnings: 1,
      alerts: [
        { type: 'tab-switch', time: '1 min ago', message: 'Switched tabs' }
      ],
      faceDetected: true,
      recordingStatus: 'recording'
    }
  ]);

  const [selectedSession, setSelectedSession] = useState(null);
  const [filterWarnings, setFilterWarnings] = useState(false);

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    return `${Math.floor(diff / 3600)}h`;
  };

  const getRiskLevel = (session) => {
    const warningCount = session.warnings;
    const alertCount = session.alerts.length;
    
    if (warningCount >= 2 || alertCount > 3) return 'high';
    if (warningCount === 1 || alertCount > 1) return 'medium';
    return 'low';
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      default: return 'bg-green-500/20 border-green-500/30 text-green-400';
    }
  };

  const filteredSessions = filterWarnings 
    ? activeSessions.filter(s => getRiskLevel(s) !== 'low')
    : activeSessions;

  const stats = {
    totalActive: activeSessions.length,
    flaggedCount: activeSessions.filter(s => getRiskLevel(s) !== 'low').length,
    allRecording: activeSessions.every(s => s.recordingStatus === 'recording'),
    allFacesDetected: activeSessions.every(s => s.faceDetected)
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Shield size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Proctoring Dashboard</h1>
            <p className="text-gray-400">Real-time interview monitoring and security</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Sessions', value: stats.totalActive, icon: Users, color: 'blue' },
            { label: 'Flagged', value: stats.flaggedCount, icon: AlertTriangle, color: 'red' },
            { label: 'Recording', value: stats.allRecording ? '✓ All' : stats.totalActive, icon: Zap, color: 'purple' },
            { label: 'Faces Detected', value: stats.allFacesDetected ? '✓ All' : 'Checking', icon: Eye, color: 'green' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-panel p-6 border-l-4 ${
                stat.color === 'blue' ? 'border-blue-500' :
                stat.color === 'red' ? 'border-red-500' :
                stat.color === 'purple' ? 'border-purple-500' :
                'border-green-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1 text-white">{stat.value}</p>
                </div>
                <stat.icon size={24} className={`opacity-50 ${
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'red' ? 'text-red-400' :
                  stat.color === 'purple' ? 'text-purple-400' :
                  'text-green-400'
                }`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilterWarnings(!filterWarnings)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all border ${
            filterWarnings
              ? 'bg-red-500/20 text-red-300 border-red-500/30'
              : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
          }`}
        >
          <AlertTriangle size={16} className="inline mr-2" />
          {filterWarnings ? 'Showing Flagged Only' : 'Show All'}
        </button>
        <button className="px-6 py-2 rounded-lg font-semibold bg-accent text-white hover:shadow-lg transition-all flex items-center gap-2">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSessions.map((session, idx) => {
          const riskLevel = getRiskLevel(session);
          const elapsed = formatTime(session.startTime);

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedSession(selectedSession?.id === session.id ? null : session)}
              className={`glass-panel p-6 cursor-pointer transition-all hover:shadow-xl border-l-4 ${
                getRiskColor(riskLevel)
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{session.studentName}</h3>
                  <p className="text-sm text-gray-400">
                    {session.role} • {session.difficulty}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`w-3 h-3 rounded-full ${
                      session.recordingStatus === 'recording'
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-xs font-bold text-gray-400">
                    {session.recordingStatus === 'recording' ? 'REC' : 'IDLE'}
                  </span>
                </div>
              </div>

              {/* Session Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400">Elapsed Time</p>
                  <p className="text-2xl font-bold mt-1">{elapsed}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-400">Tests Submitted</p>
                  <p className="text-2xl font-bold mt-1">{session.testsSubmitted}</p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex gap-2 mb-4">
                {session.faceDetected ? (
                  <div className="flex-1 bg-green-500/10 border border-green-500/30 rounded-lg p-2 flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs font-bold text-green-400">Face Detected</span>
                  </div>
                ) : (
                  <motion.div
                    animate={{ opacity: [0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 flex items-center gap-2"
                  >
                    <AlertTriangle size={14} className="text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400">No Face Detected</span>
                  </motion.div>
                )}
              </div>

              {/* Warnings & Alerts */}
              {session.warnings > 0 && (
                <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-xs font-bold text-red-300">⚠️ Warnings: {session.warnings}/2</p>
                </div>
              )}

              {/* Alert History */}
              {session.alerts.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-bold text-gray-400 mb-2">Recent Alerts:</p>
                  <div className="space-y-1">
                    {session.alerts.slice(0, 3).map((alert, i) => (
                      <div key={i} className="text-xs bg-white/5 p-2 rounded border border-white/10 flex justify-between items-center">
                        <span className="text-gray-300">{alert.message}</span>
                        <span className="text-gray-500">{alert.time}</span>
                      </div>
                    ))}
                    {session.alerts.length > 3 && (
                      <p className="text-xs text-gray-500 italic">+{session.alerts.length - 3} more alerts</p>
                    )}
                  </div>
                </div>
              )}

              {/* Risk Level Badge */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="text-xs text-gray-400">Risk Assessment</div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  riskLevel === 'high' ? 'bg-red-500/20 text-red-300' :
                  riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {riskLevel}
                </div>
              </div>

              {/* Expand Indicator */}
              {selectedSession?.id === session.id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <p className="text-xs text-gray-400 mb-2">Full Alert History:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {session.alerts.map((alert, i) => (
                        <div key={i} className="text-xs bg-black/30 p-2 rounded border border-white/5">
                          <div className="flex justify-between mb-1">
                            <span className="font-mono text-accent">[{alert.time}]</span>
                            <span className={`font-bold ${
                              alert.type === 'tab-switch' ? 'text-yellow-300' :
                              alert.type === 'no-face' ? 'text-red-300' :
                              'text-blue-300'
                            }`}>
                              {alert.type.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-400">{alert.message}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-3 px-4 py-2 bg-accent/20 text-accent rounded-lg text-xs font-bold hover:bg-accent/30 transition-all">
                      View Full Recording
                    </button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredSessions.length === 0 && (
        <div className="glass-panel p-12 text-center">
          <Eye size={32} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-400">No active sessions matching filters</p>
        </div>
      )}
    </div>
  );
};

export default ProctoringDashboard;
