const SpaceLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Orbiting rings */}
      <div className="relative w-20 h-20 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin" style={{ animationDuration: '2s' }} />
        
        {/* Middle ring */}
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-cyan-400 border-l-blue-400 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
        
        {/* Center dot */}
        <div className="absolute inset-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-sm" />
        <div className="absolute inset-6 rounded-full border border-blue-400/50" />
      </div>

      {/* Loading text */}
      <p className="text-gray-300 font-semibold text-lg glow-text-blue">{text}</p>
    </div>
  );
};

export default SpaceLoader;
