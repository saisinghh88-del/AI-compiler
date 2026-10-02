import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Brain, 
  History, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Flame, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Code2, 
  Layers,
  Award,
  Users
} from 'lucide-react';
import { LANGUAGES } from '../services/languageDetector';

interface HomePageProps {
  onStartCoding: () => void;
  onExploreMistakes: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartCoding,
  onExploreMistakes
}) => {
  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} className="text-blue" />
            <span>SmartLearn 2.0 • AI-Powered Student Compiler</span>
          </div>

          <h1 className="hero-main-title">
            Code. Learn. <span className="highlight-text">Improve.</span>
          </h1>

          <p className="hero-tagline-statement">
            A beginner-friendly online compiler that remembers mistakes and helps students become better programmers instead of simply showing cold compiler errors.
          </p>

          <div className="hero-cta-group">
            <button onClick={onStartCoding} className="btn btn-primary btn-lg pulse-glow">
              <Terminal size={18} />
              <span>Launch Compiler</span>
              <ArrowRight size={18} />
            </button>

            <button onClick={onExploreMistakes} className="btn btn-outline btn-lg">
              <History size={18} />
              <span>Explore Mistake Vault</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="hero-stats-strip">
            <div className="hero-stat-item">
              <span className="stat-big-num">11</span>
              <span className="stat-sub">Languages Auto-Detected</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat-item">
              <span className="stat-big-num">3-Tier</span>
              <span className="stat-sub">Socratic Hint Engine</span>
            </div>
            <div className="stat-divider" />
            <div className="hero-stat-item">
              <span className="stat-big-num">100%</span>
              <span className="stat-sub">Remembers Past Mistakes</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="hero-preview-wrapper">
          <div className="interactive-preview-card glass-panel">
            <div className="preview-card-header">
              <div className="mac-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <span className="preview-card-title font-mono">smartlearn-session.py</span>
              <span className="preview-badge-pill">🐍 Python Auto-Detected</span>
            </div>

            <div className="preview-code-viewport font-mono">
              <div className="code-line"><span className="line-no">1</span><span className="token-keyword">def</span> <span className="token-fn">check_passing</span>(score) <span className="token-error-underline"># Line 1</span></div>
              <div className="code-line"><span className="line-no">2</span>    <span className="token-keyword">if</span> score &gt;= <span className="token-num">60</span>:</div>
              <div className="code-line"><span className="line-no">3</span>        <span className="token-fn">print</span>(<span className="token-string">"Passed!"</span>)</div>
            </div>

            {/* Smart Learning Floating Overlay */}
            <div className="preview-smart-bubble">
              <div className="bubble-top">
                <Brain size={16} className="text-amber" />
                <strong>SmartLearn Progressive Assistant</strong>
                <span className="bubble-tag">Level 2: Seen 2x</span>
              </div>
              <p className="bubble-body">
                "You made a similar mistake before with block headers. In Python, statements like <code>def</code> require a colon (<code>:</code>) at the end."
              </p>
              <div className="bubble-example font-mono">
                def check_passing(score):
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Difference: Traditional vs SmartLearn */}
      <section className="difference-section">
        <div className="section-head-center">
          <span className="section-pre-title">Why Students Love SmartLearn</span>
          <h2 className="section-main-heading">Traditional Compiler vs SmartLearn</h2>
          <p className="section-desc">
            Cold cryptic error stacks cause beginners to give up. SmartLearn acts like an encouraging professor by your side.
          </p>
        </div>

        <div className="comparison-cards-grid">
          {/* Traditional */}
          <div className="comparison-card traditional-card glass-panel">
            <div className="card-top-icon-row">
              <XCircle size={28} className="text-rose" />
              <h3 className="card-comp-title">Traditional Compilers</h3>
            </div>
            <ul className="comp-list">
              <li>
                <span className="bullet-neg">✕</span>
                <div>
                  <strong>Cryptic jargon:</strong>
                  <p>Dumps <code>SyntaxError: unexpected EOF while parsing</code> or <code>aborting due to previous error</code>.</p>
                </div>
              </li>
              <li>
                <span className="bullet-neg">✕</span>
                <div>
                  <strong>Zero memory:</strong>
                  <p>Forgets that you made the exact same mistake 5 minutes ago.</p>
                </div>
              </li>
              <li>
                <span className="bullet-neg">✕</span>
                <div>
                  <strong>Spoils the solution or confuses:</strong>
                  <p>Either gives zero guidance or leaves students guessing which line is actually broken.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* SmartLearn */}
          <div className="comparison-card smartlearn-card glass-panel">
            <div className="card-top-icon-row">
              <CheckCircle2 size={28} className="text-emerald" />
              <h3 className="card-comp-title">SmartLearn Compiler</h3>
            </div>
            <ul className="comp-list">
              <li>
                <span className="bullet-pos">✓</span>
                <div>
                  <strong>First Time (Level 1): Socratic Hint:</strong>
                  <p>"Check line 5. Something is missing near this statement." Trains you to spot bugs independently.</p>
                </div>
              </li>
              <li>
                <span className="bullet-pos">✓</span>
                <div>
                  <strong>Second Time (Level 2): Intelligent Reminder:</strong>
                  <p>"You made a similar mistake before." Shows previous mistake type and correct syntax example.</p>
                </div>
              </li>
              <li>
                <span className="bullet-pos">✓</span>
                <div>
                  <strong>Third Time (Level 3): Deep Mastery Tip:</strong>
                  <p>Detailed conceptual explanation and real-world analogy to lock in the knowledge.</p>
                </div>
              </li>
              <li>
                <span className="bullet-pos">✓</span>
                <div>
                  <strong>Real-Time Typing Assistant:</strong>
                  <p>Flags recurring patterns as you type before you even click Run!</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 11 Supported Languages Grid */}
      <section className="languages-grid-section">
        <div className="section-head-center">
          <span className="section-pre-title">Single Language Per File</span>
          <h2 className="section-main-heading">Auto-Detected Languages</h2>
          <p className="section-desc">
            Type in any language—SmartLearn detects it dynamically without requiring manual dropdown clicks.
          </p>
        </div>

        <div className="languages-cards-matrix">
          {Object.values(LANGUAGES).map((l) => (
            <div key={l.id} className="lang-matrix-card glass-panel">
              <span className="matrix-emoji">{l.emoji}</span>
              <div className="matrix-text-col">
                <span className="matrix-name">{l.name}</span>
                <span className="matrix-ext">.{l.extension}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Target Audiences */}
      <section className="target-users-section">
        <div className="section-head-center">
          <span className="section-pre-title">Designed for Learners</span>
          <h2 className="section-main-heading">Who Is SmartLearn For?</h2>
        </div>

        <div className="persona-grid">
          <div className="persona-card glass-panel">
            <div className="persona-icon-box">🏫</div>
            <h4 className="persona-title">School Students</h4>
            <p className="persona-desc">Learning first lines of code in Python or C with gentle guidance and no intimidating error walls.</p>
          </div>

          <div className="persona-card glass-panel">
            <div className="persona-icon-box">🎓</div>
            <h4 className="persona-title">College Students</h4>
            <p className="persona-desc">Navigating CS101, data structures, Java OOP, memory pointers, and compiler fundamentals.</p>
          </div>

          <div className="persona-card glass-panel">
            <div className="persona-icon-box">💻</div>
            <h4 className="persona-title">Beginner Programmers</h4>
            <p className="persona-desc">Transitioning between languages (e.g. from Python to Rust or Go) and mastering new syntax patterns.</p>
          </div>

          <div className="persona-card glass-panel">
            <div className="persona-icon-box">🚀</div>
            <h4 className="persona-title">Coding Learners</h4>
            <p className="persona-desc">Self-taught developers building muscle memory, tracking coding streaks, and unlocking achievement badges.</p>
          </div>
        </div>
      </section>

      {/* Call to action footer banner */}
      <section className="cta-bottom-banner glass-panel">
        <div className="cta-inner">
          <h2 className="cta-heading">Ready to Turn Errors Into Superpowers?</h2>
          <p className="cta-sub">
            Open the Monaco-powered editor, type your code, and let SmartLearn guide your programming journey.
          </p>
          <button onClick={onStartCoding} className="btn btn-primary btn-lg pulse-glow">
            <Terminal size={18} />
            <span>Start Coding Now (Free)</span>
          </button>
        </div>
      </section>

      <style>{`
        .home-page-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 24px 80px;
          display: flex;
          flex-direction: column;
          gap: 70px;
        }
        .hero-section {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 40px;
          min-height: 520px;
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: var(--blue-subtle);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 9999px;
          color: #60A5FA;
          font-size: 0.825rem;
          font-weight: 700;
          width: fit-content;
        }
        .hero-main-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .highlight-text {
          background: linear-gradient(135deg, #3B82F6 0%, #A855F7 60%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-tagline-statement {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 580px;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 10px;
        }
        .hero-stats-strip {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border-subtle);
        }
        .hero-stat-item {
          display: flex;
          flex-direction: column;
        }
        .stat-big-num {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .stat-sub {
          font-size: 0.775rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .stat-divider {
          width: 1px;
          height: 36px;
          background: var(--border-subtle);
        }
        .hero-preview-wrapper {
          position: relative;
        }
        .interactive-preview-card {
          background: #090E1D;
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.15);
        }
        .preview-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: #0F172A;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .mac-dots {
          display: flex;
          gap: 6px;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .dot.red { background: #EF4444; }
        .dot.yellow { background: #F59E0B; }
        .dot.green { background: #10B981; }
        .preview-card-title {
          font-size: 0.8rem;
          color: #94A3B8;
        }
        .preview-badge-pill {
          font-size: 0.72rem;
          background: rgba(56, 189, 248, 0.15);
          color: #38BDF8;
          padding: 2px 8px;
          border-radius: 9999px;
          font-weight: 700;
        }
        .preview-code-viewport {
          padding: 20px;
          font-size: 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
          line-height: 1.6;
        }
        .line-no {
          display: inline-block;
          width: 28px;
          color: #475569;
          user-select: none;
        }
        .token-keyword { color: #F43F5E; }
        .token-fn { color: #38BDF8; }
        .token-string { color: #34D399; }
        .token-num { color: #F59E0B; }
        .token-error-underline {
          color: #F87171;
          text-decoration: wavy underline #EF4444;
          font-weight: 600;
        }
        .preview-smart-bubble {
          margin: 16px;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: var(--radius-md);
          padding: 14px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }
        .bubble-top {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.825rem;
          margin-bottom: 6px;
        }
        .bubble-tag {
          margin-left: auto;
          font-size: 0.68rem;
          background: rgba(245, 158, 11, 0.18);
          color: #F59E0B;
          padding: 2px 8px;
          border-radius: 9999px;
          font-weight: 700;
        }
        .bubble-body {
          font-size: 0.825rem;
          color: #E2E8F0;
          line-height: 1.45;
        }
        .bubble-example {
          margin-top: 8px;
          background: #030712;
          padding: 6px 10px;
          border-radius: 4px;
          color: #34D399;
          font-size: 0.8rem;
        }
        .section-head-center {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 36px;
        }
        .section-pre-title {
          font-size: 0.775rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--blue-primary);
          font-weight: 800;
        }
        .section-main-heading {
          font-size: 2.2rem;
          font-weight: 800;
          margin: 6px 0 10px;
        }
        .section-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .comparison-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .comparison-card {
          padding: 28px;
        }
        .traditional-card {
          border-color: rgba(239, 68, 68, 0.2);
        }
        .smartlearn-card {
          border-color: rgba(16, 185, 129, 0.35);
          background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, var(--bg-card) 100%);
        }
        .card-top-icon-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .card-comp-title {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .comp-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .comp-list li {
          display: flex;
          gap: 12px;
          font-size: 0.88rem;
          line-height: 1.45;
        }
        .bullet-neg {
          color: #EF4444;
          font-weight: 800;
          font-size: 1.1rem;
        }
        .bullet-pos {
          color: #10B981;
          font-weight: 800;
          font-size: 1.1rem;
        }
        .languages-cards-matrix {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 14px;
        }
        .lang-matrix-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          transition: transform 0.2s;
        }
        .lang-matrix-card:hover {
          transform: translateY(-3px);
          border-color: var(--blue-primary);
        }
        .matrix-emoji {
          font-size: 1.6rem;
        }
        .matrix-text-col {
          display: flex;
          flex-direction: column;
        }
        .matrix-name {
          font-weight: 700;
          font-size: 0.9rem;
        }
        .matrix-ext {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .persona-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .persona-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .persona-icon-box {
          font-size: 2rem;
        }
        .persona-title {
          font-size: 1.1rem;
          font-weight: 700;
        }
        .persona-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .cta-bottom-banner {
          text-align: center;
          padding: 60px 24px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%);
          border-color: rgba(59, 130, 246, 0.35);
        }
        .cta-inner {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .cta-heading {
          font-size: 2.2rem;
          font-weight: 800;
        }
        .cta-sub {
          color: var(--text-secondary);
          font-size: 1rem;
          margin-bottom: 8px;
        }
        @media (max-width: 960px) {
          .hero-section {
            grid-template-columns: 1fr;
          }
          .comparison-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
