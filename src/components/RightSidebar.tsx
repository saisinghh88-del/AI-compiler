import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  History, 
  TrendingUp, 
  Bot, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  RefreshCw, 
  Send, 
  Lock, 
  Unlock,
  BookOpen,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { 
  Language, 
  DetectionResult, 
  RealtimeWarning, 
  AIMessage, 
  UserStats, 
  MistakeLevel,
  MistakeRecord 
} from '../types';
import { LANGUAGES } from '../services/languageDetector';

interface RightSidebarProps {
  detectedLang: DetectionResult;
  activeLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  isLangLocked: boolean;
  onToggleLockLang: () => void;
  realtimeWarnings: RealtimeWarning[];
  activeMistakeContext?: {
    level: MistakeLevel;
    hint: string;
    example?: string;
    tip?: string;
    count: number;
    title?: string;
  } | null;
  storedMistakes: MistakeRecord[];
  stats: UserStats;
  aiMessages: AIMessage[];
  isAiThinking: boolean;
  onSendAiQuery: (query: string) => void;
  onApplyFixSnippet?: (code: string) => void;
  onMarkMistakeUnderstood?: (patternKey: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  detectedLang,
  activeLanguage,
  onSelectLanguage,
  isLangLocked,
  onToggleLockLang,
  realtimeWarnings,
  activeMistakeContext,
  storedMistakes,
  stats,
  aiMessages,
  isAiThinking,
  onSendAiQuery,
  onApplyFixSnippet,
  onMarkMistakeUnderstood
}) => {
  const [activeTab, setActiveTab] = useState<'learning' | 'mentor'>('learning');
  const [aiInput, setAiInput] = useState('');

  const currentLangMeta = LANGUAGES[activeLanguage] || LANGUAGES.python;

  // Find recent mistakes matching this language
  const languageMistakes = storedMistakes
    .filter((m) => m.language === activeLanguage)
    .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    onSendAiQuery(aiInput);
    setAiInput('');
  };

  const handleQuickPrompt = (prompt: string) => {
    onSendAiQuery(prompt);
  };

  return (
    <aside className="right-sidebar-container">
      {/* Sidebar Top Nav Tabs: Learning Assistant vs AI Mentor */}
      <div className="sidebar-tab-header">
        <button
          onClick={() => setActiveTab('learning')}
          className={`sidebar-tab-btn ${activeTab === 'learning' ? 'sidebar-tab-active' : ''}`}
        >
          <Lightbulb size={16} />
          <span>Smart Learning</span>
          {realtimeWarnings.length > 0 && (
            <span className="sidebar-badge-counter">{realtimeWarnings.length}</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('mentor')}
          className={`sidebar-tab-btn ${activeTab === 'mentor' ? 'sidebar-tab-active' : ''}`}
        >
          <Bot size={16} />
          <span>AI Mentor</span>
          <span className="gemini-pill">Gemini Ready</span>
        </button>
      </div>

      <div className="sidebar-content-scroll">
        {/* ======================================================== */}
        {/* SECTION 1: DETECTED LANGUAGE (ALWAYS VISIBLE)            */}
        {/* ======================================================== */}
        <section className="sidebar-card glass-panel" aria-label="Detected Language">
          <div className="card-header-row">
            <span className="card-section-tag">Section 1</span>
            <span className="card-section-title">Detected Language</span>
            <button
              onClick={onToggleLockLang}
              className={`lock-btn ${isLangLocked ? 'locked' : ''}`}
              title={isLangLocked ? 'Language is locked. Click to unlock auto-detection.' : 'Lock language'}
            >
              {isLangLocked ? <Lock size={13} /> : <Unlock size={13} />}
              <span>{isLangLocked ? 'Locked' : 'Auto'}</span>
            </button>
          </div>

          <div className="detected-lang-body">
            <div className="lang-badge-large" style={{ backgroundColor: currentLangMeta.badgeBg, color: currentLangMeta.badgeColor }}>
              <span className="lang-badge-emoji">{currentLangMeta.emoji}</span>
              <span className="lang-badge-name">{currentLangMeta.name}</span>
            </div>

            {/* Language Selector Dropdown */}
            <select
              value={activeLanguage}
              onChange={(e) => onSelectLanguage(e.target.value as Language)}
              className="lang-select-dropdown"
              aria-label="Select active language"
            >
              {Object.values(LANGUAGES).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.emoji} {l.name} (.{l.extension})
                </option>
              ))}
            </select>
          </div>

          {/* Mixed Language Detected Warning */}
          {detectedLang.isMixed && (
            <div className="mixed-lang-warning-box">
              <div className="warning-icon-wrap">
                <AlertTriangle size={16} />
              </div>
              <div className="warning-text-content">
                <strong>Mixed language detected.</strong>
                <p>Please use one language per file to ensure clean compilation.</p>
                {detectedLang.mixedWarning && (
                  <span className="mixed-detail-tag">{detectedLang.mixedWarning}</span>
                )}
              </div>
            </div>
          )}

          {!detectedLang.isMixed && detectedLang.indicators.length > 0 && (
            <div className="token-indicators-tray">
              <span className="token-label">Signals:</span>
              {detectedLang.indicators.slice(0, 3).map((ind, i) => (
                <span key={i} className="token-pill">{ind}</span>
              ))}
            </div>
          )}
        </section>

        {activeTab === 'learning' ? (
          <>
            {/* ======================================================== */}
            {/* SECTION 2: LEARNING HINTS (PROGRESSIVE DISCLOSURE)       */}
            {/* ======================================================== */}
            <section className="sidebar-card glass-panel" aria-label="Learning Hints">
              <div className="card-header-row">
                <span className="card-section-tag">Section 2</span>
                <span className="card-section-title">Learning Hints</span>
                <span className={`level-pill level-${activeMistakeContext?.level || 1}`}>
                  Level {activeMistakeContext?.level || 1}
                </span>
              </div>

              {activeMistakeContext ? (
                <div className={`hint-content-box hint-level-${activeMistakeContext.level}`}>
                  {/* LEVEL 1: First time mistake */}
                  {activeMistakeContext.level === 1 && (
                    <div className="hint-level-view">
                      <div className="level-badge-title">
                        <Lightbulb size={16} className="hint-bulb-icon" />
                        <span>First Time Mistake — Socratic Nudge</span>
                      </div>
                      <p className="socratic-prompt">{activeMistakeContext.hint}</p>
                      <div className="hint-pedagogy-note">
                        💡 <em>SmartLearn does not reveal the answer immediately so you can develop debugging instincts independently.</em>
                      </div>
                    </div>
                  )}

                  {/* LEVEL 2: Second time same mistake */}
                  {activeMistakeContext.level === 2 && (
                    <div className="hint-level-view">
                      <div className="level-badge-title text-amber">
                        <History size={16} />
                        <span>You made a similar mistake before</span>
                      </div>
                      <p className="socratic-prompt">{activeMistakeContext.hint}</p>
                      
                      {activeMistakeContext.example && (
                        <div className="example-block">
                          <span className="example-label">Correct Example:</span>
                          <pre className="example-code font-mono">{activeMistakeContext.example}</pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* LEVEL 3: Third time same mistake */}
                  {activeMistakeContext.level === 3 && (
                    <div className="hint-level-view">
                      <div className="level-badge-title text-rose">
                        <BookOpen size={16} />
                        <span>Mastery Deep Dive (3+ Occurrences)</span>
                      </div>
                      <p className="socratic-prompt">{activeMistakeContext.hint}</p>
                      
                      {activeMistakeContext.example && (
                        <div className="example-block">
                          <span className="example-label">Syntax Reference:</span>
                          <pre className="example-code font-mono">{activeMistakeContext.example}</pre>
                        </div>
                      )}

                      {activeMistakeContext.tip && (
                        <div className="pro-tip-box">
                          <strong>Learning Tip:</strong> {activeMistakeContext.tip}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-hint-card">
                  <CheckCircle2 size={24} className="text-emerald check-pulse" />
                  <p className="empty-hint-title">Clean Syntax Detected</p>
                  <span className="empty-hint-sub">
                    No active errors in your current draft. Run your program or type code to receive real-time Socratic learning hints.
                  </span>
                </div>
              )}
            </section>

            {/* ======================================================== */}
            {/* SECTION 3: PREVIOUS MISTAKE REMINDER                     */}
            {/* ======================================================== */}
            <section className="sidebar-card glass-panel" aria-label="Previous Mistake Reminder">
              <div className="card-header-row">
                <span className="card-section-tag">Section 3</span>
                <span className="card-section-title">Previous Mistake Reminder</span>
                <span className="vault-count-tag">{languageMistakes.length} logged</span>
              </div>

              {/* Real-time typing reminder banner if code matches past mistakes */}
              {realtimeWarnings.length > 0 ? (
                <div className="realtime-reminders-list">
                  {realtimeWarnings.map((w) => (
                    <div key={w.id} className={`reminder-alert-card reminder-level-${w.level}`}>
                      <div className="reminder-alert-top">
                        <AlertTriangle size={15} />
                        <span className="reminder-title">{w.title}</span>
                      </div>
                      <p className="reminder-message">{w.message}</p>
                      <div className="reminder-meta-row">
                        <span className="reminder-line-tag">Line {w.line}</span>
                        {w.previousOccurrences > 0 && (
                          <span className="recurrence-pill">
                            Encountered {w.previousOccurrences}x before
                          </span>
                        )}
                      </div>
                      {w.correctSnippet && w.level >= 2 && (
                        <div className="quick-example-accordion">
                          <pre className="quick-code font-mono">{w.correctSnippet}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : languageMistakes.length > 0 ? (
                <div className="recent-mistakes-vault-preview">
                  <p className="memory-helper-text">
                    SmartLearn remembers your past challenges in {currentLangMeta.name} so you build lasting mastery:
                  </p>
                  <div className="mistake-mini-list">
                    {languageMistakes.slice(0, 3).map((item) => (
                      <div key={item.id} className="mistake-mini-item">
                        <div className="mistake-mini-main">
                          <span className="mistake-item-title">{item.title}</span>
                          <span className="mistake-item-time">
                            Seen {item.occurrenceCount}x • {new Date(item.lastSeen).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`status-tag ${item.resolved ? 'resolved' : 'review'}`}>
                          {item.resolved ? 'Understood' : 'Needs Practice'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="clean-memory-slate">
                  <Sparkles size={20} className="sparkle-gold" />
                  <p>No past mistakes logged yet in {currentLangMeta.name}. You're off to a flawless start!</p>
                </div>
              )}
            </section>

            {/* ======================================================== */}
            {/* SECTION 4: LEARNING PROGRESS                             */}
            {/* ======================================================== */}
            <section className="sidebar-card glass-panel" aria-label="Learning Progress">
              <div className="card-header-row">
                <span className="card-section-tag">Section 4</span>
                <span className="card-section-title">Learning Progress</span>
                <TrendingUp size={15} className="text-blue" />
              </div>

              <div className="progress-metrics-grid">
                <div className="stat-card-mini">
                  <div className="stat-card-top">
                    <Flame size={16} className="text-amber" />
                    <span className="stat-title">Streak</span>
                  </div>
                  <span className="stat-number">{stats.codingStreak} Days</span>
                </div>

                <div className="stat-card-mini">
                  <div className="stat-card-top">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <span className="stat-title">Errors Fixed</span>
                  </div>
                  <span className="stat-number">{stats.errorsCorrected}</span>
                </div>

                <div className="stat-card-mini">
                  <div className="stat-card-top">
                    <Award size={16} className="text-blue" />
                    <span className="stat-title">Score</span>
                  </div>
                  <span className="stat-number">{stats.learningScore}</span>
                </div>

                <div className="stat-card-mini">
                  <div className="stat-card-top">
                    <TrendingUp size={16} className="text-cyan" />
                    <span className="stat-title">Total Runs</span>
                  </div>
                  <span className="stat-number">{stats.totalRuns}</span>
                </div>
              </div>

              {/* Languages Practiced Mini Badges */}
              <div className="languages-practiced-row">
                <span className="practiced-label">Languages Practiced:</span>
                <div className="practiced-chips">
                  {stats.languagesPracticed.map((langKey) => {
                    const meta = LANGUAGES[langKey];
                    if (!meta) return null;
                    return (
                      <span key={langKey} className="lang-practiced-chip" title={meta.name}>
                        {meta.emoji} {meta.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </section>
          </>
        ) : (
          /* ======================================================== */
          /* SECTION 5: AI MENTOR INTERACTIVE CHAT                    */
          /* ======================================================== */
          <section className="ai-mentor-panel glass-panel" aria-label="AI Mentor">
            <div className="ai-mentor-header">
              <div className="mentor-avatar-badge">
                <Bot size={20} className="text-blue" />
              </div>
              <div>
                <h4 className="mentor-name">SmartLearn Socratic Mentor</h4>
                <p className="mentor-subtitle">Guided reasoning & pedagogical hints</p>
              </div>
            </div>

            {/* Quick Socratic Prompt Pills */}
            <div className="quick-prompts-bar">
              <button 
                onClick={() => handleQuickPrompt("Can you give me a subtle hint about my code?")}
                className="quick-prompt-btn"
              >
                💡 Subtle Nudge
              </button>
              <button 
                onClick={() => handleQuickPrompt("Why is this line wrong?")}
                className="quick-prompt-btn"
              >
                ❓ Why is this wrong?
              </button>
              <button 
                onClick={() => handleQuickPrompt("Test me with a quick Socratic question about this syntax")}
                className="quick-prompt-btn"
              >
                🎯 Socratic Quiz
              </button>
              <button 
                onClick={() => handleQuickPrompt("Explain this concept using a real-world analogy")}
                className="quick-prompt-btn"
              >
                📖 Analogy
              </button>
            </div>

            {/* Chat Message Stream */}
            <div className="chat-messages-container">
              {aiMessages.map((msg) => (
                <div key={msg.id} className={`chat-bubble-row ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                  <div className="chat-bubble">
                    <p className="chat-bubble-text">{msg.text}</p>
                    {msg.codeExample && (
                      <pre className="chat-code-block font-mono">{msg.codeExample}</pre>
                    )}
                    <span className="chat-timestamp">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="chat-bubble-row bubble-ai">
                  <div className="chat-bubble thinking-bubble">
                    <span className="dot-flashing" />
                    <span>Mentor is formulating guidance...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleAiSubmit} className="chat-input-bar">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask your mentor (e.g. 'How do loops work in C?')..."
                className="chat-input-field"
              />
              <button type="submit" className="chat-send-btn" disabled={!aiInput.trim() || isAiThinking}>
                <Send size={15} />
              </button>
            </form>
          </section>
        )}
      </div>

      <style>{`
        .right-sidebar-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: rgba(11, 17, 32, 0.5);
          border-left: 1px solid var(--border-subtle);
          overflow: hidden;
        }
        [data-theme='light'] .right-sidebar-container {
          background: rgba(248, 250, 252, 0.7);
        }
        .sidebar-tab-header {
          display: flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.85);
          border-bottom: 1px solid var(--border-subtle);
          padding: 8px 12px;
          gap: 8px;
        }
        [data-theme='light'] .sidebar-tab-header {
          background: #FFFFFF;
        }
        .sidebar-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sidebar-tab-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.04);
        }
        .sidebar-tab-active {
          background: var(--blue-subtle) !important;
          border-color: rgba(59, 130, 246, 0.4) !important;
          color: var(--blue-primary) !important;
        }
        .sidebar-badge-counter {
          background: #EF4444;
          color: #FFFFFF;
          font-size: 0.7rem;
          padding: 1px 6px;
          border-radius: 9999px;
          font-weight: 700;
        }
        .gemini-pill {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2));
          color: #A855F7;
          border: 1px solid rgba(168, 85, 247, 0.3);
          font-size: 0.65rem;
          padding: 1px 6px;
          border-radius: 9999px;
          font-weight: 700;
        }
        .sidebar-content-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .sidebar-card {
          padding: 14px 16px;
          background: var(--bg-card);
        }
        .card-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .card-section-tag {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--blue-primary);
          font-weight: 800;
          background: var(--blue-subtle);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .card-section-title {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-left: 8px;
          flex: 1;
        }
        .lock-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          cursor: pointer;
        }
        .lock-btn.locked {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.4);
          color: #F59E0B;
        }
        .detected-lang-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .lang-badge-large {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.95rem;
        }
        .lang-badge-emoji {
          font-size: 1.25rem;
        }
        .lang-select-dropdown {
          padding: 6px 10px;
          background: var(--bg-surface-elevated);
          color: var(--text-primary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }
        .mixed-lang-warning-box {
          margin-top: 12px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          display: flex;
          gap: 10px;
          color: #FCA5A5;
        }
        .warning-icon-wrap {
          color: #EF4444;
          margin-top: 2px;
        }
        .warning-text-content strong {
          color: #EF4444;
          font-size: 0.825rem;
          display: block;
        }
        .warning-text-content p {
          font-size: 0.775rem;
          margin-top: 2px;
          color: #F87171;
        }
        .mixed-detail-tag {
          display: inline-block;
          margin-top: 4px;
          font-size: 0.7rem;
          background: rgba(239, 68, 68, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .token-indicators-tray {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .token-label {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .token-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-secondary);
        }
        .level-pill {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .level-1 { background: rgba(59, 130, 246, 0.15); color: #3B82F6; }
        .level-2 { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
        .level-3 { background: rgba(239, 68, 68, 0.15); color: #EF4444; }

        .hint-content-box {
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-sm);
        }
        .level-badge-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--blue-primary);
          margin-bottom: 8px;
        }
        .hint-bulb-icon {
          color: #3B82F6;
        }
        .socratic-prompt {
          font-size: 0.9rem;
          color: var(--text-primary);
          line-height: 1.5;
        }
        .hint-pedagogy-note {
          margin-top: 10px;
          font-size: 0.75rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-subtle);
          padding-top: 6px;
        }
        .example-block {
          margin-top: 10px;
          background: #060A14;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 8px 10px;
        }
        .example-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
          display: block;
          margin-bottom: 4px;
        }
        .example-code {
          color: #34D399;
          font-size: 0.8rem;
          white-space: pre-wrap;
        }
        .pro-tip-box {
          margin-top: 10px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px dashed rgba(59, 130, 246, 0.3);
          border-radius: var(--radius-sm);
          padding: 8px 10px;
          font-size: 0.8rem;
          color: var(--text-primary);
        }
        .empty-hint-card {
          text-align: center;
          padding: 24px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .empty-hint-title {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-primary);
        }
        .empty-hint-sub {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .realtime-reminders-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .reminder-alert-card {
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          border-left: 3px solid;
          background: rgba(255, 255, 255, 0.02);
        }
        .reminder-level-1 { border-color: #3B82F6; background: rgba(59, 130, 246, 0.05); }
        .reminder-level-2 { border-color: #F59E0B; background: rgba(245, 158, 11, 0.05); }
        .reminder-level-3 { border-color: #EF4444; background: rgba(239, 68, 68, 0.05); }
        .reminder-alert-top {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 0.825rem;
          color: var(--text-primary);
        }
        .reminder-message {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        .reminder-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }
        .reminder-line-tag {
          font-size: 0.68rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.08);
          padding: 1px 6px;
          border-radius: 4px;
          color: var(--text-primary);
        }
        .recurrence-pill {
          font-size: 0.68rem;
          font-weight: 700;
          color: #F59E0B;
        }
        .quick-code {
          background: #060A14;
          padding: 6px;
          border-radius: 4px;
          color: #34D399;
          font-size: 0.75rem;
          margin-top: 6px;
        }
        .memory-helper-text {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .mistake-mini-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mistake-mini-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
        }
        .mistake-mini-main {
          display: flex;
          flex-direction: column;
        }
        .mistake-item-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .mistake-item-time {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .status-tag {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .status-tag.resolved { background: rgba(16, 185, 129, 0.15); color: #10B981; }
        .status-tag.review { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
        .clean-memory-slate {
          text-align: center;
          padding: 16px;
          color: var(--text-muted);
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .sparkle-gold {
          color: #F59E0B;
        }
        .progress-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
        }
        .stat-card-mini {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 8px 10px;
        }
        .stat-card-top {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .stat-number {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          display: block;
          margin-top: 2px;
        }
        .languages-practiced-row {
          border-top: 1px solid var(--border-subtle);
          padding-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .practiced-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .practiced-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .lang-practiced-chip {
          font-size: 0.72rem;
          background: var(--blue-subtle);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: var(--text-primary);
          padding: 2px 8px;
          border-radius: 9999px;
          font-weight: 600;
        }
        /* AI MENTOR PANEL */
        .ai-mentor-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 520px;
          padding: 14px;
        }
        .ai-mentor-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .mentor-avatar-badge {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--blue-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mentor-name {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .mentor-subtitle {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .quick-prompts-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }
        .quick-prompt-btn {
          font-size: 0.72rem;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: 9999px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .quick-prompt-btn:hover {
          color: var(--blue-primary);
          border-color: var(--blue-primary);
          background: var(--blue-subtle);
        }
        .chat-messages-container {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 8px 0;
          max-height: 380px;
        }
        .chat-bubble-row {
          display: flex;
        }
        .bubble-user {
          justify-content: flex-end;
        }
        .bubble-ai {
          justify-content: flex-start;
        }
        .chat-bubble {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          line-height: 1.45;
        }
        .bubble-user .chat-bubble {
          background: var(--blue-primary);
          color: #FFFFFF;
          border-bottom-right-radius: 2px;
        }
        .bubble-ai .chat-bubble {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          border-bottom-left-radius: 2px;
        }
        .chat-code-block {
          background: #060A14;
          padding: 8px;
          border-radius: 4px;
          font-size: 0.78rem;
          margin-top: 6px;
          color: #38BDF8;
        }
        .chat-timestamp {
          font-size: 0.65rem;
          opacity: 0.6;
          display: block;
          margin-top: 4px;
          text-align: right;
        }
        .thinking-bubble {
          display: flex;
          align-items: center;
          gap: 8px;
          font-style: italic;
          color: var(--text-muted);
        }
        .chat-input-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding-top: 8px;
          border-top: 1px solid var(--border-subtle);
        }
        .chat-input-field {
          flex: 1;
          padding: 8px 12px;
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.85rem;
          outline: none;
        }
        .chat-input-field:focus {
          border-color: var(--blue-primary);
        }
        .chat-send-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--blue-primary);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .text-amber { color: #F59E0B; }
        .text-rose { color: #EF4444; }
        .text-emerald { color: #10B981; }
        .text-blue { color: #3B82F6; }
        .text-cyan { color: #06B6D4; }
      `}</style>
    </aside>
  );
};
