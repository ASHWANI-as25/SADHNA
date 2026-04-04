import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Mic, MicOff, AlertTriangle, Check, PhoneOff, Loader2, Settings, ChevronLeft, ChevronRight, ChevronDown, Volume2, VolumeX, Play, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateAIResponse, generateFinalFeedback, getIntroQuestion } from '../services/supabaseAI';
import { useInterview } from '../context/InterviewContext';
import { PROBLEMS } from '../services/problems';
import { getRandomAvailableQuestionIndex, markQuestionAsUsed, getShuffledAvailableQuestions } from '../services/questionTrackingService';
import LiveProctoringCamera from '../components/LiveProctoringCamera';
import CodeQualityReport from '../components/CodeQualityReport';
import { analyzeCodeQuality } from '../services/codeQuality';
import HintsPanel from '../components/HintsPanel';
import FeedbackPanel from '../components/FeedbackPanel';

const BOILERPLATES = {
  javascript: (name) => `function ${name}() {\n  // your code here\n}`,
  python: (name) => `def ${name}():\n    # your code here\n    pass`,
  java: (name) => `public class Solution {\n    public static void main(String[] args) {\n        // your code here\n    }\n}`,
  cpp: (name) => `#include <iostream>\n\nint main() {\n    // your code here\n    return 0;\n}`,
  c: (name) => `#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}`,
  rust: (name) => `fn main() {\n    // your code here\n}`,
  go: (name) => `package main\n\nimport "fmt"\n\nfunc main() {\n    // your code here\n}`,
  kotlin: (name) => `fun main() {\n    // your code here\n}`
};

const InterviewRoom = () => {
  const navigate = useNavigate();
  const { session, updateSession, addMessage } = useInterview();
  
  // Redirect if no session data exists
  if (!session || !session.role || !session.difficulty) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-3">⚠️ No Session Found</h2>
          <p className="text-gray-300 mb-6">Please start an interview from the setup page</p>
          <button
            onClick={() => navigate('/dashboard/setup')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:opacity-90 transition-all"
          >
            Go to Setup
          </button>
        </div>
      </div>
    );
  }
  
  const allProblems = useMemo(() => {
    const roleProblems = PROBLEMS[session.role] || PROBLEMS['Software Engineer'];
    const difficultyOptions = roleProblems[session.difficulty] || roleProblems['Medium'];
    return Array.isArray(difficultyOptions) ? difficultyOptions : [difficultyOptions];
  }, [session.role, session.difficulty]);

  // Initialize problem index based on available (unused) questions for this resume
  const getInitialProblemIndex = () => {
    if (!session.resumeHash || !allProblems.length) {
      return 0;
    }
    // Get a random available question that hasn't been used yet for this resume
    return getRandomAvailableQuestionIndex(session.resumeHash, session.role, session.difficulty, allProblems);
  };

  const [currentProblemIdx, setCurrentProblemIdx] = useState(() => getInitialProblemIndex());
  const problem = allProblems[currentProblemIdx] || allProblems[0];
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  const [codes, setCodes] = useState({}); // problemTitle_lang -> code
  const currentKey = `${problem.title}_${selectedLanguage}`;
  const code = codes[currentKey] || (selectedLanguage === 'javascript' ? (problem.defaultCode || '') : BOILERPLATES[selectedLanguage]('solution'));

  const setCode = (newCode) => {
    setCodes(prev => ({ ...prev, [currentKey]: newCode }));
  };

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [warnings, setWarnings] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [aiMessage, setAiMessage] = useState("Waiting for your signal to start...");
  const [timeLeft, setTimeLeft] = useState(() => (session?.duration || 30) * 60); // Convert minutes to seconds
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [hasInterviewStarted, setHasInterviewStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [codeAnalysis, setCodeAnalysis] = useState(null);
  const [showHintsPanel, setShowHintsPanel] = useState(false);
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('problem-understanding');

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const timerRef = useRef(null);

  // Initial Resume Analysis & Intro
  const hasStartedRef = useRef(false);
  const questionMarkedRef = useRef(false); // Track if we've marked this question as used
  useEffect(() => {
    if (!hasInterviewStarted || hasStartedRef.current) return;
    hasStartedRef.current = true;

    const startInterview = async () => {
      try {
        // Mark this question as used for this resume/role/difficulty (first time only)
        if (!questionMarkedRef.current && session.resumeHash && problem) {
          markQuestionAsUsed(session.resumeHash, session.role, session.difficulty, problem.title);
          questionMarkedRef.current = true;
        }

        // Use Supabase-based intro question generator
        const response = getIntroQuestion(problem.isBehavioral, session.difficulty);
        
        // Enhance with context if resume is available
        let finalResponse = response;
        if (session.resumeText) {
          finalResponse = `${response} [I can see you've provided a background - that's great!]`;
        }
        
        setAiMessage(finalResponse);
        addMessage('assistant', finalResponse);
        speak(finalResponse);
      } catch (e) {
        console.error("Error starting interview:", e);
        const fallbackMsg = `Hello! Let's start the ${problem.isBehavioral ? 'behavioral' : 'technical'} interview for ${session.role}. We'll work through the ${problem.title} problem together.`;
        setAiMessage(fallbackMsg);
        addMessage('assistant', fallbackMsg);
        speak(fallbackMsg);
      }
    };

    startInterview();
  }, [session, problem, addMessage]);

  // Timer logic
  useEffect(() => {
    if (!hasInterviewStarted || isSubmitting) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          handleSubmit(); // Auto-submit when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [hasInterviewStarted, isSubmitting]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRunCode = async () => {
    if (selectedLanguage !== 'javascript') {
      setConsoleOutput([...consoleOutput, `[System] Execution for ${selectedLanguage} is not supported in the browser. Results are simulated.`]);
      setRunResults([{ id: 'mock', passed: true, actual: "Simulation Successful" }]);
      return;
    }

    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      originalLog(...args);
    };

    try {
      // Find the function name and body
      const fnNameMatch = code.match(/function\s+(\w+)/);
      if (!fnNameMatch) throw new Error("Could not find function name. Please use 'function name() { ... }' format.");
      
      const fnName = fnNameMatch[1];
      // Create the function from the code string
      // SECURITY: Execute user code in isolated context with timeout
      // Note: For production, use Web Workers or sandboxing library
      const executeCode = (code, timeout = 5000) => {
        return new Promise((resolve, reject) => {
          // Create a timeout to prevent infinite loops
          const timeoutId = setTimeout(() => {
            reject(new Error('Code execution timeout - possibly infinite loop'));
          }, timeout);

          try {
            // Basic validation: check for dangerous patterns
            const dangerousPatterns = [
              /localStorage\./gi,
              /sessionStorage\./gi,
              /document\./gi,
              /window\./gi,
              /fetch\(/gi,
              /XMLHttpRequest/gi
            ];
            
            for (const pattern of dangerousPatterns) {
              if (pattern.test(code)) {
                clearTimeout(timeoutId);
                reject(new Error(`Dangerous pattern detected in code: ${pattern}. For security, certain browser APIs are restricted.`));
                return;
              }
            }

            // Execute wrapped in function
            const wrappedCode = `(function() { ${code} })()`;
            const result = eval(wrappedCode);
            clearTimeout(timeoutId);
            resolve(result);
          } catch (err) {
            clearTimeout(timeoutId);
            reject(err);
          }
        });
      };

      try {
        const output = await executeCode(code);
        setCodeOutput(output);
      } catch (err) {
        setCodeOutput(`❌ Error: ${err.message}`);
      }
      
      if (typeof userFn !== 'function') throw new Error("The code does not define a valid function");

      const results = (problem.testCases || []).map((tc, i) => {
        try {
          const actual = userFn(...tc.input);
          const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
          return { id: i, passed, input: JSON.stringify(tc.input), expected: JSON.stringify(tc.expected), actual: JSON.stringify(actual) };
        } catch (e) {
          return { id: i, passed: false, error: e.message };
        }
      });
      
      setRunResults(results);
      
      // Analyze code quality
      const analysis = analyzeCodeQuality(code);
      setCodeAnalysis(analysis);
      
      setConsoleOutput(logs);
    } catch (error) {
      setRunResults([{ id: 'err', passed: false, error: error.message }]);
      setConsoleOutput(logs);
    } finally {
      console.log = originalLog;
    }
  };

  const handleSkipProblem = (direction = 1) => {
    let nextIdx;
    
    if (typeof direction === 'number' && direction >= 0) {
      // Direct index selection
      nextIdx = direction;
    } else {
      // For prev/next navigation, prefer available (unused) questions for better variety
      const availableIndices = session.resumeHash 
        ? getShuffledAvailableQuestions(session.resumeHash, session.role, session.difficulty, allProblems)
        : Array.from({ length: allProblems.length }, (_, i) => i);
      
      if (availableIndices.length > 0) {
        // Navigate through available questions
        const currentPos = availableIndices.indexOf(currentProblemIdx);
        const nextPos = direction === 'prev' ? currentPos - 1 : currentPos + 1;
        
        if (nextPos >= 0 && nextPos < availableIndices.length) {
          nextIdx = availableIndices[nextPos];
        } else {
          // Fallback to cyclic navigation through all problems
          nextIdx = (currentProblemIdx + (direction === 'prev' ? -1 : 1) + allProblems.length) % allProblems.length;
        }
      } else {
        // All questions used for this resume - cycle through all
        nextIdx = (currentProblemIdx + (direction === 'prev' ? -1 : 1) + allProblems.length) % allProblems.length;
      }
    }
    
    setCurrentProblemIdx(nextIdx);
    setRunResults(null);
    setConsoleOutput([]);
    setCodeAnalysis(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const feedback = await generateFinalFeedback(
        session.transcript, 
        codes, 
        problem.isBehavioral, 
        session.role,
        runResults,        // Pass test results for analysis
        codeAnalysis,      // Pass code quality analysis
        session.difficulty // Pass difficulty level
      );
      updateSession({ 
        results: { ...feedback, isBehavioral: problem.isBehavioral }, 
        problemTitle: "Comprehensive Evaluation" 
      });
      navigate('/dashboard/feedback');
    } catch (error) {
      console.error(error);
      navigate('/dashboard/feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Anti-cheating mechanism (Browser Locking)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarnings(w => w + 1);
        if (warnings >= 2) {
          alert('Interview terminated due to multiple tab switches.');
          navigate('/dashboard/feedback');
        } else {
          alert('Warning: Please do not switch tabs during the interview. This is a proctored session.');
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Request fullscreen on mount (user interaction may be required, so we just try)
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        console.log("Fullscreen request denied or requires user interaction first.");
      });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      synthRef.current?.cancel();
    };
  }, [warnings, navigate]);

  // Speech Recognition Setup
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    setAiMessage("Thinking...");
    try {
      addMessage('user', text);
      setQuestionCount(prev => prev + 1);
      const reply = await generateAIResponse(text, code, session.transcript, {
        role: session.role,
        difficulty: session.difficulty,
        resumeText: session.resumeText,
        isBehavioral: problem.isBehavioral,
        currentProblemTitle: problem.title,
        currentProblemStatement: problem.statement
      });
      setAiMessage(reply);
      addMessage('assistant', reply);
      speak(reply);
    } catch (error) {
      console.error(error);
      setAiMessage("Sorry, I had trouble processing that. Could you repeat?");
    }
  };

  const toggleMic = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      if (transcript.trim().length > 0) {
        handleSendMessage(transcript);
      }
      setTranscript('');
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
      synthRef.current?.cancel();
    }
  };

  const speak = (text) => {
    if (!synthRef.current || isMuted) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: Try to find a good English voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const endInterview = () => {
    if (window.confirm("Are you sure you want to end the interview early? You will be evaluated on your performance so far.")) {
      handleSubmit();
    }
  };

  return (
    <div className="h-full flex flex-col pt-2 -mt-4 bg-gradient-to-br from-background via-background to-sadhna-navy/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl px-6 py-4 rounded-t-xl border border-white/20 mb-4 shadow-2xl hover:bg-white/7 transition-all">
        <div className="flex items-center gap-4">
          <div className="flex space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => handleSkipProblem('prev')}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-1 overflow-x-auto max-w-[200px] no-scrollbar">
              {allProblems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSkipProblem(i)}
                  className={`min-w-[28px] h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    currentProblemIdx === i 
                      ? 'bg-accent text-white shadow-lg shadow-accent/40 scale-110' 
                      : 'bg-white/5 text-gray-500 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handleSkipProblem('next')}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {warnings > 0 && (
            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-sm">
              <AlertTriangle size={16} />
              <span>Warnings: {warnings}/2</span>
            </div>
          )}
          <div className={`text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm border ${
            timeLeft < 300 ? 'bg-red-500/20 text-red-300 animate-pulse border-red-500/30' : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
          }`}>
            <span className="font-mono">{formatTime(timeLeft)}</span>
            <span className="text-gray-500">/</span>
            <span className="font-mono">{session?.duration || 30}m total</span>
          </div>
          <button 
            onClick={() => setShowFeedbackPanel(!showFeedbackPanel)}
            className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 backdrop-blur-sm border font-semibold ${
              showFeedbackPanel 
                ? 'bg-purple-500/30 text-purple-200 border-purple-500/50' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20 border-white/20'
            }`}
            title="Toggle Real-Time Feedback"
          >
            📊 Feedback
          </button>
          <button 
            onClick={() => setShowHintsPanel(!showHintsPanel)}
            className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 backdrop-blur-sm border font-semibold ${
              showHintsPanel 
                ? 'bg-green-500/30 text-green-200 border-green-500/50' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20 border-white/20'
            }`}
            title="Toggle Smart Hints"
          >
            💡 Hints
          </button>
          <button onClick={endInterview} className="bg-red-500/20 hover:bg-red-500/40 text-red-200 px-4 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 border border-red-500/30 backdrop-blur-sm font-semibold">
            <PhoneOff size={16} />
            End Session
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden relative">
        {/* Live Proctoring Camera - Fixed position draggable overlay */}
        <LiveProctoringCamera 
          isInterviewActive={hasInterviewStarted}
          onWarning={(warningCount) => {
            console.log(`Face detection warning ${warningCount}/3`);
            // Could show toast notification or alert here
          }}
          onTerminate={() => {
            console.log('Interview terminated due to proctoring violation');
            // Interview will be terminated by the component itself
          }}
        />

        {/* Left Panel: AI Agent & Output */}
        <div className="w-1/3 flex flex-col gap-6">
          
          {/* AI Video/Audio Agent Box */}
          <div className="flex-1 glass-panel flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-purple-500/5">
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <div className="bg-black/50 px-3 py-1 text-xs rounded-full backdrop-blur-xl flex items-center gap-2 border border-white/20">
                <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
                AI Agent
              </div>
              <button 
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (!isMuted) synthRef.current?.cancel();
                }}
                className={`p-1.5 rounded-full backdrop-blur-md border border-white/10 transition-all ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-black/40 text-gray-400 hover:text-white'}`}
                title={isMuted ? "Unmute AI" : "Mute AI"}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-8 relative">
              {/* Agent visualization */}
              <motion.div 
                animate={{ 
                  scale: isSpeaking ? [1, 1.1, 1] : 1,
                  boxShadow: isSpeaking ? ['0px 0px 0px rgba(99,102,241,0)', '0px 0px 40px rgba(99,102,241,0.5)', '0px 0px 0px rgba(99,102,241,0)'] : "none"
                }}
                transition={{ duration: 1.5, repeat: isSpeaking ? Infinity : 0 }}
                className="w-32 h-32 rounded-full bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center relative z-10"
              >
                 <div className="w-24 h-24 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">AI</div>
                 </div>
              </motion.div>

              {!hasInterviewStarted && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setHasInterviewStarted(true)}
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/40 group-hover:bg-accent-light transition-colors">
                      <Play fill="currentColor" size={24} className="ml-1 text-white" />
                    </div>
                    <span className="text-sm font-bold tracking-widest text-white uppercase opacity-80 group-hover:opacity-100 transition-opacity">Start Interview</span>
                  </motion.button>
                </div>
              )}
              
              {/* Decorative circles */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-64 h-64 rounded-full border border-accent/50"></div>
                <div className="absolute w-80 h-80 rounded-full border-dashed border border-purple-500/30 animate-[spin_20s_linear_infinite]"></div>
              </div>
            </div>

            {/* Subtitles / Agent Chat Log */}
            <div className="bg-black/30 backdrop-blur-md p-5 mt-auto border-t border-white/20 min-h-[120px] max-h-[150px] overflow-y-auto">
              <p className="text-gray-200 text-sm leading-relaxed mb-2 font-medium">"{aiMessage}"</p>
              {transcript && (
                <p className="text-gray-400 text-xs italic border-l-2 border-accent pl-2 ml-1">You: {transcript}</p>
              )}
            </div>

            {/* Chat Controls */}
            <div className="p-4 border-t border-white/20 flex gap-3 bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-md">
              <input 
                type="text"
                placeholder="Type your response..."
                className="flex-1 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:bg-white/10 focus:ring-1 focus:ring-accent/30 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button 
                onClick={toggleMic}
                className={`p-3 rounded-xl transition-all flex items-center justify-center shadow-lg backdrop-blur-sm border ${
                  isListening 
                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/30' 
                    : 'bg-accent/20 text-white hover:bg-accent/30 border-accent/30'
                }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button 
                onClick={() => handleSkipProblem('next')}
                className="p-3 rounded-xl transition-all flex items-center justify-center shadow-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30 backdrop-blur-sm"
                title="Skip to next question"
              >
                <SkipForward size={20} />
              </button>
            </div>
          </div>

          {/* Problem Statement Box or Panels */}
          {showFeedbackPanel ? (
            <div className="h-1/3 overflow-y-auto hidden lg:block">
              <FeedbackPanel 
                transcript={transcript} 
                code={code} 
                duration={((session?.duration || 30) * 60 - timeLeft)}
                currentPhase={currentPhase}
              />
            </div>
          ) : showHintsPanel ? (
            <div className="h-1/3 overflow-y-auto hidden lg:block">
              <HintsPanel 
                code={code}
                difficulty={session.difficulty}
                problemId={problem.id}
                problemType={problem.type}
              />
            </div>
          ) : (
            <div className="glass-panel p-6 h-1/3 overflow-y-auto hidden lg:block bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                {problem.isBehavioral || session.role === 'HR Manager' ? "📋 Interview Guidance" : `🎯 Problem Statement: ${problem.title}`}
              </h3>
              {!problem.isBehavioral && session.role !== 'HR Manager' && problem.hints && (
                <button
                  onClick={() => setShowHints(!showHints)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all backdrop-blur-sm border ${
                    showHints
                      ? 'bg-accent/30 text-accent border-accent/50'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border-white/20'
                  }`}
                >
                  💡 {showHints ? 'Hide Hints' : 'Show Hints'}
                </button>
              )}
            </div>
            
            {showHints && problem.hints ? (
              <div className="space-y-4">
                {/* Hints Section */}
                <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg border border-accent/30">
                  <h4 className="text-sm font-bold text-accent mb-2">💡 Smart Hints:</h4>
                  <ul className="space-y-1.5">
                    {problem.hints.map((hint, i) => (
                      <li key={i} className="text-xs text-gray-300 pl-4 border-l-2 border-accent/50 hover:border-accent transition-colors">
                        <span className="text-accent font-bold">{i + 1}.</span> {hint}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Examples Section */}
                {problem.examples && (
                  <div className="pt-3 border-t border-white/20 bg-black/20 backdrop-blur-sm p-3 rounded-lg">
                    <h4 className="text-sm font-bold text-accent mb-2">📝 Example Solution:</h4>
                    <pre className="bg-black/50 p-3 rounded-lg text-[10px] text-gray-300 overflow-x-auto max-h-[120px] overflow-y-auto font-mono border border-white/10">
                      {problem.examples}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {problem.isBehavioral || session.role === 'HR Manager'
                    ? "This session focuses on soft skills and behavioral scenarios. Please listen to the interviewer's questions carefully and provide specific examples from your past experiences. No coding is required."
                    : problem.statement
                  }
                </p>
                {!problem.isBehavioral && session.role !== 'HR Manager' && problem.testCases && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">📊 Example Test Cases</h4>
                    <div className="space-y-2">
                      {problem.testCases.slice(0, 2).map((tc, i) => (
                        <div key={i} className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-3 rounded-lg font-mono text-[11px] text-gray-300 border border-white/10 hover:border-white/20 transition-all">
                          <div className="text-blue-300">▸ Input: {JSON.stringify(tc.input)}</div>
                          <div className="text-green-300 mt-1">▸ Output: {JSON.stringify(tc.expected)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            </div>
          )}
        </div>

        {/* Right Panel: Code Editor (or Behavioral Placeholder) */}
        {!problem.isBehavioral && session.role !== 'HR Manager' ? (
          <div className="w-2/3 glass-panel overflow-hidden flex flex-col border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <div className="bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-xl border-b border-white/20 p-3 px-5 flex justify-between items-center z-20">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span className="text-green-400">⚙️</span>
                  solution.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'java' ? 'java' : 'js'}
                </span>
                
                {/* Custom Language Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-gray-300 transition-all active:scale-95 backdrop-blur-sm"
                  >
                    <span className="capitalize">{selectedLanguage}</span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLangOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)}></div>
                      <div className="absolute top-full mt-2 left-0 w-32 bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl py-2 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {['javascript', 'python', 'java', 'cpp', 'c', 'rust', 'go', 'kotlin'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              setSelectedLanguage(lang);
                              setIsLangOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-accent/20 ${
                              selectedLanguage === lang ? 'text-accent font-bold bg-accent/10' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            <div className="flex gap-2">
              <button 
                onClick={handleRunCode}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-lg text-sm transition-all backdrop-blur-sm text-blue-300 font-semibold border border-blue-500/30 hover:border-blue-400/50"
                >
                ▶ Run Code
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 hover:from-green-500/30 hover:to-emerald-500/30 rounded-lg text-sm flex items-center gap-1.5 transition-all font-medium border border-green-500/30 hover:border-green-400/50 disabled:opacity-50 backdrop-blur-sm"
              >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} 
                {isSubmitting ? 'Generating...' : 'Submit Interview'}
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                language={selectedLanguage}
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  padding: { top: 20 },
                  fontFamily: 'JetBrains Mono, Menlo, monospace',
                  scrollBeyondLastLine: false,
                  lineHeight: 1.6,
                  renderLineHighlight: 'all',
                  suggestOnTriggerCharacters: true,
                  smoothScrolling: true,
                }}
              />
            </div>
            
            {/* Run Results Console */}
            {(runResults || consoleOutput.length > 0) && (
              <div className="h-1/3 bg-gradient-to-t from-[#1a1a2e] to-[#16213e] border-t border-white/20 flex flex-col backdrop-blur-sm">
                <div className="flex items-center justify-between p-3 px-4 bg-gradient-to-r from-black/40 to-black/20 border-b border-white/20">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-yellow-400">▼</span> Console Output & Tests
                  </span>
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-1 rounded-full">Questions: <span className="text-green-400 font-bold">{questionCount}</span></span>
                    <button onClick={() => { setRunResults(null); setConsoleOutput([]); setCodeAnalysis(null); }} className="text-gray-500 hover:text-white text-xs transition-colors font-semibold">✕ Clear</button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
                  {/* Console Logs */}
                  {consoleOutput.map((log, i) => (
                    <div key={`log-${i}`} className="text-blue-300 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                      <span className="text-gray-500 mr-2">→ LOG:</span>{log}
                    </div>
                  ))}
                  
                  {/* Test Results */}
                  {runResults?.map((res) => (
                    <div key={res.id} className="mb-2 p-3 rounded-lg border transition-all" style={{
                      borderColor: res.error ? '#f87171' : res.passed ? '#34d399' : '#fbbf24',
                      backgroundColor: res.error ? 'rgba(248,113,113,0.1)' : res.passed ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)'
                    }}>
                      {res.error ? (
                        <div className="text-red-400 flex items-center gap-2">
                          <span className="text-lg">⚠️</span> Error: {res.error}
                        </div>
                      ) : (
                        <div className={res.passed ? "text-green-300" : "text-yellow-300"}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{res.passed ? '✓' : '✗'}</span>
                            <span className="font-bold">{res.passed ? "Test Passed" : "Test Failed"}</span>
                          </div>
                          <div className="text-xs text-gray-400 pl-6 space-y-1">
                            <div>📥 Input: <span className="text-blue-300">{res.input}</span></div>
                            <div>📤 Expected: <span className="text-green-300">{res.expected}</span></div>
                            <div>🔄 Actual: <span className={res.passed ? "text-green-300" : "text-red-300"}>{res.actual}</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Code Quality Report */}
                  {codeAnalysis && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <CodeQualityReport analysis={codeAnalysis} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        ) : (
          <div className="w-2/3 glass-panel flex flex-col items-center justify-center text-center p-12 border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10">
             <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-8 border border-purple-500/30 backdrop-blur-sm">
                <Settings className="text-purple-300 animate-[spin_10s_linear_infinite]" size={48} />
             </div>
             <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">💬 Behavioral Interview</h2>
             <p className="text-gray-300 max-w-md leading-relaxed">
               No coding is required for this interview. The AI is evaluating your communication, leadership, and problem-solving skills through dialogue. Focus on your STAR responses.
             </p>
             <div className="mt-8 flex gap-3 flex-wrap justify-center">
               <div className="px-4 py-2 rounded-lg bg-emerald-500/15 text-emerald-300 text-sm border border-emerald-500/30 backdrop-blur-sm">✓ Active Listening</div>
               <div className="px-4 py-2 rounded-lg bg-blue-500/15 text-blue-300 text-sm border border-blue-500/30 backdrop-blur-sm">★ STAR Model</div>
               <div className="px-4 py-2 rounded-lg bg-amber-500/15 text-amber-300 text-sm border border-amber-500/30 backdrop-blur-sm">📚 Real Examples</div>
             </div>
             
             <div className="mt-auto w-full pt-12">
               <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 hover:from-green-500/30 hover:to-emerald-500/30 rounded-xl transition-all font-bold flex items-center justify-center gap-2 border border-green-500/30 backdrop-blur-sm hover:border-green-400/50"
               >
                 {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                 {isSubmitting ? 'Finalizing Evaluation...' : '✓ Complete Behavioral Interview'}
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRoom;
