import { UserStats, Achievement, ActivityItem, AppSettings, AuthUser, Language } from '../types';

const STORAGE_KEYS = {
  STATS: 'smartlearn_user_stats',
  ACHIEVEMENTS: 'smartlearn_achievements',
  ACTIVITIES: 'smartlearn_activities',
  SETTINGS: 'smartlearn_settings',
  AUTH: 'smartlearn_auth_user',
  CODE_DRAFTS: 'smartlearn_code_drafts'
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-program',
    title: 'First Program',
    description: 'Executed your very first code snippet on SmartLearn.',
    icon: '🚀',
    unlocked: true,
    unlockedAt: '2026-09-24T10:00:00Z',
    category: 'milestone'
  },
  {
    id: 'error-hunter',
    title: 'Error Hunter',
    description: 'Diagnosed and fixed 5 coding mistakes without looking at solutions.',
    icon: '🎯',
    unlocked: true,
    unlockedAt: '2026-09-27T14:30:00Z',
    category: 'learning'
  },
  {
    id: '7-day-streak',
    title: '7 Day Streak',
    description: 'Kept your coding momentum alive for 7 consecutive days.',
    icon: '🔥',
    unlocked: true,
    unlockedAt: '2026-09-30T18:00:00Z',
    category: 'streak'
  },
  {
    id: 'python-beginner',
    title: 'Python Beginner',
    description: 'Mastered core syntax and indentation in Python.',
    icon: '🐍',
    unlocked: true,
    unlockedAt: '2026-09-25T11:20:00Z',
    category: 'language'
  },
  {
    id: 'c-explorer',
    title: 'C Explorer',
    description: 'Successfully navigated pointers, semicolons, and printf in C.',
    icon: '🔵',
    unlocked: false,
    category: 'language'
  },
  {
    id: 'polyglot',
    title: 'Polyglot Learner',
    description: 'Practiced code across 3 or more different programming languages.',
    icon: '🌐',
    unlocked: true,
    unlockedAt: '2026-09-29T16:45:00Z',
    category: 'milestone'
  },
  {
    id: 'syntax-ninja',
    title: 'Syntax Ninja',
    description: 'Achieved a Learning Score of 800+ through disciplined practice.',
    icon: '🥷',
    unlocked: false,
    category: 'learning'
  }
];

export const DEFAULT_USER: AuthUser = {
  id: 'learner-allison-01',
  name: 'Allison Lipshutz',
  email: 'allison_4_li@seto.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  provider: 'guest',
  createdAt: '2026-09-20T08:00:00Z'
};

export const DEFAULT_STATS: UserStats = {
  codingStreak: 7,
  errorsCorrected: 14,
  languagesPracticed: ['python', 'c', 'javascript', 'java'],
  learningScore: 780,
  totalRuns: 38,
  totalMistakesLogged: 16,
  rank: 'Syntax Explorer (Level 4)'
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  fontSize: 14,
  autoSave: true,
  autoDetectLanguage: true,
  lockedLanguage: null,
  mentorStyle: 'socratic',
  judge0Url: (import.meta.env.VITE_JUDGE0_URL as string) || 'https://judge0-ce.p.rapidapi.com',
  judge0ApiKey: (import.meta.env.VITE_JUDGE0_API_KEY as string) || '',
  geminiApiKey: (import.meta.env.VITE_GEMINI_API_KEY as string) || '',
  supabaseUrl: (import.meta.env.VITE_SUPABASE_URL as string) || '',
  supabaseAnonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || ''
};

export function getUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    return raw ? JSON.parse(raw) : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {
    console.error(e);
  }
}

export function getAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return raw ? JSON.parse(raw) : INITIAL_ACHIEVEMENTS;
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (e) {
    console.error(e);
  }
}

export function getRecentActivities(): ActivityItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (raw) return JSON.parse(raw);
  } catch {}

  return [
    {
      id: 'act-1',
      timestamp: '15 mins ago',
      type: 'mistake_resolved',
      title: 'Resolved Python Indentation Error',
      detail: 'Fixed block header syntax independently after Socratic hint.',
      language: 'python'
    },
    {
      id: 'act-2',
      timestamp: '2 hours ago',
      type: 'code_run',
      title: 'Compiled C Array Algorithm',
      detail: '0 syntax errors. Execution time: 42ms.',
      language: 'c'
    },
    {
      id: 'act-3',
      timestamp: 'Yesterday',
      type: 'badge_unlocked',
      title: 'Unlocked 7 Day Streak Badge 🔥',
      detail: 'Earned +50 Learning Score bonus!'
    },
    {
      id: 'act-4',
      timestamp: '2 days ago',
      type: 'language_switched',
      title: 'Started Learning Java',
      detail: 'Explored class structure and System.out formatting.',
      language: 'java'
    }
  ];
}

export function addActivityItem(item: Omit<ActivityItem, 'id' | 'timestamp'>): void {
  const current = getRecentActivities();
  const newItem: ActivityItem = {
    ...item,
    id: `act-${Date.now()}`,
    timestamp: 'Just now'
  };
  const updated = [newItem, ...current.slice(0, 19)];
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
  } catch {}
}

export function getAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const parsed = raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    // Migrate away from rapidapi or broken judge0 endpoints
    if (!parsed.judge0Url || parsed.judge0Url.includes('rapidapi')) {
      parsed.judge0Url = 'https://ce.judge0.com';
    }
    return parsed;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
}

export function getAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuthUser(user: AuthUser): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
  } catch (e) {
    console.error(e);
  }
}

export function removeAuthUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  } catch (e) {
    console.error(e);
  }
}

export function getSavedCodeDraft(lang: Language): string | null {
  try {
    const drafts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CODE_DRAFTS) || '{}');
    return drafts[lang] || null;
  } catch {
    return null;
  }
}

export function saveCodeDraft(lang: Language, code: string): void {
  try {
    const drafts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CODE_DRAFTS) || '{}');
    drafts[lang] = code;
    localStorage.setItem(STORAGE_KEYS.CODE_DRAFTS, JSON.stringify(drafts));
  } catch {}
}
