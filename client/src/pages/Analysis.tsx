import { demoAnalysis } from '../data/demoRepository';

const METRICS = [
  { key: 'codeQuality',    label: 'Code Quality',    color: '#8B5CF6' },
  { key: 'security',       label: 'Security',        color: '#EF4444' },
  { key: 'performance',    label: 'Performance',     color: '#F59E0B' },
  { key: 'maintainability',label: 'Maintainability', color: '#3B82F6' },
  { key: 'testCoverage',   label: 'Test Coverage',   color: '#10B981' },
  { key: 'documentation',  label: 'Documentation',   color: '#6366F1' },
];

export default function AnalysisPage() {
  const { metrics, issues, score, summary } = demoAnalysis;
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Code Analysis</h1>
          <p className="page-subtitle">Deep analysis of your repository quality.</p>
        </div>
        <div className="analysis-score-badge">{score}<span>/100</span></div>
      </div>
      <p className="analysis-summary">{summary}</p>
      <div className="metrics-grid">
        {METRICS.map(m => {
          const val = metrics[m.key as keyof typeof metrics];
          return (
            <div key={m.key} className="metric-card">
              <div className="metric-header">
                <span className="metric-label">{m.label}</span>
                <span className="metric-value" style={{color: m.color}}>{val}</span>
              </div>
              <div className="metric-bar-bg">
                <div className="metric-bar-fill" style={{width:`${val}%`, background: m.color}} />
              </div>
            </div>
          );
        })}
      </div>
      <h2 className="section-title" style={{marginTop:'2rem'}}>Issues</h2>
      <div className="issues-list">
        {issues.map(issue => (
          <div key={issue.id} className="issue-row">
            <span className={`issue-severity issue-severity--${issue.severity}`}>{issue.severity.toUpperCase()}</span>
            <div className="issue-info">
              <p className="issue-title">{issue.title}</p>
              <p className="issue-file">{issue.file}:{issue.line}</p>
              <p className="issue-desc">{issue.description}</p>
            </div>
            <span className="issue-category">{issue.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
