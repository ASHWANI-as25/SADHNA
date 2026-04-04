/* INTEGRATION GUIDE FOR PHASE 2 FEATURES */

// ============================================================================
// 1. INTEGRATE WEBCAM PREVIEW INTO SetupRoom.jsx
// ============================================================================
// Add to imports:
// import WebcamPreview from '../components/WebcamPreview';

// Add state:
// const [showWebcamPreview, setShowWebcamPreview] = useState(false);

// Add button before "Start Interview":
// <button
//   onClick={() => setShowWebcamPreview(true)}
//   className="w-full px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-semibold hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
// >
//   <Video size={20} />
//   Setup Webcam & Recording
// </button>

// Add component:
// {showWebcamPreview && (
//   <WebcamPreview
//     onClose={() => setShowWebcamPreview(false)}
//     onStart={(config) => {
//       // Handle recording config if needed
//       handleStartInterview();
//     }}
//   />
// )}

// ============================================================================
// 2. INTEGRATE TRANSCRIPTION PANEL INTO InterviewRoom.jsx
// ============================================================================
// Add to imports:
// import TranscriptionPanel from '../components/TranscriptionPanel';

// Add state:
// const [showTranscription, setShowTranscription] = useState(false);

// Add to chat section (replace or add alongside chat):
// {showTranscription && (
//   <div className="mt-6 glass-panel p-4">
//     <TranscriptionPanel
//       isActive={true}
//       role="user"
//     />
//   </div>
// )}

// Add button to toggle transcription:
// <button
//   onClick={() => setShowTranscription(!showTranscription)}
//   className={`p-2 rounded-lg transition-all ${
//     showTranscription
//       ? 'bg-accent text-white'
//       : 'bg-white/10 text-gray-300'
//   }`}
// >
//   <Mic size={20} />
// </button>

// ============================================================================
// 3. ADD KEYBOARD SHORTCUTS TO InterviewRoom.jsx
// ============================================================================
// Add to imports:
// import { useKeyboardShortcuts, KEYBOARD_SHORTCUTS } from '../services/shortcuts';

// Add state:
// const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

// Add keyboard handler:
// useEffect(() => {
//   const handleKeyDown = useKeyboardShortcuts({
//     onSubmit: handleSubmit,
//     onSkip: () => handleSkipProblem('next'),
//     onHint: () => setShowHints(!showHints),
//     onReset: resetCode,
//     onHelp: () => setShowShortcutsHelp(true),
//     onEnlargeCode: () => setCodePanelSize('large'),
//     onEnlargeConsole: () => setConsolePanelSize('large')
//   });

//   window.addEventListener('keydown', handleKeyDown);
//   return () => window.removeEventListener('keydown', handleKeyDown);
// }, []);

// Add help button and modal:
// <button
//   onClick={() => setShowShortcutsHelp(true)}
//   className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
//   title="Keyboard Shortcuts (?)"
// >
//   <HelpCircle size={20} />
// </button>

// <ShortcutsModal
//   isOpen={showShortcutsHelp}
//   onClose={() => setShowShortcutsHelp(false)}
// />

// ============================================================================
// 4. ADD SETTINGS PANEL TO Layout.jsx
// ============================================================================
// Add to imports:
// import SettingsPanel from '../pages/SettingsPanel';
// import { Settings } from 'lucide-react';

// Add state:
// const [showSettings, setShowSettings] = useState(false);

// Add settings button to header or sidebar:
// <button
//   onClick={() => setShowSettings(true)}
//   className="p-2 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all"
//   title="Settings"
// >
//   <Settings size={20} />
// </button>

// Add modal:
// <SettingsPanel
//   isOpen={showSettings}
//   onClose={() => setShowSettings(false)}
// />

// ============================================================================
// 5. INTEGRATE PDF EXPORT TO Analytics.jsx
// ============================================================================
// Already integrated! The downloadReport function uses downloadCSVHistory()

// ============================================================================
// 6. ADD AI FOLLOW-UP QUESTIONS TO Feedback.jsx
// ============================================================================
// Add to imports:
// import { analyzeUserResponse, extractStrengths, extractImprovements } from '../services/followUp';

// Add analysis to feedback display:
// const analysis = analyzeUserResponse(session.transcript?.join(' ') || '');

// Display analysis scores:
// <div className="grid grid-cols-2 gap-4">
//   <div className="glass-panel p-4">
//     <p className="text-xs text-gray-400">Clarity</p>
//     <p className="text-3xl font-bold text-blue-400">{analysis.clearnessScore}%</p>
//   </div>
//   <div className="glass-panel p-4">
//     <p className="text-xs text-gray-400">Completeness</p>
//     <p className="text-3xl font-bold text-green-400">{analysis.completenessScore}%</p>
//   </div>
//   {/* ... more scores ... */}
// </div>

// ============================================================================
// KEYBOARD SHORTCUTS AVAILABLE TO USERS:
// ============================================================================
// Ctrl+S  - Submit code
// Ctrl+K  - Skip question
// Ctrl+H  - Show/hide hints
// Ctrl+R  - Reset code
// Ctrl+.  - Enlarge code editor
// Ctrl+,  - Enlarge console
// ?       - Show keyboard shortcuts help

// ============================================================================
// SETTINGS AVAILABLE TO USERS:
// ============================================================================
// Appearance:
//   - Dark Mode toggle
//   - Font Size (Small, Medium, Large)
//
// Notifications & Sound:
//   - Enable Sound
//   - Enable Notifications
//
// Interview Options:
//   - Show Hints
//   - Enable Keyboard Shortcuts
//   - Auto-save Code
//   - Real-time Transcription
//   - Webcam Recording
//
// Code Editor:
//   - Font Family selection

// All settings are automatically persisted to localStorage

// ============================================================================
// NEWLY AVAILABLE SERVICES:
// ============================================================================
// src/services/pdfExport.js      - Report generation and file downloads
// src/services/transcription.js  - Web Speech API integration
// src/services/shortcuts.js      - Keyboard shortcut management
// src/services/followUp.js       - AI follow-up question and response analysis

// ============================================================================
// NEWLY AVAILABLE COMPONENTS:
// ============================================================================
// src/components/WebcamPreview.jsx      - Webcam setup and recording
// src/components/TranscriptionPanel.jsx - Real-time transcription display
// src/components/SettingsPanel.jsx      - Settings management UI
