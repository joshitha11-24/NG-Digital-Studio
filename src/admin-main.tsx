import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminPanelApp } from '../admin-panel/src/App';
import './index.css';

createRoot(document.getElementById('admin-root')!).render(
  <StrictMode>
    <AdminPanelApp />
  </StrictMode>,
);
