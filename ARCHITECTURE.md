# 🏗️ SADHNA Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SADHNA Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │              Frontend (React 19)                 │      │
│  │                                                  │      │
│  │  ┌────────────────────────────────────────┐     │      │
│  │  │  Layout.jsx                            │     │      │
│  │  │  └─ Navigation Menu                    │     │      │
│  │  │     ├─ Dashboard 🏠                    │     │      │
│  │  │     ├─ Daily Todos 📅 ← NEW!         │     │      │
│  │  │     ├─ My Streaks 🔥                 │     │      │
│  │  │     └─ Other Pages                    │     │      │
│  │  └────────────────────────────────────────┘     │      │
│  │                                                  │      │
│  │  ┌────────────────────────────────────────┐     │      │
│  │  │  DailyTodos.jsx ← NEW!                 │     │      │
│  │  │  ├─ Create Modal                       │     │      │
│  │  │  ├─ Todo List Display                  │     │      │
│  │  │  ├─ Statistics Dashboard               │     │      │
│  │  │  └─ View Mode Selector                 │     │      │
│  │  └────────────────────────────────────────┘     │      │
│  │                                                  │      │
│  │  ┌────────────────────────────────────────┐     │      │
│  │  │  Streaks.jsx ← UPDATED                 │     │      │
│  │  │  ├─ URL Validation (COMPULSORY)        │     │      │
│  │  │  ├─ Create Modal                       │     │      │
│  │  │  └─ Streak List                        │     │      │
│  │  └────────────────────────────────────────┘     │      │
│  │                                                  │      │
│  └──────────────────────────────────────────────────┘      │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    (API Calls via Services)
                           │
    ┌──────────────────────────────────────┐                 
    │                                      │                 
    ▼                                      ▼                 
┌─────────────────────────────────────────────────────┐     
│         Backend Services (Business Logic)           │     
├─────────────────────────────────────────────────────┤     
│                                                      │     
│  ┌────────────────────────────────────────────┐    │     
│  │  todoService.js ← NEW!                     │    │     
│  │  ├─ createTodo()                           │    │     
│  │  ├─ getTodosByDate()                       │    │     
│  │  ├─ toggleTodo()                           │    │     
│  │  ├─ deleteTodo()                           │    │     
│  │  ├─ getTodoStats()                         │    │     
│  │  ├─ getWeeklyTodos()                       │    │     
│  │  └─ getMonthlyTodos()                      │    │     
│  └────────────────────────────────────────────┘    │     
│                                                      │     
│  ┌────────────────────────────────────────────┐    │     
│  │  streakManagementService.js                │    │     
│  │  ├─ createStreak()                         │    │     
│  │  ├─ getUserStreaks()                       │    │     
│  │  ├─ updateStreakStats()                    │    │     
│  │  └─ getStreakStats()                       │    │     
│  └────────────────────────────────────────────┘    │     
│                                                      │     
└──────────────────────────────────────────────────────┘     
                          │                                   
                    (Supabase SDK)                           
                          │                                   
    ┌─────────────────────────────────────┐                 
    │                                     │                 
    ▼                                     ▼                 
┌──────────────────────────────────────────────────┐        
│         Database (PostgreSQL + Supabase)         │        
├──────────────────────────────────────────────────┤        
│                                                  │        
│  ┌────────────────────────────────────────┐     │        
│  │  auth.users (Supabase Auth)            │     │        
│  │  └─ User authentication & management   │     │        
│  └────────────────────────────────────────┘     │        
│                                                  │        
│  ┌────────────────────────────────────────┐     │        
│  │  streaks Table                         │     │        
│  │  ├─ id, user_id, title,                │     │        
│  │  ├─ category, url, current_streak      │     │        
│  │  └─ best_streak, total_checkins        │     │        
│  └────────────────────────────────────────┘     │        
│                                                  │        
│  ┌────────────────────────────────────────┐     │        
│  │  checkins Table                        │     │        
│  │  ├─ id, streak_id, user_id             │     │        
│  │  ├─ checkin_date, status, notes        │     │        
│  │  └─ UNIQUE(streak_id, checkin_date)    │     │        
│  └────────────────────────────────────────┘     │        
│                                                  │        
│  ┌────────────────────────────────────────┐     │        
│  │  daily_todos Table ← NEW!              │     │        
│  │  ├─ id, user_id, title,                │     │        
│  │  ├─ priority, due_date, is_completed   │     │        
│  │  ├─ related_streak_id (foreign key)    │     │        
│  │  └─ RLS Policies (User isolation)      │     │        
│  └────────────────────────────────────────┘     │        
│                                                  │        
│  ┌────────────────────────────────────────┐     │        
│  │  milestones Table                      │     │        
│  │  ├─ id, streak_id, user_id             │     │        
│  │  ├─ level, days_required, achieved_    │     │        
│  │  └─ date, is_achieved, badge_type      │     │        
│  └────────────────────────────────────────┘     │        
│                                                  │        
│  Security: ✅ RLS Policies on ALL tables       │        
│  Indexes: ✅ Optimized for common queries      │        
│                                                  │        
└──────────────────────────────────────────────────┘        
```

---

## Data Flow Diagram

### Creating a Daily Todo

```
User Clicks "Add Todo"
         │
         ▼
    Modal Opens
         │
         ▼
User Fills Form
├─ Title (required)
├─ Description (optional)
├─ Priority
├─ Link Streak (optional)
└─ Due Date
         │
         ▼
User Clicks "✓ Add Todo"
         │
         ▼
Validation Check
├─ Title not empty? ✅
└─ Date valid? ✅
         │
         ▼
todoService.createTodo()
         │
         ▼
Supabase Insert Query
         │
         ▼
daily_todos Table
├─ New Row Inserted
├─ user_id = current user
├─ created_at = now()
└─ is_completed = false
         │
         ▼
Return Success
         │
         ▼
Reload Todo List
├─ Update Statistics
├─ Show New Todo
└─ Close Modal
         │
         ▼
Screen Updates
├─ New todo visible
├─ Stats refresh
└─ Animations play
```

---

## Marking a Todo Complete

```
User Clicks Circle Icon
         │
         ▼
handleToggleTodo()
         │
         ▼
todoService.toggleTodo(todoId)
         │
         ▼
Database Query
├─ Get current is_completed
├─ Toggle value
├─ Set completed_at = now()
└─ Update record
         │
         ▼
Return Updated Todo
         │
         ▼
Component State Update
├─ Toggle icon
├─ Add strikethrough
└─ Update statistics
         │
         ▼
Animation Plays
├─ Icon changes (✅)
├─ Text fades
└─ Count updates
```

---

## Statistical Calculation

```
When User Views Daily Todos
         │
         ▼
loadAllData()
         │
    ┌────┴────┬────┬────┐
    │          │    │    │
    ▼          ▼    ▼    ▼
getTodos  getStreaks  getStats  Render
    │          │         │        │
    ▼          ▼         ▼        ▼
Query1    Query2     Query3    Display
(Parallel Execution)

getTodoStats(userId, startDate, endDate)
    │
    ├─ Fetch all todos in range
    │
    ├─ Calculate:
    │  ├─ total = todos.length
    │  ├─ completed = todos.filter(t => t.is_completed).length
    │  ├─ pending = total - completed
    │  └─ completionRate = (completed / total) * 100
    │
    ▼
Return Stats Object
├─ total: 25
├─ completed: 15
├─ pending: 10
└─ completionRate: 60
    │
    ▼
Display in Cards
┌─────────────────┐
│ 📋 25 Total     │
│ ✅ 15 Completed │
│ ⏳ 10 Pending   │
│ 📊 60% Rate     │
└─────────────────┘
```

---

## Database Relationships

```
┌──────────────────┐
│   auth.users     │
│  (ID, Email)     │
└────────┬─────────┘
         │ 1:N
         │
    ┌────┴─────┐
    │           │
    ▼           ▼
┌──────────┐  ┌──────────────┐
│ streaks  │  │ daily_todos  │
│          │  │              │
│ id       │  │ id           │
│ user_id  │  │ user_id      │
│ title    │  │ title        │
│ url ⭐   │  │ priority     │
│ category │  │ due_date     │
└────┬─────┘  │ is_completed │
     │ 1:N    │ related_     │
     │        │ streak_id ◄──┼─ Links back to streaks
     │        │              │
     ▼        └──────────────┘
┌──────────┐
│ checkins │
│          │
│ id       │
│ streak_id│
│ user_id  │
│ date     │
└──────────┘
```

---

## Component Hierarchy

```
App.jsx
  │
  ├─ ProtectedRoute
  │   │
  │   └─ Layout.jsx
  │       │
  │       ├─ Sidebar Navigation
  │       │   ├─ Dashboard Link
  │       │   ├─ Daily Todos Link ← NEW!
  │       │   ├─ My Streaks Link
  │       │   └─ More...
  │       │
  │       └─ <Outlet />
  │           │
  │           ├─ Dashboard (index)
  │           │
  │           ├─ DailyTodos.jsx ← NEW!
  │           │   ├─ Header
  │           │   ├─ Statistics Cards
  │           │   ├─ View Mode Selector
  │           │   ├─ Todo List
  │           │   └─ Create Modal
  │           │
  │           ├─ Streaks.jsx
  │           │   ├─ StreakCard (repeated)
  │           │   └─ Create Streak Modal
  │           │
  │           └─ Other Pages...
  │
  └─ CosmicBackground
```

---

## State Management Flow

### DailyTodos Component State

```
DailyTodos Component
├─ todos: [] (all todos)
├─ streaks: [] (for linking)
├─ loading: boolean
├─ selectedDate: "2026-04-02"
├─ stats: { total, completed, pending, rate }
├─ showCreateModal: boolean
├─ newTodoData: {
│  ├─ title: string
│  ├─ description: string
│  ├─ related_streak_id: uuid | null
│  └─ priority: string
├─ viewMode: "today" | "weekly" | "monthly"
│
└─ Effects:
   ├─ On mount: loadAllData()
   ├─ On selectedDate change: loadAllData()
   ├─ On viewMode change: loadAllData()
   │
   └─ Functions:
      ├─ handleCreateTodo() → createTodo()
      ├─ handleToggleTodo() → toggleTodo()
      ├─ handleDeleteTodo() → deleteTodo()
      └─ loadAllData() → Parallel queries
```

---

## Performance Optimizations

```
Frontend Performance
├─ Parallel Data Fetching
│  └─ Promise.all([getTodos, getStreaks, getStats])
│     └─ 3 queries in parallel = ~300ms (vs 900ms sequential)
│
├─ Memoization
│  ├─ useCallback → Event handlers
│  └─ useMemo → Color calculations
│
├─ Animations
│  └─ Framer Motion 60 FPS
│
└─ CSS Optimization
   └─ containment: layout style paint

Database Performance
├─ Indexes
│  ├─ idx_daily_todos_user_id
│  ├─ idx_daily_todos_due_date
│  └─ idx_daily_todos_is_completed
│
├─ Query Optimization
│  ├─ Use date range queries
│  ├─ Filter early in database
│  └─ Avoid full table scans
│
└─ Connection Pooling
   └─ Managed by Supabase
```

---

## Security Architecture

```
Security Layers
│
├─ Frontend Validation
│  ├─ URL format check
│  ├─ Required field validation
│  └─ User feedback on errors
│
├─ Row Level Security (RLS)
│  ├─ daily_todos table
│  │  ├─ SELECT: users see own todos only
│  │  ├─ INSERT: users create own todos only
│  │  ├─ UPDATE: users update own todos only
│  │  └─ DELETE: users delete own todos only
│  │
│  ├─ streaks table (same pattern)
│  └─ checkins table (same pattern)
│
├─ Authentication
│  ├─ Supabase Auth
│  ├─ JWT Tokens
│  └─ Session Management
│
└─ Database Constraints
   ├─ Foreign keys
   ├─ UNIQUE constraints
   └─ NOT NULL constraints
```

---

## Deployment Architecture

```
GitHub Repository
    │
    ▼
CI/CD Pipeline
├─ Build: npm run build
├─ Test: (optional)
└─ Deploy: Vercel/Netlify
    │
    ▼
Vercel/Netlify
├─ Static Site (React build)
├─ API Routes → Supabase
└─ Environment Variables
    ├─ VITE_SUPABASE_URL
    ├─ VITE_SUPABASE_ANON_KEY
    └─ VITE_GROQ_API_KEY
    │
    ▼
Supabase (Backend)
├─ PostgreSQL Database
├─ Auth Service
├─ Realtime Updates
└─ Storage (if needed)
```

---

## Quick Reference

### New Files
- `src/services/todoService.js` - 180+ lines
- `src/pages/DailyTodos.jsx` - 450+ lines
- `src/styles/daily-todos.css` - 200+ lines

### Updated Files
- `src/pages/Streaks.jsx` - URL validation
- `src/components/Layout.jsx` - Navigation
- `src/App.jsx` - Routes
- `SUPABASE_SCHEMA.sql` - Database

### Routes
- `/dashboard/todos` - Daily Todos page
- `/dashboard/streaks` - Streaks page
- `/dashboard` - Dashboard

### Services
- `todoService` - CRUD + Statistics
- `streakManagementService` - Streak operations
- `habitPredictionService` - AI insights

---

**Architecture Version**: 1.0.0  
**Last Updated**: April 2, 2026  
**Status**: ✅ Production Ready
