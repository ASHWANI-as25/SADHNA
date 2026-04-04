// Web Speech API Service for Real-time Transcription
export const initializeSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.warn('Speech Recognition API not supported in this browser');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  return recognition;
};

export const startTranscription = (recognition, onResult, onError, onEnd) => {
  if (!recognition) return;

  recognition.onstart = () => {
    console.log('Speech recognition started');
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    if (onResult) {
      onResult({
        final: finalTranscript.trim(),
        interim: interimTranscript.trim()
      });
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    if (onError) {
      onError(event.error);
    }
  };

  recognition.onend = () => {
    console.log('Speech recognition ended');
    if (onEnd) {
      onEnd();
    }
  };

  try {
    recognition.start();
  } catch (e) {
    console.error('Error starting recognition:', e);
  }
};

export const stopTranscription = (recognition) => {
  if (!recognition) return;
  try {
    recognition.stop();
  } catch (e) {
    console.error('Error stopping recognition:', e);
  }
};

export const abortTranscription = (recognition) => {
  if (!recognition) return;
  try {
    recognition.abort();
  } catch (e) {
    console.error('Error aborting recognition:', e);
  }
};
