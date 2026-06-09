import { useState } from 'react';
import type { Visitor, VisitorStatus } from '../../types/visitor';
import { VisitorCard } from '../../components/VisitorCard/VisitorCard';
import './AdminDashboard.css';

interface AdminDashboardProps {
  visitors: Visitor[];
}

type FilterTab = 'All Visitors' | VisitorStatus;

const TABS: FilterTab[] = ['All Visitors', 'New', 'Contact Made', 'Regular'];

export function AdminDashboard({ visitors }: AdminDashboardProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All Visitors');

  const filtered = visitors.filter(v => {
    const matchSearch = v.fullName.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'All Visitors' || v.status === activeTab;
    return matchSearch && matchTab;
  });

  function countByStatus(status: VisitorStatus) {
    return visitors.filter(v => v.status === status).length;
  }

  function tabCount(tab: FilterTab) {
    return tab === 'All Visitors' ? visitors.length : countByStatus(tab as VisitorStatus);
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__title-group">
          <h1 className="dashboard__title">Visitor Log</h1>
          <p className="dashboard__subtitle">Manage and follow up with recent guests.</p>
        </div>
        <div className="dashboard__header-actions">
          <div className="dashboard__search-wrap">
            <span className="dashboard__search-icon">🔍</span>
            <input
              type="text"
              className="dashboard__search"
              placeholder="Search visitors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="dashboard__icon-btn" title="Notifications">🔔</button>
        </div>
      </div>

      {/* Tabs + Ações */}
      <div className="dashboard__toolbar">
        <div className="dashboard__tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`dashboard__tab ${activeTab === tab ? 'dashboard__tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className="dashboard__tab-count">{tabCount(tab)}</span>
            </button>
          ))}
        </div>
        <div className="dashboard__toolbar-actions">
          <button className="dashboard__outline-btn">⚙ Filter</button>
          <button className="dashboard__outline-btn">↓ Export</button>
        </div>
      </div>

      {/* Lista */}
      <div className="dashboard__list">
        {filtered.length === 0 ? (
          <div className="dashboard__empty">
            <p>No visitors found.</p>
            <span>Try a different search or filter.</span>
          </div>
        ) : (
          filtered.map(visitor => (
            <VisitorCard
              key={visitor.id}
              visitor={visitor}
              onViewDetails={id => console.log('View details:', id)}
            />
          ))
        )}
      </div>

      {/* Paginação */}
      <div className="dashboard__pagination">
        <span className="dashboard__pagination-info">
          Showing 1 to {filtered.length} of {filtered.length} entries
        </span>
        <div className="dashboard__pages">
          <button className="dashboard__page-btn">‹</button>
          <button className="dashboard__page-btn dashboard__page-btn--active">1</button>
          <button className="dashboard__page-btn">›</button>
        </div>
      </div>
    </div>
  );
}
