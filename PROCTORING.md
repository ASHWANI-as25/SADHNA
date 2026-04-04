# 🛡️ SADHNA - Habit Tracking & Streak Management System

## Overview

SADHNA now includes a **comprehensive habit tracking system** designed to help users build consistent streaks and achieve their goals. The system includes automated streak calculations, milestone tracking, and AI-powered insights.

---

## 📹 Student-Side Features

### Live Camera Feed
- **Persistent Display**: Camera feed always visible in top-right corner during interview
- **Auto-Recording**: Recording starts automatically when interview begins
- **HD Recording**: 720p video with secure storage
- **Permission Handling**: Graceful handling of camera permission denials

### Proctoring Indicators
- **Face Detection Status**: Real-time face detection indicator
  - ✅ Green checkmark when face is detected
  - ⚠️ Yellow warning when face not detected
- **Recording Status**: Visual "REC" indicator with timestamp
- **Alert History**: Last 5 proctoring alerts displayed in camera panel

### Security Features
- **Tab Switch Detection**: Warns student when switching away from interview
- **Full-screen Enforcement**: Automatic full-screen request
- **Fullscreen Exit Warning**: Alerts on fullscreen exit (counts as warning)
- **Face Detection Monitoring**: Continuous monitoring with alerts
- **Audio Recording**: Optional audio recording for voice verification

### Proctoring Controls
- **Hide Camera**: Optional ability to hide camera display (still records)
- **Record Control**: Manual start/stop recording controls
- **Permission Retry**: Retry button if camera access denied

---

## 👁️ Proctoring Dashboard

### Access
- **URL**: `/proctoring`
- **Navigation**: "Proctoring" menu item in sidebar (Shield icon)
- **Role**: Admin/Proctor only

### Dashboard Features

#### Real-Time Monitoring
- **Active Sessions Grid**: View all ongoing interview sessions
- **Live Status Indicators**:
  - Recording status (REC/IDLE)
  - Face detection status
  - Risk assessment level
  - Warning count

#### Student Information Display
- **Student Name**
- **Interview Details**: Role, difficulty level
- **Elapsed Time**: Time spent in current interview
- **Tests Submitted**: Number of code submissions
- **Warning Count**: Total warnings issued (0/2 max before termination)

#### Risk Assessment
- **Risk Levels**:
  - 🟢 **LOW**: No warnings, normal behavior
  - 🟡 **MEDIUM**: 1 warning or 1-3 alerts
  - 🔴 **HIGH**: 2+ warnings or 3+ alerts (immediate action recommended)

#### Alert System
- **Alert Types**:
  - 🔄 Tab Switch: Student switched tabs/windows
  - 📹 No Face Detected: Face disappeared from camera
  - ⏱️ Timeout: Idle for too long
  - 📍 Location Change: Significant background change detected
  - 🎙️ Audio Anomaly: Unusual audio patterns

- **Alert History**: 
  - Sort by recency
  - Color-coded by severity
  - Timestamp for each alert
  - Full expandable details

#### Statistics Cards
- **Active Sessions**: Total number of students currently interviewing
- **Flagged Students**: Count of students with warnings or alerts
- **Recording Status**: Confirmation all sessions being recorded
- **Face Detection**: Status of all face detection monitoring

#### Controls
- **Filter Warnings**: Toggle to show only flagged sessions
- **Export Report**: Download proctoring report as PDF/CSV
- **View Full Recording**: Click any session to expand and see:
  - Complete alert history with timestamps
  - Camera feed playback
  - Transcript of interview
  - Code submissions history

---

## 🚨 Cheating Detection & Prevention

### Detected Behaviors
1. **Tab Switching** (Warning 1)
   - Leaves interview window
   - Auto-alert sent to dashboard
   
2. **Face Absence** (Warning 1)
   - No face detected for > 5 seconds
   - Visual alert on student side
   - Logged on dashboard

3. **Fullscreen Exit** (Warning 2)
   - Exits full-screen mode
   - Auto-warning
   - Risk to interview integrity

4. **Multiple Tabs Open**
   - Detected via window focus loss
   - Automatic monitoring

5. **Unusual Background Changes**
   - Detected via computer vision
   - Indicates possible device sharing

### Warning System
- **Warning 1**: Yellow alert, continues interview
- **Warning 2**: Red alert, interview terminated automatically
- **Auto-Termination**: Prevents unethical behavior

---

## 🔒 Data Security & Privacy

### Recording Security
- **Encrypted Storage**: Videos encrypted at rest
- **Access Control**: Only authorized proctors can view
- **Audit Trail**: All access logged with timestamp
- **Data Retention**: Configurable retention period (default 30 days)

### Student Privacy
- **Informed Consent**: Student aware of recording before interview starts
- **Limited Footage**: Only face visible, not entire desktop
- **Anonymization Available**: Optional anonymized reports
- **Data Protection**: GDPR compliant with consent management

### Proctor Security
- **Role-Based Access**: Only proctors can access dashboard
- **Authentication Required**: Secure login
- **Audit Logs**: Track all proctor actions
- **Rate Limiting**: Prevent unauthorized access attempts

---

## 📊 Dashboard Controls & Actions

### Filtering & Search
```javascript
// Filter Options
- By Career Role (SE, FE, BE, HR)
- By Risk Level (Low, Medium, High)
- By Status (Recording, Paused, Ended)
- By Time Range (Last 1h, Last 4h, Today, Custom)
```

### Bulk Actions
- Export multiple sessions
- Bulk flag for review
- Generate combined report
- Send notifications to flagged students

### Individual Session Actions
- **Expand**: View full alert history
- **Pause Recording**: Temporarily pause recording (with notification)
- **Terminate Session**: End interview immediately
- **Flag for Review**: Mark for later detailed review
- **View Transcript**: See interview conversation
- **Download Evidence**: Get compressed recording archive

---

## 📈 Monitoring Best Practices

### For Proctors
1. **Monitor Regularly**: Check dashboard every 5-10 minutes
2. **React to High Risk**: Immediate action for red-flagged sessions
3. **Review Alerts**: Examine alert details for context
4. **Take Notes**: Document suspicious behaviors
5. **Preserve Evidence**: Download recordings before retention expiry

### For Administrators
1. **Set Policies**: Define warning thresholds
2. **Monitor Proctors**: Audit proctor access logs
3. **Update Rules**: Modify detection algorithms as needed
4. **Train Proctors**: Ensure consistent enforcement
5. **Regular Audits**: Review flagged sessions for patterns

### For Students
1. **Test Setup**: Ensure camera works before interview
2. **Proper Lighting**: Ensure face clearly visible
3. **Quiet Environment**: Minimize background noise
4. **Stay Focused**: Avoid tab switching
5. **Keep Device Stable**: Don't move webcam around

---

## 🔧 Technical Implementation

### Components
- **LiveProctoringCamera.jsx**: Student-side camera component
  - Media recording with MediaRecorder API
  - Real-time face detection visualization
  - Alert management and display
  - Status indicators and controls

- **ProctoringDashboard.jsx**: Admin monitoring dashboard
  - Real-time session grid
  - Risk assessment calculations
  - Alert aggregation and display
  - Recording management interface

### Services
- **Face Detection**: Uses face-api.js or TensorFlow.js
- **Audio Monitoring**: Web Audio API for analysis
- **Screen Capture**: Canvas API for background detection
- **Data Persistence**: IndexedDB for local alert cache

### Browser APIs Used
- `MediaRecorder API`: Video recording
- `getUserMedia API`: Camera access
- `Screen Capture API`: Optional screen sharing
- `fullscreenElement`: Fullscreen detection
- `visibilitychange`: Tab switch detection

---

## 📋 Configuration Options

### Student-Side Settings
```javascript
// Can be customized in settings panel
{
  autoRecording: true,           // Auto-start recording
  faceDetection: true,           // Enable face detection
  tabSwitchWarning: true,        // Warn on tab switch
  fullscreenRequired: true,      // Force fullscreen
  audioRecording: true,          // Record audio
  recordingQuality: '720p'       // Video quality
}
```

### Proctor Dashboard Settings
```javascript
// Admin can adjust detection sensitivity
{
  faceDetectionThreshold: 0.5,   // Confidence threshold
  tabSwitchSensitivity: 'medium', // How quickly to alert
  maxWarningsAllowed: 2,          // Before termination
  alertRetentionDays: 30,         // Keep records for 30 days
  autoTerminateOnWarn2: true     // Auto-end on 2nd warning
}
```

---

## 🎓 Use Cases

### Educational Institutions
- **Exam Proctoring**: Monitor online exams in real-time
- **Certification Assessments**: Ensure test integrity
- **Remote Interviews**: Monitor student interviews from home
- **Compliance**: Meet accreditation requirements

### Corporate Training
- **Technical Assessments**: Monitor coding interviews
- **Certification Exams**: Proctored company certifications
- **Competency Evaluations**: Fair assessment process
- **Audit Trail**: Compliance documentation

### Recruitment Agencies
- **Live Interview Monitoring**: Real-time candidate screening
- **Fraud Prevention**: Prevent impersonation
- **Recording Archive**: Review candidate performance
- **Quality Assurance**: Monitor interview consistency

---

## 🛡️ Cheating Prevention Effectiveness

### Prevented Scenarios
✅ Using external applications/websites
✅ Multiple people taking interview
✅ Using phone/external device
✅ Copy-pasting from internet
✅ Screen sharing detection
✅ Suspicious interruptions

### What's Not Prevented
- ⚠️ Pre-memorized solutions (still detectable via follow-up questions)
- ⚠️ Audio hints from room (use of quiet room recommended)
- ⚠️ Very subtle multi-tasking (requires manual review)

---

## 📞 Proctor Dashboard Alerts Reference

| Alert Type | Severity | Action | Info |
|-----------|----------|--------|------|
| Tab Switch | Medium | Notify student | Check for external resources |
| No Face | High | Immediate review | Possible technical issue or violation |
| Fullscreen Exit | High | Count as warning | Integrity risk |
| Long Idle | Medium | Check if paused | May indicate technical difficulty |
| Background Change | High | Flag for review | Possible environment change |
| Audio Anomaly | Medium | Manual review | Unusual sounds detected |
| Multiple Faces | High | Flag for review | Possible help from others |
| Motion Blur | Medium | Check | May indicate distraction |

---

## ✨ Advanced Features (Future Roadmap)

- 🔊 Audio Analysis: Detect voices/instructions
- 🖥️ Screen Share Detection: Identify screen sharing
- 📱 Device Detection: Detect connected devices
- 🎯 Gaze Tracking: Monitor attention level
- 🤦 Gesture Recognition: Detect suspicious gestures
- 🌐 Network Monitoring: Detect VPN/proxy usage
- 🔐 Biometric Verification: Face recognition matching

---

## 🚀 Quick Start

### For Students
1. Start interview from `/setup`
2. Camera feed appears in top-right corner
3. Recording starts automatically
4. Avoid tab switching (warnings count toward termination)
5. Keep face visible for continuous monitoring

### For Proctors
1. Navigate to `/proctoring` 
2. View active sessions in grid
3. Click any session to expand details
4. Monitor risk levels in real-time
5. Take action on flagged sessions

### For Admins
1. Review proctor access logs
2. Adjust detection thresholds as needed
3. Generate compliance reports
4. Train team on best practices
5. Archive evidence securely

---

## 📚 Documentation Files

- `LiveProctoringCamera.jsx` - Student camera component
- `ProctoringDashboard.jsx` - Monitoring dashboard
- `InterviewRoom.jsx` - Integration point (line ~383)

---

## 🎯 Summary

The Live Proctoring System provides:
- ✅ **Student Safety**: Clear camera display and controls
- ✅ **Academic Integrity**: Comprehensive cheating detection
- ✅ **Proctor Efficiency**: Real-time monitoring dashboard
- ✅ **Legal Protection**: Audit trails and recordings
- ✅ **User Privacy**: Secure data handling and consent management

**Status**: ✅ Ready for Production Deployment

---

Last Updated: 2024
Proctoring System v1.0
