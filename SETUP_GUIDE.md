# SADHNA PROJECT - COMPLETE SETUP & VERIFICATION GUIDE

**Updated**: April 2, 2026 - After Critical Security & Bug Fixes

---

## 📋 QUICK SETUP (5 minutes)

### 1. Copy Environment Template
```bash
cp .env.example .env.local
```

### 2. Get Supabase Credentials
Go to https://supabase.com → Your Project → Settings → API

Copy:
- `VITE_SUPABASE_URL` → your project URL
- `VITE_SUPABASE_ANON_KEY` → anon public key

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Get Groq API Key
Go to https://console.groq.com → API Keys

```env
VITE_GROQ_API_KEY=your-groq-api-key
```

### 4. Test Setup
```bash
npm run dev
# Open browser console (F12)
# You should see messages about database status
```

---

## 🔧 DETAILED SETUP

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)
- Groq account (free tier works)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ✅ VERIFICATION CHECKLIST

### Phase 1: Core Setup
- [ ] `.env.local` file exists with valid credentials
- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts without errors
- [ ] Browser opens to http://localhost:5173

### Phase 2: Authentication
- [ ] Can create account (email + password)
- [ ] Password validation enforces:
  - [ ] At least 8 characters
  - [ ] Contains uppercase letter
  - [ ] Contains lowercase letter
  - [ ] Contains number
- [ ] Can login with created account
- [ ] "Welcome" greeting appears on dashboard
- [ ] Can logout

### Phase 3: Database
- [ ] Open browser console (F12)
- Run:
  ```javascript
  const { data, error } = await supabase.from('streaks').select('*').limit(1);
  console.log('Streaks table:', error ? 'ERROR' : 'OK');
  ```
- [ ] Should show "Streaks table: OK" (or error about missing table)
- [ ] If missing table, run SQL schema from SUPABASE_SCHEMA.sql

### Phase 4: Streak Management
- [ ] Can create a streak without URL
- [ ] Can see streak in Dashboard
- [ ] Can view Streaks page
- [ ] Stats display correctly

### Phase 5: Interviews
- [ ] Can access Assessment page
- [ ] Assessment loads with categories
- [ ] Can start interview
- [ ] Interview questions display
- [ ] Can submit assessment

### Phase 6: AI Features
- [ ] Groq API key set in .env.local
- [ ] Can get interview feedback
- [ ] Interview analysis generates

### Phase 7: Advanced Features
- [ ] Camera permissions work (or fallback appears)
- [ ] Can toggle fullscreen
- [ ] Proctoring detection works
- [ ] Daily todos can be created/managed

---

## 🔍 TROUBLESHOOTING

### Issue: "Database not configured" warnings
**Solution**: 
1. Verify `.env.local` exists
2. Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Restart dev server: `npm run dev`

### Issue: Supabase operations fail
**Solutions**:
1. Check if tables exist:
   ```javascript
   const { data, error } = await supabase.from('streaks').select('*').limit(1);
   if (error) console.log('Missing table:', error.message);
   ```
2. If missing, execute `SUPABASE_SCHEMA.sql` in Supabase SQL editor
3. Verify RLS policies allow operations

### Issue: Groq API errors
**Solutions**:
1. Verify `VITE_GROQ_API_KEY` in `.env.local`
2. Check API key is valid at https://console.groq.com
3. Check quota not exceeded
4. Fallback to demo responses works automatically

### Issue: Camera not working
**Solutions**:
1. Check browser permissions (camera icon in address bar)
2. Use "Continue without camera" button (added in recent fix)
3. Check if browser/OS restricts camera access

### Issue: OAuth login fails
**Current Status**: Uses demo mode (creates demo account)
- OAuth fully functional for testing
- To implement real backend OAuth, see OAUTH_INTEGRATION_GUIDE.md

### Issue: Streak creation fails
**Status**: ✅ FIXED in recent update
- URL field now optional
- Can create streak with just title
- Category selection works

---

## 🏗️ PROJECT STRUCTURE

```
src/
├── components/         # Reusable UI components
├── context/           # React Context (Auth, Interview, Assessment)
├── pages/             # Page components
├── services/          # Business logic & API integration
│   ├── supabase.js   # Database config
│   ├── localAuth.js  # Local authentication
│   ├── errorHandler.js # NEW - Error handling utility
│   ├── groq.js       # AI feedback generation
│   └── ...           # Other services
├── styles/           # CSS files
└── main.jsx         # Entry point

.env.example          # Environment template
.env.local           # Your credentials (NOT in git!)
```

---

## 🚀 TESTING GUIDE

### Test Signup → Login → Dashboard Flow
```
1. Clear localStorage (F12 > Storage > Clear All)
2. Navigate to /auth
3. Switch to "Sign Up"
4. Create account:
   - Email: test@example.com
   - Password: TestPass123
   - Name: Test User
5. Should redirect to dashboard with "Welcome" greeting
6. Should show "New User" status
7. Logout and login again
8. Should show "Welcome back" (not new user greeting)
```

### Test Streak Creation
```
1. Go to Dashboard
2. Click "Create Streak" button
3. Fill form:
   - Title: Daily Coding ✓ (required)
   - Description: Practice coding (optional)
   - Category: Coding (optional)
   - URL: Leave empty (optional) ✓
4. Click "Add Streak"
5. Should show success toast
6. Streak should appear in Streaks page
```

### Test Assessment
```
1. Go to Assessment page
2. Select:
   - Category: Any
   - Field: Any
   - Difficulty: Determines based on field
3. Click "Start Assessment"
4. Answer questions (can skip)
5. Submit assessment
6. Should show results with score
```

---

## 🔐 SECURITY NOTES

### Credentials Safety
- ✅ `.env.local` in `.gitignore` (never committed)
- ⚠️ Passwords stored plain text (see SECURITY_CONFIG_GUIDE.md)
- ⚠️ Groq API key exposed in browser (move to backend for production)

### Recommended Improvements
1. [ ] Install bcryptjs and hash passwords
2. [ ] Move Groq API to backend
3. [ ] Implement real OAuth with backend
4. [ ] Add HTTPS in production
5. [ ] Set up error logging (Sentry)
6. [ ] Add rate limiting
7. [ ] Security audit

See `SECURITY_CONFIG_GUIDE.md` for detailed fixes.

---

## 📊 DATABASE SCHEMA

Required tables (execute in Supabase SQL editor):
- `user_profiles`
- `streaks`
- `daily_todos`
- `interviews`
- `interviews_feedback`
- `milestones`
- `leaderboard`

See `SUPABASE_SCHEMA.sql` for complete schema.

---

## 🆘 GETTING HELP

### Check These First
1. Browser console (F12 > Console) for error messages
2. Network tab (F12 > Network) for failed requests
3. `.env.local` file - is it properly formatted?
4. Supabase dashboard - are tables created?
5. Logs in browser console - clear messages with emojis

### Common Error Messages & Fixes

| Error | Solution |
|-------|----------|
| "Database not configured" | Set env vars, restart dev server |
| "Failed to fetch from streaks" | Run Supabase SQL schema |
| "Groq API error" | Check API key, check quota |
| "Camera permission denied" | Use "Continue without camera" |
| "Code injection detected" | Code contains localStorage/fetch (intentional) |

---

## 🎯 QUICK REFERENCE

**Start dev server**: `npm run dev`  
**Build for production**: `npm run build`  
**Check for errors**: `npm run lint`  
**Open Supabase dashboard**: https://supabase.com  
**Open Groq console**: https://console.groq.com  
**Dev server URL**: http://localhost:5173  
**Supabase docs**: https://supabase.com/docs  
**Groq API docs**: https://console.groq.com/docs  

---

## 📝 RECENT CHANGES (April 2, 2026)

✅ **Fixed Issues**:
- OAuth callback demo mode fallback
- Code execution pattern validation
- Camera permission error handling
- Password strength validation
- Streak URL field optional
- Assessment difficulty levels
- Supabase config warnings
- Error handling utility

✅ **New Files**:
- `.env.example` - Environment template
- `SECURITY_CONFIG_GUIDE.md` - Security guide
- `SETUP_GUIDE.md` - This file
- `src/services/errorHandler.js` - Error handling utility

See `THOROUGH_CODEBASE_ANALYSIS.md` for complete before/after analysis.

---

**Project Status**: Stable with improved error handling, security warnings, and better UX. Ready for testing and deployment with configuration.
