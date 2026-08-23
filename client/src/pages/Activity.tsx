import { demoActivity } from '../data/demoRepository';

const TYPE_ICONS: Record<string, string> = { analysis: '⬡', chat: '🧠', fix: '✓' };

export default function ActivityPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1 className="page-title">Activity</h1><p className="page-subtitle">Recent AI interactions and analysis history.</p></div>
      </div>
      <div className="activity-list">
        {demoActivity.map(item => (
          <div key={item.id} className="activity-row">
            <span className="activity-icon">{TYPE_ICONS[item.type] ?? '◉'}</span>
            <div className="activity-info">
              <p className="activity-title">{item.title}</p>
              <p className="activity-desc">{item.description}</p>
              <p className="activity-repo">{item.repositoryName}</p>
            </div>
            <span className="activity-time">{new Date(item.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
