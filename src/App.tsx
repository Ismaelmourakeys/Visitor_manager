import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar'
import { RegistrationForm } from './pages/RegistrationForm/RegistrationForm'
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard'
import './App.css';

type Page = 'form' | 'dashboard';

function App() {
  const [activePage, setActivePage] = useState<Page>('form')

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="app-content">
        {activePage === 'form' && <RegistrationForm />}
        {activePage === 'dashboard' && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;