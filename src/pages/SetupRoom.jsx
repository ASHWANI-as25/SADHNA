import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Code, Settings, ArrowRight, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import * as pdfjs from 'pdfjs-dist';
import { generateResumeHash } from '../services/questionTrackingService';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const SetupRoom = () => {
  const navigate = useNavigate();
  const { updateSession } = useInterview();
  const fileInputRef = useRef(null);
  const [resume, setResume] = useState(null);
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState(30); // Duration in minutes
  const [isParsing, setIsParsing] = useState(false);

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleStart = async () => {
    if (!role.trim()) {
      alert("Please specify a target role first.");
      return;
    }

    setIsParsing(true);
    let resumeText = '';
    let resumeHash = null;
    
    try {
      // Generate resume hash for unique identification
      resumeHash = await generateResumeHash(resume);

      if (resume && resume.type === 'application/pdf') {
        try {
          resumeText = await extractTextFromPDF(resume);
        } catch (pdfError) {
          console.warn("PDF parsing warning (non-critical):", pdfError);
          // Continue without resume text - not a blocker
        }
      } else if (resume && (resume.type === 'application/msword' || resume.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        // For non-PDF files, just skip parsing
        console.log("Non-PDF file uploaded, skipping parsing");
      }

      // Update global context - always succeed
      updateSession({
        role,
        difficulty,
        resumeText: resumeText || '',
        resumeHash, // Store resume hash for question tracking
        duration,
        transcript: [] // Reset history for new session
      });

      // Navigate to interview room
      navigate('/dashboard/interview');
    } catch (error) {
      console.error("Session update error:", error);
      // Still update session and navigate
      updateSession({ role, difficulty, resumeText: '', resumeHash, duration, transcript: [] });
      navigate('/dashboard/interview');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 md:p-12 space-y-10"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Configure Interview</h1>
          <p className="text-gray-400 text-lg">Customize your mock session tailored to your needs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Resume Upload Column */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">Upload Resume (Optional)</label>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept=".pdf,.doc,.docx" 
              onChange={(e) => {
                if(e.target.files && e.target.files.length > 0) {
                  setResume(e.target.files[0]);
                }
              }} 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-all h-[200px]"
            >
              {resume ? (
                <>
                  <FileText size={48} className="text-emerald-400 mb-4" />
                  <p className="font-medium text-white mb-1 truncate w-full px-4">{resume.name}</p>
                  <p className="text-xs text-emerald-500 font-medium">Uploaded Successfully</p>
                </>
              ) : (
                <>
                  <UploadCloud size={48} className="text-accent mb-4" />
                  <p className="font-medium text-white mb-1">Click to upload Document</p>
                  <p className="text-xs text-gray-500">Max file size: 5MB</p>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">Uploading your resume helps the AI personalize the questions based on your background.</p>
          </div>

          {/* Settings Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Target Role</label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {['Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'HR Manager'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`py-2 rounded-lg text-sm border transition-all ${
                        role === r ? 'bg-accent/20 border-accent text-white' : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Code className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="Custom Role... (e.g. Data Scientist)"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['Easy', 'Medium', 'Hard'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`py-3 rounded-xl font-medium text-sm transition-all border ${
                      difficulty === lvl 
                        ? 'bg-accent/20 border-accent text-white' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Interview Duration</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { value: 10, label: '10 min' },
                  { value: 20, label: '20 min' },
                  { value: 30, label: '30 min' },
                  { value: 60, label: '1 hr' },
                  { value: 120, label: '2 hr' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDuration(opt.value)}
                    className={`py-2 px-2 rounded-lg font-medium text-sm transition-all border ${
                      duration === opt.value 
                        ? 'bg-green-500/20 border-green-500 text-green-300' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">⏱️ Unlimited questions will be asked based on your selected duration. The interview will auto-submit when time runs out.</p>
            </div>
            
            <div className="pt-4">
              <button 
                onClick={handleStart}
                disabled={isParsing}
                className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-wait"
              >
                {isParsing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Parsing Resume...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Interview Room</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SetupRoom;
