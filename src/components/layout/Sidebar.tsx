import type { ChurchData } from '../../hooks/useChurchProfile';
import './Sidebar.css';

interface SidebarProps {
  activePage: 'form' | 'dashboard' | 'settings';
  onNavigate: (page: 'form' | 'dashboard' | 'settings') => void;
  onLogout: () => void;
  church: ChurchData;
}

export function Sidebar({ activePage, onNavigate, onLogout, church }: SidebarProps) {
  return (
    <aside className="sidebar">
      {/* Header — só desktop */}
      <div className="sidebar__header">
        <div className="sidebar__Logo">
          {church.logoUrl ? (
            <img
              src={church.logoUrl}
              alt={church.churchName}
              style={{
                width: '40px', height: '40px', minWidth: '40px',
                borderRadius: '50%', objectFit: 'cover', display: 'block',
              }}
            />
          ) : (
            <div style={{
              width: '40px', height: '40px', background: '#2d6a4f',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px', flexShrink: 0,
            }}>✝</div>
          )}
        </div>
        <div className="sidebar__church">
          <strong>{church.churchName}</strong>
          <span>{church.city}</span>
        </div>
      </div>

      {/* Botão novo visitante — só desktop */}
      <button className="sidebar__new-btn" onClick={() => onNavigate('form')}>
        + Novo Visitante
      </button>

      {/* Nav — aparece no mobile e desktop */}
      <nav className="sidebar__nav">
        <button
          className={`sidebar__nav-item ${activePage === 'dashboard' ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <span>👥</span> Visitantes
        </button>
        <button
          className={`sidebar__nav-item ${activePage === 'form' ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => onNavigate('form')}
        >
          <span>📋</span> Cadastrar
        </button>
        <button
          className={`sidebar__nav-item ${activePage === 'settings' ? 'sidebar__nav-item--active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <span>⚙️</span> Config
        </button>
        <button
          className="sidebar__nav-item sidebar__nav-item--logout"
          onClick={onLogout}
        >
          <span>❌</span> Sair
        </button>
      </nav>

      {/* Footer — só desktop */}
      <div className="sidebar__footer">
        <div className="sidebar__avatar">
          {church.logoUrl ? (
            <img src={church.logoUrl} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <span>{church.churchName?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <div className="sidebar__footer-info">
          <strong>{church.churchName}</strong>
          <span>{church.pastor}</span>
        </div>
        <div className="sidebar__footer-actions">
          <button
            className="sidebar__settings"
            onClick={() => onNavigate('settings')}
            title="Configurações"
          >
            ⚙
          </button>
          <button
            className="sidebar__logout"
            onClick={onLogout}
            title="Sair"
          >
            ❌
          </button>
        </div>
      </div>
    </aside>
  );
}