/**
 * Centralized Camera Configuration
 * Shared settings for all camera components
 */

// Default camera constraints
export const DEFAULT_CAMERA_CONFIG = {
  video: {
    width: { ideal: 1280, min: 640 },
    height: { ideal: 720, min: 480 },
    facingMode: 'user'
  },
  audio: false // Default no audio for proctoring
};

// High-quality camera config (for setup/preview)
export const HIGH_QUALITY_CAMERA_CONFIG = {
  video: {
    width: { ideal: 1920, min: 1280 },
    height: { ideal: 1080, min: 720 },
    facingMode: 'user'
  },
  audio: true // Include audio for preview
};

// Proctoring-specific camera config (lower bandwidth)
export const PROCTORING_CAMERA_CONFIG = {
  video: {
    width: { ideal: 640, min: 480 },
    height: { ideal: 480, min: 360 },
    facingMode: 'user'
  },
  audio: false // No audio for proctoring (bandwidth optimization)
};

/**
 * Get camera config based on user settings from localStorage
 */
export const getCameraConfig = (configType = 'default') => {
  try {
    const settings = JSON.parse(localStorage.getItem('interview_settings') || '{}');
    
    // Get base config
    let config;
    if (configType === 'high') {
      config = JSON.parse(JSON.stringify(HIGH_QUALITY_CAMERA_CONFIG));
    } else if (configType === 'proctoring') {
      config = JSON.parse(JSON.stringify(PROCTORING_CAMERA_CONFIG));
    } else {
      config = JSON.parse(JSON.stringify(DEFAULT_CAMERA_CONFIG));
    }

    // Apply user settings
    if (settings.cameraResolution === 'low') {
      config.video.width = { ideal: 480, min: 320 };
      config.video.height = { ideal: 360, min: 240 };
    } else if (settings.cameraResolution === 'high') {
      config.video.width = { ideal: 1920, min: 1280 };
      config.video.height = { ideal: 1080, min: 720 };
    }

    // Apply audio settings
    if (settings.cameraWithAudio !== undefined) {
      config.audio = settings.cameraWithAudio;
    }

    return config;
  } catch (error) {
    console.error('Error loading camera config:', error);
    return configType === 'high' ? HIGH_QUALITY_CAMERA_CONFIG : 
           configType === 'proctoring' ? PROCTORING_CAMERA_CONFIG : 
           DEFAULT_CAMERA_CONFIG;
  }
};

/**
 * Get camera constraints for getUserMedia
 */
export const getCameraConstraints = (type = 'default') => {
  const config = getCameraConfig(type);
  return {
    video: config.video,
    audio: config.audio
  };
};

/**
 * Quality presets
 */
export const QUALITY_PRESETS = {
  low: { width: 480, height: 360, label: 'Low (360p)' },
  standard: { width: 1280, height: 720, label: 'Standard (720p)' },
  high: { width: 1920, height: 1080, label: 'High (1080p)' }
};

/**
 * Log camera capabilities for debugging
 */
export const debugCameraConfig = (type = 'default') => {
  const config = getCameraConfig(type);
  console.log(`📷 Camera Config (${type}):`, {
    resolution: `${config.video.width.ideal}x${config.video.height.ideal}`,
    audio: config.audio,
    facingMode: config.video.facingMode
  });
  return config;
};

export default {
  DEFAULT_CAMERA_CONFIG,
  HIGH_QUALITY_CAMERA_CONFIG,
  PROCTORING_CAMERA_CONFIG,
  getCameraConfig,
  getCameraConstraints,
  QUALITY_PRESETS,
  debugCameraConfig
};
