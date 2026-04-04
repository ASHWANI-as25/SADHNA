import { useState, useEffect } from 'react';
import { X, Bell, Volume2, Moon, Sun, Code, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPanel = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('interview_settings');
    return saved ? JSON.parse(saved) : {
      darkMode: true,
      soundEnabled: true,
      notificationsEnabled: true,
      showHints: true,
      autoSubmitEnabled: false,
      keyboardShortcutsEnabled: true,
      realTimeTranscription: false,
      webcamRecording: false,
      theme: 'dark', // 'dark' or 'light'
      fontSize: 'medium', // 'small', 'medium', 'large'
      codeFont: 'monospace', // 'monospace', 'system'
      autoSaveCode: true,
      cameraResolution: 'standard', // 'low', 'standard', 'high'
      cameraWithAudio: true // Include audio in camera stream
    };
  });

  const [isChanged, setIsChanged] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsChanged(true);
  };

  const saveSettings = () => {
    localStorage.setItem('interview_settings', JSON.stringify(settings));
    setIsChanged(false);
  };

  const resetSettings = () => {
    const defaultSettings = {
      darkMode: true,
      soundEnabled: true,
      notificationsEnabled: true,
      showHints: true,
      autoSubmitEnabled: false,
      keyboardShortcutsEnabled: true,
      realTimeTranscription: false,
      webcamRecording: false,
      theme: 'dark',
      fontSize: 'medium',
      codeFont: 'monospace',
      autoSaveCode: true,
      cameraResolution: 'standard',
      cameraWithAudio: true
    };
    setSettings(defaultSettings);
    localStorage.setItem('interview_settings', JSON.stringify(defaultSettings));
    setIsChanged(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-panel p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings Groups */}
        <div className="space-y-8">
          {/* Theme Settings */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
              Appearance
            </h3>
            <div className="space-y-3 ml-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span>Dark Mode</span>
              </label>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Font Size</label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 w-full"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sound & Notifications */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Bell size={20} />
              Notifications & Sound
            </h3>
            <div className="space-y-3 ml-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span>Enable Sound</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span>Enable Notifications</span>
              </label>
            </div>
          </div>

          {/* Interview Settings */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Code size={20} />
              Interview Options
            </h3>
            <div className="space-y-3 ml-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showHints}
                  onChange={(e) => handleSettingChange('showHints', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span>Show Hints</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.keyboardShortcutsEnabled}
                  onChange={(e) => handleSettingChange('keyboardShortcutsEnabled', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span>Enable Keyboard Shortcuts</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSaveCode}
                  onChange={(e) => handleSettingChange('autoSaveCode', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span>Auto-save Code</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.realTimeTranscription}
                  onChange={(e) => handleSettingChange('realTimeTranscription', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span>Real-time Transcription</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.webcamRecording}
                  onChange={(e) => handleSettingChange('webcamRecording', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span>Webcam Recording</span>
              </label>
            </div>
          </div>

          {/* Camera Settings */}
          <div>
            <h3 className="font-semibold text-lg mb-4">📷 Camera Settings</h3>
            <div className="space-y-4 ml-8">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Camera Resolution</label>
                <select
                  value={settings.cameraResolution}
                  onChange={(e) => handleSettingChange('cameraResolution', e.target.value)}
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 w-full"
                >
                  <option value="low">Low (360p) - Less bandwidth</option>
                  <option value="standard">Standard (720p) - Recommended</option>
                  <option value="high">High (1080p) - Best quality</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Higher resolution uses more bandwidth</p>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.cameraWithAudio}
                  onChange={(e) => handleSettingChange('cameraWithAudio', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Include Audio in Camera Stream</span>
              </label>
            </div>
          </div>

          {/* Code Settings */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Code Editor</h3>
            <div className="space-y-3 ml-8">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Font Family</label>
                <select
                  value={settings.codeFont}
                  onChange={(e) => handleSettingChange('codeFont', e.target.value)}
                  className="bg-white/10 border border-white/20 rounded px-3 py-2 w-full"
                >
                  <option value="monospace">Monospace</option>
                  <option value="system">System (Fira Code)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
          <button
            onClick={resetSettings}
            className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            disabled={!isChanged}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              isChanged
                ? 'bg-accent text-white hover:shadow-lg'
                : 'bg-accent/50 text-white/50 cursor-not-allowed'
            }`}
          >
            <Save size={16} />
            {isChanged ? 'Save Changes' : 'No Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPanel;
