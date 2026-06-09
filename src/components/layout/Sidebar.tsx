import './Sidebar.css';

interface SidebarProps {
    activePage: 'form' | 'dashboard';
    onNavigate: (page: 'form' | 'dashboard') => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
    return (
        <aside className="sidebar">
            {/* Logo + Nome da Igreja */}
            <div className="sidebar-header">
                <div className="sidebar-logo">✝</div>
                <div>
                    <strong>Grace Church</strong>
                    <span>Visitor Management</span>
                </div>
            </div>

            {/* Botão New Visitor */}
            <button
                className="btn-new-visitor"
                onClick={() => onNavigate('form')}
            >
                + New Visitor
            </button>

            {/* Navegação */}
            <nav className="sidebar-nav">
                <button
                    className={activePage === 'form' ? 'active' : ''}
                    onClick={() => onNavigate('form')}
                >
                    📋 Registration Form
                </button>
                <button
                    className={activePage === 'dashboard' ? 'active' : ''}
                    onClick={() => onNavigate('dashboard')}
                >
                    📊 Visitantes
                </button>
            </nav>

            {/* Rodapé */}
            <div className="sidebar-footer">
                <div className="avatar">A</div>
                <span>Admin User</span>
                <button className="btn-settings">⚙</button>
            </div>
        </aside>
    );
}