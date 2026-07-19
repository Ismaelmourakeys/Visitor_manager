import { useState } from 'react';
import type { Congress, CongressType } from '../../types/congress';
import './CongressList.css';

interface CongressListProps {
  congresses: Congress[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const CONGRESS_TYPES: CongressType[] = [
  'Irmãs', 'Mocidade', 'Varões',
  'Adolescentes', 'Crianças', 'Culto Eventual', 'Outro',
];

const TYPE_COLORS: Record<CongressType, { bg: string; color: string }> = {
  'Irmãs':          { bg: '#fce7f3', color: '#9d174d' },
  'Mocidade':       { bg: '#ede9fe', color: '#5b21b6' },
  'Varões':         { bg: '#dbeafe', color: '#1e40af' },
  'Adolescentes':   { bg: '#fef9c3', color: '#854d0e' },
  'Crianças':       { bg: '#dcfce7', color: '#166534' },
  'Culto Eventual': { bg: '#f0fdf4', color: '#2d6a4f' },
  'Outro':          { bg: '#f3f4f6', color: '#374151' },
};

export function CongressList({ congresses, loading, onDelete }: CongressListProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<CongressType | ''>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = congresses.filter(c => {
    const matchSearch =
      c.churchName.toLowerCase().includes(search.toLowerCase()) ||
      c.groupName.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || c.congressType === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="congress-list">
      {/* Toolbar */}
      <div className="congress-list__toolbar">
        <div className="congress-list__search-wrap">
          <span>🔍</span>
          <input
            className="congress-list__search"
            placeholder="Buscar por igreja ou grupo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="congress-list__filter"
          value={filterType}
          onChange={e => setFilterType(e.target.value as CongressType | '')}
        >
          <option value="">Todos os tipos</option>
          {CONGRESS_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Contador */}
      <div className="congress-list__count">
        {filtered.length} grupo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Lista */}
      <div className="congress-list__items">
        {loading ? (
          <div className="congress-list__empty">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="congress-list__empty">
            {congresses.length === 0
              ? 'Nenhum grupo registrado ainda.'
              : 'Nenhum grupo encontrado com esse filtro.'}
          </div>
        ) : (
          filtered.map(c => {
            const typeColor = TYPE_COLORS[c.congressType];
            return (
              <div key={c.id} className="congress-card">
                <div className="congress-card__left">
                  <span
                    className="congress-card__type"
                    style={{ background: typeColor.bg, color: typeColor.color }}
                  >
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

                <div className="congress-card__actions">
                  {confirmDeleteId === c.id ? (
                    <div className="congress-card__confirm">
                      <span>Excluir?</span>
                      <button
                        className="congress-card__confirm-yes"
                        onClick={() => { onDelete(c.id); setConfirmDeleteId(null); }}
                      >
                        Sim
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)}>Não</button>
                    </div>
                  ) : (
                    <button
                      className="congress-card__delete"
                      onClick={() => setConfirmDeleteId(c.id)}
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}