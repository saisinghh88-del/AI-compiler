import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Terminal, 
  Sparkles, 
  Code2, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Zap,
  ArrowRight
} from 'lucide-react';
import { LANGUAGES } from '../services/languageDetector';
import { Language } from '../types';

interface LibraryPageProps {
  onLoadSnippet: (lang: Language, snippet: string) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onLoadSnippet }) => {
  const [selectedLang, setSelectedLang] = useState<Language>('python');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const curLang = LANGUAGES[selectedLang];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="seto-library-container">
      <div className="seto-library-header">
        <div>
          <h2 className="seto-library-title">Language Library & Cheat Sheets</h2>
          <p className="seto-library-subtitle">
            Curated syntax references, common gotchas, and starter templates for {Object.keys(LANGUAGES).length} languages.
          </p>
        </div>
      </div>

      {/* Language Selector Pills */}
      <div className="seto-library-lang-pills">
        {Object.values(LANGUAGES).map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedLang(l.id)}
            className={`seto-lang-pill-btn ${selectedLang === l.id ? 'active' : ''}`}
          >
            <span>{l.emoji}</span>
            <span>{l.name}</span>
          </button>
        ))}
      </div>

      {/* Language Deep Dive Card */}
      <div className="seto-library-card">
        <div className="seto-library-card-header">
          <div className="seto-library-card-left">
            <span className="seto-library-emoji">{curLang.emoji}</span>
            <div>
              <h3>{curLang.name} Standard Reference</h3>
              <span className="seto-library-ext">File Extension: .{curLang.extension}</span>
            </div>
          </div>

          <button 
            className="seto-library-run-btn"
            onClick={() => onLoadSnippet(curLang.id, curLang.defaultTemplate)}
          >
            <Terminal size={15} />
            <span>Open in Studio</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <p className="seto-library-desc">{curLang.description}</p>

        {/* Code Blocks Grid */}
        <div className="seto-library-code-grid">
          <div className="seto-code-box">
            <div className="seto-code-box-header">
              <span>Standard Starter Template</span>
              <button 
                className="seto-copy-btn"
                onClick={() => handleCopy('tpl', curLang.defaultTemplate)}
              >
                {copiedId === 'tpl' ? <CheckCircle2 size={14} className="text-emerald" /> : <Copy size={14} />}
                <span>{copiedId === 'tpl' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="seto-pre font-mono">
              <code>{curLang.defaultTemplate}</code>
            </pre>
          </div>

          <div className="seto-code-box">
            <div className="seto-code-box-header">
              <span>Typical Beginner Mistake to Test</span>
              <button 
                className="seto-copy-btn"
                onClick={() => handleCopy('bug', curLang.sampleBuggyCode)}
              >
                {copiedId === 'bug' ? <CheckCircle2 size={14} className="text-emerald" /> : <Copy size={14} />}
                <span>{copiedId === 'bug' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="seto-pre font-mono">
              <code>{curLang.sampleBuggyCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
