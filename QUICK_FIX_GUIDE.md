# QUICK FIX GUIDE - Sadhna Project
**Time to Production Ready**: ~45 minutes  

---

## CRITICAL FIX #1: Table Name `interview_results` → `interviews`

### Files to Fix (9 locations total)

**File 1: [src/services/leaderboardService.js](src/services/leaderboardService.js)**

Find all occurrences of `.from('interview_results')` and replace with `.from('interviews')`

**Locations**:
- Line 15: In `getGlobalLeaderboard()`
- Line 66: In `getUserRanking()`  
- Line 79: In `getLeaderboardByRole()`
- Line 125: In `getLeaderboardByDifficulty()`
- Line 159: In `getTopScorers()`
- Line 197: In `getLast30DaysLeaderboard()`
- Line 256: In `getLeaderboardStats()`
- Line 289: In `getRoleLeaderboard()`
- Line 326: In `getLeaderboardFiltered()`

**File 2: [src/services/supabaseAI.js](src/services/supabaseAI.js)**

**Location**: Line 375 in `generateFinalFeedback()`

**Search & Replace**:
```bash
# Command to do all replacements at once:
sed -i "s/\.from('interview_results')/\.from('interviews')/g" src/services/leaderboardService.js
sed -i "s/\.from('interview_results')/\.from('interviews')/g" src/services/supabaseAI.js
```

**Before**:
```javascript
.from('interview_results')
  .select('*')
  .order('score', { ascending: false })
```

**After**:
```javascript
.from('interviews')
  .select('*')
  .order('score', { ascending: false })
```

---

## CRITICAL FIX #2: Table Name `interview_recordings` → `recordings`

### File: [src/services/supabase.js](src/services/supabase.js)

**Locations**:
- Line 185 (in saving recording)
- Line 197 (in retrieving recordings)
- Line 206 (in deleting recording)

**Search & Replace**:
```bash
sed -i "s/\.from('interview_recordings')/\.from('recordings')/g" src/services/supabase.js
```

**Before**:
```javascript
const { data, error } = await supabase
  .from('interview_recordings')
  .insert({ file_path });
```

**After**:
```javascript
const { data, error } = await supabase
  .from('recordings')
  .insert({ file_path });
```

---

## CRITICAL FIX #3: Create `daily_todos` Table

### Option A: Add to Supabase Schema (Recommended)

Add this to [SUPABASE_SCHEMA.sql](SUPABASE_SCHEMA.sql) at the end (before RLS policies):

```sql
-- Daily Todos Table
CREATE TABLE IF NOT EXISTS daily_todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  related_streak_id UUID REFERENCES streaks(id) ON DELETE SET NULL,
  priority VARCHAR(50) DEFAULT 'medium',
  due_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_todos_user_id ON daily_todos(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_todos_due_date ON daily_todos(due_date);
CREATE INDEX IF NOT EXISTS idx_daily_todos_is_completed ON daily_todos(is_completed);

-- Enable RLS
ALTER TABLE daily_todos ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can view their own todos"
  ON daily_todos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own todos"
  ON daily_todos FOR INSERT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON daily_todos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
  ON daily_todos FOR DELETE
  USING (auth.uid() = user_id);
```

Then run this in Supabase SQL editor to create the table.

### Option B: Use localStorage Fallback (Faster for Development)

Modify [src/services/todoService.js](src/services/todoService.js) at the top to add:

```javascript
const USE_SUPABASE = true; // Set to false to use localStorage only

// LocalStorage fallback
const getLocalTodos = (userId) => {
  const todos = localStorage.getItem(`todos_${userId}`);
  return todos ? JSON.parse(todos) : [];
};

const saveLocalTodos = (userId, todos) => {
  localStorage.setItem(`todos_${userId}`, JSON.stringify(todos));
};
```

Then wrap all database calls with localStorage fallback:

```javascript
async createTodo(userId, todoData) {
  if (!USE_SUPABASE) {
    const todos = getLocalTodos(userId);
    const newTodo = { id: Date.now(), ...todoData, created_at: new Date().toISOString() };
    todos.push(newTodo);
    saveLocalTodos(userId, todos);
    return { success: true, data: newTodo };
  }
  // ... existing DB code
}
```

---

## CRITICAL FIX #4: Handle `avatars` Table

### Option A: Use Supabase Storage (Recommended)

Replace avatar table operations in [src/services/supabase.js](src/services/supabase.js):

```javascript
// OLD CODE (Line 215):
// .from('avatars')

// NEW CODE:
async uploadAvatar(userId, file) {
  const fileName = `avatars/${userId}-${Date.now()}.png`;
  
  const { data, error } = await supabase.storage
    .from('user-avatars')  // Create this bucket in Supabase Storage
    .upload(fileName, file);
  
  if (error) return { data: null, error };
  
  const { data: publicUrl } = supabase.storage
    .from('user-avatars')
    .getPublicUrl(fileName);
  
  // Save URL reference to user_profiles.avatar_url
  return { data: publicUrl, error: null };
}
```

### Option B: Remove Avatar S upport

Delete line 215 in [src/services/supabase.js](src/services/supabase.js) or comment it out:

```javascript
// Avatar upload removed - not implemented
// .from('avatars')
```

---

## MEDIUM FIX #5: Add PropTypes Validation

### File 1: [src/components/FeedbackPanel.jsx](src/components/FeedbackPanel.jsx)

Add at top:
```javascript
import PropTypes from 'prop-types';

// At bottom before export:
FeedbackPanel.propTypes = {
  feedback: PropTypes.string,
  transcript: PropTypes.array,
  onClose: PropTypes.func
};
```

### File 2: [src/components/HintsPanel.jsx](src/components/HintsPanel.jsx)

Add at top:
```javascript
import PropTypes from 'prop-types';

// At bottom before export:
HintsPanel.propTypes = {
  problem: PropTypes.object,
  transcript: PropTypes.array,
  code: PropTypes.string
};
```

### Install prop-types:
```bash
npm install prop-types
```

---

## VERIFICATION CHECKLIST

After applying fixes, verify:

- [ ] `leaderboardService.js` - No more `interview_results` references
- [ ] `supabaseAI.js` - No more `interview_results` references
- [ ] `supabase.js` - No more `interview_recordings` references
- [ ] `daily_todos` table created in Supabase OR fallback implemented
- [ ] `.from('avatars')` removed or replaced with Storage
- [ ] PropTypes imported (if added)
- [ ] Test todo creation (localStorage or DB)
- [ ] Test leaderboard loading
- [ ] No console errors on startup

---

## TESTING INSTRUCTIONS

```bash
# 1. Fix all database table names
# Apply fixes from sections 1-2 above

# 2. Create daily_todos table / implement fallback
# Apply fix from section 3

# 3. Handle avatars
# Apply fix from section 4

# 4. Start dev server
npm run dev

# 5. Test checklist:
# - [ ] Can sign up new user
# - [ ] Can login
# - [ ] Can create todo (should test localStorage or DB)
# - [ ] Can create streak
# - [ ] Can view dashboard (no leaderboard errors)
# - [ ] Can start interview
# - [ ] No console errors
```

---

## ESTIMATED TIME

| Fix | Time |
|-----|------|
| Fix interview_results → interviews | 5 min |
| Fix interview_recordings → recordings | 2 min |
| Create/implement daily_todos | 10 min |
| Handle avatars | 10 min |
| Add PropTypes | 5 min |
| Testing | 10 min |
| **TOTAL** | **42 min** |

---

## DEPLOYMENT AFTER FIXES

After all fixes applied:

1. ✅ No circular dependencies
2. ✅ All imports/exports verified
3. ✅ All contexts properly configured
4. ✅ All services exported correctly
5. ✅ Database table names fixed
6. ✅ Ready for production

**Status After Fixes**: ✅ PRODUCTION READY

---
