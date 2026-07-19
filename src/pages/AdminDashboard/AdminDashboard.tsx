import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Visitor } from '../../types/visitor';
import type { Congress, CongressType } from '../../types/congress';
import { VisitorCard } from '../../components/VisitorCard/VisitorCard';
import { VisitorDetails } from '../../components/VisitorDetails/VisitorDetails';
import { Notifications } from '../../components/Notifications/Notifications';
import type { ChurchData } from '../../hooks/useChurchProfile';
import type { Notification } from '../../hooks/useNotifications';
import './AdminDashboard.css';

interface AdminDashboardProps {
  visitors: Visitor[];
  congresses: Congress[];
  loading: boolean;
  church: ChurchData;
  churchId: string;
  onTelao: () => void;
  onDirector: () => void;
  onDeleteCongress: (id: string) => void;
  onUpdateCongress: (id: string, data: Partial<Congress>) => void;
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

type MainTab = 'all' | 'visitors' | 'congresses';

interface VisitorFilters {
  dateFrom: string;
  dateTo: string;
  position: string;
  visitedTimes: string;
  status: string;
}

const emptyVisitorFilters: VisitorFilters = {
  dateFrom: '', dateTo: '', position: '', visitedTimes: '', status: '',
};

interface CongressFilters {
  dateFrom: string;
  dateTo: string;
  congressType: string;
}

const emptyCongressFilters: CongressFilters = {
  dateFrom: '', dateTo: '', congressType: '',
};

const CONGRESS_TYPES: CongressType[] = [
  'Irmãs', 'Mocidade', 'Varões',
  'Adolescentes', 'Crianças', 'Culto Eventual', 'Outro',
];

const TYPE_COLORS: Record<CongressType, { bg: string; color: string }> = {
  'Irmãs': { bg: '#fce7f3', color: '#9d174d' },
  'Mocidade': { bg: '#ede9fe', color: '#5b21b6' },
  'Varões': { bg: '#dbeafe', color: '#1e40af' },
  'Adolescentes': { bg: '#fef9c3', color: '#854d0e' },
  'Crianças': { bg: '#dcfce7', color: '#166534' },
  'Culto Eventual': { bg: '#f0fdf4', color: '#2d6a4f' },
  'Outro': { bg: '#f3f4f6', color: '#374151' },
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

export function AdminDashboard({
  visitors, congresses, loading, church, churchId,
  onTelao, onDirector,
  onDeleteCongress, onUpdateCongress,
  notifications, toasts, unreadCount,
  showNotifPanel, onToggleNotifPanel,
  onMarkAllRead, onMarkAllUnread,
  onToggleRead, onMarkAsRead, onDismissToast,
}: AdminDashboardProps) {
  const [mainTab, setMainTab] = useState<MainTab>('all');
  const [search, setSearch] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [vFilters, setVFilters] = useState<VisitorFilters>(emptyVisitorFilters);
  const [cFilters, setCFilters] = useState<CongressFilters>(emptyCongressFilters);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingCongress, setEditingCongress] = useState<Congress | null>(null);
  const [editForm, setEditForm] = useState<Partial<Congress>>({});

  const filteredVisitors = visitors.filter(v => {
    const matchSearch = v.fullName.toLowerCase().includes(search.toLowerCase());
    const matchDateFrom = !vFilters.dateFrom || v.visitDate >= vFilters.dateFrom;
    const matchDateTo = !vFilters.dateTo || v.visitDate <= vFilters.dateTo;
    const matchPosition = !vFilters.position || (() => {
      const terms = POSITION_SEARCH_TERMS[vFilters.position] ?? [vFilters.position.toLowerCase()];
      return terms.some(t => (v.position?.toLowerCase() ?? '').includes(t));
    })();
    const matchVisited = !vFilters.visitedTimes || v.visitedTimes === vFilters.visitedTimes;
    const matchStatus = !vFilters.status || v.status === vFilters.status;
    return matchSearch && matchDateFrom && matchDateTo && matchPosition && matchVisited && matchStatus;
  });

  const filteredCongresses = congresses.filter(c => {
    const matchSearch = c.churchName.toLowerCase().includes(search.toLowerCase()) ||
      c.groupName.toLowerCase().includes(search.toLowerCase());
    const matchDateFrom = !cFilters.dateFrom || c.date >= cFilters.dateFrom;
    const matchDateTo = !cFilters.dateTo || c.date <= cFilters.dateTo;
    const matchType = !cFilters.congressType || c.congressType === cFilters.congressType;
    return matchSearch && matchDateFrom && matchDateTo && matchType;
  });

  const hasVFilters = Object.values(vFilters).some(Boolean);
  const hasCFilters = Object.values(cFilters).some(Boolean);
  
  const hasActiveFilters =
    mainTab === 'congresses' ? hasCFilters :
      mainTab === 'visitors' ? hasVFilters :
        hasVFilters || hasCFilters; // ← aba "all" considera os dois


  const totalAll = visitors.length + congresses.length;

  function renderCongressCard(c: Congress, showDelete = true) {
    const typeColor = TYPE_COLORS[c.congressType] ?? { bg: '#f3f4f6', color: '#374151' };
    const isEditing = editingCongress?.id === c.id;

    return (
      <div key={c.id} className="congress-card">
        {isEditing ? (
          <div className="congress-card__edit">
            <div className="congress-card__edit-grid">
              <div className="congress-card__edit-field">
                <label>Nome da Igreja</label>
                <input value={editForm.churchName ?? ''}
                  onChange={e => setEditForm(p => ({ ...p, churchName: e.target.value }))} />
              </div>
              <div className="congress-card__edit-field">
                <label>Nome do Grupo</label>
                <input value={editForm.groupName ?? ''}
                  onChange={e => setEditForm(p => ({ ...p, groupName: e.target.value }))} />
              </div>
              <div className="congress-card__edit-field">
                <label>Tipo</label>
                <select value={editForm.congressType ?? ''}
                  onChange={e => setEditForm(p => ({ ...p, congressType: e.target.value as CongressType }))}>
                  {CONGRESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="congress-card__edit-field">
                <label>Pastor(es)</label>
                <input value={editForm.pastors ?? ''}
                  onChange={e => setEditForm(p => ({ ...p, pastors: e.target.value }))}
                  placeholder="Opcional" />
              </div>
              <div className="congress-card__edit-field">
                <label>Líderes</label>
                <input value={editForm.leaders ?? ''}
                  onChange={e => setEditForm(p => ({ ...p, leaders: e.target.value }))}
                  placeholder="Opcional" />
              </div>
              <div className="congress-card__edit-field">
                <label>Louvor</label>
                <input value={editForm.worship ?? ''}
                  onChange={e => setEditForm(p => ({ ...p, worship: e.target.value }))}
                  placeholder="Opcional" />
              </div>
            </div>
            <div className="congress-card__edit-actions">
              <button onClick={() => setEditingCongress(null)}>Cancelar</button>
              <button
                className="congress-card__edit-save"
                onClick={async () => {
                  await onUpdateCongress(c.id, editForm);
                  setEditingCongress(null);
                }}
              >
                ✅ Salvar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="congress-card__left">
              <span className="congress-card__type"
                style={{ background: typeColor.bg, color: typeColor.color }}>
                {c.congressType}
              </span>
              <div className="congress-card__names">
                <strong>{c.churchName}</strong>
                <span>{c.groupName}</span>
              </div>
            </div>
            <div className="congress-card__meta">
              {c.pastors && (
                <span className="congress-card__meta-item">
                  <span className="congress-card__meta-label">PASTOR(ES)</span>
                  {c.pastors}
                </span>
              )}
              {c.leaders && (
                <span className="congress-card__meta-item">
                  <span className="congress-card__meta-label">LÍDERES</span>
                  {c.leaders}
                </span>
              )}
              {c.worship && (
                <span className="congress-card__meta-item">
                  <span className="congress-card__meta-label">🎵 LOUVOR</span>
                  {c.worship}
                </span>
              )}
            </div>
            {showDelete && (
              <div className="congress-card__actions">
                <button
                  className="congress-card__edit-btn"
                  onClick={() => { setEditingCongress(c); setEditForm({ ...c }); }}
                >
                  ✏️
                </button>
                {confirmDeleteId === c.id ? (
                  <div className="congress-card__confirm">
                    <span>Excluir?</span>
                    <button className="congress-card__confirm-yes"
                      onClick={() => { onDeleteCongress(c.id); setConfirmDeleteId(null); }}>
                      Sim
                    </button>
                    <button onClick={() => setConfirmDeleteId(null)}>Não</button>
                  </div>
                ) : (
                  <button className="congress-card__delete"
                    onClick={() => setConfirmDeleteId(c.id)}>
                    🗑
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* ─── Header ─── */}
      <div className="dashboard__header">
        <div className="dashboard__header-btns">
          <button className="dashboard__telao-btn" onClick={onTelao}>
            📺 Telão
          </button>
          <button className="dashboard__director-btn" onClick={onDirector}>
            🎙 Dirigente
          </button>
        </div>
        <div className="dashboard__title-group">
          <h1 className="dashboard__title">Painel — {church.churchName}</h1>
          <p className="dashboard__subtitle">Gerencie visitantes e grupos do ministério.</p>
        </div>
        <div className="dashboard__header-actions">
          <div className="dashboard__search-wrap">
            <span className="dashboard__search-icon">🔍</span>
            <input
              type="text"
              className="dashboard__search"
              placeholder="Pesquisar..."
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

      {/* ─── Abas principais ─── */}
      <div className="dashboard__toolbar">
        <div className="dashboard__tabs">
          <button
            className={`dashboard__tab ${mainTab === 'all' ? 'dashboard__tab--active' : ''}`}
            onClick={() => { setMainTab('all'); setShowFilters(false); }}
          >
            🌟 Todos <span className="dashboard__tab-count">{totalAll}</span>
          </button>
          <button
            className={`dashboard__tab ${mainTab === 'visitors' ? 'dashboard__tab--active' : ''}`}
            onClick={() => { setMainTab('visitors'); setShowFilters(false); }}
          >
            👥 Visitantes <span className="dashboard__tab-count">{visitors.length}</span>
          </button>
          <button
            className={`dashboard__tab ${mainTab === 'congresses' ? 'dashboard__tab--active' : ''}`}
            onClick={() => { setMainTab('congresses'); setShowFilters(false); }}
          >
            ⛪ Grupos <span className="dashboard__tab-count">{congresses.length}</span>
          </button>
        </div>
        <div className="dashboard__toolbar-actions">
          <button
            className={`dashboard__outline-btn ${hasActiveFilters ? 'dashboard__outline-btn--active' : ''}`}
            onClick={() => setShowFilters(v => !v)}

          >
            ⚙ Filtros {hasActiveFilters && '●'}
          </button>
        </div>
      </div>

      {/* ─── Filtros de visitantes ─── */}
      <AnimatePresence>
        {showFilters && mainTab === 'visitors' && (
          <motion.div className="dashboard__filters"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
            <div className="dashboard__filters-grid">
              <div className="dashboard__filter-field">
                <label>Data inicial</label>
                <input type="date" value={vFilters.dateFrom}
                  onChange={e => setVFilters(p => ({ ...p, dateFrom: e.target.value }))} />
              </div>
              <div className="dashboard__filter-field">
                <label>Data final</label>
                <input type="date" value={vFilters.dateTo}
                  onChange={e => setVFilters(p => ({ ...p, dateTo: e.target.value }))} />
              </div>
              <div className="dashboard__filter-field">
                <label>Status</label>
                <select value={vFilters.status}
                  onChange={e => setVFilters(p => ({ ...p, status: e.target.value }))}>
                  <option value="">Todos</option>
                  <option value="New">Novo</option>
                  <option value="Contact Made">Recorrente</option>
                  <option value="Regular">Regular</option>
                </select>
              </div>
              <div className="dashboard__filter-field">
                <label>Cargo</label>
                <select value={vFilters.position}
                  onChange={e => setVFilters(p => ({ ...p, position: e.target.value }))}>
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
                <select value={vFilters.visitedTimes}
                  onChange={e => setVFilters(p => ({ ...p, visitedTimes: e.target.value }))}>
                  <option value="">Todas</option>
                  <option value="1 vez">1 vez</option>
                  <option value="2 vezes">2 vezes</option>
                  <option value="3 vezes ou mais">3 vezes ou mais</option>
                </select>
              </div>
            </div>
            {hasVFilters && (
              <button className="dashboard__filter-clear"
                onClick={() => setVFilters(emptyVisitorFilters)}>
                ✕ Limpar filtros
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Filtros de congressos ─── */}
      <AnimatePresence>
        {showFilters && mainTab === 'congresses' && (
          <motion.div className="dashboard__filters"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
            <div className="dashboard__filters-grid">
              <div className="dashboard__filter-field">
                <label>Data inicial</label>
                <input type="date" value={cFilters.dateFrom}
                  onChange={e => setCFilters(p => ({ ...p, dateFrom: e.target.value }))} />
              </div>
              <div className="dashboard__filter-field">
                <label>Data final</label>
                <input type="date" value={cFilters.dateTo}
                  onChange={e => setCFilters(p => ({ ...p, dateTo: e.target.value }))} />
              </div>
              <div className="dashboard__filter-field">
                <label>Tipo de Congresso</label>
                <select value={cFilters.congressType}
                  onChange={e => setCFilters(p => ({ ...p, congressType: e.target.value }))}>
                  <option value="">Todos</option>
                  {CONGRESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {hasCFilters && (
              <button className="dashboard__filter-clear"
                onClick={() => setCFilters(emptyCongressFilters)}>
                ✕ Limpar filtros
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFilters && mainTab === 'all' && (
          <motion.div className="dashboard__filters"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
            <div className="dashboard__filters-grid">
              <div className="dashboard__filter-field">
                <label>Data inicial</label>
                <input type="date" value={vFilters.dateFrom}
                  onChange={e => setVFilters(p => ({ ...p, dateFrom: e.target.value }))} />
              </div>
              <div className="dashboard__filter-field">
                <label>Data final</label>
                <input type="date" value={vFilters.dateTo}
                  onChange={e => setVFilters(p => ({ ...p, dateTo: e.target.value }))} />
              </div>
              <div className="dashboard__filter-field">
                <label>Tipo de Congresso</label>
                <select value={cFilters.congressType}
                  onChange={e => setCFilters(p => ({ ...p, congressType: e.target.value }))}>
                  <option value="">Todos os tipos</option>
                  {CONGRESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="dashboard__filter-field">
                <label>Status do visitante</label>
                <select value={vFilters.status}
                  onChange={e => setVFilters(p => ({ ...p, status: e.target.value }))}>
                  <option value="">Todos</option>
                  <option value="New">Novo</option>
                  <option value="Contact Made">Recorrente</option>
                  <option value="Regular">Regular</option>
                </select>
              </div>
            </div>
            {(hasVFilters || hasCFilters) && (
              <button className="dashboard__filter-clear" onClick={() => {
                setVFilters(emptyVisitorFilters);
                setCFilters(emptyCongressFilters);
              }}>
                ✕ Limpar filtros
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Lista ─── */}
      <div className="dashboard__list">
        {loading ? (
          <div className="dashboard__empty"><p>Carregando...</p></div>

        ) : mainTab === 'all' ? (
          visitors.length === 0 && congresses.length === 0 ? (
            <div className="dashboard__welcome">
              <div className="dashboard__welcome-icon">✝</div>
              <h2>Bem-vindo ao Visitor Manager!</h2>
              <p>Você ainda não tem registros cadastrados.</p>
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
                    <strong>Registre grupos</strong>
                    <p>Acesse "Congressos" para registrar igrejas e grupos</p>
                  </div>
                </div>
                <div className="dashboard__welcome-step">
                  <span>3</span>
                  <div>
                    <strong>Use o Modo Telão</strong>
                    <p>Exiba os nomes no projetor da igreja</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {filteredVisitors.map(visitor => (
                <VisitorCard key={`v-${visitor.id}`} visitor={visitor}
                  onViewDetails={v => setSelectedVisitor(v)} />
              ))}
              {filteredCongresses.map(c => renderCongressCard(c, true))}
            </>
          )

        ) : mainTab === 'visitors' ? (
          filteredVisitors.length === 0 ? (
            <div className="dashboard__empty">
              <p>Nenhum visitante encontrado.</p>
              <span>Tente ajustar os filtros ou a pesquisa.</span>
            </div>
          ) : (
            filteredVisitors.map(visitor => (
              <VisitorCard key={visitor.id} visitor={visitor}
                onViewDetails={v => setSelectedVisitor(v)} />
            ))
          )

        ) : (
          filteredCongresses.length === 0 ? (
            <div className="dashboard__empty">
              <p>Nenhum grupo encontrado.</p>
              <span>Cadastre grupos na aba Congressos ou ajuste os filtros.</span>
            </div>
          ) : (
            filteredCongresses.map(c => renderCongressCard(c, true))
          )
        )}
      </div>

      {/* ─── Paginação ─── */}
      <div className="dashboard__pagination">
        <span className="dashboard__pagination-info">
          {mainTab === 'all' && `${filteredVisitors.length + filteredCongresses.length} de ${totalAll} registros`}
          {mainTab === 'visitors' && `${filteredVisitors.length} de ${visitors.length} visitantes`}
          {mainTab === 'congresses' && `${filteredCongresses.length} de ${congresses.length} grupos`}
        </span>
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