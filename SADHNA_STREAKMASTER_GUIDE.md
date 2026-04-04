# SADHNA - StreakMaster Implementation Guide

## 📋 Overview

SADHNA is an advanced habit tracking and streak management system that provides users with a comprehensive way to build consistent habits, track progress, and achieve meaningful milestones through AI-powered insights and automation.

## 🏗️ Architecture

### Database Schema

#### Streaks Table
```sql
streaks (
  id UUID PRIMARY KEY,
  user_id UUID -> auth.users,
  title VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  url VARCHAR(500),
  current_streak INTEGER,
  best_streak INTEGER,
  total_checkins INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Purpose**: Stores individual habit streaks for each user

**Key Fields**:
- `current_streak`: Active consecutive days
- `best_streak`: Historical best achievement
- `category`: Filter by habit type (Health, Learning, Work, Personal, General)
- `is_active`: Toggle streak status

#### Checkins Table
```sql
checkins (
  id UUID PRIMARY KEY,
  streak_id UUID -> streaks,
  user_id UUID -> auth.users,
  checkin_date DATE,
  status VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(streak_id, checkin_date)
)
```

**Purpose**: Records daily check-ins for each streak

**Key Fields**:
- `checkin_date`: Date of check-in
- `status`: 'completed' or 'missed'
- `notes`: Optional user notes
- **Constraint**: One check-in per streak per day

#### Milestones Table
```sql
milestones (
  id UUID PRIMARY KEY,
  streak_id UUID -> streaks,
  user_id UUID -> auth.users,
  level INTEGER,
  days_required INTEGER,
  achieved_date TIMESTAMP NULL,
  is_achieved BOOLEAN,
  badge_type VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Purpose**: Tracks milestone achievements

**Milestone Levels**:
- Level 1 (🌱): 7 days - "Strong Start"
- Level 2 (🔥): 30 days - "One Month"
- Level 3 (💯): 100 days - "Century"
- Level 4 (👑): 365 days - "Annual Hero"

---

## 🔧 Services

### 1. streakManagementService.js

**Purpose**: CRUD operations for streaks

**Key Functions**:

```javascript
// Create a new streak
await streakManagementService.createStreak(userId, {
  title: "Morning Exercise",
  description: "30 min daily workout",
  category: "Health"
})

// Get all user streaks
const streaks = await streakManagementService.getUserStreaks(userId)

// Get active streaks only
const active = await streakManagementService.getActiveStreaks(userId)

// Get streaks by category
const health = await streakManagementService.getStreaksByCategory(userId, "Health")

// Update streak info
await streakManagementService.updateStreak(streakId, {
  title: "Updated Title"
})

// Update streak statistics
await streakManagementService.updateStreakStats(streakId, currentStreak, bestStreak, totalCheckins)

// Toggle streak active/inactive
await streakManagementService.toggleStreakStatus(streakId, true/false)

// Get comprehensive statistics
const stats = await streakManagementService.getStreakStats(userId)
// Returns: {
//   totalStreaks: 5,
//   activeStreaks: 3,
//   totalCheckins: 150,
//   averageStreak: 25,
//   bestStreak: 365,
//   streaksByCategory: { Health: 2, Learning: 1, ... }
// }

// Delete a streak
await streakManagementService.deleteStreak(streakId)
```

---

### 2. checkinService.js

**Purpose**: Daily check-in operations and tracking

**Key Functions**:

```javascript
// Add a daily check-in
await checkinService.addCheckin(streakId, userId, "2024-01-15", "completed", "Great workout!")

// Get all check-ins for a streak
const checkins = await checkinService.getStreakCheckins(streakId)

// Get check-ins for date range
const weekCheckins = await checkinService.getCheckinsByDateRange(
  streakId, 
  "2024-01-01", 
  "2024-01-31"
)

// Check if user checked in today
const hasCheckedin = await checkinService.hasCheckedInToday(streakId, userId)

// Get consecutive days count
const { consecutiveDays } = await checkinService.getConsecutiveDays(streakId)

// Get total check-ins count
const { count } = await checkinService.getTotalCheckins(streakId)

// Get check-in statistics
const { stats } = await checkinService.getCheckinStats(streakId)
// Returns: {
//   total: 45,
//   completed: 42,
//   missed: 3,
//   completionRate: 93
// }

// Update check-in
await checkinService.updateCheckin(checkinId, { notes: "Updated notes" })

// Delete check-in
await checkinService.deleteCheckin(checkinId)
```

---

### 3. milestoneService.js

**Purpose**: Milestone tracking and automation

**Key Functions**:

```javascript
// Initialize milestones for new streak (auto-called)
await milestoneService.initializeMilestones(streakId, userId)

// Get all milestones for a streak
const milestones = await milestoneService.getStreakMilestones(streakId)

// Get achieved milestones only
const achieved = await milestoneService.getAchievedMilestones(streakId)

// Get next milestone target
const next = await milestoneService.getNextMilestone(streakId, currentStreakDays)
// Returns: {
//   id, level, days_required, badge_type,
//   daysRemaining: 15,
//   progress: 60
// }

// Auto-check and award milestones
const { newlyAwarded } = await milestoneService.checkAndAwardMilestones(
  streakId, 
  currentStreakDays
)

// Get user's total milestone stats
const { stats: milestoneStats } = await milestoneService.getUserMilestoneStats(userId)
// Returns: {
//   total: 20,
//   achieved: 8,
//   percentage: 40
// }

// Get milestone badge info
const info = milestoneService.getMilestoneInfo(2) // Level 2
// Returns: { level: 2, days: 30, badge: "One Month", emoji: "🔥" }

// Mark milestone as achieved
await milestoneService.achieveMilestone(milestoneId)
```

---

### 4. habitPredictionService.js

**Purpose**: AI-powered habit analytics and personalized recommendations

**Key Functions**:

```javascript
// Predict habit success probability
const prediction = await habitPredictionService.predictHabitSuccess(streakId, userId)
// Returns: {
//   successScore: 75,            // 0-100
//   riskLevel: "Low",            // High/Medium/Low
//   riskReason: "Great performance!",
//   completionRate: 92,
//   recentCompletionRate: 95,
//   currentStreak: 25,
//   isImproving: true,
//   recommendations: ["Keep it up!", "..."],
//   analyzedAt: "2024-01-15T10:30:00Z"
// }

// Get personalized suggestions for all streaks
const suggestions = await habitPredictionService.getPersonalizedSuggestions(userId)
// Returns array of: {
//   streakId, streakTitle,
//   type: "celebrate|motivate|warning|start",
//   message: "...",
//   priority: "high|medium|low"
// }

// Analyze performance trends
const trends = await habitPredictionService.getPerformanceTrends(streakId)
// Returns: {
//   trend: "improving|stable|declining",
//   weeklyData: [{ week, completionRate, checkins }, ...],
//   totalWeeks: 4,
//   averageCompletionRate: 88
// }

// Get smart reminders
const reminders = await habitPredictionService.getSmartReminders(userId)
// Returns array of: {
//   streakId, streakTitle,
//   urgency: "high|medium",
//   message: "Don't forget to check in!"
// }
```

---

## 🎨 UI Components

### StreakCard Component

**Location**: `src/components/StreakCard.jsx`

**Features**:
- Displays individual streak with current, best, and total check-ins
- Quick check-in button
- Health assessment with success score
- Next milestone progress tracker
- Expandable detailed view
- Edit and delete options
- Real-time AI insights

**Props**:
```jsx
<StreakCard 
  streak={streakObject}
  userId={userId}
  onUpdate={reloadFunction}
/>
```

**Styling**: `src/styles/streaks.css`

---

### Streaks Page

**Location**: `src/pages/Streaks.jsx`

**Features**:
- Dashboard with 5 stat cards (Total, Active, Check-ins, Average, Best)
- Smart suggestions panel
- Filter: All / Active / Completed
- Streak grid display
- Create new streak modal
- Category-based organization

**Routes**:
```
/dashboard/streaks
```

---

## 🔗 Integration Points

### Dashboard Integration

The Dashboard (`src/pages/Dashboard.jsx`) displays:
- Streak widget in stats section
- Recent streaks overview
- Quick access to Streaks page

### Layout Navigation

Added "My Streaks" menu item with Flame icon in sidebar navigation

---

## 📊 Algorithm Details

### Streak Calculation

**Algorithm**: Consecutive day detection

```
1. Fetch all check-ins for streak (sorted by date DESC)
2. Start with current date at 00:00:00
3. For each check-in:
   - Calculate days difference from current date
   - If difference == consecutiveDays (0, 1, 2, ...), increment
   - If difference > consecutiveDays, break (streak broken)
4. Return final count
```

**Result**: Handles gaps that break streaks correctly

### Success Prediction Score (0-100)

```
Score = 
  (Historical Completion % × 0.30) +
  (Recent Completion % × 0.30) +
  (Current Streak × 5, capped at 100 × 0.20) +
  (Trend Bonus × 0.20)

Risk Assessment:
- Score ≥ 80: LOW risk (Green)
- Score 60-79: MEDIUM risk (Yellow)
- Score < 60: HIGH risk (Red)
```

### Milestone Auto-Award

```
When check-in added:
1. Calculate consecutive days
2. Fetch unachieved milestones
3. For each milestone:
   - If currentDays ≥ daysRequired:
     - Mark as achieved
     - Set achieved_date
     - Add to notification queue
4. Return newlyAwarded array
```

---

## 🚀 Usage Flow

### Creating a New Streak

```javascript
// 1. User clicks "New Streak" button
// 2. Modal opens with form

// 3. Data submitted
const result = await streakManagementService.createStreak(userId, {
  title: "Morning Meditation",
  description: "10 minutes daily",
  category: "Health"
})

// 4. System auto-initializes milestones
if (result.success) {
  await milestoneService.initializeMilestones(result.data.id, userId)
}

// 5. Page refreshes, new streak appears
```

### Daily Check-In Flow

```javascript
// 1. User clicks "Check In Today" button
// 2. System adds check-in record
const today = new Date().toISOString().split('T')[0]
await checkinService.addCheckin(streakId, userId, today, "completed")

// 3. Update streak counters
const { consecutiveDays } = await checkinService.getConsecutiveDays(streakId)
await streakManagementService.updateStreakStats(
  streakId, 
  consecutiveDays,
  Math.max(currentStreak, bestStreak),
  totalCheckins + 1
)

// 4. Check for milestone achievements
const { newlyAwarded } = await milestoneService.checkAndAwardMilestones(
  streakId, 
  consecutiveDays
)

// 5. Show celebration/notification if milestones reached
if (newlyAwarded.length > 0) {
  // Show achievement notification
}
```

### Viewing Insights

```javascript
// 1. User expands StreakCard details

// 2. System fetches:
const prediction = await habitPredictionService.predictHabitSuccess(streakId, userId)
const trends = await habitPredictionService.getPerformanceTrends(streakId)
const nextMilestone = await milestoneService.getNextMilestone(streakId, currentDays)

// 3. Display insights in expandable section
```

---

## 🔐 Security

All operations use Supabase RLS (Row Level Security):

```sql
-- Users can ONLY see their own data
CREATE POLICY "Users can view their own streaks"
  ON streaks FOR SELECT
  USING (auth.uid() = user_id);
```

**Implementation**: Every query already includes user_id filtering via context

---

## ⚡ Performance Optimizations

1. **Indexes**: Created on frequently queried columns
   - `idx_streaks_user_id`
   - `idx_checkins_streak_id`
   - `idx_milestones_user_id`

2. **Unique Constraints**: One check-in per streak per day

3. **Caching**: Consider Redis for:
   - Consecutive day calculations
   - Success scores
   - Next milestone info

---

## 📈 Future Enhancements

1. **Habit Stacking**: Link streaks to create compound habits
2. **Social Features**: Share streaks, compare progress
3. **Notifications**: Push notifications for check-ins and milestones
4. **Smart Suggestions**: ML-based optimal check-in times
5. **Export Reports**: PDF/CSV analytics reports
6. **Integrations**: Sync with health apps (Apple Health, Google Fit)
7. **Accountability Partners**: Pair users with similar habits
8. **Habit Templates**: Pre-built habit recommendations

---

## 🐛 Troubleshooting

### Issue: Check-ins not updating streak counters

**Solution**: Ensure `updateStreakStats` is called after each check-in

### Issue: Milestones not auto-awarding

**Solution**: Verify `checkAndAwardMilestones` is called in check-in flow

### Issue: Database permission errors

**Solution**: Check Supabase RLS policies are in place and user_id is included

### Issue: Slow performance with many streaks

**Solution**: Add pagination to streak list queries, implement caching

---

## 📞 Support

For issues or questions:
1. Check database RLS policies in Supabase console
2. Verify user_id is properly passed to services
3. Check browser console for API errors
4. Review Supabase logs for database errors

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**Status**: ✅ Production Ready
