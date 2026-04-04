import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Settings, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCameraConstraints, debugCameraConfig } from '../services/cameraConfig';

const WebcamPreview = ({ onClose, onStart }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  useEffect(() => {
    startWebcam();
    return () => {
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    try {
      setError(null);
      
      // Get camera constraints from centralized config (using 'high' for preview)
      const constraints = getCameraConstraints('high');
      debugCameraConfig('high');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setHasPermission(true);
    } catch (err) {
      setError(err.message);
      setHasPermission(false);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleMicrophone = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    
    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      console.log('Recording stopped. Download link:', url);
      // Could pass blob to analytics or save to server
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStartInterview = () => {
    if (onStart) {
      onStart({ recording: isRecording, stream });
    }
    onClose();
  };

  if (!hasPermission) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="glass-panel p-8 max-w-md mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Webcam Setup</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg mb-6">
            <p className="text-red-300 mb-3">
              {error || 'Webcam permission denied. Please enable camera access to continue.'}
            </p>
            <button
              onClick={startWebcam}
              className="w-full px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Retry
            </button>
          </div>

          <button
            onClick={() => handleStartInterview()}
            className="w-full px-4 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
          >
            Continue Without Webcam
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="glass-panel p-8 max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Webcam Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Video Preview */}
        <div className="relative mb-6 bg-black rounded-lg overflow-hidden border border-white/10">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full aspect-video object-cover"
          />
          
          {/* Recording Indicator */}
          {isRecording && (
            <motion.div
              animate={{ opacity: [1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full"
            >
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-sm font-semibold">Recording</span>
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={toggleMicrophone}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            {isMuted ? 'Microphone Off' : 'Microphone On'}
          </button>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
              isRecording
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
            }`}
          >
            {isRecording ? <VideoOff size={20} /> : <Video size={20} />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg mb-6">
          <p className="text-sm text-gray-300">
            {isRecording
              ? 'Your interview is being recorded. You can review the recording after the interview.'
              : 'Position yourself clearly in frame. Recording is optional but recommended for review.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
          >
            Go Back
          </button>
          <button
            onClick={handleStartInterview}
            className="flex-1 px-4 py-3 bg-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Video size={20} />
            Start Interview
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WebcamPreview;
