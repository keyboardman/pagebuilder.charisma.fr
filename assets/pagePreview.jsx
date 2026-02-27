import React from 'react';
import { createRoot } from 'react-dom/client';
import AppProvider from './editeur/services/providers/AppProvider';
import App from './editeur/app/App';
import './editeur/assets/css/index.css';

const el = document.getElementById('page-preview-root');
if (el) {
  const json = el.dataset.json ?? '{}';
  const root = createRoot(el);
  root.render(
    React.createElement(AppProvider, { json, view: true }, React.createElement(App))
  );
}
