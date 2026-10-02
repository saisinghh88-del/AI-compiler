import React from 'react';
import { 
  Code2, 
  History, 
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { SetoLogoIcon } from './SetoIcons';
import { AuthUser } from '../types';

interface SetoLeftSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  user: AuthUser;
  onLogout?: () => void;
}

export const SetoLeftSidebar: React.FC<SetoLeftSidebarProps> = ({
  activePage,
  onNavigate,
  user,
  onLogout
}) => {
  const navItems = [
    { id: 'compiler', label: 'Code Compiler', icon: Code2 },
    { id: 'errors', label: 'Mistake Vault', icon: History },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="seto-left-sidebar">
      {/* Brand Header */}
      <div className="seto-brand-row" onClick={() => onNavigate('compiler')}>
        <div className="seto-brand-logo-box">
          <SetoLogoIcon size={24} className="seto-brand-icon" />
        </div>
        <span className="seto-brand-title">SETO</span>
      </div>

      {/* Main Navigation Items - Clean & Minimal */}
      <nav className="seto-nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`seto-nav-item ${isActive ? 'seto-nav-active' : ''}`}
            >
              <div className="seto-nav-item-left">
                <Icon size={18} className="seto-nav-icon" />
                <span className="seto-nav-label">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="seto-sidebar-spacer" />

      {/* User Profile Card with Sign Out option */}
      <div className="seto-profile-card">
        <div className="seto-profile-top-row">
          <div className="seto-avatar-container">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'} 
              alt={user.name || 'Allison Lipshutz'}
              className="seto-avatar-img"
            />
            <span className="seto-online-dot" />
          </div>

          <div className="seto-profile-info">
            <span className="seto-profile-name">{user.name || 'Allison Lipshutz'}</span>
            <span className="seto-profile-handle">
              {user.email ? `@${user.email.split('@')[0]}` : '@allison_4_li'}
            </span>
          </div>

          {onLogout && (
            <button 
              type="button" 
              onClick={onLogout} 
              className="seto-logout-icon-btn"
              title="Sign out of account"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
