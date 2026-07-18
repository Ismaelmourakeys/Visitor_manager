import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuth } from './contexts/AuthContext';
import { useVisitors } from './hooks/useVisitors';
import { useChurchProfile } from './hooks/useChurchProfile';
import { useNotifications } from './hooks/useNotifications';
import { Sidebar } from './components/layout/Sidebar';
import { RegistrationForm } from './pages/RegistrationForm/RegistrationForm';
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard';
import { Login } from './pages/Login/Login';
import { ChurchProfile } from './pages/ChurchProfile/ChurchProfile';
import { Settings } from './pages/Settings/Settings';
import { Telao } from './pages/Telao/Telao';
import { Landing } from './pages/Landing/Landing';
import type { Visitor, VisitorStatus } from './types/visitor';
import './App.css';

type Page = 'form' | 'dashboard' | 'settings';

function getStatusByVisits(visitedTimes: string | undefined): VisitorStatus {
  if (visitedTimes === '3 vezes ou mais') return 'Regular';
  if (visitedTimes === '2 vezes') return 'Contact Made';
  return 'New';
}

function App() {
  const { user, loading: authLoading } = useAuth();
  const { church, loading: churchLoading, refresh } = useChurchProfile(user?.uid);
  const { visitors, loading: visitorsLoading, addVisitor } = useVisitors(user?.uid);

  const {
  notifications, toasts, unreadCount,
  markAllRead, markAllUnread,
  toggleRead, markAsRead, dismissToast,
} = useNotifications(visitors, visitorsLoading, user?.uid);

  const [telaoOpen, setTelaoOpen] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [startWithRegister, setStartWithRegister] = useState(false);
  const [activePage, setActivePage] = useState<Page>('dashboard');

  async function handleNewVisitor(visitor: Visitor) {
    const { id, ...rest } = visitor;
    await addVisitor({
      ...rest,
      status: getStatusByVisits(visitor.visitedTimes),
    });
    setActivePage('dashboard');
  }

  // 1. Carregando
  if (authLoading || churchLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f1923',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '14px',
      }}>
        Carregando...
      </div>
    );
  }

  // 2. Landing page — só aparece se não estiver logado e showLanding for true
  if (!user && showLanding) {
    return (
      <Landing
        onLogin={() => {
          setStartWithRegister(false);
          setShowLanding(false);
        }}
        onRegister={() => {
          setStartWithRegister(true);
          setShowLanding(false);
        }}
      />
    );
  }

  // 3. Tela de login/cadastro
  if (!user) {
    return <Login startWithRegister={startWithRegister} />;
  }

  // 4. Perfil da igreja — primeiro acesso
  if (!church) {
    return <ChurchProfile user={user} onComplete={refresh} />;
  }

  // 5. App completo
  return (
    <>
      <div className="app-layout">
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={() => {
            signOut(auth);
            setShowLanding(true); // volta pra landing ao sair
          }}
          church={church}
        />
        <main className="app-content">
          {activePage === 'form' && (
            <RegistrationForm
              onSubmit={handleNewVisitor}
              church={church}
            />
          )}
          {activePage === 'dashboard' && (
            <AdminDashboard
              visitors={visitors}
              loading={visitorsLoading}
              church={church}
              churchId={user.uid}
              onTelao={() => setTelaoOpen(true)}
              notifications={notifications}
              toasts={toasts}
              unreadCount={unreadCount}
              showNotifPanel={showNotifPanel}
              onToggleNotifPanel={() => setShowNotifPanel(v => !v)}
              onMarkAllRead={markAllRead}
              onMarkAllUnread={markAllUnread}
              onToggleRead={toggleRead}
              onMarkAsRead={markAsRead}
              onDismissToast={dismissToast}
            />
          )}
          {activePage === 'settings' && (
            <Settings
              user={user}
              church={church}
              onSave={refresh}
            />
          )}
        </main>
      </div>

      {telaoOpen && (
        <Telao
          visitors={visitors}
          church={church}
          onClose={() => setTelaoOpen(false)}
        />
      )}
    </>
  );
}

export default App;