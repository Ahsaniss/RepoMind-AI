import React, { useState, useRef, useEffect, useCallback } from 'react';
import { postAIChat, type AIMessage } from '../../services/ai';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  repositoryId?: string;
  onNavigate?: (file: string, line: number) => void;
}

// ─── Suggested prompts ───────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  'Find the most serious bug in this repository',
  'Explain how authentication works',
  'Analyze the security of this repository',
  'Generate tests for the authentication service',
  'Explain the architecture',
  'What should I refactor first?',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseInlineRefs(
  text: string,
  refs: { file: string; line: number }[],
  onNavigate?: (file: string, line: number) => void
): (string | React.ReactNode)[] {
  if (!refs || refs.length === 0) return [text];

  // Build regex from known refs
  const parts: (string | React.ReactNode)[] = [];
  let remaining = text;

  for (const ref of refs) {
    const marker = `${ref.file}:${ref.line}`;
    const idx = remaining.indexOf(marker);
    if (idx === -1) continue;
    if (idx > 0) parts.push(remaining.slice(0, idx));
    parts.push(
      <button
        key={`${ref.file}-${ref.line}-${idx}`}
        className="file-ref-link"
        onClick={() => onNavigate?.(ref.file, ref.line)}
        title={`Open ${ref.file} at line ${ref.line}`}
      >
        📄 {marker}
      </button>
    );
    remaining = remaining.slice(idx + marker.length);
  }
  if (remaining) parts.push(remaining);
  return parts;
}

/** Very lightweight markdown→HTML renderer for code blocks and bold/inline-code */
function renderMarkdown(
  text: string,
  refs: { file: string; line: number }[] | undefined,
  onNavigate?: (file: string, line: number) => void
): React.ReactNode {
  // Split by fenced code blocks
  const segments = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="ai-response-body">
      {segments.map((seg, i) => {
        if (seg.startsWith('```')) {
          const lines = seg.split('\n');
          const lang = lines[0].replace('```', '').trim();
          const code = lines.slice(1, -1).join('\n');
          return (
            <div key={i} className="code-block-wrapper">
              {lang && <span className="code-lang-badge">{lang}</span>}
              <pre className="code-block">
                <code>{code}</code>
              </pre>
              <button
                className="copy-code-btn"
                onClick={() => navigator.clipboard.writeText(code)}
              >
                Copy
              </button>
            </div>
          );
        }

        // Render inline markdown (bold, inline-code, file refs)
        const paragraphs = seg.split('\n\n');
        return (
          <div key={i}>
            {paragraphs.map((para, pi) => {
              // Bold **text**
              const withBold = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              // Inline code `text`
              const withCode = withBold.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
              // Headings ## and ###
              const withHeadings = withCode
                .replace(/^### (.*)$/gm, '<h4>$1</h4>')
                .replace(/^## (.*)$/gm, '<h3>$1</h3>')
                .replace(/^# (.*)$/gm, '<h2>$1</h2>');

              // Inject clickable file refs if any match
              const refNodes = refs && refs.length > 0
                ? parseInlineRefs(withHeadings, refs, onNavigate)
                : [withHeadings];

              return (
                <p
                  key={pi}
                  className="ai-para"
                  dangerouslySetInnerHTML={
                    refNodes.length === 1 && typeof refNodes[0] === 'string'
                      ? { __html: refNodes[0] }
                      : undefined
                  }
                >
                  {refNodes.length > 1 || typeof refNodes[0] !== 'string'
                    ? refNodes.map((node, ni) =>
                        typeof node === 'string'
                          ? <span key={ni} dangerouslySetInnerHTML={{ __html: node }} />
                          : node
                      )
                    : undefined}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatPanel({ repositoryId = 'demo-1', onNavigate }: Props) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      setError(null);

      const userMsg: AIMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      try {
        const reply = await postAIChat({ repositoryId, message: text });
        setMessages(prev => [...prev, reply]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [loading, repositoryId]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <span className="chat-header-icon">🧠</span>
        <div>
          <h2 className="chat-header-title">AI Engineer</h2>
          <p className="chat-header-sub">Powered by Gemini · Repository: {repositoryId}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && !loading && (
          <div className="chat-empty">
            <p className="chat-empty-title">Ask RepoMind AI anything about this repository</p>
            <div className="suggested-prompts">
              {SUGGESTED_PROMPTS.map(p => (
                <button key={p} className="suggested-prompt-btn" onClick={() => send(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`chat-message chat-message--${msg.role}`}>
            {msg.role === 'user' ? (
              <div className="user-bubble">
                <span className="user-avatar">You</span>
                <p className="user-text">{msg.content}</p>
              </div>
            ) : (
              <div className="assistant-bubble">
                <div className="assistant-header">
                  <span className="assistant-badge">🧠 RepoMind AI</span>
                  {msg.model && <span className="model-badge">{msg.model}</span>}
                </div>

                {renderMarkdown(msg.content, msg.references, onNavigate)}

                {/* File references */}
                {msg.references && msg.references.length > 0 && (
                  <div className="file-references">
                    <p className="file-refs-label">Referenced files</p>
                    <div className="file-refs-list">
                      {msg.references.map((ref, i) => (
                        <button
                          key={i}
                          className="file-ref-chip"
                          onClick={() => onNavigate?.(ref.file, ref.line)}
                        >
                          📄 {ref.file}:{ref.line}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Context files used */}
                {msg.contextFilesUsed && msg.contextFilesUsed.length > 0 && (
                  <details className="context-files">
                    <summary>Context files used ({msg.contextFilesUsed.length})</summary>
                    <ul>
                      {msg.contextFilesUsed.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </details>
                )}

                {/* Action buttons */}
                <div className="assistant-actions">
                  <button
                    className="action-btn"
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                  >
                    Copy Response
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => send(`Generate a fix for the issue described above in ${repositoryId}`)}
                  >
                    Generate Fix
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => send(`Generate tests for the code described above in ${repositoryId}`)}
                  >
                    Generate Tests
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading state */}
        {loading && (
          <div className="chat-message chat-message--assistant">
            <div className="assistant-bubble thinking-bubble">
              <span className="thinking-icon">🧠</span>
              <span className="thinking-text">RepoMind is thinking</span>
              <span className="thinking-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="chat-error">
            ⚠️ {error}
            <button className="chat-error-dismiss" onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input form */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          className="chat-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask anything about this repository…"
          disabled={loading}
        />
        <button
          className="chat-send-btn"
          type="submit"
          disabled={loading || !input.trim()}
        >
          {loading ? '⏳' : '↑'}
        </button>
      </form>
    </div>
  );
}
