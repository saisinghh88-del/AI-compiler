import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  Settings as SettingsIcon, 
  Sliders, 
  Mic, 
  MicOff, 
  ArrowUp, 
  Sparkles,
  CheckCircle2,
  Code2,
  Terminal,
  Cpu
} from 'lucide-react';
import { 
  IridescentCrystalStar, 
  PastelStar3DIcon, 
  PastelPencil3DIcon, 
  PastelPalette3DIcon 
} from './SetoIcons';
import { AuthUser } from '../types';

interface SetoHeroCanvasProps {
  user: AuthUser;
  onNavigateToStudio: () => void;
  onNavigateToCollections: () => void;
  onOpenSettings: () => void;
  onSubmitPrompt: (prompt: string) => void;
}

export const SetoHeroCanvas: React.FC<SetoHeroCanvasProps> = ({
  user,
  onNavigateToStudio,
  onNavigateToCollections,
  onOpenSettings,
  onSubmitPrompt
}) => {
  const [promptText, setPromptText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<'compiler' | 'creative' | 'mentor'>('compiler');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Get first name
  const firstName = user?.name ? user.name.split(' ')[0] : 'Allison';

  // Quick Action Cards definition
  const quickCards = [
    {
      id: 'generate-visual',
      title: 'Generate visual',
      description: 'Create images from text prompts instantly',
      icon: PastelStar3DIcon,
      action: () => {
        setPromptText('Create a modern generative visual algorithm in Python with turtle or matplotlib');
      }
    },
    {
      id: 'improve-prompt',
      title: 'Improve prompt',
      description: 'Enhance your prompt automatically',
      icon: PastelPencil3DIcon,
      action: () => {
        setPromptText('Analyze my code syntax and provide a Socratic explanation for the most common bug');
      }
    },
    {
      id: 'explore-styles',
      title: 'Explore styles',
      description: 'Apply curated visual aesthetics and styles',
      icon: PastelPalette3DIcon,
      action: () => {
        onNavigateToCollections();
      }
    }
  ];

  // Speech Recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPromptText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      setStatusFeedback("Voice dictation is not supported in this browser.");
      setTimeout(() => setStatusFeedback(null), 3000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setPromptText(`Inspect attached file (${file.name}):\n` + content.slice(0, 300));
        setStatusFeedback(`Attached ${file.name}`);
        setTimeout(() => setStatusFeedback(null), 3000);
      };
      reader.readAsText(file);
    }
  };

  const handleSendPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;
    
    onSubmitPrompt(promptText);
    setStatusFeedback("Processing command with AI...");
    setTimeout(() => {
      setStatusFeedback(null);
      onNavigateToStudio();
    }, 700);
  };

  return (
    <div className="seto-hero-canvas">
      {/* Hidden file input for attachment */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        style={{ display: 'none' }} 
        accept=".py,.c,.cpp,.java,.js,.ts,.rs,.go,.txt"
      />

      {/* Center Hero Block */}
      <div className="seto-hero-center-content">
        {/* Iridescent Glowing Crystal Star */}
        <div className="seto-star-container">
          <IridescentCrystalStar size={110} />
        </div>

        {/* Welcome Typography */}
        <h1 className="seto-hero-title">Welcome, {firstName}!</h1>
        <p className="seto-hero-subtitle">How can I help you today?</p>

        {/* 3 Quick Action Cards */}
        <div className="seto-quick-cards-grid">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id} 
                className="seto-quick-card"
                onClick={card.action}
                role="button"
                tabIndex={0}
              >
                <div className="seto-quick-card-icon-box">
                  <Icon size={40} />
                </div>
                <h3 className="seto-quick-card-title">{card.title}</h3>
                <p className="seto-quick-card-desc">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom AI Command Bar */}
      <div className="seto-bottom-prompt-wrapper">
        {statusFeedback && (
          <div className="seto-prompt-status-toast">
            <Sparkles size={14} />
            <span>{statusFeedback}</span>
          </div>
        )}

        <form onSubmit={handleSendPrompt} className="seto-prompt-bar-container">
          {/* Top Line: Sparkle + Input text */}
          <div className="seto-prompt-input-row">
            <Sparkles size={16} className="seto-prompt-sparkle" />
            <input 
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Initiate a query or send a command to the AI..."
              className="seto-prompt-input"
              autoFocus
            />
          </div>

          {/* Bottom Action Pill Bar */}
          <div className="seto-prompt-actions-row">
            {/* Left Action Buttons */}
            <div className="seto-prompt-left-actions">
              <button 
                type="button" 
                className="seto-pill-action-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Attach source file or document"
              >
                <Paperclip size={14} />
                <span>Attach</span>
              </button>

              <button 
                type="button" 
                className="seto-pill-action-btn"
                onClick={onOpenSettings}
                title="Compiler and AI Settings"
              >
                <SettingsIcon size={14} />
                <span>Settings</span>
              </button>

              <div className="seto-options-dropdown-wrapper">
                <button 
                  type="button" 
                  className={`seto-pill-action-btn ${optionsMenuOpen ? 'active' : ''}`}
                  onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
                  title="Execution Options"
                >
                  <Sliders size={14} />
                  <span>Options</span>
                </button>

                {optionsMenuOpen && (
                  <div className="seto-options-popover">
                    <div className="seto-popover-item" onClick={() => { setSelectedEngine('compiler'); setOptionsMenuOpen(false); }}>
                      <Terminal size={14} />
                      <span>Code Studio & Compiler</span>
                      {selectedEngine === 'compiler' && <CheckCircle2 size={12} className="text-emerald" />}
                    </div>
                    <div className="seto-popover-item" onClick={() => { setSelectedEngine('mentor'); setOptionsMenuOpen(false); }}>
                      <Cpu size={14} />
                      <span>Socratic AI Mentor</span>
                      {selectedEngine === 'mentor' && <CheckCircle2 size={12} className="text-emerald" />}
                    </div>
                    <div className="seto-popover-item" onClick={() => { setSelectedEngine('creative'); setOptionsMenuOpen(false); }}>
                      <Code2 size={14} />
                      <span>Visual Algorithmic Studio</span>
                      {selectedEngine === 'creative' && <CheckCircle2 size={12} className="text-emerald" />}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="seto-prompt-right-actions">
              {/* Voice button */}
              <button 
                type="button" 
                className={`seto-mic-action-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleVoice}
                title={isListening ? "Listening... Click to stop" : "Voice dictation"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={!promptText.trim()}
                className={`seto-submit-action-btn ${promptText.trim() ? 'active' : ''}`}
                title="Send command"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
