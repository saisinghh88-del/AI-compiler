import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, 
  Play, 
  Trash2, 
  Copy, 
  Check, 
  Cpu, 
  Clock, 
  Maximize2, 
  Minimize2,
  AlertTriangle,
  CheckCircle2,
  FileCode2
} from 'lucide-react';
import { ExecutionResult } from '../types';

interface TerminalConsoleProps {
  result: ExecutionResult;
  isRunning: boolean;
  stdin: string;
  onChangeStdin: (val: string) => void;
  onClear: () => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  result,
  isRunning,
  stdin,
  onChangeStdin,
  onClear
}) => {
  const [activeTab, setActiveTab] = useState<'output' | 'compile' | 'stdin' | 'stats'>('output');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    const textToCopy = activeTab === 'compile' ? result.compileOutput : result.stdout || result.stderr;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`terminal-card ${isExpanded ? 'terminal-expanded' : ''}`}>
      {/* Terminal Toolbar */}
      <div className="terminal-header">
        <div className="terminal-tabs">
          <button
            onClick={() => setActiveTab('output')}
            className={`term-tab ${activeTab === 'output' ? 'term-tab-active' : ''}`}
          >
            <TerminalIcon size={14} />
            <span>Output</span>
            {result.status === 'success' && <span className="tab-dot dot-success" />}
            {result.status === 'error' && <span className="tab-dot dot-error" />}
          </button>

          <button
            onClick={() => setActiveTab('compile')}
            className={`term-tab ${activeTab === 'compile' ? 'term-tab-active' : ''}`}
          >
            <FileCode2 size={14} />
            <span>Compiler Log</span>
            {result.stderr && <span className="term-badge-alert">!</span>}
          </button>

          <button
            onClick={() => setActiveTab('stdin')}
            className={`term-tab ${activeTab === 'stdin' ? 'term-tab-active' : ''}`}
          >
            <span>Input (stdin)</span>
            {stdin.trim() && <span className="tab-dot dot-active" />}
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`term-tab ${activeTab === 'stats' ? 'term-tab-active' : ''}`}
          >
            <Cpu size={14} />
            <span>Metrics</span>
          </button>
        </div>

        {/* Status indicator and actions */}
        <div className="terminal-controls">
          {isRunning && (
            <div className="running-pill">
              <span className="spinner-dots" />
              <span>Executing...</span>
            </div>
          )}

          {!isRunning && result.status !== 'idle' && (
            <div className={`status-pill status-${result.status}`}>
              {result.status === 'success' ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>Exit 0</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={13} />
                  <span>Exit {result.exitCode || 1}</span>
                </>
              )}
            </div>
          )}

          <button onClick={handleCopy} className="term-icon-btn" title="Copy output">
            {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
          </button>

          <button onClick={onClear} className="term-icon-btn" title="Clear console">
            <Trash2 size={14} />
          </button>

          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="term-icon-btn" 
            title={isExpanded ? 'Collapse' : 'Expand Terminal'}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Terminal View Content */}
      <div className="terminal-body font-mono">
        {activeTab === 'output' && (
          <div className="output-scroll-pane">
            {isRunning ? (
              <div className="terminal-placeholder running-animation">
                <Play size={16} className="play-pulse" />
                <span>Compiling and running code...</span>
              </div>
            ) : (result.stdout || result.stderr || (result.status === 'error' && result.compileOutput)) ? (
              <div className="output-content-stream">
                {result.stdout && (
                  <pre className="stdout-text">{result.stdout}</pre>
                )}
                {(result.stderr || (result.status === 'error' && result.compileOutput)) && (
                  <div className="stderr-block">
                    <div className="stderr-header">
                      <AlertTriangle size={14} />
                      <span>{result.status === 'error' ? 'Compiler / Runtime Error:' : 'Standard Error:'}</span>
                    </div>
                    <pre className="stderr-text">{result.stderr || result.compileOutput}</pre>
                  </div>
                )}
              </div>
            ) : result.status === 'success' ? (
              <div className="terminal-placeholder">
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Program finished successfully with no output (Exit 0).</span>
              </div>
            ) : (
              <div className="terminal-placeholder">
                <span>Click "Run Code" or press Ctrl + Enter to execute your program.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compile' && (
          <div className="compile-log-pane">
            {result.compileOutput ? (
              <pre className="compile-text">{result.compileOutput}</pre>
            ) : (
              <div className="terminal-placeholder">
                <span>No compiler messages yet. Click "Run Code" to inspect build pipeline.</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stdin' && (
          <div className="stdin-pane">
            <p className="stdin-helper-text">
              Provide simulated standard input (stdin) for programs that read from console (e.g. <code>input()</code>, <code>scanf()</code>, or <code>Scanner</code>):
            </p>
            <textarea
              value={stdin}
              onChange={(e) => onChangeStdin(e.target.value)}
              placeholder="e.g. 42&#10;Alice&#10;10 20 30"
              className="stdin-textarea font-mono"
              rows={4}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="metrics-pane">
            <div className="metric-box">
              <Clock size={18} className="metric-icon" />
              <div className="metric-meta">
                <span className="metric-label">Execution Time</span>
                <span className="metric-val">{result.executionTime} ms</span>
              </div>
            </div>
            <div className="metric-box">
              <Cpu size={18} className="metric-icon" />
              <div className="metric-meta">
                <span className="metric-label">Memory Usage</span>
                <span className="metric-val">{(result.memory / 1024).toFixed(2)} MB</span>
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-meta">
                <span className="metric-label">Last Timestamp</span>
                <span className="metric-val">{result.timestamp || 'Ready'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .terminal-card {
          background: #060A14;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 220px;
          transition: height 0.25s ease;
        }
        [data-theme='light'] .terminal-card {
          background: #0F172A;
          border-color: #1E293B;
        }
        .terminal-expanded {
          height: 380px;
        }
        .terminal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(15, 23, 42, 0.95);
          padding: 6px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          gap: 12px;
        }
        .terminal-tabs {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .term-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: transparent;
          border: none;
          color: #94A3B8;
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .term-tab:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.06);
        }
        .term-tab-active {
          color: #60A5FA !important;
          background: rgba(59, 130, 246, 0.15) !important;
        }
        .tab-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .dot-success { background: #10B981; }
        .dot-error { background: #EF4444; }
        .dot-active { background: #3B82F6; }
        .term-badge-alert {
          background: #EF4444;
          color: white;
          font-size: 0.65rem;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .terminal-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .running-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #60A5FA;
          font-weight: 600;
        }
        .status-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .status-success {
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .status-error {
          background: rgba(239, 68, 68, 0.15);
          color: #F87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .term-icon-btn {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          background: transparent;
          border: 1px solid transparent;
          color: #94A3B8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .term-icon-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.08);
        }
        .terminal-body {
          flex: 1;
          padding: 12px 16px;
          overflow-y: auto;
          font-size: 0.875rem;
          line-height: 1.6;
          color: #E2E8F0;
        }
        .stdout-text {
          white-space: pre-wrap;
          color: #F8FAFC;
        }
        .stderr-block {
          background: rgba(239, 68, 68, 0.08);
          border-left: 3px solid #EF4444;
          padding: 8px 12px;
          border-radius: 4px;
        }
        .stderr-header {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #F87171;
          font-weight: 600;
          font-size: 0.8rem;
          margin-bottom: 6px;
        }
        .stderr-text {
          color: #FCA5A5;
          white-space: pre-wrap;
        }
        .compile-text {
          color: #94A3B8;
          white-space: pre-wrap;
        }
        .terminal-placeholder {
          height: 100%;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          font-size: 0.85rem;
          gap: 8px;
        }
        .stdin-pane {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stdin-helper-text {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          color: #94A3B8;
        }
        .stdin-textarea {
          width: 100%;
          background: #030712;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          color: #60A5FA;
          padding: 8px 12px;
          outline: none;
          font-size: 0.85rem;
          resize: vertical;
        }
        .metrics-pane {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          padding-top: 8px;
        }
        .metric-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .metric-icon {
          color: #60A5FA;
        }
        .metric-meta {
          display: flex;
          flex-direction: column;
        }
        .metric-label {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          color: #64748B;
          text-transform: uppercase;
          font-weight: 600;
        }
        .metric-val {
          font-size: 0.95rem;
          font-weight: 700;
          color: #F8FAFC;
        }
        .text-emerald {
          color: #10B981;
        }
      `}</style>
    </div>
  );
};
