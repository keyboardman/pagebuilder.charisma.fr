import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dashboard } from './components/Dashboard';

const el = document.getElementById('dashboard-root');
if (el) {
  const root = createRoot(el);
  root.render(
    <Dashboard
      fontCount={Number(el.dataset.fontCount) || 0}
      themeCount={Number(el.dataset.themeCount) || 0}
      fontUrl={el.dataset.fontUrl || '/font'}
      themeUrl={el.dataset.themeUrl || '/theme'}
    />
  );
}
