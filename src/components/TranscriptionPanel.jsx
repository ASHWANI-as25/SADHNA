import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { initializeSpeechRecognition, startTranscription, stopTranscription } from '../services/transcription';

const TranscriptionPanel = ({ isActive, role = 'user' }) => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const recognition = initializeSpeechRecognition();
    if (!recognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = recognition;

    return () => {
      stopTranscription(recognition);
    };
  }, []);

  useEffect(() => {
    if (isActive && isSupported) {
      startListening();
    } else {
      stopListening();
    }
  }, [isActive]);

  const startListening = () => {
    if (!recognitionRef.current || !isSupported) return;

    setTranscript('');
    setInterimTranscript('');
    setIsListening(true);

    startTranscription(
      recognitionRef.current,
      ({ final, interim }) => {
        if (final) {
          setTranscript(prev => prev + (final ? ' ' + final : ''));
        }
        setInterimTranscript(interim);
      },
      (error) => {
        console.error('Transcription error:', error);
        if (error !== 'no-speech') {
          setIsListening(false);
        }
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    stopTranscription(recognitionRef.current);
    setIsListening(false);
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm">
        <VolumeX size={16} className="inline mr-2" />
        Speech Recognition not supported in your browser
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Status Bar */}
      <div className="flex items-center gap-2">
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-red-500 rounded-full"
          />
        ) : (
          <div className="w-2 h-2 bg-gray-400 rounded-full" />
        )}
        <span className="text-xs text-gray-400">
          {isListening ? 'Listening...' : 'Not listening'}
        </span>
        <Loader size={14} className={`ml-auto ${isListening ? 'animate-spin text-accent' : 'text-gray-400'}`} />
      </div>

      {/* Transcription Display */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 min-h-20 max-h-40 overflow-y-auto">
        {transcript ? (
          <>
            <p className="text-gray-200 text-sm leading-relaxed">{transcript}</p>
            {interimTranscript && (
              <p className="text-gray-500 text-sm italic">{interimTranscript}</p>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-xs">
            {isListening ? 'Start speaking...' : 'Click start to enable transcription'}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            isListening
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
          }`}
        >
          <Volume2 size={16} />
          {isListening ? 'Stop' : 'Start'} Transcription
        </button>
        <button
          onClick={() => {
            setTranscript('');
            setInterimTranscript('');
          }}
          className="px-3 py-2 bg-white/10 text-gray-300 rounded-lg font-semibold text-sm hover:bg-white/20 transition-all"
        >
          Clear
        </button>
      </div>
    </motion.div>
  );
};

export default TranscriptionPanel;
