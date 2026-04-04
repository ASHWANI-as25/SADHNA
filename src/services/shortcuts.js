// Keyboard Shortcuts Service
export const KEYBOARD_SHORTCUTS = {
  SUBMIT_CODE: { key: 's', ctrl: true, description: 'Submit code (Ctrl+S)' },
  SKIP_QUESTION: { key: 'k', ctrl: true, description: 'Skip question (Ctrl+K)' },
  HINT: { key: 'h', ctrl: true, description: 'Show hint (Ctrl+H)' },
  RESET: { key: 'r', ctrl: true, description: 'Reset code (Ctrl+R)' },
  OPEN_SHORTCUTS: { key: '?', shift: false, description: 'Help (?)' },
  ENLARGE_CODE: { key: '.', ctrl: true, description: 'Enlarge code editor (Ctrl+.)' },
  ENLARGE_CONSOLE: { key: ',', ctrl: true, description: 'Enlarge console (Ctrl+,)' },
};

export const useKeyboardShortcuts = (handlers = {}) => {
  const handleKeyDown = (e) => {
    const { ctrlKey, shiftKey, key } = e;
    const lowerKey = key.toLowerCase();

    // Ctrl+S - Submit
    if (ctrlKey && lowerKey === 's') {
      e.preventDefault();
      if (handlers.onSubmit) handlers.onSubmit();
    }

    // Ctrl+K - Skip
    if (ctrlKey && lowerKey === 'k') {
      e.preventDefault();
      if (handlers.onSkip) handlers.onSkip();
    }

    // Ctrl+H - Hint
    if (ctrlKey && lowerKey === 'h') {
      e.preventDefault();
      if (handlers.onHint) handlers.onHint();
    }

    // Ctrl+R - Reset
    if (ctrlKey && lowerKey === 'r') {
      e.preventDefault();
      if (handlers.onReset) handlers.onReset();
    }

    // ? - Help
    if (lowerKey === '?' && !ctrlKey) {
      e.preventDefault();
      if (handlers.onHelp) handlers.onHelp();
    }

    // Ctrl+. - Enlarge code
    if (ctrlKey && lowerKey === '.') {
      e.preventDefault();
      if (handlers.onEnlargeCode) handlers.onEnlargeCode();
    }

    // Ctrl+, - Enlarge console
    if (ctrlKey && lowerKey === ',') {
      e.preventDefault();
      if (handlers.onEnlargeConsole) handlers.onEnlargeConsole();
    }
  };

  return handleKeyDown;
};

export const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-panel p-8 max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-6">Keyboard Shortcuts</h2>
        
        <div className="space-y-3 mb-6">
          {Object.entries(KEYBOARD_SHORTCUTS).map(([key, shortcut]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-sm text-gray-300">{shortcut.description}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};
