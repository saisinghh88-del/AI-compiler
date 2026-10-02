import React from 'react';
import { 
  Flame, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  Clock, 
  Layers, 
  Sparkles, 
  Code2, 
  Activity, 
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';
import { UserStats, Achievement, ActivityItem, AuthUser } from '../types';
import { LANGUAGES } from '../services/languageDetector';

interface DashboardPageProps {
  stats: UserStats;
  achievements: Achievement[];
  activities: ActivityItem[];
  user: AuthUser;
  onNavigateToCompiler: () => void;
  onNavigateToMistakes: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  achievements,
  activities,
  user,
  onNavigateToCompiler,
  onNavigateToMistakes
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="dashboard-container">
      {/* Top Banner: Student Welcome & Learning Score Ring */}
      <div className="dashboard-welcome-banner glass-panel">
        <div className="welcome-text-cluster">
          <span className="welcome-badge">
            <Sparkles size={14} className="text-blue" />
            <span>Learner Overview</span>
          </span>
          <h1 className="welcome-title">Keep it up, {user.name.split(' ')[0]}!</h1>
          <p className="welcome-sub">
            You're currently on a <strong>{stats.codingStreak}-day coding streak</strong>. Your persistence in understanding errors is paying off.
          </p>
          <div className="welcome-actions">
            <button onClick={onNavigateToCompiler} className="btn btn-primary btn-sm">
              <Code2 size={16} />
              <span>Resume Coding Session</span>
            </button>
            <button onClick={onNavigateToMistakes} className="btn btn-outline btn-sm">
              <span>View Mistake Vault</span>
            </button>
          </div>
        </div>

        {/* Learning Score Card */}
        <div className="score-radial-card">
          <div className="score-ring-wrapper">
            <svg className="radial-svg" viewBox="0 0 100 100">
              <circle className="circle-bg" cx="50" cy="50" r="42" />
              <circle 
                className="circle-progress" 
                cx="50" 
                cy="50" 
                r="42" 
                style={{ strokeDashoffset: Math.max(0, 264 - (264 * stats.learningScore) / 1000) }}
              />
            </svg>
            <div className="ring-content">
              <span className="ring-score-val">{stats.learningScore}</span>
              <span className="ring-score-sub">Score</span>
            </div>
          </div>
          <span className="rank-indicator">{stats.rank}</span>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="metric-cards-grid">
        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-card-label">Coding Streak</span>
            <div className="icon-badge amber"><Flame size={18} /></div>
          </div>
          <div className="stat-card-value">{stats.codingStreak} <span className="stat-unit">Days</span></div>
          <div className="stat-card-footer">
            <span className="text-emerald">🔥 Best streak: 12 days</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-card-label">Errors Corrected</span>
            <div className="icon-badge emerald"><CheckCircle2 size={18} /></div>
          </div>
          <div className="stat-card-value">{stats.errorsCorrected}</div>
          <div className="stat-card-footer">
            <span>Diagnosed independently without cheats</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-card-label">Languages Practiced</span>
            <div className="icon-badge blue"><Layers size={18} /></div>
          </div>
          <div className="stat-card-value">{stats.languagesPracticed.length} <span className="stat-unit">Langs</span></div>
          <div className="stat-card-footer">
            <span>{stats.languagesPracticed.map((l) => LANGUAGES[l]?.emoji).join(' ')}</span>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Executions</span>
            <div className="icon-badge cyan"><TrendingUp size={18} /></div>
          </div>
          <div className="stat-card-value">{stats.totalRuns}</div>
          <div className="stat-card-footer">
            <span>Compiled & evaluated</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Achievements & Recent Activity */}
      <div className="dashboard-columns-split">
        {/* Achievements Showcase */}
        <section className="achievements-section glass-panel">
          <div className="panel-header-row">
            <div>
              <h3 className="panel-title">Achievement Badges</h3>
              <p className="panel-sub">{unlockedCount} of {achievements.length} badges unlocked</p>
            </div>
            <Award size={20} className="text-blue" />
          </div>

          <div className="badges-grid-list">
            {achievements.map((badge) => (
              <div 
                key={badge.id} 
                className={`badge-card ${badge.unlocked ? 'badge-unlocked' : 'badge-locked'}`}
              >
                <div className="badge-icon-bubble">{badge.icon}</div>
                <div className="badge-meta">
                  <div className="badge-title-row">
                    <h4 className="badge-name">{badge.title}</h4>
                    {badge.unlocked && <span className="unlocked-tag">Unlocked</span>}
                  </div>
                  <p className="badge-desc">{badge.description}</p>
                  {badge.unlockedAt && (
                    <span className="badge-date">Earned {new Date(badge.unlockedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Learning Activity Timeline */}
        <section className="activity-section glass-panel">
          <div className="panel-header-row">
            <div>
              <h3 className="panel-title">Recent Learning Activity</h3>
              <p className="panel-sub">Real-time trace of your coding milestones</p>
            </div>
            <Activity size={20} className="text-cyan" />
          </div>

          <div className="activity-timeline-feed">
            {activities.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-body">
                  <div className="timeline-meta-row">
                    <span className="timeline-title">{item.title}</span>
                    <span className="timeline-time">{item.timestamp}</span>
                  </div>
                  <p className="timeline-detail">{item.detail}</p>
                  {item.language && (
                    <span className="timeline-lang-tag">
                      {LANGUAGES[item.language]?.emoji} {LANGUAGES[item.language]?.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px 24px 60px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .dashboard-welcome-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px 36px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%), var(--bg-card);
          gap: 24px;
        }
        .welcome-text-cluster {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 700px;
        }
        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.775rem;
          color: #60A5FA;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .welcome-title {
          font-size: 2.2rem;
          font-weight: 800;
        }
        .welcome-sub {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .welcome-actions {
          display: flex;
          gap: 12px;
          margin-top: 6px;
        }
        .score-radial-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .score-ring-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
        }
        .radial-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .circle-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.08);
          stroke-width: 8;
        }
        .circle-progress {
          fill: none;
          stroke: #3B82F6;
          stroke-width: 8;
          stroke-linecap: round;
          stroke-dasharray: 264;
          transition: stroke-dashoffset 1s ease-in-out;
        }
        .ring-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .ring-score-val {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .ring-score-sub {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
        }
        .rank-indicator {
          font-size: 0.8rem;
          font-weight: 700;
          color: #A855F7;
          background: rgba(168, 85, 247, 0.12);
          padding: 3px 10px;
          border-radius: 9999px;
        }
        .metric-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }
        .stat-card {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stat-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .stat-card-label {
          font-size: 0.825rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .icon-badge {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-badge.amber { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
        .icon-badge.emerald { background: rgba(16, 185, 129, 0.15); color: #10B981; }
        .icon-badge.blue { background: rgba(59, 130, 246, 0.15); color: #3B82F6; }
        .icon-badge.cyan { background: rgba(6, 182, 212, 0.15); color: #06B6D4; }
        .stat-card-value {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .stat-unit {
          font-size: 0.95rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .stat-card-footer {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .dashboard-columns-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .panel-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .panel-title {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .panel-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .achievements-section, .activity-section {
          padding: 24px 28px;
        }
        .badges-grid-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 6px;
        }
        .badge-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.02);
          transition: transform 0.2s;
        }
        .badge-unlocked {
          border-color: rgba(59, 130, 246, 0.3);
          background: rgba(59, 130, 246, 0.05);
        }
        .badge-locked {
          opacity: 0.55;
          filter: grayscale(0.5);
        }
        .badge-icon-bubble {
          font-size: 1.8rem;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .badge-meta {
          flex: 1;
        }
        .badge-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .badge-name {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .unlocked-tag {
          font-size: 0.68rem;
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .badge-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .badge-date {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 4px;
          display: block;
        }
        .activity-timeline-feed {
          display: flex;
          flex-direction: column;
          gap: 18px;
          position: relative;
          padding-left: 14px;
        }
        .activity-timeline-feed::before {
          content: '';
          position: absolute;
          left: 4px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: var(--border-subtle);
        }
        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          position: relative;
        }
        .timeline-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #3B82F6;
          border: 2px solid #0B1120;
          margin-top: 5px;
          position: absolute;
          left: -14px;
        }
        .timeline-body {
          flex: 1;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
        }
        .timeline-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .timeline-title {
          font-weight: 700;
          font-size: 0.875rem;
        }
        .timeline-time {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .timeline-detail {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        .timeline-lang-tag {
          display: inline-block;
          margin-top: 6px;
          font-size: 0.7rem;
          background: var(--blue-subtle);
          color: #60A5FA;
          padding: 1px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
        @media (max-width: 960px) {
          .dashboard-columns-split {
            grid-template-columns: 1fr;
          }
          .dashboard-welcome-banner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};
