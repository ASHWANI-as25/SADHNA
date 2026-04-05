import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CinematicStarfield from '../components/CinematicStarfield';
import { Mail, Lock, User, ArrowRight, Loader2, Zap, CheckCircle2, Trophy, Flame, Target } from 'lucide-react';
import { FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa6';

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, markUserAsVisited, oauthLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [emailExists, setEmailExists] = useState(null); // null = not checked, true = exists, false = not found
  const [typoSuggestion, setTypoSuggestion] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  // Auto-clear error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Check if email exists in localStorage
  const checkEmailExists = async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailExists(null);
      return;
    }
    try {
      const { localAuthService } = await import('../services/localAuth');
      const user = localAuthService.findUserByEmail(email);
      setEmailExists(!!user);
    } catch (err) {
      console.error('Error checking email:', err);
      setEmailExists(null);
    }
  };

  // Check for common email typos
  const checkEmailFormat = (email) => {
    const typoMap = {
      'gmial.com': 'gmail.com',
      'gmal.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yaho.com': 'yahoo.com',
      'yahooo.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'hotmal.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
    };
    
    const domain = email.split('@')[1];
    if (domain && typoMap[domain]) {
      const correctedEmail = email.split('@')[0] + '@' + typoMap[domain];
      setTypoSuggestion({
        original: email,
        corrected: correctedEmail,
        message: `Did you mean ${correctedEmail}?`
      });
      return;
    }
    setTypoSuggestion(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate email
      const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? null : 'Please enter a valid email';
      if (emailError) {
        setError(emailError);
        setLoading(false);
        return;
      }

      if (isLogin) {
        // Step 1: Check if email exists before trying password
        try {
          const { localAuthService } = await import('../services/localAuth');
          const existingUser = localAuthService.findUserByEmail(formData.email);
          
          if (!existingUser) {
            setError('❌ No account found with this email. Please sign up first.');
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error checking email existence:', err);
        }

        // Step 2: Try login with password
        const { error: loginError } = await login(formData.email, formData.password);
        if (loginError) {
          // Email exists but password is wrong
          if (loginError.includes('Invalid credentials')) {
            setError('❌ Wrong password. Please try again.');
          } else {
            setError(loginError);
          }
        } else {
          // Mark user as visited for returning user detection
          markUserAsVisited();
          setSuccess('✅ Logged in successfully!');
          setTimeout(() => navigate('/dashboard'), 500);
        }
      } else {
        // Validate password strength for signup
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters with uppercase, lowercase, and numbers');
          setLoading(false);
          return;
        }
        if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
          setError('Password must contain uppercase, lowercase, and numbers');
          setLoading(false);
          return;
        }
        if (!formData.fullName || formData.fullName.trim() === '') {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }

        const { error: signupError } = await signup(formData.email, formData.password, {
          fullName: formData.fullName
        });
        if (signupError) {
          setError(signupError);
        } else {
          // New user - they'll land on landing page to see onboarding
          setSuccess('✅ Account created! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 500);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setError('');
    setSuccess('');
    
    try {
      // Configuration for OAuth providers
      const oauthConfig = {
        google: {
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          redirectUri: `${window.location.origin}/auth/google/callback`,
          authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
          scope: 'openid profile email',
          prompt: 'select_account' // Always show account selection screen
        },
        github: {
          clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
          redirectUri: `${window.location.origin}/auth/github/callback`,
          authUrl: 'https://github.com/login/oauth/authorize',
          scope: 'read:user user:email'
        },
        linkedin: {
          clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
          redirectUri: `${window.location.origin}/auth/linkedin/callback`,
          authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
          scope: 'openid profile email'
        }
      };

      const config = oauthConfig[provider];
      
      if (!config.clientId || config.clientId === 'PLACEHOLDER') {
        setError(`${provider} not configured. Please add credentials to .env.local`);
        return;
      }

      // Generate state for CSRF protection
      const state = Math.random().toString(36).substring(7);
      sessionStorage.setItem(`oauth_state_${provider}`, state);

      // Build OAuth URL - using implicit flow for frontend-only auth
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scope,
        state: state
      });

      if (provider === 'google') {
        // Implicit flow - token comes back in URL hash (no backend needed)
        params.set('response_type', 'token');
        // ALWAYS show account picker + force password/passkey
        params.set('prompt', 'select_account');
      } else {
        params.set('response_type', 'code');
      }

      // Redirect to provider
      window.location.href = `${config.authUrl}?${params.toString()}`;
    } catch (err) {
      setError(err.message || `Sign in with ${provider} failed`);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-red-950 via-black to-slate-950 text-white relative overflow-hidden flex">
      {/* Animated Starfield Background */}
      <div className="absolute inset-0 z-0">
        <CinematicStarfield />
      </div>

      {/* Overlay for better visibility */}
      <div className="absolute inset-0 z-[1] bg-black/10 pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="w-full max-w-full mx-auto px-4 flex items-center justify-between gap-8 max-h-screen overflow-hidden">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-1 flex-col items-start justify-center max-w-md">
            <div className="mb-8 animate-fade-in">
              <img 
                src="/sadhna-logo.png" 
                alt="Logo"
                style={{
                  width:"80px",
                  height:"80px",
                  borderRadius:"50%",
                  objectFit:"cover",
                  animation:"ellipseSpin 7s linear infinite",
                  filter:"drop-shadow(0 0 15px rgba(255,80,0,0.7))"
                }}
              />
            </div>
            <h1 className="text-7xl font-black bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-4 leading-tight user-select-none">
              SADHNA
            </h1>
            <p className="text-xl text-gray-300 max-w-sm font-light mb-16 user-select-none">
              Master your habits, transform your life
            </p>
            
            {/* Feature Cards - Expanded */}
            <div className="space-y-4 w-full max-w-sm">
              <div className="flex items-start gap-5 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/40 transition-all group cursor-pointer hover:shadow-lg hover:shadow-red-500/20">
                <div className="w-14 h-14 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/30 transition-all">
                  <Trophy size={28} className="text-red-400 group-hover:text-red-300 group-hover:scale-110 transition-all" />
                </div>
                <div className="text-left">
                <p className="font-bold text-white text-base user-select-none">Build Streaks</p>
                <p className="text-sm text-gray-400 user-select-none">Track daily progress</p>
                </div>
              </div>
              <div className="flex items-start gap-5 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-500/40 transition-all group cursor-pointer hover:shadow-lg hover:shadow-orange-500/20">
                <div className="w-14 h-14 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-all">
                  <Flame size={28} className="text-orange-400 group-hover:text-orange-300 group-hover:scale-110 transition-all" />
                </div>
                <div className="text-left">
                <p className="font-bold text-white text-base user-select-none">Stay Consistent</p>
                <p className="text-sm text-gray-400 user-select-none">Build lasting habits</p>
                </div>
              </div>
              <div className="flex items-start gap-5 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/40 transition-all group cursor-pointer hover:shadow-lg hover:shadow-blue-500/20">
                <div className="w-14 h-14 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-all">
                  <Target size={28} className="text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all" />
                </div>
                <div className="text-left">
                <p className="font-bold text-white text-base user-select-none">Achieve Goals</p>
                <p className="text-sm text-gray-400 user-select-none">Reach your potential</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-8">
            {/* Auth Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/40 transition-all shadow-xl shadow-red-500/10 hover:shadow-red-500/20 relative w-full max-w-md">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              {/* Content wrapper for relative positioning */}
              <div className="relative z-10">
                {/* Tab Switcher */}
                <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-lg border border-white/10">
                  <button
                    onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                    className={`flex-1 py-2.5 px-3 rounded-md font-semibold text-sm transition-all duration-300 ${
                      isLogin
                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/50'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                    className={`flex-1 py-2.5 px-3 rounded-md font-semibold text-sm transition-all duration-300 ${
                      !isLogin
                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/50'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form Heading */}
                <h2 className="text-xl font-bold mb-1.5 text-white">
                  {isLogin ? 'Welcome Back' : 'Join SADHNA'}
                </h2>
                <p className="text-xs text-gray-400 mb-6">
                  {isLogin ? 'Continue your journey to consistency' : 'Start building unstoppable habits'}
                </p>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/15 border border-red-500/50 rounded-xl p-3 mb-4 text-red-200 text-xs flex items-start gap-2 animate-shake">
                    <span className="text-sm mt-0.5">⚠️</span>
                    <span className="flex-1">{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-500/15 border border-green-500/50 rounded-xl p-3 mb-4 text-green-200 text-xs flex items-start gap-2 animate-pulse">
                    <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="flex-1">{success}</span>
                  </div>
                )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name (Signup only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold mb-2 text-gray-300">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 transition-colors z-10" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter your full name"
                        className="relative w-full bg-white/10 border border-white/20 rounded-lg pl-14 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/20 transition-all text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold mb-2 text-gray-300">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 transition-colors z-10" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => {
                        handleChange(e);
                        if (isLogin) {
                          // Check email format for typos
                          checkEmailFormat(e.target.value);
                          // Check if email exists with debounce
                          clearTimeout(window._emailCheckTimer);
                          window._emailCheckTimer = setTimeout(() => {
                            checkEmailExists(e.target.value);
                          }, 600);
                        } else {
                          setEmailExists(null);
                          setTypoSuggestion(null);
                        }
                      }}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      placeholder="you@example.com"
                      className="relative w-full bg-white/10 border border-white/20 rounded-lg pl-14 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/20 transition-all text-sm font-medium"
                      required
                    />
                  </div>
                  
                  {/* Email hints for login mode */}
                  {isLogin && (
                    <>
                      {emailExists === true && (
                        <p className="text-xs text-green-400 mt-2 flex items-center gap-1.5">
                          <span className="text-sm">✅</span>
                          <span>Account found — enter your password below</span>
                        </p>
                      )}
                      {emailExists === false && (
                        <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
                          <span className="text-sm">❌</span>
                          <span>No account with this email — </span>
                          <button 
                            type="button"
                            onClick={() => {
                              setIsLogin(false);
                              setError('');
                              setSuccess('');
                              setEmailExists(null);
                            }}
                            className="underline hover:text-red-300 font-semibold"
                          >
                            Sign up instead?
                          </button>
                        </p>
                      )}
                    </>
                  )}

                  {/* Email typo suggestion */}
                  {typoSuggestion && (
                    <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5">
                      <span className="text-sm">💡</span>
                      <span>{typoSuggestion.message}</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setFormData({...formData, email: typoSuggestion.corrected});
                          setTypoSuggestion(null);
                          setTimeout(() => checkEmailExists(typoSuggestion.corrected), 100);
                        }}
                        className="underline hover:text-amber-300 font-semibold"
                      >
                        Fix it
                      </button>
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-gray-300">Password</label>
                    {isLogin && (
                      <a href="#" className="text-xs text-red-400 hover:text-red-300 transition-colors font-semibold">Forgot?</a>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 transition-colors z-10" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      placeholder="••••••••"
                      className="relative w-full bg-white/10 border border-white/20 rounded-lg pl-14 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/20 transition-all text-sm font-medium"
                      required
                      minLength={6}
                    />
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      Min 8 chars: uppercase, lowercase, numbers
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 text-sm disabled:shadow-none hover:scale-105 transform"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold">{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-gradient-to-br from-red-950 via-black to-slate-950 text-xs text-gray-400">Or continue with</span>
                  </div>
                </div>

                {/* OAuth Sign-In Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={loading}
                    className="flex items-center justify-center py-3 px-3 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-red-500/50 transition-all disabled:opacity-50 text-white hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20 group"
                    title="Sign in with Google"
                  >
                    <FaGoogle size={20} className="group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={loading}
                    className="flex items-center justify-center py-3 px-3 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-red-500/50 transition-all disabled:opacity-50 text-white hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20 group"
                    title="Sign in with GitHub"
                  >
                    <FaGithub size={20} className="group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn('linkedin')}
                    disabled={loading}
                    className="flex items-center justify-center py-3 px-3 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-red-500/50 transition-all disabled:opacity-50 text-white hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20 group"
                    title="Sign in with LinkedIn"
                  >
                    <FaLinkedin size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Footer Text */}
                <p className="text-xs text-gray-400 text-center mt-5 px-2">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                    className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </form>
              </div>
            </div>
          </div>

          {/* Right Side - Decorative Section */}
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center px-8" style={{ minHeight: "100vh" }}>
            <div className="flex flex-col items-center justify-center gap-8 text-center">
              <img 
                src="/sadhna-logo.png" 
                alt="Logo"
                style={{
                  width:"280px",
                  height:"280px",
                  borderRadius:"50%",
                  objectFit:"cover",
                  animation:"ellipseSpin 6s linear infinite",
                  filter:"drop-shadow(0 0 50px rgba(255,80,0,0.8))"
                }}
              />
              <div className="space-y-4">
              <h2 style={{color:"#fff",fontSize:"2.5rem",fontWeight:"bold",userSelect:"none"}}>
                Master Your Habits
              </h2>
              <p style={{color:"#aaa",fontSize:"1.1rem",maxWidth:"350px",lineHeight:"1.6",userSelect:"none"}}>
                  Build unstoppable habits, track daily consistency, and achieve milestone rewards.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile - Auth Form */}
          <div className="lg:hidden w-full flex flex-col items-center justify-center px-4 py-8">
            {/* Auth Card - Mobile */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-sm">
              {/* Tab Switcher */}
              <div className="flex gap-2 mb-6 bg-white/5 p-1.5 rounded-lg border border-white/10">
                <button
                  onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                  className={`flex-1 py-2 px-3 rounded-md font-semibold text-xs transition-all duration-300 ${
                    isLogin
                      ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/50'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                  className={`flex-1 py-2 px-3 rounded-md font-semibold text-xs transition-all duration-300 ${
                    !isLogin
                      ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/50'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Heading */}
              <h2 className="text-lg font-bold mb-1 text-white">
                {isLogin ? 'Welcome Back' : 'Join SADHNA'}
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                {isLogin ? 'Continue your journey to consistency' : 'Start building unstoppable habits'}
              </p>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/15 border border-red-500/50 rounded-xl p-3 mb-3 text-red-200 text-xs flex items-start gap-2 animate-shake">
                  <span className="text-sm mt-0.5">⚠️</span>
                  <span className="flex-1">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-500/15 border border-green-500/50 rounded-xl p-3 mb-3 text-green-200 text-xs flex items-start gap-2 animate-pulse">
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="flex-1">{success}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Full Name (Signup only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-gray-300">Full Name</label>
                    <div className="relative group">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 transition-colors z-10" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('fullName')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Enter your full name"
                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/20 transition-all text-sm"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-300">Email Address</label>
                  <div className="relative group">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 transition-colors z-10" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      placeholder="you@example.com"
                      className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/20 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-300">Password</label>
                    {isLogin && (
                      <a href="#" className="text-xs text-red-400 hover:text-red-300 transition-colors font-semibold">Forgot?</a>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 transition-colors z-10" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      placeholder="••••••••"
                      className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:bg-white/20 transition-all text-sm"
                      required
                      minLength={6}
                    />
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      Min 8 chars: uppercase, lowercase, numbers
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 text-sm disabled:shadow-none text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold">{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-gradient-to-br from-red-950 via-black to-slate-950 text-xs text-gray-400">Or continue with</span>
                  </div>
                </div>

                {/* OAuth Sign-In Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={loading}
                    className="flex items-center justify-center py-2.5 px-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-red-500/50 transition-all disabled:opacity-50 text-white hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20 group"
                    title="Sign in with Google"
                  >
                    <FaGoogle size={18} className="group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={loading}
                    className="flex items-center justify-center py-2.5 px-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-red-500/50 transition-all disabled:opacity-50 text-white hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20 group"
                    title="Sign in with GitHub"
                  >
                    <FaGithub size={18} className="group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuthSignIn('linkedin')}
                    disabled={loading}
                    className="flex items-center justify-center py-2.5 px-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-red-500/50 transition-all disabled:opacity-50 text-white hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20 group"
                    title="Sign in with LinkedIn"
                  >
                    <FaLinkedin size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Footer Text */}
                <p className="text-xs text-gray-400 text-center mt-4">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                    className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
