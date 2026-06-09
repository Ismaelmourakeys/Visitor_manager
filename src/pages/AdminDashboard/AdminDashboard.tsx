// AdminDashboard.tsx
import { useState } from 'react';
import { mockVisitors } from '../../data/mockVisitors';
import { VisitorCard } from '../../components/layout/VisitorCard/VisitorCard';
import './AdminDashboard.css';

type FilterTab = 'All Visitors' | 'New' | 'Contact Made';

export function AdminDashboard() {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<FilterTab>('All Visitors');

    const filtered = mockVisitors.filter(v => {
        const matchSearch = v.fullName.toLowerCase().includes(search.toLowerCase());
        const matchTab =
            activeTab === 'All Visitors' ||
            v.status === activeTab;
        return matchSearch && matchTab;
    });

    const tabs: FilterTab[] = ['All Visitors', 'New', 'Contact Made'];

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Visitor Log</h1>
                    <p>Manage and follow up with recent guests.</p>
                </div>
                <div className="dashboard-actions">
                    <input
                        type="text"
                        placeholder="Search visitors..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <button className="btn-icon">🔔</button>
                </div>
            </div>

            {/* Filtros */}
            <div className="dashboard-filters">
                <div className="tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={activeTab === tab ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                            <span className="tab-count">
                                {tab === 'All Visitors'
                                    ? mockVisitors.length
                                    : mockVisitors.filter(v => v.status === tab).length}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="filter-actions">
                    <button className="btn-outline">⚙ Filter</button>
                    <button className="btn-outline">↓ Export</button>
                </div>
            </div>

            {/* Lista de visitantes */}
            <div className="visitor-list">
                {filtered.length === 0 ? (
                    <p className="empty-state">No visitors found.</p>
                ) : (
                    filtered.map(visitor => (
                        <VisitorCard
                            key={visitor.id}
                            visitor={visitor}
                            onViewDetails={(id) => console.log('Ver detalhes:', id)}
                        />
                    ))
                )}
            </div>

            {/* Paginação */}
            <div className="pagination">
                <span>Showing 1 to {filtered.length} of {filtered.length} entries</span>
                <div className="page-controls">
                    <button>‹</button>
                    <button className="active">1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>›</button>
                </div>
            </div>
        </div>
    );
}