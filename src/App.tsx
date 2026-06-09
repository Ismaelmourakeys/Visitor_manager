import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { RegistrationForm } from './pages/RegistrationForm/RegistrationForm';
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard';
import type { Visitor } from './types/visitor';
import { mockVisitors } from './data/mockVisitors';
import './App.css';

type Page = 'form' | 'dashboard';

function App() {
  const [activePage, setActivePage] = useState<Page>('form');
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);

  function handleNewVisitor(visitor: Visitor) {
    setVisitors(prev => [visitor, ...prev]);
    setActivePage('dashboard');
  }

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="app-content">
        {activePage === 'form' && (
          <RegistrationForm onSubmit={handleNewVisitor} />
        )}
        {activePage === 'dashboard' && (
          <AdminDashboard visitors={visitors} />
        )}
      </main>
    </div>
  );
}

export default App;