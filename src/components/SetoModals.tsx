import React from 'react';
import { Sparkles, Check, X, Crown, Zap, Shield, Image as ImageIcon } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  userName = 'Allison'
}) => {
  if (!isOpen) return null;

  return (
    <div className="seto-modal-backdrop" onClick={onClose}>
      <div className="seto-upgrade-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="seto-modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="seto-upgrade-modal-badge">
          <Crown size={16} />
          <span>SETO Pro Membership</span>
        </div>

        <h2 className="seto-upgrade-title">Elevate Your Coding & Creativity</h2>
        <p className="seto-upgrade-subtitle">
          Unlock unlimited compiler runs, advanced Socratic AI explanations, multi-file projects, and neural visual generation.
        </p>

        <div className="seto-plan-features-list">
          <div className="seto-feature-item">
            <div className="seto-feature-check">
              <Check size={14} />
            </div>
            <span>Unlimited high-speed Judge0 code execution (11+ languages)</span>
          </div>
          <div className="seto-feature-item">
            <div className="seto-feature-check">
              <Check size={14} />
            </div>
            <span>Deep 3-tier Socratic debugging hints powered by Gemini 2.5</span>
          </div>
          <div className="seto-feature-item">
            <div className="seto-feature-check">
              <Check size={14} />
            </div>
            <span>Continuous Mistake Memory Vault with predictive typo guards</span>
          </div>
          <div className="seto-feature-item">
            <div className="seto-feature-check">
              <Check size={14} />
            </div>
            <span>Exportable code certificates & learner portfolio synchronization</span>
          </div>
        </div>

        <div className="seto-upgrade-price-row">
          <div className="seto-price-block">
            <span className="seto-price-currency">$</span>
            <span className="seto-price-amount">12</span>
            <span className="seto-price-period">/month</span>
          </div>
          <span className="seto-price-badge">Cancel anytime</span>
        </div>

        <button 
          className="seto-confirm-upgrade-btn"
          onClick={() => {
            alert(`Thank you, ${userName}! SETO Pro features are unlocked on your session.`);
            onClose();
          }}
        >
          <Sparkles size={16} />
          <span>Upgrade to Pro Now</span>
        </button>
      </div>
    </div>
  );
};

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const galleryItems = [
    {
      title: 'Futuristic Portrait Exploration',
      tag: 'Neural Portrait',
      src: '/assets/portrait_silhouette.jpg'
    },
    {
      title: 'Fractal Mandelbrot Python Render',
      tag: 'Algorithmic Visual',
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Geometric Gradient Matrix',
      tag: 'Vector Canvas',
      src: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="seto-modal-backdrop" onClick={onClose}>
      <div className="seto-gallery-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="seto-gallery-modal-header">
          <div className="seto-gallery-header-left">
            <ImageIcon size={20} />
            <h3>Generated Media & Visual Library</h3>
          </div>
          <button className="seto-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="seto-gallery-grid">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="seto-gallery-item">
              <img src={item.src} alt={item.title} className="seto-gallery-img" />
              <div className="seto-gallery-meta">
                <span className="seto-gallery-badge">{item.tag}</span>
                <h4 className="seto-gallery-item-title">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
