import ChatPanel from '../components/ai/ChatPanel';

export default function AIEngineerPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', display: 'flex', flexDirection: 'column' }}>
      <ChatPanel
        repositoryId="demo-1"
        onNavigate={(file, line) => {
          // Emit a custom event that the Workspace / CodeViewer can listen to
          window.dispatchEvent(
            new CustomEvent('repomind:navigate', { detail: { file, line } })
          );
        }}
      />
    </div>
  );
}
