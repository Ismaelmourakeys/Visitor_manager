import './Sidebar.css';

interface SidebarProps {
  activePage: 'form' | 'dashboard';
  onNavigate: (page: 'form' | 'dashboard') => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">✝</div>
        <div className="sidebar__church">
          <strong>Grace Church</strong>
          <span>Visitor Management</span>
        </div>
      </div>

      <button
        className="sidebar__new-btn"
        onClick={() => onNavigate('form')}
      >
        + New Visitor
      </button>

      <nav className="sidebar__nav">
        <button
          className={`sidebar__nav-item ${activePage === 'form' ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => onNavigate('form')}
        >
          <span>📋</span> Registration Form
        </button>
        <button
          className={`sidebar__nav-item ${activePage === 'dashboard' ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <span>👥</span> Visitantes
        </button>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__avatar">A</div>
        <span>Admin User</span>
        <button className="sidebar__settings">⚙</button>
      </div>
    </aside>
  );
}
