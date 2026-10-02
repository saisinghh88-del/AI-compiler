import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  User,
  GraduationCap,
  LogIn,
  UserPlus,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { AuthUser } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  onLoginSuccess: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [learningTrack, setLearningTrack] = useState('College CS Student');

  // Loading & feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (tab === 'signup') {
        // Register in Supabase
        const result = await supabase.signUp(
          email,
          password,
          name || email.split('@')[0],
          learningTrack
        );

        if (result.error) {
          setErrorMessage(result.error);
        } else if (result.user) {
          if (result.needsEmailConfirmation) {
            setInfoMessage('Account created in Supabase! If your project requires email confirmation, please check your inbox to verify.');
            setTimeout(() => {
              onLoginSuccess(result.user!);
              onClose();
            }, 3000);
          } else {
            onLoginSuccess(result.user);
            onClose();
          }
        }
      } else {
        // Sign in with Supabase
        const result = await supabase.signIn(email, password);

        if (result.error) {
          setErrorMessage(result.error);
        } else if (result.user) {
          onLoginSuccess(result.user);
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setErrorMessage(null);
    setIsLoading(true);
    const { error } = await supabase.signInWithOAuth(provider);
    if (error) {
      setErrorMessage(error);
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    onClose();
  };

  return (
    <div className="auth-overlay-backdrop" onClick={onClose}>
      <div className="auth-modal-dialog glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>

        {/* Header Branding */}
        <div className="auth-header-block">
          <div className="auth-badge-icon">
            <Sparkles size={22} className="text-blue" />
          </div>
          <h2 className="auth-title">Welcome to SmartLearn</h2>
          <p className="auth-tagline">"Code. Learn. Improve."</p>
          <span className="auth-subtitle">
            A compiler that remembers mistakes and helps students become better programmers.
          </span>
        </div>

        {/* Prominent Tab Switcher: Sign In vs Register */}
        <div className="auth-tab-selector">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            className={`auth-tab-btn ${tab === 'signin' ? 'auth-tab-active' : ''}`}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            className={`auth-tab-btn ${tab === 'signup' ? 'auth-tab-active' : ''}`}
          >
            <UserPlus size={15} />
            <span>Register Free</span>
          </button>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="auth-alert error-alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="auth-alert info-alert">
            <CheckCircle2 size={16} />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="oauth-buttons-list">
          <button 
            type="button" 
            onClick={() => handleOAuth('google')} 
            disabled={isLoading}
            className="oauth-btn google-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3c0 2.9.7 5.6 1.9 8l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <button 
            type="button" 
            onClick={() => handleOAuth('github')} 
            disabled={isLoading}
            className="oauth-btn github-btn"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="email-login-form">
          {tab === 'signup' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={15} className="input-icon" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="input-field with-icon"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Learning Level / Goal</label>
                <div className="input-with-icon">
                  <GraduationCap size={15} className="input-icon" />
                  <select
                    value={learningTrack}
                    onChange={(e) => setLearningTrack(e.target.value)}
                    className="input-field with-icon"
                  >
                    <option value="School Student">School Student (Beginner)</option>
                    <option value="College CS Student">College Student (Computer Science / Engineering)</option>
                    <option value="Self-Taught Coder">Self-Taught Programmer</option>
                    <option value="Bootcamp Learner">Bootcamp Learner</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={15} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="input-field with-icon"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={15} className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field with-icon"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary btn-submit-auth">
            {isLoading ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                <span>Connecting to Supabase...</span>
              </>
            ) : (
              <>
                <span>{tab === 'signin' ? 'Sign In to Compiler' : 'Create Free Student Account'}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Guest Skip Option */}
        <div className="guest-skip-block">
          <button type="button" onClick={handleContinueAsGuest} className="guest-skip-link">
            <span>Skip & Explore as Guest Learner</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="auth-footer-toggle">
          {tab === 'signin' ? (
            <p>
              New learner?{' '}
              <button 
                type="button" 
                onClick={() => {
                  setTab('signup');
                  setErrorMessage(null);
                  setInfoMessage(null);
                }} 
                className="link-button"
              >
                Register free account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button 
                type="button" 
                onClick={() => {
                  setTab('signin');
                  setErrorMessage(null);
                  setInfoMessage(null);
                }} 
                className="link-button"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>

        <div className="supabase-ready-banner">
          <ShieldCheck size={14} className="text-emerald" />
          <span>Connected to Supabase Project • qmosngzblvzorocqvrny</span>
        </div>
      </div>

      <style>{`
        .auth-overlay-backdrop {
          position: fixed;
          inset: 0;
          z-index: 500;
          background: rgba(4, 7, 18, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .auth-modal-dialog {
          position: relative;
          width: 100%;
          max-width: 460px;
          background: #0B1120;
          border: 1px solid rgba(59, 130, 246, 0.28);
          border-radius: var(--radius-xl);
          padding: 30px 26px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.15);
          animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-theme='light'] .auth-modal-dialog {
          background: #FFFFFF;
        }
        @keyframes modalPop {
          from {
            transform: scale(0.94) translateY(12px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .auth-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .auth-close-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.1);
        }
        .auth-header-block {
          text-align: center;
          margin-bottom: 18px;
        }
        .auth-badge-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 10px;
          border-radius: 50%;
          background: var(--blue-subtle);
          border: 1px solid rgba(59, 130, 246, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-title {
          font-family: var(--font-heading);
          font-size: 1.45rem;
          font-weight: 800;
          margin-bottom: 2px;
          background: linear-gradient(135deg, #60A5FA 0%, #C084FC 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .auth-tagline {
          font-family: var(--font-heading);
          font-size: 0.85rem;
          color: var(--blue-primary);
          font-weight: 700;
          margin-bottom: 6px;
        }
        .auth-subtitle {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.4;
          display: block;
        }
        .auth-tab-selector {
          display: flex;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 3px;
          margin-bottom: 14px;
          gap: 4px;
        }
        [data-theme='light'] .auth-tab-selector {
          background: #F1F5F9;
        }
        .auth-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 700;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .auth-tab-btn:hover {
          color: var(--text-primary);
        }
        .auth-tab-active {
          background: var(--blue-primary) !important;
          color: #FFFFFF !important;
          box-shadow: 0 2px 10px rgba(59, 130, 246, 0.4);
        }
        .auth-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          margin-bottom: 12px;
          line-height: 1.35;
        }
        .error-alert {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #FCA5A5;
        }
        .info-alert {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34D399;
        }
        .oauth-buttons-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }
        .oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
        }
        .oauth-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--blue-primary);
        }
        .oauth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.72rem;
          margin: 12px 0;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-subtle);
        }
        .auth-divider span {
          padding: 0 10px;
        }
        .email-login-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .form-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }
        .input-field.with-icon {
          padding-left: 36px;
        }
        .btn-submit-auth {
          margin-top: 6px;
          width: 100%;
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .guest-skip-block {
          text-align: center;
          margin-top: 12px;
        }
        .guest-skip-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .guest-skip-link:hover {
          color: var(--blue-primary);
        }
        .auth-footer-toggle {
          margin-top: 14px;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .link-button {
          background: transparent;
          border: none;
          color: var(--blue-primary);
          font-weight: 700;
          cursor: pointer;
        }
        .link-button:hover {
          text-decoration: underline;
        }
        .supabase-ready-banner {
          margin-top: 14px;
          padding: 7px 12px;
          border-radius: var(--radius-sm);
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.7rem;
          color: #34D399;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
