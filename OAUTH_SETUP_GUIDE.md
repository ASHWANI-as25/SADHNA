# Complete OAuth Integration Guide
## Real Google, GitHub, LinkedIn Sign-In

---

## PART 1: ENVIRONMENT SETUP

### Step 1.1: Create `.env.local` file in project root
```
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# GitHub OAuth
VITE_GITHUB_CLIENT_ID=your_github_client_id_here

# LinkedIn OAuth
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
VITE_LINKEDIN_REDIRECT_URI=http://localhost:5173/auth/linkedin/callback
```

---

## PART 2: GOOGLE OAUTH SETUP

### Step 2.1: Create Google OAuth Credentials
1. Go to: https://console.cloud.google.com/
2. Create new project (or select existing)
3. Go to "OAuth consent screen"
   - Select "External" user type
   - Fill app name, email
4. Go to "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     http://localhost:5173/auth/google/callback
     ```
5. Copy **Client ID** and save in `.env.local`

### Step 2.2: Install Google OAuth Library
```bash
npm install @react-oauth/google
```

---

## PART 3: GITHUB OAUTH SETUP

### Step 3.1: Create GitHub OAuth App
1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill details:
   - Application name: SADHNA
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5173/auth/github/callback`
4. Copy **Client ID** to `.env.local`
5. Copy **Client Secret** (keep secret - for backend only!)

---

## PART 4: LINKEDIN OAUTH SETUP

### Step 4.1: Create LinkedIn OAuth App
1. Go to: https://www.linkedin.com/developers/apps
2. Click "Create app"
3. Fill app details and choose "Sign In with LinkedIn"
4. Add authorized redirect URL:
   ```
   http://localhost:5173/auth/linkedin/callback
   ```
5. Copy **Client ID** to `.env.local`
6. Copy **Client Secret** (for backend only)

---

## PART 5: FRONTEND IMPLEMENTATION

### Step 5.1: Install Dependencies
```bash
npm install @react-oauth/google jwt-decode
```

### Step 5.2: Environment Variables in Vite
Make sure `.env.local` uses `VITE_` prefix for frontend access.

### Step 5.3: Update Auth.jsx
Will provide complete code with real OAuth integration.

---

## PART 6: BACKEND SETUP (OPTIONAL but RECOMMENDED)

For production security, create backend endpoints:

### Recommended Backend Stack:
- **Node.js + Express** (simple)
- **Python + Flask** (easy)
- **Any backend** that can handle OAuth callback

### Required Endpoints:
```
POST /api/auth/google/callback
POST /api/auth/github/callback  
POST /api/auth/linkedin/callback
```

These endpoints should:
1. Receive authorization code from frontend
2. Exchange code for access token (using Client Secret)
3. Fetch user profile data
4. Create/update user in database
5. Return JWT token + user data

---

## IMPORTANT NOTES:

⚠️ **Never expose Client Secret in frontend!**
- Client ID: Can be in frontend
- Client Secret: Must be in backend only

✅ **For Development**: We can use popup-based flow first
✅ **For Production**: Use backend OAuth flow

---

## NEXT STEPS:
1. Choose ONE provider first (Google recommended)
2. Complete credentials setup
3. Add to `.env.local`
4. Follow implementation code in next parts
5. Test with real account
6. Repeat for GitHub & LinkedIn

