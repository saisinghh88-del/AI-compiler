import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  Lightbulb, 
  AlertTriangle,
  HelpCircle,
  Code
} from 'lucide-react';
import { AIMessage } from '../types';

interface SetoRightSidebarProps {
  messages: AIMessage[];
  isThinking: boolean;
  onSendMessage: (text: string) => void;
  activeMistakeHint?: string | null;
}

export const SetoRightSidebar: React.FC<SetoRightSidebarProps> = ({
  messages,
  isThinking,
  onSendMessage,
  activeMistakeHint
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <aside className="seto-right-sidebar">
      {/* Header */}
      <div className="seto-history-header">
        <div className="seto-ai-header-title">
          <Bot size={18} className="text-purple" />
          <h3 className="seto-history-title">AI Mentor</h3>
        </div>
        <span className="seto-ai-online-badge">Active</span>
      </div>

      {/* Active Socratic Error Alert if code failed */}
      {activeMistakeHint && (
        <div className="seto-active-hint-card">
          <div className="seto-hint-title-row">
            <Lightbulb size={15} className="text-amber" />
            <span>Socratic Guide</span>
          </div>
          <p className="seto-hint-text">{activeMistakeHint}</p>
        </div>
      )}

      {/* Messages Stream */}
      <div className="seto-messages-scroll-pane">
        {messages.map((msg) => (
          <div key={msg.id} className={`seto-chat-bubble ${msg.sender === 'user' ? 'user' : 'ai'}`}>
            <div className="seto-chat-bubble-header">
              <span className="seto-chat-sender-name">
                {msg.sender === 'user' ? 'You' : 'SETO AI'}
              </span>
              <span className="seto-chat-time">{msg.timestamp}</span>
            </div>
            <p className="seto-chat-text">{msg.text}</p>
            {msg.codeExample && (
              <pre className="seto-chat-code-snippet font-mono">
                <code>{msg.codeExample}</code>
              </pre>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="seto-chat-bubble ai thinking">
            <div className="seto-chat-bubble-header">
              <span className="seto-chat-sender-name">SETO AI</span>
            </div>
            <div className="seto-thinking-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="seto-quick-prompts-row">
        <button 
          type="button" 
          onClick={() => handleQuickPrompt("Explain why my code produced this output or error.")}
          className="seto-quick-chip-btn"
        >
          <HelpCircle size={12} />
          <span>Explain output</span>
        </button>
        <button 
          type="button" 
          onClick={() => handleQuickPrompt("Give me a hint to optimize or fix my code without giving away the full answer.")}
          className="seto-quick-chip-btn"
        >
          <Lightbulb size={12} />
          <span>Socratic hint</span>
        </button>
      </div>

      {/* Bottom Input Form */}
      <form onSubmit={handleSubmit} className="seto-ai-input-form">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask AI Mentor anything..."
          className="seto-ai-chat-input"
        />
        <button 
          type="submit" 
          disabled={!inputText.trim()}
          className={`seto-ai-send-btn ${inputText.trim() ? 'active' : ''}`}
          title="Send"
        >
          <Send size={14} />
        </button>
      </form>
    </aside>
  );
};
