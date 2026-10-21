import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import OneClickApp from './OneClickApp.tsx';
import './index.css';

const params = new URLSearchParams(window.location.search);
const showAdvancedWorkspace = params.get('advanced') === '1' || params.get('workspace') === '1';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {showAdvancedWorkspace ? <App /> : <OneClickApp />}
  </StrictMode>,
);
