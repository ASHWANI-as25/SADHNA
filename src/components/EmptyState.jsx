import { motion } from 'framer-motion';
import GlowButton from './GlowButton';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionText = 'Get Started',
  image,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'spring', damping: 15 }}
    className="text-center py-16 px-4"
  >
    <div className="max-w-md mx-auto">
      {image && (
        <motion.img
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          src={image}
          alt={title}
          className="w-32 h-32 mx-auto mb-6 opacity-60"
        />
      )}

      {Icon && !image && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="mb-6"
        >
          <Icon size={64} className="mx-auto text-slate-600" />
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-white mb-2"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-slate-400 mb-8"
      >
        {description}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlowButton onClick={action} className="mx-auto">
            {actionText}
          </GlowButton>
        </motion.div>
      )}
    </div>
  </motion.div>
);

export default EmptyState;
