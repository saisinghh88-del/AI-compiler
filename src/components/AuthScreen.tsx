import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { SetoLogoIcon } from './SetoIcons';
import { AuthUser } from '../types';
import { supabase } from '../services/supabaseClient';
import { DEFAULT_USER } from '../services/storage';

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Attempt Supabase registration if configured
        const result = await supabase.signUp(cleanEmail, cleanPassword, name.trim());
        if (result.error && !result.user) {
          // If Supabase returned an explicit error (like user already exists)
          if (result.error.toLowerCase().includes('already registered')) {
            setErrorMessage('An account with this email already exists. Please sign in instead.');
            setIsLoading(false);
            return;
          }
          // If Supabase connection fails or is local, fallback gracefully to a local account
          const localUser: AuthUser = {
            id: `usr-${Date.now()}`,
            name: name.trim(),
            email: cleanEmail,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
            provider: 'email',
            createdAt: new Date().toISOString()
          };
          onLoginSuccess(localUser);
          return;
        }

        if (result.user) {
          setSuccessMessage('Account created successfully! Welcome to SETO.');
          setTimeout(() => {
            onLoginSuccess(result.user!);
          }, 800);
        } else {
          // Local fallback
          const localUser: AuthUser = {
            id: `usr-${Date.now()}`,
            name: name.trim(),
            email: cleanEmail,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
            provider: 'email',
            createdAt: new Date().toISOString()
          };
          onLoginSuccess(localUser);
        }
      } else {
        // Attempt Sign In
        const result = await supabase.signIn(cleanEmail, cleanPassword);
        if (result.error && !result.user) {
          if (result.error.toLowerCase().includes('invalid login credentials')) {
            setErrorMessage('Invalid email or password. Please check your credentials.');
            setIsLoading(false);
            return;
          }
          // Fallback to local session
          const localUser: AuthUser = {
            id: `usr-${Date.now()}`,
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
            provider: 'email',
            createdAt: new Date().toISOString()
          };
          onLoginSuccess(localUser);
          return;
        }

        if (result.user) {
          onLoginSuccess(result.user);
        } else {
          const localUser: AuthUser = {
            id: `usr-${Date.now()}`,
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
            provider: 'email',
            createdAt: new Date().toISOString()
          };
          onLoginSuccess(localUser);
        }
      }
    } catch (err: any) {
      // Graceful fallback for offline / mock sessions
      const localUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: name.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
        provider: 'email',
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(localUser);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    onLoginSuccess(DEFAULT_USER);
  };

  return (
    <div className="seto-auth-fullscreen-container">
      <div className="seto-auth-card">
        {/* Logo and Brand Title */}
        <div className="seto-auth-brand-header">
          <div className="seto-auth-logo-badge">
            <SetoLogoIcon size={28} className="seto-auth-logo-icon" />
          </div>
          <h1 className="seto-auth-title">SETO</h1>
          <p className="seto-auth-subtitle">AI-Powered Code Compiler & Learning Workspace</p>
        </div>

        {/* Mode Toggle Tabs (Sign In / Register) */}
        <div className="seto-auth-tabs-row">
          <button
            type="button"
            className={`seto-auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`seto-auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="seto-auth-alert error">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="seto-auth-alert success">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="seto-auth-form">
          {mode === 'signup' && (
            <div className="seto-auth-input-group">
              <label className="seto-auth-label">Full Name</label>
              <div className="seto-auth-input-wrapper">
                <User size={16} className="seto-auth-field-icon" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Allison Lipshutz"
                  className="seto-auth-input"
                  required
                />
              </div>
            </div>
          )}

          <div className="seto-auth-input-group">
            <label className="seto-auth-label">Email Address</label>
            <div className="seto-auth-input-wrapper">
              <Mail size={16} className="seto-auth-field-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="seto-auth-input"
                required
              />
            </div>
          </div>

          <div className="seto-auth-input-group">
            <label className="seto-auth-label">Password</label>
            <div className="seto-auth-input-wrapper">
              <Lock size={16} className="seto-auth-field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="seto-auth-input"
                required
              />
              <button
                type="button"
                className="seto-auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="seto-auth-submit-btn"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="seto-spinner" />
                <span>Authenticating...</span>
              </>
            ) : mode === 'signin' ? (
              <>
                <span>Sign In to Compiler</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Create Account & Start Coding</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="seto-auth-divider">
          <span>or</span>
        </div>

        {/* 1-Click Guest Access */}
        <button
          type="button"
          onClick={handleGuestAccess}
          className="seto-auth-guest-btn"
        >
          <Code2 size={16} />
          <span>Continue as Guest (Instant Access)</span>
        </button>

        <p className="seto-auth-footer-notice">
          Your session will be saved locally so you won't need to log in again.
        </p>
      </div>
    </div>
  );
};
