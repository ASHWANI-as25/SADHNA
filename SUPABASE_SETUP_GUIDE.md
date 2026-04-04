# Supabase Integration Setup Guide

## 🚀 Complete Setup Instructions

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in or create account
4. Create a new project:
   - Project name: `ai-interviewer`
   - Database password: Save this securely
   - Region: Choose closest to you
   - Click "Create new project"

Wait for project to initialize (2-3 minutes)

### Step 2: Get API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)

### Step 3: Create Tables

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Copy entire contents from `SUPABASE_SCHEMA.sql` file
4. Paste into query editor
5. Click "Run"

Wait for completion (few seconds)

### Step 4: Enable Storage Buckets

1. Go to **Storage** in left sidebar
2. Create new bucket: `interview_recordings`
   - Make it **Private**
   - Click "Create bucket"
3. Create new bucket: `avatars`
   - Make it **Private**
   - Click "Create bucket"

### Step 5: Configure Environment Variables

1. Open `.env.local` file in project root
2. Fill in your keys:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GROQ_API_KEY=your-groq-key-here
```

### Step 6: Enable Authentication

1. Go to **Authentication** → **Providers** in Supabase
2. Email/Password is enabled by default ✅
3. (Optional) Enable Google/GitHub OAuth if desired

### Step 7: Configure CORS (if needed)

1. Go to **Project Settings** → **API**
2. Under CORS settings, add:
   ```
   http://localhost:5175
   http://localhost:3000
   ```

### Step 8: Test Connection

```bash
npm run dev
```

Visit `http://localhost:5175`

You should see login/signup page instead of dashboard.

---

## 📊 Database Schema Overview

### Tables Created:
- **user_profiles** - User info, resume, avatar
- **user_settings** - Preferences, theme, notifications
- **interviews** - Interview records, scores, feedback
- **interview_analytics** - Aggregated performance data
- **recordings** - Interview video metadata

### Row Level Security (RLS):
✅ All tables have RLS enabled
✅ Users can only access their own data
✅ Database enforces data privacy

---

## 🔑 Authentication Flow

1. User signs up with email/password
2. Supabase creates auth user
3. User profile created automatically
4. Access token stored in browser
5. All requests authenticated with user ID

### Protected Routes:
- All routes except `/auth` require authentication
- Login redirects to `/auth`
- Logout clears session automatically

---

## 💾 Data Migration (Optional)

If you have existing localStorage data and want to migrate:

```javascript
// Run in browser console to migrate old data:
const oldHistory = JSON.parse(localStorage.getItem('interview_history'));
const oldSettings = JSON.parse(localStorage.getItem('interview_settings'));

// Contact support or implement migration script
```

---

## 🔒 Security Features

✅ **Row Level Security** - Users see only their data
✅ **Auth Required** - All routes protected
✅ **HTTPS Only** - Supabase enforces encryption
✅ **Rate Limiting** - Built-in DDoS protection
✅ **Backup** - Automatic daily backups

---

## 📱 Real-time Features

The app automatically syncs across multiple tabs/devices:

```javascript
// Real-time interview updates
realtimeService.subscribeToInterviews(userId, (changes) => {
  // Automatically updates when new interview saved
});
```

---

## 🐛 Troubleshooting

### Issue: "No ANON KEY found"
**Solution:** Check `.env.local` has correct keys

### Issue: "User not authenticated"
**Solution:** Clear cookies, sign out, and login again

### Issue: "Database connection failed"
**Solution:** 
- Check Supabase project is running
- Verify CORS settings
- Check internet connection

### Issue: "Storage upload failed"
**Solution:**
- Ensure buckets are created
- Check file size limits
- Verify RLS policies

---

## 📚 Useful Supabase Resources

- **Docs**: https://supabase.com/docs
- **API Ref**: https://supabase.com/docs/reference/javascript
- **Community**: https://discord.gg/supabase

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] API keys copied to `.env.local`
- [ ] Database schema executed
- [ ] Storage buckets created
- [ ] Environment variables configured
- [ ] App runs without errors
- [ ] Can sign up new account
- [ ] Interview data saves to database
- [ ] Real-time syncing works

---

## 🎉 Next Steps

1. **Test signup flow**
   - Create test account
   - Verify email confirmation (if email auth enabled)
   - Check user profile created

2. **Test interview flow**
   - Start new interview
   - Complete and submit
   - Check data in Supabase dashboard

3. **Enable additional features**
   - Google OAuth login
   - Email notifications
   - Scheduled reports

---

**Questions?** Check Supabase docs or contact support!
