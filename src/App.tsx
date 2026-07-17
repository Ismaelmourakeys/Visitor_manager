import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuth } from './contexts/AuthContext';
import { useVisitors } from './hooks/useVisitors';
import { Sidebar } from './components/layout/Sidebar';
import { RegistrationForm } from './pages/RegistrationForm/RegistrationForm';
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard';
import { Login } from './pages/Login/Login';
import type { Visitor, VisitorStatus } from './types/visitor';
import './App.css';

type Page = 'form' | 'dashboard';

function getStatusByVisits(visitedTimes: string | undefined): VisitorStatus {
  if (visitedTimes === '3 vezes ou mais') return 'Regular';
  if (visitedTimes === '2 vezes') return 'Contact Made';
  return 'New';
}

function App() {
  const { user, loading: authLoading } = useAuth();
  const { visitors, loading: visitorsLoading, addVisitor } = useVisitors(user?.uid);
  const [activePage, setActivePage] = useState<Page>('dashboard');

  async function handleNewVisitor(visitor: Visitor) {
    const { id, ...rest } = visitor;
    await addVisitor({
      ...rest,
      status: getStatusByVisits(visitor.visitedTimes),
    });
    setActivePage('dashboard');
  }

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f3f4f6',
        color: '#6b7280',
        fontSize: '14px',
      }}>
        Carregando...
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={() => signOut(auth)}
      />
      <main className="app-content">
        {activePage === 'form' && (
          <RegistrationForm onSubmit={handleNewVisitor} />
        )}
        {activePage === 'dashboard' && (
          <AdminDashboard
            visitors={visitors}
            loading={visitorsLoading}
          />
        )}
      </main>
    </div>
  );
}

export default App;