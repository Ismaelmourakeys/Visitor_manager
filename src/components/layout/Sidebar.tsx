import './Sidebar.css';
import logoImg from '../../assets/Visitor_Logo.png';

interface SidebarProps {
  activePage: 'form' | 'dashboard';
  onNavigate: (page: 'form' | 'dashboard') => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__Logo">
          <img
            src={logoImg}
            alt="Grace Church"
            style={{
              width: '40px',
              height: '40px',
              minWidth: '40px',
              minHeight: '40px',
              maxWidth: '40px',
              maxHeight: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
        <div className="sidebar__church">
          <strong>Grace Church</strong>
          <span>Visitor Management</span>
        </div>
      </div>

      <button
        className="sidebar__new-btn"
        onClick={() => onNavigate('form')}
      >
        + Novo Visitante
      </button>

      <nav className="sidebar__nav">
        <button
          className={`sidebar__nav-item ${activePage === 'form' ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => onNavigate('form')}
        >
          <span>📋</span> Registro para Visitante
        </button>
        <button
          className={`sidebar__nav-item ${activePage === 'dashboard' ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <span>👥</span> Histórico de Visitantes
        </button>
      </nav>

      {/* <div className="sidebar__footer">
        <div className="sidebar__avatar">A</div>
        <span>Admin User</span>
        <button className="sidebar__settings">⚙</button>
      </div> */}
      
    </aside>
  );
}
