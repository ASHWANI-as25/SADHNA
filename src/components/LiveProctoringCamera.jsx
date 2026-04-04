import { useState, useRef, useEffect } from 'react';
import { Camera, Disc3, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { getCameraConstraints, debugCameraConfig } from '../services/cameraConfig';

const LiveProctoringCamera = ({ isInterviewActive = true, onWarning = null, onTerminate = null }) => {
  const navigate = useNavigate();
  const { updateSession } = useInterview();
  const detectorRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const faceDetectionTimerRef = useRef(null);
  
  const [alerts, setAlerts] = useState([]);
  const [faceDetected, setFaceDetected] = useState(true);
  const [faceWarnings, setFaceWarnings] = useState(0);
  const [consecutiveNoFaceFrames, setConsecutiveNoFaceFrames] = useState(0);
  const [isCheckingFace, setIsCheckingFace] = useState(false);
  const [faceConfidence, setFaceConfidence] = useState(0);

  // Draggable camera position state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cameraRef = useRef(null);

  // Initialize camera position to bottom-right corner
  useEffect(() => {
    const setInitialPosition = () => {
      const margin = 20;
      const cameraWidth = 256; // w-64 = 256px
      const cameraHeight = 192; // h-48 = 192px
      
      const newPosition = {
        x: window.innerWidth - cameraWidth - margin,
        y: window.innerHeight - cameraHeight - margin
      };
      
      console.log('📹 Camera position initialized:', newPosition);
      setPosition(newPosition);
    };

    // Set initial position after component mounts
    setInitialPosition();
    
    // Handle window resize to keep camera in bounds
    const handleResize = () => {
      setInitialPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // No need for complex model initialization
  useEffect(() => {
    console.log('✓ Camera component initialized');
  }, []);

  // Drag event handlers for moving camera
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep camera within viewport bounds
      const maxX = window.innerWidth - 256; // w-64 = 256px
      const maxY = window.innerHeight - 192; // h-48 = 192px
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const addAlert = (message, type = 'warning') => {
    const alert = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setAlerts(prev => [alert, ...prev].slice(0, 5)); // Keep last 5 alerts
  };

  // Simple face detection using skin tone analysis
  const detectFaceSimple = async () => {
    if (!videoRef.current || !canvasRef.current || !isRecording) {
      return false;
    }

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const video = videoRef.current;

      // Set canvas size
      canvas.width = 320;
      canvas.height = 240;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Count skin-tone pixels (simple detection)
      let skinPixels = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Skin tone detection
        if (r > 95 && g > 40 && b > 20 && r > g && g > b && r - g < 15) {
          skinPixels++;
        }
      }

      const totalPixels = canvas.width * canvas.height;
      const confidence = Math.round((skinPixels / totalPixels) * 100);
      setFaceConfidence(confidence);

      // Return true if enough skin tone pixels
      return confidence > 8;
    } catch (err) {
      console.error('Face detection error:', err);
      return true; // Assume face present to avoid false warnings
    }
  };

  // Start continuous face detection
  const startFaceDetection = () => {
    if (faceDetectionTimerRef.current) {
      clearInterval(faceDetectionTimerRef.current);
    }

    faceDetectionTimerRef.current = setInterval(async () => {
      if (!isRecording || !isInterviewActive) return;

      setIsCheckingFace(true);
      try {
        const isFaceDetected = await detectFaceSimple();
        setFaceDetected(isFaceDetected);

        if (!isFaceDetected) {
          // Face not detected
          const newConsecutive = consecutiveNoFaceFrames + 1;
          setConsecutiveNoFaceFrames(newConsecutive);

          // Issue warning after 5 consecutive frames without face (~1.5 seconds at 300ms intervals)
          if (newConsecutive >= 5 && newConsecutive % 5 === 0) {
            const newWarningCount = faceWarnings + 1;
            setFaceWarnings(newWarningCount);

            let warningMessage = '';
            if (newWarningCount === 1) {
              warningMessage = '⚠️ WARNING 1/3: Your face is not detected. Please ensure you are visible in the camera.';
            } else if (newWarningCount === 2) {
              warningMessage = '⚠️ WARNING 2/3: You are not visible in the camera. The interview will be terminated after one more warning!';
            } else if (newWarningCount >= 3) {
              warningMessage = '❌ FINAL WARNING 3/3: The interview is being terminated due to repeated absence from camera.';
            }

            addAlert(warningMessage, 'error');
            if (onWarning) {
              onWarning(newWarningCount);
            }

            // Terminate interview on 3rd warning
            if (newWarningCount >= 3) {
              terminateInterview(`Student went out of frame - ${newWarningCount} warnings issued`);
              return;
            }
          }
        } else {
          // Face detected - reset consecutive counter
          setConsecutiveNoFaceFrames(0);
        }
      } catch (err) {
        console.error('Face detection interval error:', err);
      } finally {
        setIsCheckingFace(false);
      }
    }, 300); // Check every 300ms
  };

  // Terminate interview due to violation
  const terminateInterview = (reason) => {
    // Stop recording
    stopRecording();

    // Clear detection timer
    if (faceDetectionTimerRef.current) {
      clearInterval(faceDetectionTimerRef.current);
      faceDetectionTimerRef.current = null;
    }

    // Alert student
    addAlert(`❌ INTERVIEW TERMINATED: ${reason}`, 'error');

    // Update interview session with termination
    try {
      updateSession({
        status: 'completed',
        results: {
          score: 0,
          feedback: reason,
          terminationReason: reason,
          terminatedDueToProctoring: true
        }
      });
    } catch (err) {
      console.error('Error updating session:', err);
    }

    // Call parent termination callback
    if (onTerminate) {
      onTerminate();
    }

    // Navigate to feedback page after a brief delay
    setTimeout(() => {
      navigate('/feedback', { 
        state: { 
          terminatedEarly: true,
          reason: reason 
        } 
      });
    }, 2000);
  };

  useEffect(() => {
    const initCamera = async () => {
      try {
        setError(null);
        
        // Get camera constraints from centralized config
        const constraints = getCameraConstraints('proctoring');
        debugCameraConfig('proctoring');
        
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        console.log('✓ Stream acquired:', stream);
        console.log('Video tracks:', stream.getVideoTracks());
        
        streamRef.current = stream;
        
        // Ensure video element is attached properly
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('✓ srcObject assigned to video element');
          console.log('Video element srcObject:', videoRef.current.srcObject);
          
          // Force play with error handling
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('\u2705 Video playing successfully');
              })
              .catch(e => {
                console.error('❌ Play failed:', e);
              });
          }
        }
        
        setHasPermission(true);
        console.log('✅ Camera permission granted and configured');

        // Auto-start recording if interview is active
        if (isInterviewActive) {
          console.log('🎬 Interview active, starting recording...');
          setTimeout(() => startRecording(), 500);
        }
      } catch (err) {
        console.error('❌ Camera error:', err);
        setHasPermission(false);
        setError(err.message);
      }
    };

    console.log('📹 Initializing camera component...');
    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isInterviewActive]);

  const startRecording = () => {
    if (!streamRef.current || isRecording) return;

    try {
      const options = {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 2500000
      };

      // Fallback if vp8 not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        console.log('Recording saved:', url);
        // Could send to server here
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setFaceWarnings(0);
      setConsecutiveNoFaceFrames(0);

      // Update recording time
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);

      // Start face detection monitoring
      startFaceDetection();

      addAlert('Recording started for proctoring purposes', 'info');
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(`Recording error: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }

    // Stop face detection
    if (faceDetectionTimerRef.current) {
      clearInterval(faceDetectionTimerRef.current);
      faceDetectionTimerRef.current = null;
    }

    addAlert('Recording stopped', 'info');
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === null) {
    console.log('📹 Camera: Initializing (hasPermission is null)');
    return (
      <div className="fixed w-64 h-48 rounded-xl shadow-2xl z-50 border-2 border-white/30 overflow-hidden backdrop-blur-sm"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
          backgroundColor: 'rgba(0, 0, 0, 0.8)'
        }}>
        <div className="w-full h-full rounded-lg border border-white/20 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-xs text-gray-300 text-center">📷 Camera Init...</p>
        </div>
      </div>
    );
  }

  if (hasPermission === false) {
    console.log('📹 Camera: Permission denied');
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed w-80 rounded-xl shadow-2xl z-50 border-2 border-red-500/50 p-4"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`
        }}
      >
        <div className="w-full bg-red-500/10 rounded-lg border border-red-500/30 flex flex-col items-center justify-center backdrop-blur-sm p-4">
          <AlertCircle size={24} className="text-red-400 mb-3" />
          <p className="text-sm text-red-300 text-center mb-2 font-semibold">Camera Access Required</p>
          <p className="text-xs text-red-400/70 text-center mb-4">
            Live proctoring requires camera access for interview verification.
          </p>
          {error && (
            <p className="text-xs text-red-300 text-center mb-3 bg-red-500/20 p-2 rounded">
              {error}
            </p>
          )}
          <div className="space-y-2 w-full">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-3 py-2 bg-red-500/30 text-red-300 text-xs rounded hover:bg-red-500/40 transition-all border border-red-500/50 font-medium"
            >
              🔄 Retry Camera Access
            </button>
            <button
              onClick={() => {
                // Continue interview without camera (reduced verification)
                if (isInterviewActive && onTerminate) {
                  const confirmed = window.confirm(
                    'Continuing without camera will disable live proctoring.\nYour interview may not be fully verified.\n\nContinue?'
                  );
                  if (confirmed) {
                    setHasPermission('disabled');
                  }
                }
              }}
              className="w-full px-3 py-2 bg-amber-500/30 text-amber-300 text-xs rounded hover:bg-amber-500/40 transition-all border border-amber-500/50 font-medium"
            >
              ⚠️ Continue Without Camera
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Camera disabled by user - show minimal indicator
  if (hasPermission === 'disabled') {
    return (
      <div
        className="fixed w-16 h-16 rounded-full shadow-lg z-50 border-2 border-amber-500/50 bg-amber-500/10 flex items-center justify-center cursor-help"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`
        }}
        title="Camera disabled - limited proctoring"
      >
        <AlertCircle size={24} className="text-amber-400" />
      </div>
    );
  }

  console.log('📹 Camera: Rendering main camera window at position:', position);
  
  return (
    <div
      ref={cameraRef}
      className="fixed w-64 h-48 rounded-xl shadow-2xl z-50 border-2 border-white/30 overflow-hidden cursor-grab active:cursor-grabbing"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transition: isDragging ? 'none' : 'all 0.1s ease'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="w-full h-full flex flex-col bg-black rounded-lg border border-white/20 overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="bg-black/80 px-3 py-2 border-b border-white/10 flex items-center justify-between cursor-grab active:cursor-grabbing flex-shrink-0" onMouseDown={handleMouseDown}>
        <div className="flex items-center gap-2">
          {isRecording && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-red-500 rounded-full"
            />
          )}
          <span className="text-xs font-bold text-white flex items-center gap-1.5 select-none">
            <Camera size={12} />
            Live Proctoring
          </span>
          <span className="text-[8px] text-gray-400">⋮⋮ Drag</span>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2">
            {faceWarnings > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                faceWarnings >= 3 ? 'bg-red-500/30 text-red-200 border border-red-500/50' :
                faceWarnings >= 2 ? 'bg-orange-500/30 text-orange-200 border border-orange-500/50' :
                'bg-yellow-500/30 text-yellow-200 border border-yellow-500/50'
              }`}>
                ⚠️ {faceWarnings}/3
              </span>
            )}
            <span className="text-[10px] font-mono bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
              REC {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>

      {/* Video Feed */}
      <div className="flex-1 relative w-full bg-black flex items-center justify-center min-h-0">
        <video
          ref={videoRef}
          autoPlay={true}
          playsInline={true}
          muted={true}
          controls={false}
          crossOrigin="anonymous"
          className="w-full h-full"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
            backgroundColor: '#000000'
          }}
          onLoadedMetadata={() => {
            console.log('✓ Video loaded, metadata ready');
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.error('Play error:', e));
            }
          }}
          onCanPlay={() => {
            console.log('✓ Video can play - stream is flowing');
          }}
          onError={(e) => {
            console.error('❌ Video error:', e);
          }}
        />
        {/* Hidden canvas for face detection */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Status Overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isCheckingFace && (
            <div className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
              <div className="animate-spin w-1.5 h-1.5 border border-blue-400 border-t-transparent rounded-full" />
              Scanning...
            </div>
          )}
          {faceDetected && !isCheckingFace && (
            <div className="text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded border border-green-500/30 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Face Detected ✓
            </div>
          )}
          {!faceDetected && !isCheckingFace && (
            <motion.div
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/30 flex items-center gap-1"
            >
              <AlertCircle size={10} />
              NO FACE DETECTED
            </motion.div>
          )}
          {!showCamera && (
            <div className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">
              Camera Hidden
            </div>
          )}
        </div>

        {!showCamera && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <EyeOff size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-400">Camera Feed Hidden</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-black/60 border-t border-white/10 px-3 py-2 flex gap-1.5 items-center justify-between">
        <div className="flex gap-1.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCamera(!showCamera)}
            className="p-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 transition-all text-xs"
            title={showCamera ? 'Hide camera' : 'Show camera'}
          >
            {showCamera ? <Eye size={12} /> : <EyeOff size={12} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-lg transition-all text-xs flex items-center gap-1 ${
              isRecording
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                : 'bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30'
            }`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <Disc3 size={12} />
          </motion.button>
        </div>

        <div className="text-[10px] text-gray-400">Proctored Session</div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-black/40 border-t border-white/10 px-3 py-1.5 max-h-16 overflow-y-auto space-y-0.5">
          {alerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1.5 border ${
                alert.type === 'error'
                  ? 'bg-red-500/10 text-red-300 border-red-500/20'
                  : alert.type === 'warning'
                  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  : alert.type === 'danger'
                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}
            >
              <span className="font-mono text-[9px]">{alert.timestamp}</span>
              <span>{alert.message}</span>
            </motion.div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default LiveProctoringCamera;
