import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Sliders, 
  Bot, 
  Cpu, 
  Sparkles, 
  Sun, 
  Moon, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  ShieldAlert,
  Save,
  CheckCircle2
} from 'lucide-react';
import { AppSettings, Language } from '../types';
import { LANGUAGES } from '../services/languageDetector';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetAllData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="settings-page-container">
      <div className="settings-header glass-panel">
        <div className="settings-header-left">
          <div className="settings-icon-bubble">
            <SettingsIcon size={24} className="text-blue" />
          </div>
          <div>
            <h1 className="settings-title">Compiler & System Settings</h1>
            <p className="settings-sub">
              Customize your learning environment, AI mentor parameters, and cloud integrations.
            </p>
          </div>
        </div>

        <button onClick={handleSave} className="btn btn-primary">
          {savedNotice ? <CheckCircle2 size={16} /> : <Save size={16} />}
          <span>{savedNotice ? 'Saved!' : 'Save Preferences'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="settings-sections-grid">
        {/* Section 1: Code Editor & Layout */}
        <section className="settings-card glass-panel">
          <div className="sec-title-row">
            <Sliders size={18} className="text-blue" />
            <h3 className="card-heading">Code Editor</h3>
          </div>

          <div className="setting-field-group">
            <label className="field-label">Editor Font Size: {formData.fontSize}px</label>
            <input
              type="range"
              min={11}
              max={22}
              value={formData.fontSize}
              onChange={(e) => setFormData({ ...formData, fontSize: Number(e.target.value) })}
              className="slider-range"
            />
          </div>

          <div className="setting-toggle-row">
            <div>
              <span className="toggle-label">Auto-Save Code Drafts</span>
              <p className="toggle-sub">Saves your typed progress locally as you work</p>
            </div>
            <input
              type="checkbox"
              checked={formData.autoSave}
              onChange={(e) => setFormData({ ...formData, autoSave: e.target.checked })}
              className="toggle-checkbox"
            />
          </div>

          <div className="setting-toggle-row">
            <div>
              <span className="toggle-label">Automatic Language Detection</span>
              <p className="toggle-sub">Detects language signatures dynamically as you type</p>
            </div>
            <input
              type="checkbox"
              checked={formData.autoDetectLanguage}
              onChange={(e) => setFormData({ ...formData, autoDetectLanguage: e.target.checked })}
              className="toggle-checkbox"
            />
          </div>

          <div className="setting-field-group">
            <label className="field-label">Lock Language (Optional)</label>
            <select
              value={formData.lockedLanguage || ''}
              onChange={(e) => setFormData({ ...formData, lockedLanguage: (e.target.value || null) as Language })}
              className="settings-select"
            >
              <option value="">No Lock (Auto-detect automatically)</option>
              {Object.values(LANGUAGES).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.emoji} {l.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Section 2: AI Mentor & Pedagogy */}
        <section className="settings-card glass-panel">
          <div className="sec-title-row">
            <Bot size={18} className="text-purple" />
            <h3 className="card-heading">AI Mentor & Hints</h3>
          </div>

          <div className="setting-field-group">
            <label className="field-label">Mentor Guidance Style</label>
            <div className="mentor-style-options">
              <label className={`style-radio-card ${formData.mentorStyle === 'socratic' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="mentorStyle"
                  value="socratic"
                  checked={formData.mentorStyle === 'socratic'}
                  onChange={() => setFormData({ ...formData, mentorStyle: 'socratic' })}
                />
                <div>
                  <strong>Socratic Guide (Recommended)</strong>
                  <p>Asks thought-provoking questions and provides nudges without revealing answers.</p>
                </div>
              </label>

              <label className={`style-radio-card ${formData.mentorStyle === 'explanatory' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="mentorStyle"
                  value="explanatory"
                  checked={formData.mentorStyle === 'explanatory'}
                  onChange={() => setFormData({ ...formData, mentorStyle: 'explanatory' })}
                />
                <div>
                  <strong>Academic Tutor</strong>
                  <p>Provides conceptual breakdowns and direct code syntax solutions immediately.</p>
                </div>
              </label>
            </div>
          </div>
        </section>



        {/* Section 4: Data Management */}
        <section className="settings-card glass-panel full-width danger-section">
          <div className="sec-title-row">
            <ShieldAlert size={18} className="text-rose" />
            <h3 className="card-heading">Danger Zone</h3>
          </div>

          <div className="danger-row">
            <div>
              <strong>Reset Mistake Vault and Local Statistics</strong>
              <p>Permanently clears all logged mistakes, streak counters, and draft code.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to reset your mistake history? This cannot be undone.")) {
                  onResetAllData();
                }
              }}
              className="btn btn-sm btn-outline danger-btn"
            >
              Reset All Data
            </button>
          </div>
        </section>
      </form>

      <style>{`
        .settings-page-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 30px 24px 60px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px;
          gap: 16px;
        }
        .settings-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .settings-icon-bubble {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--blue-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .settings-title {
          font-size: 1.8rem;
          font-weight: 800;
        }
        .settings-sub {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .settings-sections-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .settings-card {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .sec-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 12px;
        }
        .card-heading {
          font-size: 1.15rem;
          font-weight: 700;
        }
        .integration-badge {
          margin-left: auto;
          font-size: 0.68rem;
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          padding: 2px 8px;
          border-radius: 9999px;
          font-weight: 700;
        }
        .setting-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .slider-range {
          accent-color: var(--blue-primary);
          cursor: pointer;
        }
        .setting-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 0;
        }
        .toggle-label {
          font-size: 0.85rem;
          font-weight: 600;
          display: block;
        }
        .toggle-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .toggle-checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--blue-primary);
          cursor: pointer;
        }
        .settings-select {
          padding: 9px 12px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
        }
        .mentor-style-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .style-radio-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .style-radio-card.selected {
          border-color: var(--blue-primary);
          background: var(--blue-subtle);
        }
        .style-radio-card strong {
          font-size: 0.85rem;
          display: block;
        }
        .style-radio-card p {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }
        .integration-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .integration-name {
          font-weight: 700;
          font-size: 0.95rem;
        }
        .integration-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .fallback-notice {
          font-size: 0.72rem;
          color: #38BDF8;
        }
        .test-btn-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
          flex-wrap: wrap;
        }
        .status-msg {
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-msg.success { color: #10B981; }
        .status-msg.error { color: #EF4444; }
        .danger-section {
          border-color: rgba(239, 68, 68, 0.3);
        }
        .danger-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .danger-btn {
          color: #EF4444;
          border-color: rgba(239, 68, 68, 0.4);
        }
        .danger-btn:hover {
          background: rgba(239, 68, 68, 0.15);
        }
        @media (max-width: 850px) {
          .settings-sections-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
