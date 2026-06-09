import { useState } from 'react';
import type { Visitor, VisitorStatus } from '../../types/visitor';
import { VisitorCard } from '../../components/VisitorCard/VisitorCard';
import { VisitorDetails } from '../../components/VisitorDetails/VisitorDetails';
import './AdminDashboard.css';

interface AdminDashboardProps {
  visitors: Visitor[];
}

const TAB_LABELS: Record<string, string> = {
  'All Visitors': 'Todos os Visitantes',
  'New':          'Novo',
  'Contact Made': 'Recorrente',
  'Regular':      'Regular',
};

const TAB_VALUES = ['All Visitors', 'New', 'Contact Made', 'Regular'] as const;
type FilterTab = typeof TAB_VALUES[number];

export function AdminDashboard({ visitors }: AdminDashboardProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All Visitors');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null); // ✅ dentro do componente

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
        <div className="dashboard__title-group">
          <h1 className="dashboard__title">Visitantes Registrados</h1>
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
          <button className="dashboard__outline-btn">↓ Exportar</button>
        </div>
      </div>

      <div className="dashboard__list">
        {filtered.length === 0 ? (
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

      {/* Modal fora da lista ✅ */}
      {selectedVisitor && (
        <VisitorDetails
          visitor={selectedVisitor}
          onClose={() => setSelectedVisitor(null)}
        />
      )}
    </div>
  );
}