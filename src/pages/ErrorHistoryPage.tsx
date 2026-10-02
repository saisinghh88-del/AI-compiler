import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Code2, 
  ArrowRight, 
  Clock, 
  Layers, 
  HelpCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { MistakeRecord, Language } from '../types';
import { LANGUAGES } from '../services/languageDetector';
import { markMistakeResolved } from '../services/smartLearningEngine';

interface ErrorHistoryPageProps {
  mistakes: MistakeRecord[];
  onUpdateMistakes: (updated: MistakeRecord[]) => void;
  onPracticeMistake: (lang: Language, snippet: string) => void;
}

export const ErrorHistoryPage: React.FC<ErrorHistoryPageProps> = ({
  mistakes,
  onUpdateMistakes,
  onPracticeMistake
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');

  const handleToggleResolved = (id: string) => {
    const updated = markMistakeResolved(id);
    onUpdateMistakes(updated);
  };

  const filteredMistakes = mistakes.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.codeSnippet.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLang === 'all' || m.language === selectedLang;
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'resolved' && m.resolved) ||
                          (statusFilter === 'unresolved' && !m.resolved);
    return matchesSearch && matchesLang && matchesStatus;
  });

  return (
    <div className="error-history-container">
      {/* Header Banner */}
      <div className="history-header glass-panel">
        <div className="history-header-left">
          <div className="header-icon-bubble">
            <History size={24} className="text-blue" />
          </div>
          <div>
            <h1 className="history-title">Mistake Vault</h1>
            <p className="history-sub">
              "Errors are proof that you are trying." SmartLearn tracks your mistake patterns to graduate you from subtle hints to full mastery.
            </p>
          </div>
        </div>

        <div className="history-stats-pill">
          <span className="stats-pill-num">{mistakes.length}</span>
          <span className="stats-pill-label">Total Mistakes Logged</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-controls-row">
        <div className="search-input-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mistakes by syntax, title, or code snippet..."
            className="search-field"
          />
        </div>

        <div className="filters-group">
          {/* Language filter */}
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Languages</option>
            {Object.values(LANGUAGES).map((l) => (
              <option key={l.id} value={l.id}>
                {l.emoji} {l.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="unresolved">Needs Practice</option>
            <option value="resolved">Understood</option>
          </select>
        </div>
      </div>

      {/* Mistake Cards Grid */}
      <div className="mistake-cards-list">
        {filteredMistakes.length > 0 ? (
          filteredMistakes.map((record) => {
            const langMeta = LANGUAGES[record.language] || LANGUAGES.python;
            const levelLabel = record.occurrenceCount === 1 
              ? 'Level 1 (First Time)' 
              : record.occurrenceCount === 2 
                ? 'Level 2 (Reminder Active)' 
                : 'Level 3 (Mastery Mode)';

            return (
              <div key={record.id} className={`mistake-card glass-panel ${record.resolved ? 'mistake-resolved' : ''}`}>
                <div className="card-top-bar">
                  <div className="lang-and-cat">
                    <span className="lang-pill-tag">
                      {langMeta.emoji} {langMeta.name}
                    </span>
                    <span className="category-pill-tag">{record.category}</span>
                  </div>

                  <div className="occurrence-badge">
                    <span className="recurrence-count">Encountered {record.occurrenceCount}x</span>
                    <span className="level-tag-mini">{levelLabel}</span>
                  </div>
                </div>

                <div className="mistake-main-info">
                  <h3 className="mistake-title-text">{record.title}</h3>
                  {record.notes && <p className="mistake-notes-text">{record.notes}</p>}
                </div>

                {/* Code Snippet Box */}
                <div className="snippet-preview-box">
                  <span className="snippet-label">Triggering Code:</span>
                  <pre className="snippet-code font-mono">{record.codeSnippet}</pre>
                </div>

                {/* Footer Actions */}
                <div className="mistake-card-footer">
                  <div className="date-meta">
                    <Clock size={13} />
                    <span>Last seen {new Date(record.lastSeen).toLocaleDateString()}</span>
                  </div>

                  <div className="card-action-buttons">
                    <button
                      onClick={() => handleToggleResolved(record.id)}
                      className={`btn btn-sm ${record.resolved ? 'btn-outline' : 'btn-success'}`}
                    >
                      <CheckCircle2 size={14} />
                      <span>{record.resolved ? 'Marked Understood' : 'Mark Understood'}</span>
                    </button>

                    <button
                      onClick={() => onPracticeMistake(record.language, record.codeSnippet)}
                      className="btn btn-primary btn-sm"
                      title="Open this mistake pattern in the compiler to practice fixing it"
                    >
                      <Code2 size={14} />
                      <span>Practice in Compiler</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-vault-card glass-panel">
            <Sparkles size={36} className="text-blue" />
            <h3>No mistakes match your filter</h3>
            <p>Try clearing your search query or practicing in the Compiler to log new syntax discoveries!</p>
          </div>
        )}
      </div>

      <style>{`
        .error-history-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px 24px 60px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 32px;
          gap: 20px;
        }
        .history-header-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .header-icon-bubble {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background: var(--blue-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .history-title {
          font-size: 2rem;
          font-weight: 800;
        }
        .history-sub {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-top: 4px;
          max-width: 650px;
          line-height: 1.45;
        }
        .history-stats-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          padding: 12px 20px;
          border-radius: var(--radius-md);
          min-width: 140px;
        }
        .stats-pill-num {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--blue-primary);
        }
        .stats-pill-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
        }
        .filter-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .search-input-box {
          position: relative;
          flex: 1;
          min-width: 280px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .search-field {
          width: 100%;
          padding: 10px 14px 10px 38px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.9rem;
          outline: none;
        }
        .search-field:focus {
          border-color: var(--blue-primary);
        }
        .filters-group {
          display: flex;
          gap: 10px;
        }
        .filter-select {
          padding: 10px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }
        .mistake-cards-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
          gap: 20px;
        }
        .mistake-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .mistake-resolved {
          border-color: rgba(16, 185, 129, 0.35);
          background: rgba(16, 185, 129, 0.03);
        }
        .card-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .lang-and-cat {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lang-pill-tag {
          font-size: 0.775rem;
          font-weight: 700;
          background: var(--blue-subtle);
          color: var(--blue-primary);
          padding: 3px 8px;
          border-radius: 9999px;
        }
        .category-pill-tag {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          padding: 3px 6px;
          border-radius: 4px;
          font-weight: 600;
        }
        .occurrence-badge {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .recurrence-count {
          font-size: 0.75rem;
          font-weight: 700;
          color: #F59E0B;
        }
        .level-tag-mini {
          font-size: 0.65rem;
          color: var(--text-muted);
        }
        .mistake-main-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mistake-title-text {
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.3;
        }
        .mistake-notes-text {
          font-size: 0.825rem;
          color: var(--text-secondary);
        }
        .snippet-preview-box {
          background: #060A14;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 10px 12px;
        }
        .snippet-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
          display: block;
          margin-bottom: 4px;
        }
        .snippet-code {
          color: #F87171;
          font-size: 0.825rem;
          white-space: pre-wrap;
          line-height: 1.4;
        }
        .mistake-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-subtle);
          padding-top: 14px;
          margin-top: auto;
          gap: 12px;
          flex-wrap: wrap;
        }
        .date-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .card-action-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .empty-vault-card {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        @media (max-width: 768px) {
          .mistake-cards-list {
            grid-template-columns: 1fr;
          }
          .history-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};
