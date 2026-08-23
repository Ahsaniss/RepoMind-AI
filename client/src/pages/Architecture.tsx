export default function ArchitecturePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1 className="page-title">Architecture</h1><p className="page-subtitle">Visual overview of your project structure.</p></div>
      </div>
      <div className="arch-diagram">
        {[
          { label: 'Client', sub: 'Browser / React', color: '#8B5CF6' },
          { label: '↓ HTTP', sub: 'REST API', color: '#3B82F6' },
          { label: 'Express Server', sub: 'Node.js + TypeScript', color: '#3B82F6' },
          { label: '↓ Routes', sub: '/auth  /me', color: '#6366F1' },
          { label: 'Middleware', sub: 'JWT requireAuth', color: '#F59E0B' },
          { label: 'Services', sub: 'userService.ts', color: '#10B981' },
          { label: '↓ pg Pool', sub: 'PostgreSQL', color: '#6366F1' },
          { label: 'Database', sub: 'users · posts', color: '#EF4444' },
        ].map((node, i) => (
          <div key={i} className="arch-node" style={{ borderColor: node.color }}>
            <span className="arch-node-label" style={{ color: node.color }}>{node.label}</span>
            <span className="arch-node-sub">{node.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
