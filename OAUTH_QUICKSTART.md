# OAuth Quick Start Setup

## Frontend Environment Variables

Create `.env.local` file in project root:

```env
# Google OAuth - Get from https://console.cloud.google.com/
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID

# GitHub OAuth - Get from https://github.com/settings/developers
VITE_GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID

# LinkedIn OAuth - Get from https://www.linkedin.com/developers/apps
VITE_LINKEDIN_CLIENT_ID=YOUR_LINKEDIN_CLIENT_ID
```

---

## For Quick Testing (Demo Mode)

You can test the OAuth buttons without real credentials:
1. Just click the Google/GitHub/LinkedIn buttons
2. Demo account will be created with that provider's name
3. Dashboard will show "Welcome back via GOOGLE/GITHUB/LINKEDIN"

---

## For Production (Real OAuth)

### Step 1: Set Up Backend API

Create endpoint: `POST /api/auth/{provider}/callback`

**Example Backend Handler (Node.js/Express):**

```javascript
app.post('/api/auth/google/callback', async (req, res) => {
  const { code, state } = req.body;
  
  try {
    // Verify state token
    const storedState = req.session.oauthState;
    if (state !== storedState) {
      return res.status(400).json({ error: 'Invalid state' });
    }

    // Exchange code for token
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:5173/auth/google/callback'
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Fetch user info
    const userResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const { email, name, picture } = userResponse.data;

    // Find or create user in database
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, picture, provider: 'google' });
      await user.save();
    }

    // Create session and return user
    return res.json({
      user: { id: user._id },
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### Step 2: Update .env.local

```env
VITE_GOOGLE_CLIENT_ID=actual_client_id_from_google
VITE_GITHUB_CLIENT_ID=actual_client_id_from_github
VITE_LINKEDIN_CLIENT_ID=actual_client_id_from_linkedin
```

### Step 3: Add Client Secrets to Backend Only

Never put these in frontend `.env.local`:

```env
# Backend .env only
GOOGLE_CLIENT_SECRET=your_secret_here
GITHUB_CLIENT_SECRET=your_secret_here
LINKEDIN_CLIENT_SECRET=your_secret_here
```

---

## What Happens When User Signs In

### Current Flow (Frontend-Only):

1. User clicks "Sign in with Google"
2. Redirected to: `https://accounts.google.com/o/oauth2/v2/auth?...`
3. Google asks permission
4. Redirected back to: `http://localhost:5173/auth/google/callback?code=...&state=...`
5. OAuthCallback.jsx tries to call backend `/api/auth/google/callback`
6. Backend exchanges code for token and returns user email/name
7. User logged in and dashboard shows: "Welcome back, [name]"

### For Demo (No Backend):

1-4: Same as above
5: OAuthCallback.jsx shows "Backend not configured" error (in development)
6: Demo account created locally

---

## Display Features

### Greeting on Dashboard:

**First Time (New User from OAuth):**
```
Welcome, john
👋 Let's get started!
```

**Returning User:**
```
Welcome back, john
via GOOGLE
```

---

## Next Steps

1. **Choose Priority:** Google (easiest) → GitHub → LinkedIn
2. **Get Credentials:** Use the links above to create OAuth apps
3. **Add to .env.local:** Paste credentials
4. **Test:** Sign in and check "Welcome back" greeting
5. **Production:** Set up backend handlers for real token exchange

---

## Troubleshooting

**Issue:** "Client ID not configured"
- **Fix:** Make sure `.env.local` exists with `VITE_GOOGLE_CLIENT_ID=...`
- Restart dev server after changing .env

**Issue:** Redirects to wrong URL
- **Fix:** Make sure redirect URL in OAuth app settings matches exactly
- Example: `http://localhost:5173/auth/google/callback`

**Issue:** "Backend not configured"
- **Fix:** That's fine for demo! Just means real token exchange isn't set up yet
- For production, follow "Production Setup" section above

---

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx (updated: oauthLogin with email/name)
├── pages/
│   ├── Auth.jsx (updated: real OAuth URLs)
│   ├── OAuthCallback.jsx (NEW: handles /auth/google/callback etc)
│   └── Dashboard.jsx (updated: shows welcome back with provider)
├── services/
│   └── oauthService.js (OAuth helpers)
└── App.jsx (updated: OAuth callback routes)
```

