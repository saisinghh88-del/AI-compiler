import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { AuthUser } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

function normalizeSupabaseUrl(raw: string): string {
  if (!raw) return '';
  let clean = raw.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }
  if (!clean.includes('.supabase.co') && !clean.includes('localhost') && !clean.includes(':')) {
    clean = `${clean}.supabase.co`;
  }
  return clean;
}

export class SupabaseService {
  public client: SupabaseClient | null = null;
  public config: SupabaseConfig;
  public isConnected: boolean = false;

  constructor(config?: Partial<SupabaseConfig>) {
    const rawUrl = config?.url || localStorage.getItem('smartlearn_supabase_url') || (import.meta.env.VITE_SUPABASE_URL as string) || '';
    const anonKey = config?.anonKey || localStorage.getItem('smartlearn_supabase_key') || (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
    const url = normalizeSupabaseUrl(rawUrl);

    this.config = { url, anonKey };
    this.initClient(url, anonKey);
  }

  private initClient(url: string, anonKey: string) {
    if (url && anonKey) {
      try {
        this.client = createClient(url, anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        this.isConnected = true;
      } catch (err) {
        console.warn('Failed to initialize Supabase client:', err);
        this.client = null;
        this.isConnected = false;
      }
    } else {
      this.client = null;
      this.isConnected = false;
    }
  }

  public updateConfig(rawUrl: string, anonKey: string): boolean {
    const url = normalizeSupabaseUrl(rawUrl);
    this.config = { url, anonKey };
    this.initClient(url, anonKey);
    localStorage.setItem('smartlearn_supabase_url', url);
    localStorage.setItem('smartlearn_supabase_key', anonKey);
    return this.isConnected;
  }

  public getStatus(): { isConfigured: boolean; url: string } {
    return {
      isConfigured: this.isConnected,
      url: this.config.url ? new URL(this.config.url).host : 'Not connected (Local mode)'
    };
  }

  /**
   * Test Supabase REST & Auth connectivity
   */
  public async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.isConnected || !this.client) {
      return { success: false, message: 'Supabase URL or Anon Key is missing.' };
    }

    try {
      const { error } = await this.client.auth.getSession();
      if (!error) {
        return { success: true, message: 'Connected to Supabase Auth & Database successfully!' };
      }
      return { success: false, message: `Supabase Auth error: ${error.message}` };
    } catch (e: any) {
      return { success: false, message: `Connection error: ${e.message || 'Network unreachable'}` };
    }
  }

  /**
   * Register a new student account in Supabase Auth
   */
  public async signUp(
    email: string, 
    password: string, 
    fullName: string, 
    learningTrack?: string
  ): Promise<{ user: AuthUser | null; error: string | null; needsEmailConfirmation: boolean }> {
    if (!this.client) {
      return { user: null, error: 'Supabase is not configured with active URL and Key.', needsEmailConfirmation: false };
    }

    try {
      const { data, error } = await this.client.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            learning_track: learningTrack || 'College CS Student',
            avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
          }
        }
      });

      if (error) {
        return { user: null, error: error.message, needsEmailConfirmation: false };
      }

      if (data.user) {
        const authUser = this.mapSupabaseUserToAuthUser(data.user, fullName);
        // If session is null, email confirmation is enabled in user's Supabase dashboard
        const needsEmailConfirmation = !data.session;
        return { user: authUser, error: null, needsEmailConfirmation };
      }

      return { user: null, error: 'User registration could not be completed.', needsEmailConfirmation: false };
    } catch (err: any) {
      return { user: null, error: err.message || 'Registration failed.', needsEmailConfirmation: false };
    }
  }

  /**
   * Sign in an existing student account using Email and Password
   */
  public async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
    if (!this.client) {
      return { user: null, error: 'Supabase is not configured.' };
    }

    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const authUser = this.mapSupabaseUserToAuthUser(data.user);
        return { user: authUser, error: null };
      }

      return { user: null, error: 'Sign in failed. No user returned.' };
    } catch (err: any) {
      return { user: null, error: err.message || 'Authentication error.' };
    }
  }

  /**
   * 1-Click Social Sign-In (Google / GitHub) via Supabase OAuth
   */
  public async signInWithOAuth(provider: 'google' | 'github'): Promise<{ error: string | null }> {
    if (!this.client) {
      return { error: 'Supabase is not configured.' };
    }

    try {
      const { error } = await this.client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'OAuth initialization failed.' };
    }
  }

  /**
   * Sign out from Supabase
   */
  public async signOut(): Promise<void> {
    if (this.client) {
      try {
        await this.client.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
  }

  /**
   * Get active logged in user from Supabase session
   */
  public async getCurrentUser(): Promise<AuthUser | null> {
    if (!this.client) return null;
    try {
      const { data: { session }, error } = await this.client.auth.getSession();
      if (error || !session || !session.user) return null;
      return this.mapSupabaseUserToAuthUser(session.user);
    } catch {
      return null;
    }
  }

  /**
   * Listen to real-time auth changes
   */
  public onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!this.client) return { unsubscribe: () => {} };

    const { data: { subscription } } = this.client.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        callback(this.mapSupabaseUserToAuthUser(session.user));
      } else {
        callback(null);
      }
    });

    return subscription;
  }

  private mapSupabaseUserToAuthUser(sbUser: SupabaseUser, fallbackName?: string): AuthUser {
    const meta = sbUser.user_metadata || {};
    const name = meta.full_name || meta.name || fallbackName || sbUser.email?.split('@')[0] || 'Learner';
    const avatar = meta.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    const provider = (sbUser.app_metadata?.provider as any) || 'email';

    return {
      id: sbUser.id,
      name,
      email: sbUser.email || '',
      avatar,
      provider: provider === 'google' || provider === 'github' ? provider : 'email',
      createdAt: sbUser.created_at || new Date().toISOString()
    };
  }

  /**
   * Save user mistake record to Supabase table 'mistakes' (if table exists)
   */
  public async syncMistakeToCloud(record: any): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client
        .from('mistakes')
        .upsert(record);
      return !error;
    } catch {
      return false;
    }
  }
}

export const supabase = new SupabaseService();
