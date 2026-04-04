import { useState } from 'react';
import { TrendingUp, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CodeQualityReport = ({ analysis }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  if (!analysis) {
    return (
      <div className="p-4 text-center text-gray-400">
        Run your code to see quality analysis
      </div>
    );
  }

  const scoreColor = 
    analysis.score >= 80 ? 'text-green-400' :
    analysis.score >= 60 ? 'text-yellow-400' :
    analysis.score >= 40 ? 'text-orange-400' : 'text-red-400';

  const scoreBgColor = 
    analysis.score >= 80 ? 'bg-green-500/10' :
    analysis.score >= 60 ? 'bg-yellow-500/10' :
    analysis.score >= 40 ? 'bg-orange-500/10' : 'bg-red-500/10';

  return (
    <div className="p-4 space-y-4 text-sm">
      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${scoreBgColor} rounded-lg p-4 border border-white/10`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-white flex items-center gap-2">
            <TrendingUp size={16} />
            Code Quality Score
          </h3>
          <span className={`text-2xl font-bold ${scoreColor}`}>
            {analysis.score}/100
          </span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-2">
          <div
            className={`h-full rounded-full transition-all ${
              analysis.score >= 80 ? 'bg-green-400' :
              analysis.score >= 60 ? 'bg-yellow-400' :
              analysis.score >= 40 ? 'bg-orange-400' : 'bg-red-400'
            }`}
            style={{ width: `${analysis.score}%` }}
          />
        </div>
      </motion.div>

      {/* Complexity Metrics */}
      <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
        <h4 className="font-semibold text-blue-300 mb-2">⏱️ Complexity Metrics</h4>
        <div className="space-y-1 text-xs text-gray-300">
          <p>Time Complexity: <span className="font-mono text-blue-400">{analysis.timeComplexity}</span></p>
          <p>Space Complexity: <span className="font-mono text-blue-400">{analysis.spaceComplexity}</span></p>
        </div>
      </div>

      {/* Code Metrics */}
      <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
        <h4 className="font-semibold text-purple-300 mb-2">📊 Code Metrics</h4>
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-300">
          <div>Lines: <span className="text-purple-400 font-bold">{analysis.metrics.lines}</span></div>
          <div>Functions: <span className="text-purple-400 font-bold">{analysis.metrics.functions}</span></div>
          <div>Comments: <span className="text-purple-400 font-bold">{Math.round(analysis.metrics.comments)}</span></div>
        </div>
      </div>

      {/* Design Patterns */}
      {analysis.patterns.length > 0 && (
        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
          <button
            onClick={() => setExpandedSection(expandedSection === 'patterns' ? null : 'patterns')}
            className="w-full font-semibold text-green-300 text-left flex items-center justify-between hover:text-green-200 transition"
          >
            <span className="flex items-center gap-2">
              <CheckCircle size={16} />
              Design Patterns ({analysis.patterns.length})
            </span>
            <span>{expandedSection === 'patterns' ? '▼' : '▶'}</span>
          </button>
          {expandedSection === 'patterns' && (
            <div className="mt-2 space-y-2 text-xs text-gray-300">
              {analysis.patterns.map((pattern, idx) => (
                <div key={idx} className="pl-4 border-l border-green-500/50">
                  <p className="font-semibold text-green-400">{pattern.name}</p>
                  <p className="text-gray-400">{pattern.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Code Smells */}
      {analysis.codeSmells.length > 0 && (
        <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
          <button
            onClick={() => setExpandedSection(expandedSection === 'smells' ? null : 'smells')}
            className="w-full font-semibold text-red-300 text-left flex items-center justify-between hover:text-red-200 transition"
          >
            <span className="flex items-center gap-2">
              <AlertTriangle size={16} />
              Code Smells ({analysis.codeSmells.length})
            </span>
            <span>{expandedSection === 'smells' ? '▼' : '▶'}</span>
          </button>
          {expandedSection === 'smells' && (
            <div className="mt-2 space-y-2 text-xs text-gray-300">
              {analysis.codeSmells.map((smell, idx) => (
                <div key={idx} className="pl-4 border-l border-red-500/50">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-red-400">{smell.type}</p>
                    <span className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                      smell.severity === 'High' ? 'bg-red-500 text-white' :
                      smell.severity === 'Medium' ? 'bg-yellow-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {smell.severity}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1">{smell.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
          <button
            onClick={() => setExpandedSection(expandedSection === 'suggestions' ? null : 'suggestions')}
            className="w-full font-semibold text-yellow-300 text-left flex items-center justify-between hover:text-yellow-200 transition"
          >
            <span className="flex items-center gap-2">
              <Lightbulb size={16} />
              Top Suggestions ({analysis.suggestions.length})
            </span>
            <span>{expandedSection === 'suggestions' ? '▼' : '▶'}</span>
          </button>
          {expandedSection === 'suggestions' && (
            <div className="mt-2 space-y-3 text-xs text-gray-300">
              {analysis.suggestions.map((suggestion, idx) => (
                <div key={idx} className="pl-4 border-l border-yellow-500/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      suggestion.priority === 'High' ? 'bg-red-500/50 text-red-300' :
                      suggestion.priority === 'Medium' ? 'bg-yellow-500/50 text-yellow-300' :
                      'bg-blue-500/50 text-blue-300'
                    }`}>
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="font-semibold text-yellow-400 mb-1">{suggestion.suggestion}</p>
                  <p className="text-gray-400 italic">"{suggestion.action}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeQualityReport;
