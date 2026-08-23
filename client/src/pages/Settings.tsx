export default function SettingsPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1 className="page-title">Settings</h1><p className="page-subtitle">Configure your RepoMind AI experience.</p></div>
      </div>
      <div className="settings-sections">
        {[
          { title: 'GitHub Integration', desc: 'Manage your connected GitHub account and OAuth permissions.', action: 'Reconnect GitHub' },
          { title: 'AI Model', desc: 'Currently using gemini-2.5-flash for fast, cost-efficient responses.', action: 'Change Model' },
          { title: 'Notifications', desc: 'Configure email and in-app notifications for analysis results.', action: 'Configure' },
          { title: 'API Keys', desc: 'Manage your Gemini API key and other integrations.', action: 'Manage Keys' },
        ].map(s => (
          <div key={s.title} className="settings-row">
            <div>
              <h3 className="settings-title">{s.title}</h3>
              <p className="settings-desc">{s.desc}</p>
            </div>
            <button className="btn-ghost">{s.action}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
