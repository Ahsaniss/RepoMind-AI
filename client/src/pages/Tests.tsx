export default function TestsPage() {
  const tests = [
    { id: 1, name: 'auth.login — valid credentials', status: 'pass', file: 'src/routes/auth.ts' },
    { id: 2, name: 'auth.login — SQL injection guard', status: 'fail', file: 'src/routes/auth.ts' },
    { id: 3, name: 'requireAuth — valid token', status: 'pass', file: 'src/middleware/auth.ts' },
    { id: 4, name: 'requireAuth — missing token', status: 'pass', file: 'src/middleware/auth.ts' },
    { id: 5, name: 'getAllUsers — returns array', status: 'pass', file: 'src/services/userService.ts' },
  ];
  const passed = tests.filter(t => t.status === 'pass').length;
  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1 className="page-title">Tests</h1><p className="page-subtitle">Generated and tracked test coverage.</p></div>
        <div className="analysis-score-badge" style={{background:'rgba(16,185,129,.1)',color:'#10B981',borderColor:'rgba(16,185,129,.3)'}}>{passed}/{tests.length}</div>
      </div>
      <div className="issues-list">
        {tests.map(t => (
          <div key={t.id} className="issue-row">
            <span className={`issue-severity${t.status === 'pass' ? ' issue-severity--low' : ' issue-severity--critical'}`}>
              {t.status === 'pass' ? '✓ PASS' : '✗ FAIL'}
            </span>
            <div className="issue-info">
              <p className="issue-title">{t.name}</p>
              <p className="issue-file">{t.file}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
