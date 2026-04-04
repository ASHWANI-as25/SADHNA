import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Flame,
  BarChart3,
  Zap,
  Brain,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

/**
 * Premium Minimal Sidebar
 * Apple-inspired minimal navigation
 * - Clean icons only (no text)
 * - Soft hover effects
 * - Active state indicator
 */

const PremiumSidebar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(null);

  const navItems = [
    { id: 'dashboard', path: '/', icon: Flame, label: 'Dashboard' },
    { id: 'analytics', path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'insights', path: '/insights', icon: Zap, label: 'Insights' },
    { id: 'ai', path: '/ai', icon: Brain, label: 'AI' },
  ];

  const bottomItems = [
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      {/* Top Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`sidebar-item ${active ? 'active' : ''}`}
              onMouseEnter={() => setIsHovered(item.id)}
              onMouseLeave={() => setIsHovered(null)}
              title={item.label}
            >
              <Icon size={20} strokeWidth={1.5} />
              {isHovered === item.id && (
                <div className="sidebar-tooltip">{item.label}</div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="sidebar-bottom">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`sidebar-item ${active ? 'active' : ''}`}
              onMouseEnter={() => setIsHovered(item.id)}
              onMouseLeave={() => setIsHovered(null)}
              title={item.label}
            >
              <Icon size={20} strokeWidth={1.5} />
              {isHovered === item.id && (
                <div className="sidebar-tooltip">{item.label}</div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PremiumSidebar;
