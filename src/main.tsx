import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { FirebaseProvider } from './contexts/FirebaseContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
      <App />
      <Toaster position="top-right" />
    </FirebaseProvider>
  </StrictMode>
);