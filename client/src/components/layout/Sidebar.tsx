import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { path: '/dashboard',      label: 'Dashboard',      icon: '⊞' },
  { path: '/repositories',   label: 'Repositories',   icon: '◫' },
  { path: '/ai',             label: 'AI Engineer',    icon: '🧠' },
  { path: '/analysis',       label: 'Code Analysis',  icon: '⬡' },
  { path: '/security',       label: 'Security',       icon: '🛡' },
  { path: '/tests',          label: 'Tests',          icon: '✓' },
  { path: '/documentation',  label: 'Documentation',  icon: '📄' },
  { path: '/architecture',   label: 'Architecture',   icon: '◈' },
  { path: '/activity',       label: 'Activity',       icon: '◉' },
];

const BOTTOM_ITEMS = [
  { path: '/settings', label: 'Settings', icon: '⚙' },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: Props) {
  const location = useLocation();

  const NavItem = ({ path, label, icon }: { path: string; label: string; icon: string }) => {
    const active = location.pathname === path || location.pathname.startsWith(path + '/');
    return (
      <NavLink
        to={path}
        onClick={onMobileClose}
        className={`sidebar-nav-item${active ? ' sidebar-nav-item--active' : ''}`}
        title={collapsed ? label : undefined}
      >
        <span className="sidebar-nav-icon">{icon}</span>
        {!collapsed && <span className="sidebar-nav-label">{label}</span>}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={onMobileClose} />}

      <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}${mobileOpen ? ' sidebar--mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🧠</div>
          {!collapsed && (
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-name">RepoMind</span>
              <span className="sidebar-logo-tag">AI</span>
            </div>
          )}
          <button className="sidebar-collapse-btn" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Main nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => <NavItem key={item.path} {...item} />)}
        </nav>

        {/* Bottom nav */}
        <div className="sidebar-bottom">
          {BOTTOM_ITEMS.map(item => <NavItem key={item.path} {...item} />)}
        </div>
      </aside>
    </>
  );
}
