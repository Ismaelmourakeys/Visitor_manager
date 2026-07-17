import { useState } from 'react';
import type { Visitor, VisitorStatus } from '../../types/visitor';
import { VisitorCard } from '../../components/VisitorCard/VisitorCard';
import { VisitorDetails } from '../../components/VisitorDetails/VisitorDetails';
import type { ChurchData } from '../../hooks/useChurchProfile';
import './AdminDashboard.css';

interface AdminDashboardProps {
  visitors: Visitor[];
  loading: boolean;
  church: ChurchData;
  churchId: string; 
  onTelao: () => void;
}

const TAB_LABELS: Record<string, string> = {
  'All Visitors': 'Todos os Visitantes',
  'New': 'Novo',
  'Contact Made': 'Recorrente',
  'Regular': 'Regular',
};

const TAB_VALUES = ['All Visitors', 'New', 'Contact Made', 'Regular'] as const;
type FilterTab = typeof TAB_VALUES[number];

export function AdminDashboard({ visitors, loading, church, churchId, onTelao }: AdminDashboardProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All Visitors');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  const filtered = visitors.filter(v => {
    const matchSearch = v.fullName.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'All Visitors' || v.status === activeTab;
    return matchSearch && matchTab;
  });

  function countByStatus(status: VisitorStatus) {
    return visitors.filter(v => v.status === status).length;
  }

  function tabCount(tab: FilterTab) {
    return tab === 'All Visitors'
      ? visitors.length
      : countByStatus(tab as VisitorStatus);
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <button className="dashboard__telao-btn" onClick={onTelao} title="Modo Telão">
          📺 Telão
        </button>
        <div className="dashboard__title-group">
          <h1 className="dashboard__title">Visitantes — {church.churchName}</h1>
          <p className="dashboard__subtitle">Gerencie e acompanhe os visitantes do ministério.</p>
        </div>
        <div className="dashboard__header-actions">
          <div className="dashboard__search-wrap">
            <span className="dashboard__search-icon">🔍</span>
            <input
              type="text"
              className="dashboard__search"
              placeholder="Pesquisar visitantes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="dashboard__icon-btn" title="Notificações">🔔</button>
        </div>
      </div>

      <div className="dashboard__toolbar">
        <div className="dashboard__tabs">
          {TAB_VALUES.map(tab => (
            <button
              key={tab}
              className={`dashboard__tab ${activeTab === tab ? 'dashboard__tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {TAB_LABELS[tab]}
              <span className="dashboard__tab-count">{tabCount(tab)}</span>
            </button>
          ))}
        </div>
        <div className="dashboard__toolbar-actions">
          <button className="dashboard__outline-btn">⚙ Filtros</button>
        </div>
      </div>

      <div className="dashboard__list">
        {loading ? (
          <div className="dashboard__empty">
            <p>Carregando visitantes...</p>
          </div>
        ) : filtered.length === 0 && activeTab === 'All Visitors' && !search ? (
          <div className="dashboard__welcome">
            <div className="dashboard__welcome-icon">✝</div>
            <h2>Bem-vindo ao Visitor Manager!</h2>
            <p>Você ainda não tem visitantes cadastrados.</p>
            <div className="dashboard__welcome-steps">
              <div className="dashboard__welcome-step">
                <span>1</span>
                <div>
                  <strong>Cadastre um visitante</strong>
                  <p>Clique em "+ Novo Visitante" na barra lateral</p>
                </div>
              </div>
              <div className="dashboard__welcome-step">
                <span>2</span>
                <div>
                  <strong>Acompanhe os visitantes</strong>
                  <p>Veja quem visitou, quantas vezes e como conheceu a igreja</p>
                </div>
              </div>
              <div className="dashboard__welcome-step">
                <span>3</span>
                <div>
                  <strong>Gerencie o contato</strong>
                  <p>Use os filtros para acompanhar novos, recorrentes e regulares</p>
                </div>
              </div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dashboard__empty">
            <p>Visitante não encontrado.</p>
            <span>Tente um termo de pesquisa diferente.</span>
          </div>
        ) : (
          filtered.map(visitor => (
            <VisitorCard
              key={visitor.id}
              visitor={visitor}
              onViewDetails={v => setSelectedVisitor(v)}
            />
          ))
        )}
      </div>

      <div className="dashboard__pagination">
        <span className="dashboard__pagination-info">
          Exibindo 1 a {filtered.length} de {filtered.length} registros
        </span>
        <div className="dashboard__pages">
          <button className="dashboard__page-btn">‹</button>
          <button className="dashboard__page-btn dashboard__page-btn--active">1</button>
          <button className="dashboard__page-btn">›</button>
        </div>
      </div>

      {selectedVisitor && (
        <VisitorDetails
          visitor={selectedVisitor}
          churchId={churchId}
          onClose={() => setSelectedVisitor(null)}
          onDeleted={() => setSelectedVisitor(null)}
          onUpdated={(updated) => setSelectedVisitor(updated)}
        />
      )}
    </div>
  );
}