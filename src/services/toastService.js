import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export const toast = {
  success: (message, duration = 3000) => useToastStore.getState().addToast(message, 'success', duration),
  error: (message, duration = 5000) => useToastStore.getState().addToast(message, 'error', duration),
  info: (message, duration = 3000) => useToastStore.getState().addToast(message, 'info', duration),
  warning: (message, duration = 4000) => useToastStore.getState().addToast(message, 'warning', duration),
};

export default useToastStore;
