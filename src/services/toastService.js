import { create } from 'zustand';

const useToastStore = create((set, get) => ({
  toasts: [],
  timeouts: {}, // Track timeouts for deduplication
  addToast: (message, type = 'success', duration = 3000) => {
    const state = get();
    
    // Check for duplicate: same message and type within last 500ms
    const duplicate = state.toasts.find(
      t => t.message === message && t.type === type
    );
    
    if (duplicate) {
      // Clear the old timeout and set a new one
      if (state.timeouts[duplicate.id]) {
        clearTimeout(state.timeouts[duplicate.id]);
      }
      // Just extend the existing toast's duration
      const newTimeout = setTimeout(() => {
        set((s) => ({
          toasts: s.toasts.filter((t) => t.id !== duplicate.id),
        }));
      }, duration);
      
      set((s) => ({
        timeouts: { ...s.timeouts, [duplicate.id]: newTimeout }
      }));
      
      return duplicate.id;
    }
    
    // Create new toast
    const id = Date.now();
    set((s) => ({
      toasts: [...s.toasts, { id, message, type, duration }],
    }));
    
    const newTimeout = setTimeout(() => {
      set((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
        timeouts: (() => {
          const { [id]: _, ...rest } = s.timeouts;
          return rest;
        })()
      }));
    }, duration);
    
    set((s) => ({
      timeouts: { ...s.timeouts, [id]: newTimeout }
    }));
    
    return id;
  },
  removeToast: (id) => {
    set((state) => {
      // Clear the timeout
      if (state.timeouts[id]) {
        clearTimeout(state.timeouts[id]);
      }
      const { [id]: _, ...rest } = state.timeouts;
      return {
        toasts: state.toasts.filter((t) => t.id !== id),
        timeouts: rest
      };
    });
  },
}));

export const toast = {
  success: (message, duration = 3000) => useToastStore.getState().addToast(message, 'success', duration),
  error: (message, duration = 5000) => useToastStore.getState().addToast(message, 'error', duration),
  info: (message, duration = 3000) => useToastStore.getState().addToast(message, 'info', duration),
  warning: (message, duration = 4000) => useToastStore.getState().addToast(message, 'warning', duration),
};

export default useToastStore;

