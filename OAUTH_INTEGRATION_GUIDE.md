# 🔐 OAuth Integration Guide

## Overview
The login page now has OAuth sign-in options for Google, GitHub, and LinkedIn. Currently using demo mode, but ready for real OAuth integration.

## Current Status

### ✅ Implemented
- OAuth UI buttons on login page
- Demo OAuth sign-in flow (creates local accounts)
- OAuth service infrastructure
- Stores OAuth provider info
- AuthContext support for OAuth

### 🔄 Demo Mode
- Creates temporary OAuth accounts
- No actual provider authentication
- Good for UI/UX testing

## Real OAuth Setup

### 1. Google OAuth

**Step 1: Create Google OAuth Credentials**
```
1. Go to: https://console.cloud.google.com/
2. Create new project: "SADHNA - Habit Tracker"
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Type: Web application
6. Authorized origins: http://localhost:5173, https://yourdomain.com
7. Authorized redirect URIs: http://localhost:5173/auth/callback, https://yourdomain.com/auth/callback
8. Copy Client ID
```

**Step 2: Install Package**
```bash
npm install @react-oauth/google
```

**Step 3: Set Environment Variable**
```
# .env file
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

**Step 4: Wrap App with Google Provider**
```jsx
// main.jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
```

**Step 5: Update Auth.jsx**
```jsx
import { useGoogleLogin } from '@react-oauth/google';

const handleGoogleSignIn = useGoogleLogin({
  onSuccess: async (codeResponse) => {
    await handleOAuthSignIn('google', codeResponse);
  },
  flow: 'auth-code'
});
```

---

### 2. GitHub OAuth

**Step 1: Create GitHub OAuth App**
```
1. Go to: https://github.com/settings/developers
2. Settings → Developer settings → OAuth Apps → New OAuth App
3. Application name: SADHNA - Habit Tracker
4. Homepage URL: http://localhost:5173 or your domain
5. Authorization callback URL: http://localhost:5173/auth/callback
6. Copy Client ID and Client Secret
```

**Step 2: Set Environment Variables**
```
REACT_APP_GITHUB_CLIENT_ID=your_client_id
REACT_APP_GITHUB_CLIENT_SECRET=your_client_secret (backend only!)
```

**Step 3: Implement GitHub OAuth Flow**
```jsx
const handleGithubSignIn = () => {
  const clientId = import.meta.env.VITE_REACT_APP_GITHUB_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/callback`;
  const scope = 'user:email';
  
  const authUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `scope=${scope}`;
  
  window.location.href = authUrl;
};
```

**Step 4: Create Backend Handler**
```javascript
// Backend: /auth/github/callback
app.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query;
  
  // Exchange code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code
    })
  });
  
  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  
  // Get user info
  const userResponse = await fetch('https://api.github.com/user', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  
  const user = await userResponse.json();
  
  // Create or update user in database
  // Return session token to frontend
});
```

---

### 3. LinkedIn OAuth

**Step 1: Create LinkedIn App**
```
1. Go to: https://www.linkedin.com/developers/apps
2. Create app:
   - App name: SADHNA - Habit Tracker
   - LinkedIn Page: (select your company page or create one)
   - App logo: (upload logo)
   - Legal agreement: checked
3. Auth → Authorized redirect URLs:
   - http://localhost:5173/auth/callback
   - https://yourdomain.com/auth/callback
4. Get Client ID and Client Secret
```

**Step 2: Set Environment Variables**
```
REACT_APP_LINKEDIN_CLIENT_ID=your_client_id
REACT_APP_LINKEDIN_CLIENT_SECRET=your_client_secret (backend only!)
```

**Step 3: Request Permissions**
In LinkedIn Developer Console:
- Request access for: Sign In with LinkedIn
- Request access for: Share on LinkedIn

**Step 4: Implement OAuth Flow**
```jsx
const handleLinkedInSignIn = () => {
  const clientId = import.meta.env.VITE_REACT_APP_LINKEDIN_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/callback`;
  
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `scope=r_basicprofile%20r_emailaddress`;
  
  window.location.href = authUrl;
};
```

---

## File Locations & Changes

### Components Modified
- ✅ `src/pages/Auth.jsx` - Added OAuth buttons and handlers
- ✅ `src/context/AuthContext.jsx` - Added oauthLogin function
- ✅ `src/services/oauthService.js` - OAuth service (NEW)

### Environment Variables Needed
```
# For Google
REACT_APP_GOOGLE_CLIENT_ID=xxx

# For GitHub
REACT_APP_GITHUB_CLIENT_ID=xxx

# For LinkedIn
REACT_APP_LINKEDIN_CLIENT_ID=xxx
```

### Backend Implementation
Create OAuth callback handlers that:
1. Receive authorization code from provider
2. Exchange code for access token (using client secret)
3. Get user profile information
4. Create/update user in database
5. Return session token to frontend

---

## OAuth Flow Diagram

```
User clicks "Sign in with Google/GitHub/LinkedIn"
                     ↓
Browser redirects to provider's auth page
                     ↓
User logs in with provider
                     ↓
Provider redirects back with authorization code
                     ↓
Backend exchanges code for access token
                     ↓
Backend requests user profile from provider
                     ↓
Backend creates/updates user in database
                     ↓
Backend returns session token to frontend
                     ↓
Frontend stores session and redirects to dashboard
```

---

## Testing OAuth

### Local Testing
1. Use `http://localhost:5173` as redirect URI
2. Add to OAuth provider's allowed origins
3. Test sign-in flow in development

### Production Testing
1. Use HTTPS domain
2. Configure redirect URI with domain
3. Test in production environment

---

## Security Considerations

### ✅ Do's
- Store client secrets only in backend
- Never expose client secret in frontend code
- Use environment variables for sensitive data
- Validate tokens server-side
- Implement CSRF protection

### ❌ Don'ts
- Don't store tokens in localStorage unencrypted
- Don't expose client secrets in frontend
- Don't make direct OAuth API calls from frontend
- Don't skip email verification

---

## Implementation Priorities

### Priority 1 (Do First)
- [ ] Set up Google OAuth
- [ ] Test with demo mode first
- [ ] Implement backend callback handler

### Priority 2 (Do Next)
- [ ] Set up GitHub OAuth
- [ ] Add GitHub sign-in flow
- [ ] Test integration

### Priority 3 (Do Later)
- [ ] Set up LinkedIn OAuth
- [ ] Add LinkedIn sign-in flow
- [ ] Test integration

---

## Troubleshooting

### OAuth Redirect URI Mismatch
- Make sure redirect URI in OAuth app matches exactly
- Include protocol (http/https)
- Include port number for localhost

### CORS Errors
- OAuth should handle CORS (not frontend issue)
- Make backend calls to exchange code for token
- Frontend never talks directly to OAuth provider

### Missing Scopes
- Request only needed scopes
- Different providers have different scope formats
- Test error messages for scope-related issues

---

## Next Steps

1. **Choose Provider**: Start with Google (easiest)
2. **Get Credentials**: Create OAuth app in developer console
3. **Set Environment**: Add client ID to .env
4. **Install Package**: npm install oauth package
5. **Update Auth.jsx**: Replace demo with real OAuth
6. **Backend**: Implement callback handler
7. **Test**: Verify sign-in flow works end-to-end

---

Current Implementation Status: **Demo Mode Ready** ✅  
Real OAuth Integration: **Ready to Connect** 🔗

For help, refer to each provider's official documentation:
- Google: https://developers.google.com/identity
- GitHub: https://docs.github.com/en/developers/apps
- LinkedIn: https://docs.microsoft.com/en-us/linkedin/shared/authentication
