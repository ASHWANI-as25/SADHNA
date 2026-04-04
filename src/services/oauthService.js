/**
 * OAuth Integration Service
 * Handles OAuth sign-in flow for Google, GitHub, and LinkedIn
 * Can be integrated with actual OAuth providers
 */

// OAuth Configuration
export const OAUTH_CONFIG = {
  google: {
    name: 'Google',
    icon: '🔵',
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    scope: ['profile', 'email'],
    authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  },
  github: {
    name: 'GitHub',
    icon: '⚫',
    clientId: process.env.REACT_APP_GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID',
    scope: ['user:email'],
    authEndpoint: 'https://github.com/login/oauth/authorize',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '🔷',
    clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID',
    scope: ['r_basicprofile', 'r_emailaddress'],
    authEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
  }
};

/**
 * Initiate OAuth sign-in flow
 * In production, this would redirect to the OAuth provider
 */
export const initiateOAuthSignIn = (provider) => {
  const config = OAUTH_CONFIG[provider];
  
  if (!config) {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  // For demo purposes, we're handling this in the AuthContext
  // In production, implement actual OAuth redirect here
  console.log(`[OAuth] Initiating ${provider} sign-in flow...`);
  console.log(`[OAuth] Configure these env variables to enable real OAuth:`);
  console.log(`  REACT_APP_GOOGLE_CLIENT_ID`);
  console.log(`  REACT_APP_GITHUB_CLIENT_ID`);
  console.log(`  REACT_APP_LINKEDIN_CLIENT_ID`);
  
  return config;
};

/**
 * Handle OAuth callback (for real OAuth implementations)
 */
export const handleOAuthCallback = (provider, code, state) => {
  console.log(`[OAuth] Handling callback for ${provider}`, { code, state });
  // In production, exchange code for access token and user info
  // This would be handled by your backend
};

/**
 * Extract user info from OAuth response
 */
export const extractUserInfo = (provider, oauthUser) => {
  const userInfo = {
    email: '',
    name: '',
    picture: '',
    provider: provider
  };

  switch (provider) {
    case 'google':
      userInfo.email = oauthUser.email;
      userInfo.name = oauthUser.name;
      userInfo.picture = oauthUser.picture;
      break;
    case 'github':
      userInfo.email = oauthUser.email || oauthUser.login + '@github.com';
      userInfo.name = oauthUser.name || oauthUser.login;
      userInfo.picture = oauthUser.avatar_url;
      break;
    case 'linkedin':
      userInfo.email = oauthUser.emailAddress;
      userInfo.name = `${oauthUser.firstName} ${oauthUser.lastName}`;
      userInfo.picture = oauthUser.pictureUrl;
      break;
  }

  return userInfo;
};

/**
 * Store OAuth user session
 */
export const storeOAuthSession = (provider, userInfo) => {
  const session = {
    provider,
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem(`oauth_session_${provider}`, JSON.stringify(session));
  return session;
};

/**
 * Retrieve OAuth user session
 */
export const getOAuthSession = (provider) => {
  const session = localStorage.getItem(`oauth_session_${provider}`);
  return session ? JSON.parse(session) : null;
};

/**
 * Clear OAuth session
 */
export const clearOAuthSession = (provider) => {
  localStorage.removeItem(`oauth_session_${provider}`);
};

/**
 * Check if user is logged in via OAuth
 */
export const isOAuthUser = (userId) => {
  return localStorage.getItem(`oauth_provider_${userId}`) !== null;
};

/**
 * Get OAuth provider for user
 */
export const getOAuthProvider = (userId) => {
  return localStorage.getItem(`oauth_provider_${userId}`);
};

/**
 * Implementation guide for real OAuth
 * 
 * 1. Google OAuth:
 *    - Install: npm install @react-oauth/google
 *    - Get credentials: https://console.cloud.google.com/
 *    - Set REACT_APP_GOOGLE_CLIENT_ID in .env
 * 
 * 2. GitHub OAuth:
 *    - Create OAuth App: https://github.com/settings/developers
 *    - Set REACT_APP_GITHUB_CLIENT_ID in .env
 *    - Implement backend token exchange
 * 
 * 3. LinkedIn OAuth:
 *    - Create App: https://www.linkedin.com/developers/apps
 *    - Set REACT_APP_LINKEDIN_CLIENT_ID in .env
 *    - Implement backend token exchange
 * 
 * Update Auth.jsx handleOAuthSignIn to use actual OAuth flow
 * instead of creating demo accounts
 */

export default {
  OAUTH_CONFIG,
  initiateOAuthSignIn,
  handleOAuthCallback,
  extractUserInfo,
  storeOAuthSession,
  getOAuthSession,
  clearOAuthSession,
  isOAuthUser,
  getOAuthProvider
};
