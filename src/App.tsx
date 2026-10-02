import React, { useState, useEffect } from 'react';
import { SetoLeftSidebar } from './components/SetoLeftSidebar';
import { SetoRightSidebar } from './components/SetoRightSidebar';
import { AuthScreen } from './components/AuthScreen';
import { CompilerPage } from './pages/CompilerPage';
import { ErrorHistoryPage } from './pages/ErrorHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { AchievementPopup } from './components/AchievementPopup';

import { 
  AuthUser, 
  UserStats, 
  Achievement, 
  ActivityItem, 
  AppSettings, 
  MistakeRecord, 
  Language,
  AIMessage
} from './types';
import { 
  getAuthUser, 
  saveAuthUser, 
  removeAuthUser,
  getUserStats, 
  saveUserStats, 
  getAchievements, 
  saveAchievements, 
  getRecentActivities, 
  getAppSettings, 
  saveAppSettings,
  saveCodeDraft,
  DEFAULT_STATS,
  INITIAL_ACHIEVEMENTS
} from './services/storage';
import { getStoredMistakes, saveMistakes } from './services/smartLearningEngine';
import { getAIMentorResponse } from './services/aiMentor';
import { supabase } from './services/supabaseClient';

export const App: React.FC = () => {
  // Navigation: Default directly to 'compiler'
  const [activePage, setActivePage] = useState<string>('compiler');

  // App Theme & Settings
  const [settings, setSettings] = useState<AppSettings>(() => getAppSettings());

  // User Authentication State: Read persistent session from localStorage
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());

  // Gamification & Storage States
  const [stats, setStats] = useState<UserStats>(() => getUserStats());
  const [achievements, setAchievements] = useState<Achievement[]>(() => getAchievements());
  const [activities, setActivities] = useState<ActivityItem[]>(() => getRecentActivities());
  const [mistakes, setMistakes] = useState<MistakeRecord[]>(() => getStoredMistakes());

  // Active Socratic Mistake Context
  const [activeMistakeHint, setActiveMistakeHint] = useState<string | null>(null);

  // Current Code & Language state tracked for AI Mentor context
  const [currentCode, setCurrentCode] = useState<string>('');
  const [currentLang, setCurrentLang] = useState<Language>('python');

  // AI Mentor Chat Messages
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-ai',
      sender: 'ai',
      text: `Hello! I'm your SETO AI Mentor. Write or paste code in the editor, click Run, and I will help explain any output or syntax errors.`,
      timestamp: 'Just now'
    }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Achievement Toast Notification
  const [toastBadge, setToastBadge] = useState<string | null>(null);

  // Sync light theme attribute to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Synchronize active Supabase authentication session silently in background if available
  useEffect(() => {
    supabase.getCurrentUser().then((sbUser) => {
      if (sbUser) {
        setUser(sbUser);
        saveAuthUser(sbUser);
      }
    });

    const subscription = supabase.onAuthStateChange((sbUser) => {
      if (sbUser) {
        setUser(sbUser);
        saveAuthUser(sbUser);
      }
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleLoginSuccess = (loggedInUser: AuthUser) => {
    setUser(loggedInUser);
    saveAuthUser(loggedInUser);
  };

  const handleLogout = () => {
    removeAuthUser();
    setUser(null);
  };

  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
    saveUserStats(newStats);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveAppSettings(newSettings);
  };

  const handleTriggerAchievement = (badgeTitle: string) => {
    setToastBadge(badgeTitle);
    const updated = achievements.map((a) =>
      a.title === badgeTitle ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
    );
    setAchievements(updated);
    saveAchievements(updated);
  };

  const handlePracticeMistake = (lang: Language, snippet: string) => {
    saveCodeDraft(lang, snippet);
    setActivePage('compiler');
  };

  const handleResetAllData = () => {
    localStorage.clear();
    setStats(DEFAULT_STATS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setMistakes([]);
    alert("Local data and mistake records have been reset.");
  };

  // Handle queries to AI Mentor
  const handleSendAiMessage = async (query: string) => {
    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const aiReply = await getAIMentorResponse(query, {
        code: currentCode,
        language: currentLang,
        recentMistake: activeMistakeHint || undefined,
        mentorStyle: settings.mentorStyle || 'socratic',
        apiKey: settings.geminiApiKey
      });

      setAiMessages((prev) => [...prev, aiReply]);
    } catch {
      setAiMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `Check the line numbers in the output terminal to locate the issue.`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // If user is not authenticated yet, gate the site with the Login/Register screen
  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Once authenticated, render the full application (persisted in localStorage, never shows login again)
  return (
    <div className="seto-ambient-canvas framed-canvas">
      {/* Main SETO Application Container */}
      <div className="seto-app-shell">
        {/* Left Navigation Sidebar */}
        <SetoLeftSidebar
          activePage={activePage}
          onNavigate={(page) => setActivePage(page)}
          user={user}
          onLogout={handleLogout}
        />

        {/* Center Workspace: Code Editor & Terminal */}
        <main className="seto-center-workspace">
          {activePage === 'compiler' && (
            <CompilerPage
              theme="light"
              stats={stats}
              onUpdateStats={handleUpdateStats}
              settings={settings}
              onTriggerAchievement={handleTriggerAchievement}
              onMistakeDetected={(hint) => {
                setActiveMistakeHint(hint);
                if (hint) {
                  setAiMessages((prev) => [
                    ...prev,
                    {
                      id: `hint-${Date.now()}`,
                      sender: 'ai',
                      text: `💡 Socratic Hint: ${hint}`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }
              }}
              onCodeChange={(code, lang) => {
                setCurrentCode(code);
                setCurrentLang(lang);
              }}
            />
          )}

          {activePage === 'errors' && (
            <div className="seto-inner-page-wrapper">
              <ErrorHistoryPage
                mistakes={mistakes}
                onUpdateMistakes={(upd) => {
                  setMistakes(upd);
                  saveMistakes(upd);
                }}
                onPracticeMistake={handlePracticeMistake}
              />
            </div>
          )}

          {activePage === 'settings' && (
            <div className="seto-inner-page-wrapper">
              <SettingsPage
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetAllData={handleResetAllData}
              />
            </div>
          )}
        </main>

        {/* Right AI Mentor Sidebar */}
        <SetoRightSidebar
          messages={aiMessages}
          isThinking={isAiThinking}
          onSendMessage={handleSendAiMessage}
          activeMistakeHint={activeMistakeHint}
        />
      </div>

      {/* Achievement Toast */}
      <AchievementPopup
        badgeTitle={toastBadge}
        onDismiss={() => setToastBadge(null)}
      />
    </div>
  );
};

export default App;
