import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@luster-ui/ui/loader';
import { AuthProvider } from './contexts/AuthContext';

import './index.css';
import App from './App.tsx';

defineCustomElements(window);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);