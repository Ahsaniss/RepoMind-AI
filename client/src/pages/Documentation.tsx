export default function DocumentationPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1 className="page-title">Documentation</h1><p className="page-subtitle">AI-generated documentation for your codebase.</p></div>
      </div>
      <div className="doc-cards">
        {[
          { title: 'Authentication Flow', desc: 'JWT-based auth with login and register endpoints. Uses jsonwebtoken to sign tokens with a 7-day expiry.', file: 'src/routes/auth.ts' },
          { title: 'Database Layer', desc: 'PostgreSQL connection pool using pg. Exposes a shared `db` instance for query execution.', file: 'src/db/index.ts' },
          { title: 'User Service', desc: 'Business logic for user management. getAllUsers() has a known N+1 query issue.', file: 'src/services/userService.ts' },
          { title: 'Auth Middleware', desc: 'Express middleware that validates Bearer JWT tokens and attaches userId to the request.', file: 'src/middleware/auth.ts' },
        ].map(doc => (
          <div key={doc.title} className="doc-card">
            <h3 className="doc-card-title">{doc.title}</h3>
            <p className="doc-card-desc">{doc.desc}</p>
            <span className="doc-card-file">{doc.file}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
