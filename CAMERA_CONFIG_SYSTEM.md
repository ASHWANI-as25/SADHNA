# 🎥 Unified Camera Configuration System

## Overview
Consolidated all camera settings into a single, centralized configuration system that's shared across all camera components.

## Changes Made

### 1. **New Service: `cameraConfig.js`**
Centralized camera configuration file that provides:
- `DEFAULT_CAMERA_CONFIG` - Standard settings (1280×720)
- `HIGH_QUALITY_CAMERA_CONFIG` - High-res settings (1920×1080)
- `PROCTORING_CAMERA_CONFIG` - Optimized for proctoring (640×480)
- `getCameraConfig()` - Get config based on type and user settings
- `getCameraConstraints()` - Returns constraints for `getUserMedia()`
- `QUALITY_PRESETS` - Quality options (Low/Standard/High)
- `debugCameraConfig()` - Debug logging

### 2. **Updated Components**

#### **WebcamPreview.jsx**
- Uses `getCameraConstraints('high')` for setup preview
- Supports high-quality video with audio
- Respects user settings from localStorage

#### **LiveProctoringCamera.jsx**
- Uses `getCameraConstraints('proctoring')` for proctoring
- Optimized for bandwidth (640×480)
- Reads from centralized config instead of hardcoded values
- Automatically updates when settings change

#### **SettingsPanel.jsx**
- Added "Camera Settings" section
- Users can choose resolution: Low/Standard/High
- Toggle audio inclusion option
- Settings saved to localStorage automatically

## How It Works

### Resolution Options
```
Low (360p)     → 480×360
Standard (720p) → 1280×720 (default)
High (1080p)   → 1920×1080
```

### Audio Options
- **With Audio**: Captures both video and audio
- **Without Audio**: Video only (better for proctoring)

### Storage
All settings saved in browser localStorage under key: `interview_settings`
```javascript
{
  cameraResolution: 'standard',    // 'low', 'standard', 'high'
  cameraWithAudio: true             // true/false
}
```

## Usage in Components

### Get Camera Constraints
```javascript
import { getCameraConstraints } from '../services/cameraConfig';

// For setup/preview (high quality)
const previewConstraints = getCameraConstraints('high');

// For proctoring (optimized)
const proctoringConstraints = getCameraConstraints('proctoring');

// For default (standard)
const defaultConstraints = getCameraConstraints('default');
```

### Request Camera
```javascript
const stream = await navigator.mediaDevices.getUserMedia(
  getCameraConstraints('proctoring')
);
```

### Debug Configuration
```javascript
import { debugCameraConfig } from '../services/cameraConfig';

debugCameraConfig('proctoring');
// Logs: 📷 Camera Config (proctoring): {resolution: '640x480', audio: false, ...}
```

## User Settings Flow

1. **User opens Settings** → SettingsPanel component loads
2. **Selects Camera Resolution** → Saved to localStorage
3. **During Interview** → LiveProctoringCamera calls `getCameraConstraints()` 
4. **Config reads localStorage** → Applies user's chosen resolution
5. **Camera initializes** → Uses merged settings

## Integration with Existing Settings

Settings are merged as follows (in priority order):
1. User-selected resolution/audio (highest priority)
2. Component type defaults (proctoring/high/default)
3. Fallback to DEFAULT_CAMERA_CONFIG

## Browser Compatibility

### Video Constraints Support
✅ Chrome/Chromium (best support)
✅ Firefox (good support)
✅ Safari (limited support)
⚠️ Older browsers fall back to minimum constraints

### Audio Constraints
✅ Most modern browsers
⚠️ Some may require HTTPS

## Performance Implications

### Low Resolution (360p)
- ✅ Minimal bandwidth
- ✅ Lower CPU usage
- ❌ Less detail for proctoring

### Standard Resolution (720p)
- ✅ Good balance
- ✅ Recommended
- ✅ Good for proctoring

### High Resolution (1080p)
- ❌ High bandwidth
- ❌ Higher CPU usage
- ✅ Best quality
- ✅ Better for recording

## Console Debugging

When components initialize, look for console logs:
```
📷 Camera Config (proctoring): {resolution: '640x480', audio: false}
✓ Stream acquired: MediaStream {id: '...', active: true}
Video tracks: [MediaStreamVideoTrack]
```

## Future Enhancements

- [ ] Device selection (front/back camera)
- [ ] Frame rate control
- [ ] Exposure/brightness settings
- [ ] Recording quality options
- [ ] Bandwidth detection for auto-optimization

## Files Modified

1. ✅ `src/services/cameraConfig.js` (NEW)
2. ✅ `src/components/LiveProctoringCamera.jsx` (UPDATED)
3. ✅ `src/components/WebcamPreview.jsx` (UPDATED)
4. ✅ `src/components/SettingsPanel.jsx` (UPDATED)

## Testing Checklist

- [ ] Camera initializes with proctoring settings
- [ ] WebcamPreview uses high-quality settings
- [ ] Settings changes are reflected on next interview
- [ ] Low/Standard/High presets work correctly
- [ ] Audio toggle works
- [ ] Falls back gracefully without localStorage
- [ ] Console debug logs appear correctly
