import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Bell, Volume2, Code, Lock, Download, Trash2, Database, HardDrive, Save, RotateCcw, Keyboard, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInterview } from '../context/InterviewContext';
import { downloadCSVHistory } from '../services/pdfExport';
import { toast } from '../services/toastService';

const Settings = () => {
  const navigate = useNavigate();
  const { history } = useInterview();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [isChanged, setIsChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('interview_settings');
    return saved ? JSON.parse(saved) : {
      darkMode: true,
      soundEnabled: true,
      notificationsEnabled: true,
      showHints: true,
      keyboardShortcutsEnabled: true,
      realTimeTranscription: false,
      webcamRecording: false,
      theme: 'dark',
      fontSize: 'medium',
      codeFont: 'monospace',
      autoSaveCode: true,
      privacyMode: false,
      dataRetention: '90', // days
      autoStartRecording: true,
      defaultDifficulty: 'Medium',
      feedbackVerbosity: 'detailed'
    };
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsChanged(true);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('interview_settings', JSON.stringify(settings));
      setIsChanged(false);
      setSavedNotification(true);
      toast.success('✅ Settings saved successfully!');
      setTimeout(() => setSavedNotification(false), 3000);
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = async () => {
    if (!window.confirm('Reset all settings to defaults?')) return;
    
    setIsSaving(true);
    try {
      const defaultSettings = {
        darkMode: true,
        soundEnabled: true,
        notificationsEnabled: true,
        showHints: true,
        keyboardShortcutsEnabled: true,
        realTimeTranscription: false,
        webcamRecording: false,
        theme: 'dark',
        fontSize: 'medium',
        codeFont: 'monospace',
        autoSaveCode: true,
        privacyMode: false,
        dataRetention: '90',
        autoStartRecording: true,
        defaultDifficulty: 'Medium',
        feedbackVerbosity: 'detailed'
      };
      setSettings(defaultSettings);
      localStorage.setItem('interview_settings', JSON.stringify(defaultSettings));
      setIsChanged(false);
      toast.success('✅ Settings reset to defaults');
    } catch (error) {
      toast.error('Failed to reset settings');
      console.error('Error resetting settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      try {
        localStorage.removeItem('interview_history');
        toast.success('✅ Interview history cleared');
        // Reload after a short delay to allow toast to display
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toast.error('Failed to clear history');
        console.error('Error clearing history:', error);
      }
    }
  };

  const exportData = () => {
    try {
      downloadCSVHistory(history);
      toast.success('✅ Interview history exported as CSV');
    } catch (error) {
      toast.error('Failed to export data');
      console.error('Error exporting data:', error);
    }
  };

  const SettingToggle = ({ label, value, onChange, icons: [IconOff, IconOn] }) => (
    <motion.div
      whileHover={{ x: 4 }}
      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
        isDarkMode 
          ? 'bg-white/5 hover:bg-white/10' 
          : 'bg-gray-200 hover:bg-gray-300'
      }`}
    >
      <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{label}</span>
      <button
        onClick={() => {
          onChange(!value);
          setIsChanged(true);
        }}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
          value ? 'bg-accent' : isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </motion.div>
  );

  const SettingSelect = ({ label, value, onChange, options, icon: Icon }) => (
    <motion.div
      whileHover={{ x: 4 }}
      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
        isDarkMode 
          ? 'bg-white/5 hover:bg-white/10' 
          : 'bg-gray-200 hover:bg-gray-300'
      }`}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-accent" />}
        <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{label}</span>
      </div>
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsChanged(true);
        }}
        className={`rounded-lg px-3 py-1 text-sm font-medium cursor-pointer transition-all ${
          isDarkMode
            ? 'bg-gray-700 border border-gray-600 text-white hover:bg-gray-600'
            : 'bg-gray-100 border border-gray-400 text-gray-800 hover:bg-white'
        }`}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </motion.div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-background' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} border-b backdrop-blur-xl sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-300'}`}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Customize your experience</p>
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-white/10 text-yellow-400' : 'bg-gray-200 text-gray-800'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          {[
            { id: 'general', label: 'General', icon: Zap },
            { id: 'appearance', label: 'Appearance', icon: Moon },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'data', label: 'Data & Privacy', icon: Database }
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-lg font-medium transition-all flex items-center gap-2 justify-center ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Settings Panels */}
        <div className={`glass-panel p-8 ${isDarkMode ? '' : 'bg-white border-gray-200'}`}>
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              <div>
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Interview Preferences</h2>
                <div className="space-y-3">
                  <SettingSelect
                    label="Default Difficulty"
                    value={settings.defaultDifficulty}
                    onChange={(val) => handleSettingChange('defaultDifficulty', val)}
                    options={['Easy', 'Medium', 'Hard']}
                    icon={Zap}
                  />
                  <SettingSelect
                    label="Feedback Verbosity"
                    value={settings.feedbackVerbosity}
                    onChange={(val) => handleSettingChange('feedbackVerbosity', val)}
                    options={['brief', 'detailed', 'comprehensive']}
                    icon={Code}
                  />
                  <SettingToggle
                    label="Show Hints During Interview"
                    value={settings.showHints}
                    onChange={(val) => handleSettingChange('showHints', val)}
                    icons={[Volume2, Volume2]}
                  />
                  <SettingToggle
                    label="Auto-Save Code"
                    value={settings.autoSaveCode}
                    onChange={(val) => handleSettingChange('autoSaveCode', val)}
                    icons={[Save, Save]}
                  />
                </div>
              </div>

              <div className={`border-t ${isDarkMode ? 'border-white/10' : 'border-gray-300'} pt-6`}>
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recording & Proctoring</h2>
                <div className="space-y-3">
                  <SettingToggle
                    label="Auto-Start Recording"
                    value={settings.autoStartRecording}
                    onChange={(val) => handleSettingChange('autoStartRecording', val)}
                    icons={[Volume2, Volume2]}
                  />
                  <SettingToggle
                    label="Webcam Recording"
                    value={settings.webcamRecording}
                    onChange={(val) => handleSettingChange('webcamRecording', val)}
                    icons={[Volume2, Volume2]}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              <div>
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Editor & Display</h2>
                <div className="space-y-3">
                  <SettingSelect
                    label="Font Size"
                    value={settings.fontSize}
                    onChange={(val) => handleSettingChange('fontSize', val)}
                    options={['small', 'medium', 'large']}
                  />
                  <SettingSelect
                    label="Code Font"
                    value={settings.codeFont}
                    onChange={(val) => handleSettingChange('codeFont', val)}
                    options={['monospace', 'system']}
                    icon={Code}
                  />
                  <SettingToggle
                    label="Dark Mode"
                    value={settings.darkMode}
                    onChange={(val) => handleSettingChange('darkMode', val)}
                    icons={[Sun, Moon]}
                  />
                </div>
              </div>

              <div className={`border-t ${isDarkMode ? 'border-white/10' : 'border-gray-300'} pt-6`}>
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Preview</h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-6 rounded-lg border ${settings.darkMode ? 'bg-gray-900/50 border-white/10' : 'bg-gray-100 border-gray-300'}`}
                >
                  <p style={{ fontSize: settings.fontSize === 'large' ? '18px' : settings.fontSize === 'small' ? '12px' : '14px' }} className="font-mono">
                    const solution = () =&gt; {'{'}
                    <br/>&nbsp;&nbsp;return "Your code preview";
                    <br/>{'}'}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              <div>
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h2>
                <div className="space-y-3">
                  <SettingToggle
                    label="Enable Notifications"
                    value={settings.notificationsEnabled}
                    onChange={(val) => handleSettingChange('notificationsEnabled', val)}
                    icons={[Bell, Bell]}
                  />
                  <SettingToggle
                    label="Sound Effects"
                    value={settings.soundEnabled}
                    onChange={(val) => handleSettingChange('soundEnabled', val)}
                    icons={[Volume2, Volume2]}
                  />
                </div>
              </div>

              <div className={`border-t ${isDarkMode ? 'border-white/10' : 'border-gray-300'} pt-6`}>
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Real-time Features</h2>
                <div className="space-y-3">
                  <SettingToggle
                    label="Real-time Transcription"
                    value={settings.realTimeTranscription}
                    onChange={(val) => handleSettingChange('realTimeTranscription', val)}
                    icons={[Volume2, Volume2]}
                  />
                  <SettingToggle
                    label="Enable Keyboard Shortcuts"
                    value={settings.keyboardShortcutsEnabled}
                    onChange={(val) => handleSettingChange('keyboardShortcutsEnabled', val)}
                    icons={[Keyboard, Keyboard]}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Data & Privacy Settings */}
          {activeTab === 'data' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              <div>
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Privacy Settings</h2>
                <div className="space-y-3">
                  <SettingToggle
                    label="Privacy Mode (No Face Detection)"
                    value={settings.privacyMode}
                    onChange={(val) => handleSettingChange('privacyMode', val)}
                    icons={[Lock, Lock]}
                  />
                  <SettingSelect
                    label="Data Retention Period"
                    value={settings.dataRetention}
                    onChange={(val) => handleSettingChange('dataRetention', val)}
                    options={['30', '60', '90', '180', '365']}
                    icon={HardDrive}
                  />
                </div>
              </div>

              <div className={`border-t ${isDarkMode ? 'border-white/10' : 'border-gray-300'} pt-6`}>
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Data Management</h2>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={exportData}
                    disabled={history.length === 0}
                    className="w-full p-4 rounded-lg bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 justify-center font-medium"
                  >
                    <Download size={18} />
                    Export Interview History (CSV)
                    <span className="text-xs ml-2">({history.length} records)</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={clearHistory}
                    disabled={history.length === 0}
                    className="w-full p-4 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 justify-center font-medium"
                  >
                    <Trash2 size={18} />
                    Clear All Interview History
                  </motion.button>
                </div>
              </div>

              <div className={`rounded-lg p-4 ${
                isDarkMode
                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                  : 'bg-yellow-100 border border-yellow-400'
              }`}>
                <p className={`text-xs ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  ⚠️ Clearing history cannot be undone. All interview records and analytics will be permanently deleted.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetSettings}
            className={`px-6 py-3 rounded-lg transition-all font-medium flex items-center gap-2 ${
              isDarkMode
                ? 'border border-white/20 hover:bg-white/10'
                : 'border border-gray-400 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </motion.button>
          <motion.button
            whileHover={{ scale: !isChanged || isSaving ? 1 : 1.05 }}
            whileTap={{ scale: !isChanged || isSaving ? 1 : 0.95 }}
            onClick={saveSettings}
            disabled={!isChanged || isSaving}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
              isChanged && !isSaving
                ? 'bg-accent text-white hover:shadow-lg'
                : isDarkMode
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </motion.button>
        </div>

        {/* Save Notification */}
        {savedNotification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 right-6 bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-3 text-green-300 font-medium flex items-center gap-2"
          >
            ✓ Settings saved successfully!
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Settings;
