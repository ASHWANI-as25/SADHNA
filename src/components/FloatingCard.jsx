import { motion } from 'framer-motion';

const FloatingCard = ({ 
  children, 
  icon: Icon, 
  title, 
  description, 
  className = '',
  delay = 0,
  onClick = null,
  glowColor = 'blue', // 'blue', 'purple', 'cyan'
}) => {
  const glowClasses = {
    blue: 'hover:shadow-blue-500/40 hover:border-blue-400/50',
    purple: 'hover:shadow-purple-500/40 hover:border-purple-400/50',
    cyan: 'hover:shadow-cyan-400/30 hover:border-cyan-400/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className={`floating-card group ${glowClasses[glowColor]} ${className}`}
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {Icon && (
          <div className="mb-4 w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
            <Icon className="text-white" size={28} />
          </div>
        )}
        
        {title && (
          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>
        )}
        
        {children}
      </div>
    </motion.div>
  );
};

export default FloatingCard;
