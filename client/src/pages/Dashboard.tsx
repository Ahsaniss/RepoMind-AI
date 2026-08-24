import { useNavigate } from 'react-router-dom';
import { demoRepositories, demoDashboardStats, demoAnalysis } from '../data/demoRepository';
import { supabase } from '../supabase';

const connectGitHub = () => {
  supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      scopes: 'repo',
      redirectTo: 'https://repo-mind-ai-git-main-ahsaniss-projects.vercel.app'
    }
  });
};

const STAT_CARDS = [
  { id: 'repos',    label: 'Repositories',    value: 3,    icon: '◫', color: '#8B5CF6', change: '+2 this month' },
  { id: 'files',    label: 'Files Analyzed',  value: '9.2k', icon: '📄', color: '#3B82F6', change: '+1.2k this week' },
  { id: 'issues',   label: 'Issues Found',    value: demoDashboardStats.totalIssuesFound, icon: '⚠', color: '#F59E0B', change: '7 open' },
  { id: 'security', label: 'Security Risks',  value: 2,    icon: '🛡', color: '#EF4444', change: '2 critical' },
  { id: 'tests',    label: 'Tests Generated', value: 15,   icon: '✓', color: '#10B981', change: '+5 today' },
];

function healthColor(score: number) {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  return '#EF4444';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const score = demoAnalysis.score;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back — here is your repository overview.</p>
        </div>
        <button className="btn-primary" onClick={connectGitHub}>
          ⊛ Connect GitHub
        </button>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {STAT_CARDS.map(card => (
          <div key={card.id} className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">{card.label}</span>
              <span className="stat-card-icon" style={{ color: card.color }}>{card.icon}</span>
            </div>
            <div className="stat-card-value" style={{ color: card.color }}>{card.value}</div>
            <div className="stat-card-change">{card.change}</div>
          </div>
        ))}
      </div>

      {/* Repository cards */}
      <div className="section-header">
        <h2 className="section-title">Your Repositories</h2>
        <button className="btn-ghost" onClick={() => navigate('/repositories')}>View all →</button>
      </div>

      <div className="repo-grid">
        {demoRepositories.map(repo => {
          const repoScore = repo.id === 'demo-1' ? score : Math.floor(Math.random() * 30) + 60;
          return (
            <div
              key={repo.id}
              className="repo-card"
              onClick={() => navigate(`/repositories/${repo.id}`)}
            >
              <div className="repo-card-header">
                <div>
                  <h3 className="repo-card-name">{repo.name}</h3>
                  <p className="repo-card-full">{repo.fullName}</p>
                </div>
                <span className="repo-card-lang">{repo.language}</span>
              </div>

              <p className="repo-card-desc">{repo.description}</p>

              <div className="repo-card-footer">
                <div className="repo-health">
                  <span className="repo-health-label">Health</span>
                  <div className="repo-health-bar">
                    <div
                      className="repo-health-fill"
                      style={{ width: `${repoScore}%`, background: healthColor(repoScore) }}
                    />
                  </div>
                  <span className="repo-health-score" style={{ color: healthColor(repoScore) }}>
                    {repoScore}
                  </span>
                </div>
                <div className="repo-meta">
                  <span>★ {repo.stars}</span>
                  <span>⑂ {repo.forks}</span>
                  <span className={repo.visibility === 'private' ? 'repo-private' : 'repo-public'}>
                    {repo.visibility}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent issues */}
      <div className="section-header">
        <h2 className="section-title">Recent Issues</h2>
        <button className="btn-ghost" onClick={() => navigate('/analysis')}>View analysis →</button>
      </div>
      <div className="issues-list">
        {demoAnalysis.issues.map(issue => (
          <div key={issue.id} className="issue-row">
            <span className={`issue-severity issue-severity--${issue.severity}`}>
              {issue.severity.toUpperCase()}
            </span>
            <div className="issue-info">
              <p className="issue-title">{issue.title}</p>
              <p className="issue-file">{issue.file}:{issue.line}</p>
            </div>
            <span className="issue-category">{issue.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
