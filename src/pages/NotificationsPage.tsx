import React, { useState } from 'react';
import { Bell, Sparkles, CheckCircle2, Award, Zap, Code2, AlertTriangle, ArrowRight } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'achievement' | 'tip' | 'reminder' | 'system';
}

interface NotificationsPageProps {
  onNavigateToStudio: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigateToStudio }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: '7 Day Coding Streak Achieved!',
      desc: 'You have written code consistently for 7 straight days. Keep the momentum going!',
      time: '15m ago',
      unread: true,
      type: 'achievement'
    },
    {
      id: 'notif-2',
      title: 'Level 2 Indentation Mastered',
      desc: 'SmartLearn noticed you successfully corrected 3 Python indentation errors without spoiler hints.',
      time: '1h ago',
      unread: true,
      type: 'tip'
    },
    {
      id: 'notif-3',
      title: 'New Language Auto-Detection Engine Active',
      desc: 'Real-time multi-syntax detection for Rust and Kotlin is now enabled in Studio.',
      time: '3h ago',
      unread: true,
      type: 'system'
    },
    {
      id: 'notif-4',
      title: 'Mistake Vault Synced',
      desc: '16 common pattern benchmarks were synced to your local learner profile.',
      time: 'Yesterday',
      unread: false,
      type: 'reminder'
    }
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="seto-notifications-container">
      <div className="seto-notif-header">
        <div>
          <h2 className="seto-notif-title">Notifications & Insights</h2>
          <p className="seto-notif-sub">Stay up to date with your coding achievements and system updates.</p>
        </div>
        <button className="seto-mark-read-btn" onClick={markAllRead}>
          Mark all as read
        </button>
      </div>

      <div className="seto-notif-list">
        {notifications.map((n) => (
          <div key={n.id} className={`seto-notif-card ${n.unread ? 'unread' : ''}`}>
            <div className="seto-notif-icon-box">
              {n.type === 'achievement' && <Award size={20} className="text-amber" />}
              {n.type === 'tip' && <Sparkles size={20} className="text-purple" />}
              {n.type === 'system' && <Zap size={20} className="text-blue" />}
              {n.type === 'reminder' && <CheckCircle2 size={20} className="text-emerald" />}
            </div>

            <div className="seto-notif-content">
              <div className="seto-notif-title-row">
                <h4 className="seto-notif-item-title">{n.title}</h4>
                <span className="seto-notif-time">{n.time}</span>
              </div>
              <p className="seto-notif-desc">{n.desc}</p>
            </div>

            {n.unread && <span className="seto-unread-dot" />}
          </div>
        ))}
      </div>
    </div>
  );
};
