import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  Code, 
  Sparkles, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  CheckCheck,
  FileCode,
  Bug
} from 'lucide-react';
import { Language, RealtimeWarning } from '../types';
import { LANGUAGES } from '../services/languageDetector';

interface MonacoEditorPaneProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  language: Language;
  theme: 'dark' | 'light';
  fontSize: number;
  onRunCode: () => void;
  isRunning: boolean;
  onClearCode: () => void;
  onResetTemplate: () => void;
  onLoadBuggySample: () => void;
  realtimeWarnings: RealtimeWarning[];
  onZoomIn: () => void;
  onZoomOut: () => void;
  isAutoSaved: boolean;
}

export const MonacoEditorPane: React.FC<MonacoEditorPaneProps> = ({
  code,
  onChangeCode,
  language,
  theme,
  fontSize,
  onRunCode,
  isRunning,
  onClearCode,
  onResetTemplate,
  onLoadBuggySample,
  realtimeWarnings,
  onZoomIn,
  onZoomOut,
  isAutoSaved
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register shortcut: Ctrl+Enter (or Cmd+Enter) to Run Code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunCode();
    });

    // Editor styling configurations for clean, modern look
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      bracketPairColorization: { enabled: true },
      fontLigatures: true,
      renderLineHighlight: 'all',
      tabSize: 4
    });
  };

  // Keyboard shortcut listener on window as well
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onRunCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRunCode]);

  const langMeta = LANGUAGES[language] || LANGUAGES.python;
  const fileName = `main.${langMeta.extension}`;

  return (
    <div className="monaco-pane-container">
      {/* Editor Header Toolbar */}
      <div className="editor-toolbar">
        {/* Left: Active File Tab & Status */}
        <div className="file-tab-cluster">
          <div className="active-file-tab">
            <span className="file-emoji">{langMeta.emoji}</span>
            <span className="file-name font-mono">{fileName}</span>
          </div>

          <div className="save-status-pill" title="Changes saved locally in real-time">
            <CheckCheck size={13} className="text-emerald" />
            <span>{isAutoSaved ? 'Auto-Saved' : 'Saving...'}</span>
          </div>
        </div>

        {/* Right: Actions, Font Zoom, Bug Sample, & Run Button */}
        <div className="editor-actions-cluster">
          {/* Quick Buggy Code Loader (Great for testing the Smart Mistake features!) */}
          <button
            onClick={onLoadBuggySample}
            className="action-pill-btn bug-sample-btn"
            title="Load sample code with common beginner mistake to test the Smart Learning hints"
          >
            <Bug size={14} />
            <span>Test Error Hint</span>
          </button>

          {/* Reset Template */}
          <button
            onClick={onResetTemplate}
            className="action-pill-btn"
            title="Reset to clean language template"
          >
            <RotateCcw size={14} />
            <span>Template</span>
          </button>

          {/* Zoom controls */}
          <div className="zoom-buttons-group">
            <button onClick={onZoomOut} className="icon-zoom-btn" title="Decrease font size">
              <ZoomOut size={13} />
            </button>
            <span className="font-size-indicator">{fontSize}px</span>
            <button onClick={onZoomIn} className="icon-zoom-btn" title="Increase font size">
              <ZoomIn size={13} />
            </button>
          </div>

          {/* Clear */}
          <button onClick={onClearCode} className="icon-zoom-btn text-muted" title="Clear editor">
            <Trash2 size={14} />
          </button>

          {/* Big Run Button */}
          <button
            onClick={onRunCode}
            disabled={isRunning}
            className="run-code-button btn-success"
            title="Compile & Run (Ctrl + Enter)"
          >
            <Play size={16} fill="currentColor" />
            <span className="run-button-text">Run</span>
            <span className="shortcut-tag font-mono">^↵</span>
          </button>
        </div>
      </div>

      {/* Real-time typing reminder banner if code resembles previous mistakes */}
      {realtimeWarnings.length > 0 && (
        <div className="realtime-editor-banner">
          <div className="banner-left">
            <AlertTriangle size={16} className="banner-warning-icon" />
            <span className="banner-title">
              Smart Assistant Notice: <strong>{realtimeWarnings[0].title}</strong> on Line {realtimeWarnings[0].line}
            </span>
          </div>
          <span className="banner-subtext">
            {realtimeWarnings[0].level === 1 
              ? 'Check your punctuation before running.' 
              : 'Matches a past mistake pattern. Look at the sidebar for guidance.'}
          </span>
        </div>
      )}

      {/* Monaco Editor Host */}
      <div className="monaco-canvas-host">
        <Editor
          height="100%"
          language={langMeta.monacoLang}
          value={code}
          onChange={(val) => onChangeCode(val || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            fontSize: fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            lineNumbers: 'on',
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            overviewRulerBorder: false,
            folding: true,
            padding: { top: 12, bottom: 12 }
          }}
          onMount={handleEditorDidMount}
        />
      </div>

      <style>{`
        .monaco-pane-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #0B1120;
          border-right: 1px solid var(--border-subtle);
          position: relative;
        }
        [data-theme='light'] .monaco-pane-container {
          background: #FFFFFF;
        }
        .editor-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: rgba(15, 23, 42, 0.95);
          border-bottom: 1px solid var(--border-subtle);
          gap: 12px;
          flex-wrap: wrap;
        }
        [data-theme='light'] .editor-toolbar {
          background: #F8FAFC;
        }
        .file-tab-cluster {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .active-file-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: var(--radius-sm);
          color: #60A5FA;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .file-emoji {
          font-size: 1rem;
        }
        .file-name {
          letter-spacing: -0.01em;
        }
        .save-status-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .editor-actions-cluster {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .action-pill-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .action-pill-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.09);
        }
        .bug-sample-btn {
          background: rgba(245, 158, 11, 0.12);
          border-color: rgba(245, 158, 11, 0.3);
          color: #F59E0B;
        }
        .bug-sample-btn:hover {
          background: rgba(245, 158, 11, 0.22);
          color: #FBBF24;
        }
        .zoom-buttons-group {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 2px;
        }
        .icon-zoom-btn {
          width: 26px;
          height: 26px;
          border-radius: 4px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }
        .icon-zoom-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }
        .font-size-indicator {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          padding: 0 4px;
          min-width: 32px;
          text-align: center;
        }
        .run-code-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border-radius: var(--radius-md);
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          border: none;
        }
        .run-button-text {
          letter-spacing: 0.02em;
        }
        .shortcut-tag {
          font-size: 0.68rem;
          background: rgba(0, 0, 0, 0.25);
          padding: 1px 5px;
          border-radius: 4px;
          opacity: 0.9;
        }
        .realtime-editor-banner {
          background: linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%);
          border-bottom: 1px solid rgba(245, 158, 11, 0.35);
          padding: 6px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #FEF3C7;
          animation: pulseGlow 3s infinite;
        }
        .banner-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .banner-warning-icon {
          color: #F59E0B;
        }
        .banner-subtext {
          font-size: 0.75rem;
          color: #FCD34D;
        }
        .monaco-canvas-host {
          flex: 1;
          width: 100%;
          min-height: 250px;
          position: relative;
        }
      `}</style>
    </div>
  );
};
