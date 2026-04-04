import { motion } from 'framer-motion';

// Generic skeleton loader
export const SkeletonLoader = ({ width = '100%', height = '20px', className = '' }) => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    style={{ width, height }}
    className={`bg-slate-700/50 rounded-lg ${className}`}
  />
);

// Card skeleton
export const CardSkeleton = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-4 space-y-3"
        >
          <SkeletonLoader height="24px" width="60%" />
          <SkeletonLoader height="16px" />
          <SkeletonLoader height="16px" width="80%" />
        </motion.div>
      ))}
  </div>
);

// Stats skeleton
export const StatsSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array(count)
      .fill(0)
      .map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-4 space-y-2"
        >
          <SkeletonLoader height="16px" width="60%" />
          <SkeletonLoader height="28px" width="40%" />
        </motion.div>
      ))}
  </div>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="space-y-2">
    {Array(rows)
      .fill(0)
      .map((_, row) => (
        <div key={row} className="flex gap-4">
          {Array(columns)
            .fill(0)
            .map((_, col) => (
              <SkeletonLoader
                key={col}
                width="100%"
                height="40px"
                className="flex-1"
              />
            ))}
        </div>
      ))}
  </div>
);

// Modal skeleton
export const ModalSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-4"
  >
    <SkeletonLoader height="32px" width="60%" />
    <SkeletonLoader height="16px" width="100%" />
    <div className="space-y-3 mt-6">
      <SkeletonLoader height="40px" />
      <SkeletonLoader height="40px" />
      <SkeletonLoader height="40px" />
    </div>
    <div className="flex gap-3 mt-6">
      <SkeletonLoader height="40px" width="40%" />
      <SkeletonLoader height="40px" width="60%" />
    </div>
  </motion.div>
);

// Page skeleton
export const PageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <SkeletonLoader height="40px" width="40%" />
        <SkeletonLoader height="16px" width="60%" />
      </div>
      <StatsSkeleton />
      <CardSkeleton count={5} />
    </div>
  </div>
);
