import { motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import useToastStore from '../services/toastService';

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastColors = {
  success: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
  error: 'from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400',
  info: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
  warning: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
};

const Toast = ({ id, message, type }) => {
  const Icon = toastIcons[type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 400 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20, x: 400 }}
      transition={{ type: 'spring', damping: 15 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm bg-gradient-to-r ${toastColors[type]} shadow-lg`}
    >
      <span className="flex-shrink-0">
        <Icon size={20} />
      </span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => useToastStore.getState().removeToast(id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Toast;
