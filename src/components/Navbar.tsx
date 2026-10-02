import React from 'react';
import { 
  Code2, 
  Terminal, 
  LayoutDashboard, 
  History, 
  User, 
  Settings, 
  Sun, 
  Moon, 
  Flame, 
  Zap, 
  Sparkles,
  LogIn
} from 'lucide-react';
import { AuthUser, UserStats } from '../types';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  user: AuthUser;
  stats: UserStats;
  onOpenAuth: () => void;
  isCompiling?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  theme,
  onToggleTheme,
  user,
  stats,
  onOpenAuth,
  isCompiling
}) => {
  const navLinks = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'compiler', label: 'Compiler', icon: Terminal, pulse: isCompiling },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'errors', label: 'Mistake Vault', icon: History, count: stats.totalMistakesLogged },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="brand-wrapper" onClick={() => onNavigate('home')} role="button" tabIndex={0}>
          <div className="logo-glow-icon">
            <Code2 size={24} className="logo-icon-svg" />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">SmartLearn</span>
            <span className="brand-sub">Compiler</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-menu" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-tab ${isActive ? 'nav-tab-active' : ''}`}
                title={item.label}
              >
                <Icon size={16} className={`tab-icon ${item.pulse ? 'tab-icon-pulse' : ''}`} />
                <span className="tab-label">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="tab-counter-badge">{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Gamification Badges, Theme, and User */}
        <div className="nav-actions">
          {/* Coding Streak */}
          <div className="streak-pill" title={`${stats.codingStreak} Day Coding Streak!`}>
            <Flame size={16} className="streak-flame-icon" />
            <span className="streak-text">{stats.codingStreak}d</span>
          </div>

          {/* Learning Score */}
          <div className="score-pill" title="Learning Score: Earn points by fixing mistakes independently!">
            <Zap size={14} className="score-zap-icon" />
            <span className="score-text">{stats.learningScore}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="icon-action-btn theme-toggle"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Profile / Auth */}
          <button
            onClick={onOpenAuth}
            className="user-profile-button"
            title={`Signed in as ${user.name}`}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="user-avatar-img" />
            ) : (
              <div className="user-avatar-fallback">
                <LogIn size={14} />
              </div>
            )}
            <span className="user-display-name">{user.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 100;
          height: var(--navbar-height);
          background: rgba(11, 17, 32, 0.85);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-bottom: 1px solid var(--border-subtle);
          transition: background 0.3s ease;
        }
        [data-theme='light'] .navbar-container {
          background: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        .navbar-inner {
          max-width: 1600px;
          height: 100%;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .brand-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }
        .logo-glow-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(59, 130, 246, 0.5);
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .brand-wrapper:hover .logo-glow-icon {
          transform: rotate(5deg) scale(1.05);
        }
        .logo-icon-svg {
          color: #ffffff;
        }
        .brand-text-block {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }
        .brand-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #60A5FA 0%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .brand-sub {
          font-size: 0.725rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.6);
          padding: 4px 6px;
          border-radius: 9999px;
          border: 1px solid var(--border-subtle);
        }
        [data-theme='light'] .nav-menu {
          background: rgba(241, 245, 249, 0.8);
        }
        .nav-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 9999px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-tab:hover {
          color: var(--text-primary);
          background: var(--blue-subtle);
        }
        .nav-tab-active {
          background: var(--blue-primary);
          color: #ffffff !important;
          box-shadow: 0 2px 10px rgba(59, 130, 246, 0.4);
        }
        .tab-icon-pulse {
          animation: pulseGlow 1.5s infinite;
        }
        .tab-counter-badge {
          background: rgba(239, 68, 68, 0.9);
          color: white;
          font-size: 0.68rem;
          padding: 1px 6px;
          border-radius: 9999px;
          font-weight: 700;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .streak-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.28);
          color: #F59E0B;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .streak-flame-icon {
          color: #F59E0B;
          animation: gentleFloat 3s ease-in-out infinite;
        }
        .score-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.28);
          color: var(--emerald-success);
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .icon-action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .icon-action-btn:hover {
          color: var(--blue-primary);
          border-color: var(--blue-primary);
          transform: rotate(15deg);
        }
        .user-profile-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px 4px 4px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: 9999px;
          cursor: pointer;
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .user-profile-button:hover {
          border-color: var(--blue-primary);
        }
        .user-avatar-img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-avatar-fallback {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--blue-subtle);
          color: var(--blue-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 900px) {
          .nav-tab .tab-label {
            display: none;
          }
          .score-pill {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
