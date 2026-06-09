import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { RegistrationForm } from './pages/RegistrationForm/RegistrationForm';
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard';
import type { Visitor, VisitorStatus } from './types/visitor';
import { mockVisitors } from './data/mockVisitors';
import './App.css';

type Page = 'form' | 'dashboard';

function App() {

  const [activePage, setActivePage] = useState<Page>('form');
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);

  function getStatusByVisits(visitedTimes: string | undefined): VisitorStatus {
    if (visitedTimes === '3 vezes ou mais') return 'Regular';
    if (visitedTimes === '2 vezes') return 'Contact Made';
    return 'New'; // 1 vez ou não informado
  }

  function handleNewVisitor(visitor: Visitor) {
    const visitorWithStatus: Visitor = {
      ...visitor,
      status: getStatusByVisits(visitor.visitedTimes),
    };
    setVisitors(prev => [visitorWithStatus, ...prev]);
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