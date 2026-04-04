import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CinematicStarfield from '../components/CinematicStarfield';
import { 
  Zap, ArrowRight, Flame, Target, Sparkles, Trophy, Rocket, Zap as Lightning
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isNewUser } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // If user is returning (already visited), redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && !isNewUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isNewUser, navigate]);

  // If still loading auth, don't show anything yet
  if (isAuthenticated && !isNewUser) {
    return null;
  }

  const features = [
    {
      icon: Flame,
      title: 'Build Streaks',
      description: 'Track habits with daily check-ins'
    },
    {
      icon: Trophy,
      title: 'Win Rewards',
      description: 'Achieve milestone badges'
    },
    {
      icon: Sparkles,
      title: 'AI Insights',
      description: 'Smart predictions & suggestions'
    },
    {
      icon: Target,
      title: 'Stay Focused',
      description: 'Master your skills daily'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-slate-950 text-white relative overflow-hidden flex flex-col select-none">
      {/* Animated Starfield Background */}
      <div className="absolute inset-0 z-0">
        <CinematicStarfield />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Bar */}
        <nav className="py-6 px-8 flex justify-between items-center bg-black/40 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <img 
              src="/sadhna-logo.png" 
              alt="SADHNA"
              style={{
                width:"48px",
                height:"48px",
                borderRadius:"50%",
                objectFit:"cover",
                animation:"ellipseSpin 7s linear infinite",
                boxShadow:"0 0 12px rgba(255,80,0,0.5)",
                transition:"all 0.3s ease"
              }}
              className="group-hover:scale-110"
            />
            <div>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-rose-400">SADHNA</p>
              <p className="text-xs text-gray-400">StreakMaster</p>
            </div>
          </Link>

          {/* CTA Buttons */}
          <div className="flex gap-3 items-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/auth"
                  className="hidden sm:block px-5 py-2 text-gray-300 hover:text-white font-semibold transition-all hover:bg-white/5 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all hover:scale-105 transform flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              </>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all hover:scale-105 transform"
              >
                Dashboard
              </button>
            )}
          </div>
        </nav>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-7xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="animate-fade-in">
                <img 
                  src="/sadhna-logo.png" 
                  alt="Logo" 
                  style={{
                    width: "280px",
                    height: "280px",
                    borderRadius: "50%",
                    animation: "ellipseSpin 7s linear infinite",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center text-center lg:text-left">
              
              {/* Left Side - Logo */}
              <div className="hidden lg:flex flex-col items-center justify-center">
                <div className="mb-8 animate-fade-in">
                  <img 
                    src="/sadhna-logo.png" 
                    alt="Logo" 
                    style={{
                      width: "280px",
                      height: "280px",
                      borderRadius: "50%",
                      animation: "ellipseSpin 7s linear infinite",
                    }}
                  />
                </div>
              </div>
              
              {/* Right Side - Content */}
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
                  Master Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 mt-2 animate-fadeInSlideUp">
                    Habits & Streaks
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-10 leading-relaxed font-light">
                  Build <span className="text-red-400 font-semibold">unstoppable habits</span>, track <span className="text-pink-400 font-semibold">daily consistency</span>, and achieve <span className="text-rose-400 font-semibold">milestone rewards</span>.
                </p>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14">
                  {isAuthenticated ? (
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-10 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold text-base hover:shadow-xl hover:shadow-red-500/60 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 group"
                    >
                      <Rocket size={20} className="group-hover:-translate-y-1 transition-transform" />
                      Go to Dashboard 
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      className="px-10 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold text-base hover:shadow-xl hover:shadow-red-500/60 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 group"
                    >
                      <Zap size={20} className="group-hover:rotate-12 transition-transform" />
                      Get Started 
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>

                {/* Quick Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {features.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                      <div 
                        key={i} 
                        onMouseEnter={() => setHoveredFeature(i)}
                        onMouseLeave={() => setHoveredFeature(null)}
                        className={`bg-white/5 border rounded-lg p-4 transition-all duration-300 group cursor-pointer transform hover:scale-105 ${
                          hoveredFeature === i 
                            ? 'bg-gradient-to-br from-red-500/30 to-rose-500/20 border-red-400/70 shadow-lg shadow-red-500/40' 
                            : 'border-white/10 hover:border-red-500/50'
                        }`}
                      >
                        <div className="relative mb-3">
                          <div className={`absolute inset-0 bg-red-500 rounded-lg blur-3xl opacity-0 transition-opacity ${hoveredFeature === i ? 'opacity-30' : ''}`}></div>
                          <Icon className={`text-red-400 mb-2 mx-auto transition-all relative z-10 ${hoveredFeature === i ? 'scale-120 text-red-300' : 'group-hover:scale-110'}`} size={32} />
                        </div>
                        <p className="text-xs font-bold text-white leading-tight mb-1">{feature.title}</p>
                        <p className="text-xs text-gray-400">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
