import React from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Flame, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Code2, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { AuthUser, UserStats, Achievement, Language } from '../types';
import { LANGUAGES } from '../services/languageDetector';

interface ProfilePageProps {
  user: AuthUser;
  stats: UserStats;
  achievements: Achievement[];
  onNavigateToCompiler: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  stats,
  achievements,
  onNavigateToCompiler
}) => {
  const languageMastery = [
    { lang: 'python', label: 'Python', percent: 84, color: '#38BDF8' },
    { lang: 'javascript', label: 'JavaScript', percent: 72, color: '#FACC15' },
    { lang: 'c', label: 'C', percent: 65, color: '#60A5FA' },
    { lang: 'java', label: 'Java', percent: 58, color: '#FB923C' },
    { lang: 'rust', label: 'Rust', percent: 35, color: '#F97316' }
  ];

  return (
    <div className="profile-page-container">
      {/* Student ID Card */}
      <div className="profile-hero-card glass-panel">
        <div className="profile-avatar-block">
          <img src={user.avatar} alt={user.name} className="profile-avatar-img" />
          <div className="avatar-rank-pill">{stats.rank.split(' ')[0]}</div>
        </div>

        <div className="profile-bio-block">
          <div className="profile-name-row">
            <h1 className="profile-name">{user.name}</h1>
            <span className="verified-badge">
              <ShieldCheck size={14} className="text-emerald" />
              <span>Verified Student</span>
            </span>
          </div>

          <p className="profile-role">Computer Science Learner • University Track</p>

          <div className="profile-meta-tags">
            <span className="meta-tag"><Mail size={13} /> {user.email}</span>
            <span className="meta-tag"><Calendar size={13} /> Joined September 2026</span>
            <span className="meta-tag"><Flame size={13} className="text-amber" /> {stats.codingStreak} Day Streak</span>
          </div>
        </div>

        {/* Level Progression Gauge */}
        <div className="level-progression-box">
          <div className="level-header-row">
            <span className="level-current-tag">Level 4</span>
            <span className="xp-text">{stats.learningScore} / 1000 XP</span>
          </div>
          <div className="xp-bar-track">
            <div 
              className="xp-bar-fill" 
              style={{ width: `${Math.min(100, (stats.learningScore / 1000) * 100)}%` }} 
            />
          </div>
          <span className="next-rank-hint">
            Next Rank: <strong>Bug Buster (Level 5)</strong> at 1,000 XP
          </span>
        </div>
      </div>

      {/* Two Column Grid: Language Mastery & Badges */}
      <div className="profile-grid-split">
        {/* Language Mastery */}
        <section className="profile-section-card glass-panel">
          <div className="sec-header">
            <div>
              <h3 className="sec-title">Language Proficiency</h3>
              <p className="sec-sub">Based on mistakes identified, resolved, and code executed</p>
            </div>
            <Code2 size={20} className="text-blue" />
          </div>

          <div className="mastery-bars-list">
            {languageMastery.map((m) => {
              const meta = LANGUAGES[m.lang as Language];
              return (
                <div key={m.lang} className="mastery-item">
                  <div className="mastery-label-row">
                    <span className="lang-label">
                      {meta?.emoji} {m.label}
                    </span>
                    <span className="percent-val">{m.percent}%</span>
                  </div>
                  <div className="mastery-track">
                    <div 
                      className="mastery-fill" 
                      style={{ width: `${m.percent}%`, backgroundColor: m.color }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Learning Goals Checklist */}
        <section className="profile-section-card glass-panel">
          <div className="sec-header">
            <div>
              <h3 className="sec-title">Learning Goals</h3>
              <p className="sec-sub">Personal milestones to cultivate strong programming habits</p>
            </div>
            <Zap size={20} className="text-amber" />
          </div>

          <div className="goals-checklist">
            <div className="goal-item goal-completed">
              <CheckCircle2 size={18} className="text-emerald" />
              <div>
                <strong>Write first program</strong>
                <p>Completed in Python on Sept 24</p>
              </div>
            </div>

            <div className="goal-item goal-completed">
              <CheckCircle2 size={18} className="text-emerald" />
              <div>
                <strong>Maintain a 7-day coding streak</strong>
                <p>Unlocked today! Keep it going tomorrow.</p>
              </div>
            </div>

            <div className="goal-item">
              <div className="goal-circle-pending" />
              <div>
                <strong>Reach 20 errors resolved independently</strong>
                <p>Progress: {stats.errorsCorrected} / 20 resolved</p>
              </div>
            </div>

            <div className="goal-item">
              <div className="goal-circle-pending" />
              <div>
                <strong>Execute code in 5 different languages</strong>
                <p>Progress: {stats.languagesPracticed.length} / 5 practiced</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .profile-page-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px 24px 60px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .profile-hero-card {
          display: grid;
          grid-template-columns: auto 1fr 280px;
          align-items: center;
          gap: 28px;
          padding: 32px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%), var(--bg-card);
        }
        .profile-avatar-block {
          position: relative;
        }
        .profile-avatar-img {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--blue-primary);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.35);
        }
        .avatar-rank-pill {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--blue-primary);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          text-transform: uppercase;
        }
        .profile-bio-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .profile-name-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .profile-name {
          font-size: 1.8rem;
          font-weight: 800;
        }
        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #10B981;
          background: rgba(16, 185, 129, 0.12);
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .profile-role {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .profile-meta-tags {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 6px;
          flex-wrap: wrap;
        }
        .meta-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .level-progression-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .level-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .level-current-tag {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          color: #60A5FA;
        }
        .xp-text {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .xp-bar-track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          overflow: hidden;
        }
        .xp-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #3B82F6 0%, #A855F7 100%);
          border-radius: 9999px;
          transition: width 0.6s ease;
        }
        .next-rank-hint {
          font-size: 0.72rem;
          color: var(--text-secondary);
        }
        .profile-grid-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .profile-section-card {
          padding: 28px;
        }
        .sec-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .sec-title {
          font-size: 1.2rem;
          font-weight: 700;
        }
        .sec-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .mastery-bars-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mastery-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mastery-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .percent-val {
          color: var(--text-muted);
        }
        .mastery-track {
          width: 100%;
          height: 7px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          overflow: hidden;
        }
        .mastery-fill {
          height: 100%;
          border-radius: 9999px;
        }
        .goals-checklist {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .goal-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
        }
        .goal-completed {
          background: rgba(16, 185, 129, 0.05);
          border-color: rgba(16, 185, 129, 0.25);
        }
        .goal-item strong {
          font-size: 0.85rem;
          display: block;
        }
        .goal-item p {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .goal-circle-pending {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px dashed var(--text-muted);
          margin-top: 2px;
        }
        @media (max-width: 960px) {
          .profile-hero-card {
            grid-template-columns: 1fr;
          }
          .profile-grid-split {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
