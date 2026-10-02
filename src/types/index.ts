export type Language = 
  | 'c'
  | 'cpp'
  | 'java'
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'php'
  | 'kotlin';

export type MistakeLevel = 1 | 2 | 3;

export interface MistakePattern {
  id: string;
  patternKey: string;
  category: 'syntax' | 'logic' | 'type' | 'indentation' | 'name' | 'convention';
  language: Language;
  title: string;
  shortDesc: string;
  // Dynamic hint levels:
  level1Hint: string; // Subtle Socratic hint (don't reveal answer)
  level2Reminder: string; // "You made a similar mistake before" + example
  level2Example: string;
  level3Explanation: string; // In-depth explanation & solution
  level3Tip: string;
  detectRegex?: RegExp;
  detectFn?: (code: string) => { match: boolean; line?: number; detail?: string };
}

export interface MistakeRecord {
  id: string;
  patternKey: string;
  category: string;
  language: Language;
  title: string;
  codeSnippet: string;
  line?: number;
  occurrenceCount: number;
  firstSeen: string; // ISO date
  lastSeen: string; // ISO date
  resolved: boolean;
  notes?: string;
}

export interface LanguageInfo {
  id: Language;
  name: string;
  emoji: string;
  badgeColor: string;
  badgeBg: string;
  extension: string;
  monacoLang: string;
  defaultTemplate: string;
  sampleBuggyCode: string;
  description: string;
}

export interface DetectionResult {
  language: Language;
  confidence: number;
  isMixed: boolean;
  mixedWarning?: string;
  indicators: string[];
  secondaryLanguages?: { lang: Language; score: number }[];
}

export interface RealtimeWarning {
  id: string;
  line: number;
  title: string;
  message: string;
  level: MistakeLevel;
  patternKey: string;
  previousOccurrences: number;
  correctSnippet?: string;
  tip?: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  compileOutput: string;
  exitCode: number;
  executionTime: number; // in ms
  memory: number; // in KB
  status: 'idle' | 'running' | 'success' | 'error';
  timestamp: string;
}

export interface UserStats {
  codingStreak: number;
  errorsCorrected: number;
  languagesPracticed: Language[];
  learningScore: number;
  totalRuns: number;
  totalMistakesLogged: number;
  rank: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'milestone' | 'streak' | 'learning' | 'language';
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'code_run' | 'mistake_resolved' | 'badge_unlocked' | 'streak_extended' | 'language_switched';
  title: string;
  detail: string;
  language?: Language;
}

export interface AIMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  hintLevel?: MistakeLevel;
  codeExample?: string;
  isSocraticQuestion?: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  fontSize: number;
  autoSave: boolean;
  autoDetectLanguage: boolean;
  lockedLanguage: Language | null;
  mentorStyle: 'socratic' | 'explanatory';
  judge0Url: string;
  judge0ApiKey: string;
  geminiApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'email' | 'google' | 'github' | 'guest';
  createdAt: string;
}
