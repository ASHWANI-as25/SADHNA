import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { oauthLogin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const provider = searchParams.get('provider') || 'google';
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          setError('Authorization code not found. Falling back to local authentication.');
          setTimeout(() => navigate('/auth'), 2000);
          return;
        }

        // Check if backend is configured
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        const backendConfigured = apiUrl !== '/api';

        try {
          // Try to call backend if configured
          if (backendConfigured) {
            const response = await fetch(`${apiUrl}/auth/${provider}/callback`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code, state })
            });

            if (response.ok) {
              const { user, email, name } = await response.json();
              const result = await oauthLogin(provider, { email, name, userId: user?.id });
              if (result.error) {
                throw new Error(result.error);
              }
              navigate('/dashboard');
              return;
            }
          }
        } catch (backendErr) {
          console.warn('Backend OAuth not available:', backendErr);
        }

        // FALLBACK: Demo mode for development
        console.log('💡 Using demo OAuth mode (frontend-only). For production, implement backend OAuth handler.');
        const demoEmail = `${provider}-user-${Date.now()}@demo.sadhna.com`;
        const demoName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
        
        const result = await oauthLogin(provider, {
          email: demoEmail,
          name: demoName,
          provider: provider,
          verified: false
        });

        if (result.error) {
          setError(result.error);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, oauthLogin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sadhna-red to-sadhna-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-energy-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Signing you in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sadhna-red to-sadhna-navy flex items-center justify-center">
        <div className="text-center">
          <p className="text-energy-coral mb-4">{error}</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2 bg-energy-coral text-white rounded-lg hover:bg-energy-pink"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
