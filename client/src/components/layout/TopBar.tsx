import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: Props) {
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Cmd/Ctrl + K focuses the search input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/repositories?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const NOTIFICATIONS = [
    { id: 1, text: 'Analysis complete on repomind-demo', time: '2m ago', read: false },
    { id: 2, text: 'Security issue found in api-gateway', time: '1h ago', read: false },
    { id: 3, text: 'AI chat session saved', time: '3h ago', read: true },
  ];
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <header className="topbar">
      {/* Mobile hamburger */}
      <button className="topbar-hamburger" onClick={onMenuClick} aria-label="Open menu">
        ☰
      </button>

      {/* Search */}
      <form className="topbar-search-form" onSubmit={handleSearch}>
        <span className="topbar-search-icon">⌕</span>
        <input
          ref={searchRef}
          id="topbar-search"
          className="topbar-search-input"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search repositories…"
          aria-label="Search repositories"
        />
        <kbd className="topbar-search-kbd">⌘K</kbd>
      </form>

      <div className="topbar-right">
        {/* Notifications */}
        <div className="topbar-notif-wrapper">
          <button
            id="topbar-notif-btn"
            className="topbar-icon-btn"
            onClick={() => setNotifOpen(o => !o)}
            aria-label="Notifications"
          >
            🔔
            {unreadCount > 0 && <span className="topbar-notif-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="topbar-notif-dropdown">
              <p className="topbar-notif-title">Notifications</p>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className={`topbar-notif-item${n.read ? ' topbar-notif-item--read' : ''}`}>
                  <span className="topbar-notif-dot" />
                  <div>
                    <p className="topbar-notif-text">{n.text}</p>
                    <p className="topbar-notif-time">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <button id="topbar-avatar-btn" className="topbar-avatar" aria-label="User menu">
          <img
            src="https://api.dicebear.com/7.x/identicon/svg?seed=repomind"
            alt="Avatar"
            className="topbar-avatar-img"
          />
        </button>
      </div>
    </header>
  );
}
