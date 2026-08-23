import { demoAnalysis } from '../data/demoRepository';

export default function SecurityPage() {
  const secIssues = demoAnalysis.issues.filter(i => i.category === 'security');
  const score = demoAnalysis.metrics.security;
  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1 className="page-title">Security</h1><p className="page-subtitle">Security vulnerabilities and risk analysis.</p></div>
        <div className="analysis-score-badge" style={{background:'rgba(239,68,68,.1)',color:'#EF4444',borderColor:'rgba(239,68,68,.3)'}}>{score}<span>/100</span></div>
      </div>
      <div className="issues-list">
        {secIssues.map(issue => (
          <div key={issue.id} className="issue-row">
            <span className={`issue-severity issue-severity--${issue.severity}`}>{issue.severity.toUpperCase()}</span>
            <div className="issue-info">
              <p className="issue-title">{issue.title}</p>
              <p className="issue-file">{issue.file}:{issue.line}</p>
              <p className="issue-desc">{issue.description}</p>
              <p className="issue-suggestion">💡 {issue.suggestion}</p>
            </div>
          </div>
        ))}
        {secIssues.length === 0 && <p style={{color:'#10B981'}}>✓ No security issues found.</p>}
      </div>
    </div>
  );
}
