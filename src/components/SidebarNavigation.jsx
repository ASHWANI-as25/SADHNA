import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Flame, BarChart3, Zap, User, Settings, LogOut, Menu, X, ChevronRight, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

const SidebarNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Load display name and avatar from localStorage for OAuth users
  useEffect(() => {
    if (user?.id) {
      const oauthName = localStorage.getItem(`oauth_name_${user.id}`);
      const oauthEmail = localStorage.getItem(`oauth_email_${user.id}`);
      const saved = localStorage.getItem(`user_avatar_${user.id}`);
      
      setDisplayName(
        oauthName || 
        userProfile?.fullName || 
        oauthEmail?.split('@')[0] || 
        user?.email?.split('@')[0] || 
        'User'
      );
      
      if (saved) {
        setAvatarUrl(saved);
      }
    }
  }, [user?.id, userProfile]);

  // Fixed active state detection - dashboard only matches exact path
  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', color: 'text-blue-400' },
    { icon: Flame, label: 'My Streaks', path: '/dashboard/streaks', color: 'text-orange-400' },
    { icon: Calendar, label: 'Daily Todos', path: '/dashboard/todos', color: 'text-cyan-400' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics', color: 'text-cyan-400' },
    { icon: BookOpen, label: 'New Interview', path: '/dashboard/setup', color: 'text-green-400' },
    { icon: Zap, label: 'AI Insights', path: '/dashboard/feedback', color: 'text-yellow-400' },
    { icon: User, label: 'Profile', path: '/dashboard/profile', color: 'text-pink-400' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings', color: 'text-purple-400' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sidebar-toggle"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay on Mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header with Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-glow" />
            <img
              src="/sadhna-logo.png"
              alt="Logo"
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                animation: "ellipseSpin 7s linear infinite",
              }}
              onError={(e) => (e.target.style.display = 'none')}
            />
            <div className="logo-text">
              <p className="logo-brand">SADHNA</p>
              <p className="logo-subtitle">StreakMaster</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="sidebar-profile">
          <div className="profile-avatar">
            <div className="avatar-glow" />
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName}
                className="w-full h-full object-cover rounded-full"
                onError={() => setAvatarUrl(null)}
              />
            ) : (
              <div className="avatar-placeholder">
                {displayName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="profile-info">
            <p className="profile-name">{displayName}</p>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <div className="nav-item-content">
                <item.icon size={20} className={item.color} />
                <span>{item.label}</span>
                {isActive(item.path) && <ChevronRight size={18} className="nav-item-arrow" />}
              </div>
              {isActive(item.path) && <div className="nav-item-indicator" />}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarNavigation;
