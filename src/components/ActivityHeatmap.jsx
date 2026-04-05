import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ userId }) => {
  const [activityMap, setActivityMap] = useState({});
  const [tooltip, setTooltip] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    activeDays: 0,
    maxStreak: 0,
    currentStreak: 0,
  });

  // ─── LOAD DATA ───────────────────────────────────────────────
  const loadActivityData = () => {
    const map = {};

    // SOURCE 1: Interview history
    try {
      const interviews = JSON.parse(localStorage.getItem('app_interviews') || '[]');
      interviews
        .filter(i => i.user_id === userId)
        .forEach(i => {
          const date = (i.created_at || i.date || '').split('T')[0];
          if (date) map[date] = (map[date] || 0) + 1;
        });
    } catch (e) {
      console.warn('Error loading interviews:', e);
    }

    // SOURCE 2: Habit checkins
    try {
      const checkins = JSON.parse(localStorage.getItem('app_checkins') || '[]');
      checkins
        .filter(c => c.user_id === userId && c.status === 'completed')
        .forEach(c => {
          const date = c.checkin_date;
          if (date) map[date] = (map[date] || 0) + 1;
        });
    } catch (e) {
      console.warn('Error loading checkins:', e);
    }

    setActivityMap(map);

    // Calculate stats
    const total = Object.values(map).reduce((a, b) => a + b, 0);
    const activeDays = Object.keys(map).filter(d => map[d] > 0).length;

    // Calculate max streak
    const sortedDates = Object.keys(map)
      .filter(d => map[d] > 0)
      .sort();

    let maxStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    if (sortedDates.length > 0) maxStreak = Math.max(maxStreak, 1);

    // Current streak (from today backwards)
    let streak = 0;
    const checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (map[dateStr] > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStats({ total, activeDays, maxStreak, currentStreak: streak });
  };

  useEffect(() => {
    if (!userId) return;
    loadActivityData();

    // Refresh on focus
    const onFocus = () => loadActivityData();
    const onVisible = () => {
      if (!document.hidden) loadActivityData();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [userId]);

  // ─── BUILD GRID ───────────────────────────────────────────────
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from 52 weeks ago, adjusted to Monday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    const dayOfWeek = startDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToMonday);

    const weeks = [];
    const monthLabels = [];
    let currentDate = new Date(startDate);
    let lastMonth = -1;

    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const month = currentDate.getMonth();

        // Track month labels
        if (d === 0 && month !== lastMonth) {
          monthLabels.push({
            weekIndex: w,
            month: currentDate.toLocaleString('default', { month: 'short' }),
          });
          lastMonth = month;
        }

        week.push({
          date: dateStr,
          count: activityMap[dateStr] || 0,
          isFuture: currentDate > today,
          isToday: dateStr === today.toISOString().split('T')[0],
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }

    return { weeks, monthLabels };
  }, [activityMap]);

  // ─── COLOR FUNCTION ───────────────────────────────────────────
  const getColor = (count, isFuture) => {
    if (isFuture) return '#0f172a';
    if (count === 0) return '#1e293b';
    if (count === 1) return '#166534';
    if (count <= 3) return '#16a34a';
    if (count <= 5) return '#22c55e';
    return '#4ade80';
  };

  const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

  if (!userId) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mt-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            📅 Activity Calendar
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            <span className="text-green-400 font-bold">{stats.total}</span> activities in the past one year
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Total active days</p>
            <p className="text-white font-bold text-lg">{stats.activeDays}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-gray-400 text-xs">Max streak</p>
            <p className="text-white font-bold text-lg">{stats.maxStreak}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-gray-400 text-xs">Current streak</p>
            <p className="text-green-400 font-bold text-lg">{stats.currentStreak} 🔥</p>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-0 min-w-max">
          {/* Day labels column */}
          <div className="flex flex-col gap-[2px] mr-1 mt-5">
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="h-[10px] text-[9px] text-gray-500 leading-[10px] w-6 text-right pr-1">
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="relative">
            {/* Month labels */}
            <div className="flex mb-1 h-4">
              {monthLabels.map((ml, i) => (
                <div
                  key={i}
                  className="absolute text-[10px] text-gray-400"
                  style={{ left: `${ml.weekIndex * 12}px` }}
                >
                  {ml.month}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[2px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className="relative group"
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          date: day.date,
                          count: day.count,
                          x: rect.left,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '2px',
                          backgroundColor: getColor(day.count, day.isFuture),
                          outline: day.isToday ? '1px solid #22d3ee' : 'none',
                          outlineOffset: '1px',
                          transition: 'transform 0.1s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-slate-800 border border-slate-600 
                     text-white text-xs px-3 py-1.5 rounded-lg shadow-xl"
          style={{ top: tooltip.y - 40, left: tooltip.x - 40 }}
        >
          <span className="font-bold text-green-400">{tooltip.count} activities</span>
          <span className="text-gray-400 ml-1">on {tooltip.date}</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 justify-end">
        <span className="text-xs text-gray-500">Less</span>
        {['#1e293b', '#166534', '#16a34a', '#22c55e', '#4ade80'].map((color, i) => (
          <div
            key={i}
            style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: color }}
          />
        ))}
        <span className="text-xs text-gray-500">More</span>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;
