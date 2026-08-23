import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { demoRepositories } from '../data/demoRepository';

interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  updatedAt: string;
  url: string;
  visibility: string;
  owner: string;
}

function healthColor(score: number) {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  return '#EF4444';
}

export default function RepositoriesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [ghRepos, setGhRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // On mount: check if GitHub is already authenticated
  useEffect(() => {
    fetch('/api/github/status')
      .then(r => r.json())
      .then((data: { authenticated: boolean }) => {
        if (data.authenticated) {
          setConnected(true);
          fetchGhRepos();
        }
      })
      .catch(() => {});
  }, []);

  // Handle redirect from GitHub OAuth callback
  useEffect(() => {
    const connectedParam = searchParams.get('connected');
    const errorParam    = searchParams.get('error');

    if (connectedParam === 'true') {
      setConnected(true);
      fetchGhRepos();
      // Clean up query string without a reload
      window.history.replaceState({}, '', '/repositories');
    }
    if (errorParam) {
      const messages: Record<string, string> = {
        no_code:      'GitHub did not return an authorization code.',
        oauth_failed: 'OAuth exchange failed — please try again.',
      };
      setError(messages[errorParam] ?? `GitHub OAuth error: ${errorParam}`);
      window.history.replaceState({}, '', '/repositories');
    }
  }, [searchParams]);

  const fetchGhRepos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/github/repos');
      if (!res.ok) throw new Error('Failed to load repos');
      const data: GitHubRepo[] = await res.json();
      setGhRepos(data);
    } catch (err) {
      setError('Could not load your GitHub repositories.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    setConnecting(true);
    // Full-page redirect — the backend will redirect to GitHub
    window.location.href = '/api/github/auth';
  };

  const handleDisconnect = async () => {
    await fetch('/api/github/logout', { method: 'POST' });
    setConnected(false);
    setGhRepos([]);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Repositories</h1>
          <p className="page-subtitle">
            {connected
              ? `Connected to GitHub · ${ghRepos.length} repositories found`
              : 'Manage and analyze your connected repositories.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {connected ? (
            <button className="btn-ghost" onClick={handleDisconnect}>
              Disconnect GitHub
            </button>
          ) : (
            <button
              id="connect-repo-btn"
              className="btn-primary"
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? '⏳ Redirecting…' : '⊛ Connect GitHub'}
            </button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="chat-error" style={{ marginBottom: '1rem' }}>
          ⚠️ {error}
          <button className="chat-error-dismiss" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* GitHub connected success banner */}
      {connected && ghRepos.length > 0 && (
        <div
          style={{
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            background: 'rgba(16,185,129,.1)',
            border: '1px solid rgba(16,185,129,.25)',
            borderRadius: '0.5rem',
            color: '#34d399',
            fontSize: '0.875rem',
          }}
        >
          ✓ GitHub connected — showing your real repositories. Click any to open the AI workspace.
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ color: 'var(--color-text-secondary)', padding: '2rem 0', textAlign: 'center' }}>
          Loading your repositories…
        </div>
      )}

      {/* Repo grid */}
      {!loading && (
        <div className="repo-grid">
          {(connected && ghRepos.length > 0 ? ghRepos : demoRepositories).map(repo => {
            const score = 72; // placeholder health score
            const isGh  = connected && ghRepos.length > 0;
            const r     = repo as any;
            return (
              <div
                key={r.id}
                className="repo-card"
                onClick={() => navigate(`/repositories/${r.id}`)}
              >
                <div className="repo-card-header">
                  <div>
                    <h3 className="repo-card-name">{r.name}</h3>
                    <p className="repo-card-full">{r.fullName ?? r.full_name}</p>
                  </div>
                  <span className="repo-card-lang">{r.language ?? 'Unknown'}</span>
                </div>
                <p className="repo-card-desc">{r.description || 'No description provided.'}</p>
                <div className="repo-card-footer">
                  <div className="repo-health">
                    <span className="repo-health-label">Health</span>
                    <div className="repo-health-bar">
                      <div
                        className="repo-health-fill"
                        style={{ width: `${score}%`, background: healthColor(score) }}
                      />
                    </div>
                    <span className="repo-health-score" style={{ color: healthColor(score) }}>
                      {score}
                    </span>
                  </div>
                  <div className="repo-meta">
                    <span>★ {r.stars ?? r.stargazers_count ?? 0}</span>
                    <span>⑂ {r.forks ?? r.forks_count ?? 0}</span>
                    {isGh && <span>⚠ {r.openIssues ?? r.open_issues_count ?? 0}</span>}
                    <span className={r.visibility === 'private' ? 'repo-private' : 'repo-public'}>
                      {r.visibility}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state when connected but no repos */}
      {connected && !loading && ghRepos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-secondary)' }}>
          <p style={{ fontSize: '1rem' }}>No repositories found in your GitHub account.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Make sure you granted repository access during OAuth.</p>
        </div>
      )}
    </div>
  );
}
