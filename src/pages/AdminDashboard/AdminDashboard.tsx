import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Visitor, VisitorStatus } from '../../types/visitor';
import { VisitorCard } from '../../components/VisitorCard/VisitorCard';
import { VisitorDetails } from '../../components/VisitorDetails/VisitorDetails';
import { Notifications } from '../../components/Notifications/Notifications';
import type { ChurchData } from '../../hooks/useChurchProfile';
import type { Notification } from '../../hooks/useNotifications';
import './AdminDashboard.css';

interface AdminDashboardProps {
  visitors: Visitor[];
  loading: boolean;
  church: ChurchData;
  churchId: string;
  onTelao: () => void;
  notifications: Notification[];
  toasts: Notification[];
  unreadCount: number;
  showNotifPanel: boolean;
  onToggleNotifPanel: () => void;
  onMarkAllRead: () => void;
  onMarkAllUnread: () => void;
  onToggleRead: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onDismissToast: (id: string) => void;
}

interface Filters {
  dateFrom: string;
  dateTo: string;
  position: string;
  visitedTimes: string;
}

const emptyFilters: Filters = {
  dateFrom: '',
  dateTo: '',
  position: '',
  visitedTimes: '',
};

const TAB_LABELS: Record<string, string> = {
  'All Visitors': 'Todos os Visitantes',
  'New': 'Novo',
  'Contact Made': 'Recorrente',
  'Regular': 'Regular',
};

const POSITION_SEARCH_TERMS: Record<string, string[]> = {
  'Pastor': ['pastor', 'pastora'],
  'Apóstolo': ['apóstolo', 'apóstola'],
  'Evangelista': ['evangelista'],
  'Missionário': ['missionário', 'missionária'],
  'Presbítero': ['presbítero', 'presbítera'],
  'Diácono': ['diácono', 'diaconisa'],
  'Cooperador': ['cooperador', 'cooperadora'],
  'Levita': ['levita'],
};

const TAB_VALUES = ['All Visitors', 'New', 'Contact Made', 'Regular'] as const;
type FilterTab = typeof TAB_VALUES[number];

export function AdminDashboard({
  visitors, loading, church, churchId, onTelao,
  notifications, toasts, unreadCount,
  showNotifPanel, onToggleNotifPanel,
  onMarkAllRead, onMarkAllUnread,
  onToggleRead, onMarkAsRead,
  onDismissToast,
}: AdminDashboardProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All Visitors');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  function setFilter(field: keyof Filters, value: string) {
    setFilters(prev => ({ ...prev, [field]: value }));
  }

  const hasActiveFilters =
    filters.dateFrom || filters.dateTo ||
    filters.position || filters.visitedTimes;

  const filtered = visitors.filter(v => {
    const matchSearch = v.fullName.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'All Visitors' || v.status === activeTab;
    const matchDateFrom = !filters.dateFrom || v.visitDate >= filters.dateFrom;
    const matchDateTo = !filters.dateTo || v.visitDate <= filters.dateTo;
    const matchPosition = !filters.position || (() => {
      const terms = POSITION_SEARCH_TERMS[filters.position] ?? [filters.position.toLowerCase()];
      const pos = v.position?.toLowerCase() ?? '';
      return terms.some(term => pos.includes(term));
    })();
    const matchVisited = !filters.visitedTimes || v.visitedTimes === filters.visitedTimes;
    return matchSearch && matchTab && matchDateFrom && matchDateTo && matchPosition && matchVisited;
  });

  function countByStatus(status: VisitorStatus) {
    return visitors.filter(v => v.status === status).length;
  }

  function tabCount(tab: FilterTab) {
    return tab === 'All Visitors' ? visitors.length : countByStatus(tab as VisitorStatus);
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
          <Notifications
            notifications={notifications}
            toasts={toasts}
            unreadCount={unreadCount}
            showPanel={showNotifPanel}
            onTogglePanel={onToggleNotifPanel}
            onMarkAllRead={onMarkAllRead}
            onMarkAllUnread={onMarkAllUnread}
            onToggleRead={onToggleRead}
            onMarkAsRead={onMarkAsRead}
            onDismissToast={onDismissToast}
            onViewVisitor={v => setSelectedVisitor(v)}
          />
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
          <button
            className={`dashboard__outline-btn ${hasActiveFilters ? 'dashboard__outline-btn--active' : ''}`}
            onClick={() => setShowFilters(v => !v)}
          >
            ⚙ Filtros {hasActiveFilters && `(${[filters.dateFrom, filters.dateTo, filters.position, filters.visitedTimes].filter(Boolean).length})`}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="dashboard__filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="dashboard__filters-grid">
              <div className="dashboard__filter-field">
                <label>Data inicial</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={e => setFilter('dateFrom', e.target.value)}
                />
              </div>
              <div className="dashboard__filter-field">
                <label>Data final</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={e => setFilter('dateTo', e.target.value)}
                />
              </div>
              <div className="dashboard__filter-field">
                <label>Cargo</label>
                <select
                  value={filters.position}
                  onChange={e => setFilter('position', e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Pastor">Pastor(a)</option>
                  <option value="Apóstolo">Apóstolo(a)</option>
                  <option value="Evangelista">Evangelista</option>
                  <option value="Missionário">Missionário(a)</option>
                  <option value="Presbítero">Presbítero(a)</option>
                  <option value="Diácono">Diácono/Diaconisa</option>
                  <option value="Cooperador">Cooperador(a)</option>
                  <option value="Levita">Levita</option>
                </select>
              </div>
              <div className="dashboard__filter-field">
                <label>Quantas vezes visitou</label>
                <select
                  value={filters.visitedTimes}
                  onChange={e => setFilter('visitedTimes', e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="1 vez">1 vez</option>
                  <option value="2 vezes">2 vezes</option>
                  <option value="3 vezes ou mais">3 vezes ou mais</option>
                </select>
              </div>
            </div>
            {hasActiveFilters && (
              <button
                className="dashboard__filter-clear"
                onClick={() => setFilters(emptyFilters)}
              >
                ✕ Limpar filtros
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="dashboard__list">
        {loading ? (
          <div className="dashboard__empty">
            <p>Carregando visitantes...</p>
          </div>
        ) : filtered.length === 0 && activeTab === 'All Visitors' && !search && !hasActiveFilters ? (
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
            <p>Nenhum visitante encontrado.</p>
            <span>Tente ajustar os filtros ou a pesquisa.</span>
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
          Exibindo {filtered.length} de {visitors.length} registros
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
          onUpdated={updated => setSelectedVisitor(updated)}
        />
      )}
    </div>
  );
}