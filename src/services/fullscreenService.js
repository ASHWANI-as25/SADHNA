// Fullscreen API service
export const fullscreenService = {
  // Request fullscreen
  enterFullscreen: async (element = document.documentElement) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
        return true;
      } else if (element.webkitRequestFullscreen) {
        // Safari support
        await element.webkitRequestFullscreen();
        return true;
      } else if (element.msRequestFullscreen) {
        // IE support
        await element.msRequestFullscreen();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Fullscreen request failed:', error);
      return false;
    }
  },

  // Exit fullscreen
  exitFullscreen: async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return true;
      } else if (document.webkitFullscreenElement) {
        // Safari support
        await document.webkitExitFullscreen();
        return true;
      } else if (document.msFullscreenElement) {
        // IE support
        await document.msExitFullscreen();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Exit fullscreen failed:', error);
      return false;
    }
  },

  // Toggle fullscreen
  toggleFullscreen: async (element = document.documentElement) => {
    if (fullscreenService.isFullscreenActive()) {
      return fullscreenService.exitFullscreen();
    } else {
      return fullscreenService.enterFullscreen(element);
    }
  },

  // Check if fullscreen is active
  isFullscreenActive: () => {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  },

  // Get fullscreen change event
  onFullscreenChange: (callback) => {
    const handleChange = () => {
      callback(fullscreenService.isFullscreenActive());
    };

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    document.addEventListener('msfullscreenchange', handleChange);

    // Return cleanup function
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('msfullscreenchange', handleChange);
    };
  },
};
