import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { oauthLogin } = useAuth();
  const [status, setStatus] = useState('Completing sign in...');
  const [error, setError] = useState('');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Detect provider from current URL path
      const path = window.location.pathname;
      const provider = path.includes('google') ? 'google'
        : path.includes('github') ? 'github'
        : path.includes('linkedin') ? 'linkedin'
        : 'google';

      // Check for error from provider (in query params)
      const queryParams = new URLSearchParams(window.location.search);
      const errorParam = queryParams.get('error');
      if (errorParam) {
        setError('Sign in was cancelled. Please try again.');
        return;
      }

      // GOOGLE IMPLICIT FLOW — token comes in URL hash (#access_token=...)
      if (provider === 'google') {
        const hashParams = new URLSearchParams(
          window.location.hash.startsWith('#') 
            ? window.location.hash.substring(1) 
            : window.location.hash
        );
        
        const accessToken = hashParams.get('access_token');
        const tokenError = hashParams.get('error');

        if (tokenError) {
          setError('Google sign in failed: ' + tokenError);
          return;
        }

        if (!accessToken) {
          // No token in hash — old code flow redirect, show helpful message
          setError('Sign in incomplete. Please try the Google button again.');
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }

        // Use Google token to get real user info
        setStatus('Getting your Google profile...');
        
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (!userInfoResponse.ok) {
          throw new Error('Could not fetch Google profile. Please try again.');
        }

        const googleUser = await userInfoResponse.json();
        
        // googleUser contains: sub, email, name, picture, email_verified
        setStatus(`Welcome ${googleUser.name}! Setting up your account...`);

        // Login/signup with real Google data using AuthContext
        const result = await oauthLogin(provider, {
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.sub,
          picture: googleUser.picture,
        });

        if (result.error) {
          // If "already exists" error — this is a returning user, just proceed
          if (result.error.includes('already exists') || result.error.includes('exists')) {
            setStatus('✅ Welcome back! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 800);
            return;
          }
          setError(result.error);
          return;
        }

        setStatus('✅ Signed in successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 800);
        return;
      }

      // GITHUB / LINKEDIN — code flow (needs backend, show message)
      setError(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} login requires ` +
        `backend setup. Please use email & password or Google login.`
      );

    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-slate-950 
                    flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {error ? (
          <div className="bg-red-500/15 border border-red-500/50 rounded-2xl p-8">
            <p className="text-4xl mb-4">😕</p>
            <p className="text-red-300 mb-6 text-sm leading-relaxed">{error}</p>
            <button
              onClick={() => navigate('/auth')}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 
                         text-white rounded-xl font-bold hover:from-red-600 
                         hover:to-rose-700 transition-all shadow-lg shadow-red-500/30"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent 
                          rounded-full animate-spin mx-auto mb-6" />
            <p className="text-white text-lg font-semibold">{status}</p>
            <p className="text-gray-400 text-sm mt-2">Please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
