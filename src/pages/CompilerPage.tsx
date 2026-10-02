import React, { useState, useEffect, useCallback } from 'react';
import { MonacoEditorPane } from '../components/MonacoEditorPane';
import { TerminalConsole } from '../components/TerminalConsole';
import { 
  Language, 
  DetectionResult, 
  RealtimeWarning, 
  ExecutionResult, 
  MistakeLevel, 
  UserStats, 
  MistakeRecord, 
  AppSettings 
} from '../types';
import { detectLanguage, LANGUAGES } from '../services/languageDetector';
import { 
  analyzeCodeRealtime, 
  getStoredMistakes 
} from '../services/smartLearningEngine';
import { executeCode } from '../services/codeRunner';
import { saveCodeDraft, getSavedCodeDraft, addActivityItem } from '../services/storage';

interface CompilerPageProps {
  theme: 'dark' | 'light';
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  settings: AppSettings;
  onTriggerAchievement?: (badgeTitle: string) => void;
  onMistakeDetected?: (hint: string | null) => void;
  onCodeChange?: (code: string, lang: Language) => void;
}

export const CompilerPage: React.FC<CompilerPageProps> = ({
  theme,
  stats,
  onUpdateStats,
  settings,
  onTriggerAchievement,
  onMistakeDetected,
  onCodeChange
}) => {
  // Active programming language
  const [activeLanguage, setActiveLanguage] = useState<Language>(settings.lockedLanguage || 'python');
  const [isLangLocked, setIsLangLocked] = useState<boolean>(Boolean(settings.lockedLanguage));

  // Editor code state
  const [code, setCode] = useState<string>(() => {
    return getSavedCodeDraft(activeLanguage) || LANGUAGES[activeLanguage]?.defaultTemplate || '';
  });

  // Detection state
  const [detectedResult, setDetectedResult] = useState<DetectionResult>(() => {
    return detectLanguage(code, activeLanguage);
  });

  // Realtime typing warnings
  const [realtimeWarnings, setRealtimeWarnings] = useState<RealtimeWarning[]>([]);

  // Execution state & Terminal
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stdin, setStdin] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult>({
    stdout: '',
    stderr: '',
    compileOutput: '',
    exitCode: 0,
    executionTime: 0,
    memory: 0,
    status: 'idle',
    timestamp: ''
  });

  const [fontSize, setFontSize] = useState<number>(settings.fontSize || 14);
  const [isAutoSaved, setIsAutoSaved] = useState(true);

  // Debounced auto-save & detection
  useEffect(() => {
    setIsAutoSaved(false);
    const timer = setTimeout(() => {
      if (!isLangLocked) {
        const detection = detectLanguage(code, activeLanguage);
        setDetectedResult(detection);
        if (detection.language !== activeLanguage && detection.confidence > 0.6) {
          setActiveLanguage(detection.language);
        }
      }

      const warnings = analyzeCodeRealtime(code, activeLanguage);
      setRealtimeWarnings(warnings);

      saveCodeDraft(activeLanguage, code);
      setIsAutoSaved(true);
      onCodeChange?.(code, activeLanguage);
    }, 300);

    return () => clearTimeout(timer);
  }, [code, activeLanguage, isLangLocked, onCodeChange]);

  // Execute Code via Judge0 / real runner
  const handleRunCode = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);

    try {
      const outcome = await executeCode({
        code,
        language: activeLanguage,
        stdin,
        judge0Url: settings.judge0Url,
        judge0Key: settings.judge0ApiKey
      });

      setExecutionResult(outcome.result);

      if (outcome.result.status === 'error') {
        const hint = outcome.socraticHint || 'Review compiler output for syntax and type issues.';
        onMistakeDetected?.(hint);

        // Update user stats
        const updatedList = getStoredMistakes();
        onUpdateStats({
          ...stats,
          totalRuns: stats.totalRuns + 1,
          totalMistakesLogged: updatedList.length
        });

        addActivityItem({
          type: 'code_run',
          title: `Execution issue in ${LANGUAGES[activeLanguage].name}`,
          detail: `Compiler reported error (Exit ${outcome.result.exitCode || 1})`,
          language: activeLanguage
        });
      } else {
        onMistakeDetected?.(null);
        onUpdateStats({
          ...stats,
          totalRuns: stats.totalRuns + 1,
          learningScore: stats.learningScore + 10
        });
      }
    } catch (e: any) {
      setExecutionResult({
        stdout: '',
        stderr: `Execution error: ${e.message || 'Unknown runtime error'}`,
        compileOutput: '',
        exitCode: 1,
        executionTime: 0,
        memory: 0,
        status: 'error',
        timestamp: new Date().toLocaleTimeString()
      });
      onMistakeDetected?.(`Execution error occurred: ${e.message || 'Please check code syntax'}`);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, code, activeLanguage, stdin, settings, stats, onUpdateStats, onMistakeDetected]);

  const handleSelectLanguage = (lang: Language) => {
    setActiveLanguage(lang);
    setIsLangLocked(true);
    const draft = getSavedCodeDraft(lang) || LANGUAGES[lang]?.defaultTemplate || '';
    setCode(draft);
  };

  const handleResetTemplate = () => {
    const tpl = LANGUAGES[activeLanguage]?.defaultTemplate || '';
    setCode(tpl);
    onMistakeDetected?.(null);
  };

  const handleLoadBuggySample = () => {
    const buggy = LANGUAGES[activeLanguage]?.sampleBuggyCode || '';
    setCode(buggy);
  };

  return (
    <div className="seto-compiler-view">
      {/* Top Language Selector Ribbon */}
      <div className="seto-compiler-lang-bar">
        <div className="seto-lang-select-wrapper">
          <label htmlFor="lang-select" className="seto-lang-label">Language:</label>
          <select
            id="lang-select"
            value={activeLanguage}
            onChange={(e) => handleSelectLanguage(e.target.value as Language)}
            className="seto-lang-select"
          >
            {Object.values(LANGUAGES).map((l) => (
              <option key={l.id} value={l.id}>
                {l.emoji} {l.name} (.{l.extension})
              </option>
            ))}
          </select>
        </div>

        <div className="seto-lang-meta-pills">
          <span className="seto-meta-pill">
            {isLangLocked ? '🔒 Locked' : '⚡ Auto-Detecting'}
          </span>
          <button 
            type="button"
            onClick={() => setIsLangLocked(!isLangLocked)}
            className="seto-meta-toggle-btn"
          >
            {isLangLocked ? 'Unlock Auto-Detect' : 'Lock Language'}
          </button>
        </div>
      </div>

      {/* Code Editor Pane */}
      <div className="seto-editor-pane-holder">
        <MonacoEditorPane
          code={code}
          onChangeCode={setCode}
          language={activeLanguage}
          theme={theme}
          fontSize={fontSize}
          onRunCode={handleRunCode}
          isRunning={isRunning}
          onClearCode={() => setCode('')}
          onResetTemplate={handleResetTemplate}
          onLoadBuggySample={handleLoadBuggySample}
          realtimeWarnings={realtimeWarnings}
          onZoomIn={() => setFontSize((prev) => Math.min(24, prev + 1))}
          onZoomOut={() => setFontSize((prev) => Math.max(11, prev - 1))}
          isAutoSaved={isAutoSaved}
        />
      </div>

      {/* Terminal Output Console */}
      <div className="seto-terminal-pane-holder">
        <TerminalConsole
          result={executionResult}
          isRunning={isRunning}
          stdin={stdin}
          onChangeStdin={setStdin}
          onClear={() => {
            setExecutionResult({
              stdout: '',
              stderr: '',
              compileOutput: '',
              exitCode: 0,
              executionTime: 0,
              memory: 0,
              status: 'idle',
              timestamp: ''
            });
          }}
        />
      </div>
    </div>
  );
};
