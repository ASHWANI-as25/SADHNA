import { motion } from 'framer-motion';

const GlowButton = ({
  children,
  icon: Icon,
  variant = 'primary', // 'primary', 'secondary', 'outline'
  size = 'md', // 'sm', 'md', 'lg'
  onClick,
  className = '',
  disabled = false,
  loading = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'space-button',
    secondary: 'glass-panel bg-white/[0.05] border-blue-400/20 hover:border-blue-400/40 text-white font-semibold',
    outline: 'border-2 border-blue-400/50 hover:border-blue-400/80 hover:bg-blue-500/10 text-blue-300 font-semibold',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg transition-all duration-300 flex items-center gap-2 justify-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
      )}
      {Icon && !loading && <Icon size={20} />}
      {children}
    </motion.button>
  );
};

export default GlowButton;
