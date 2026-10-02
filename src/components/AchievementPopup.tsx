import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, X } from 'lucide-react';

interface AchievementPopupProps {
  badgeTitle: string | null;
  onDismiss: () => void;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
  badgeTitle,
  onDismiss
}) => {
  useEffect(() => {
    if (badgeTitle) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }

      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [badgeTitle, onDismiss]);

  if (!badgeTitle) return null;

  return (
    <div className="achievement-toast-container">
      <div className="achievement-toast-box glass-panel">
        <div className="toast-icon-wrap">
          <Award size={24} className="text-amber" />
        </div>
        <div className="toast-text-wrap">
          <span className="toast-badge-tag">
            <Sparkles size={12} /> Achievement Unlocked!
          </span>
          <strong className="toast-badge-title">{badgeTitle}</strong>
          <span className="toast-bonus">+50 Learning Score Bonus</span>
        </div>
        <button onClick={onDismiss} className="toast-close-btn" aria-label="Dismiss toast">
          <X size={16} />
        </button>
      </div>

      <style>{`
        .achievement-toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 300;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .achievement-toast-box {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(245, 158, 11, 0.4);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.2);
          border-radius: var(--radius-lg);
          min-width: 320px;
        }
        .toast-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .toast-text-wrap {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .toast-badge-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #F59E0B;
        }
        .toast-badge-title {
          font-size: 0.95rem;
          color: #F8FAFC;
        }
        .toast-bonus {
          font-size: 0.72rem;
          color: #10B981;
          font-weight: 600;
        }
        .toast-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .toast-close-btn:hover {
          color: var(--text-primary);
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
