import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AppProvider from './editeur/services/providers/AppProvider';
import App from './editeur/app/App';
import { registerBackendApis } from './editeur/ManagerApi/backendApiAdapter';
import { apiRegistry } from './editeur/ManagerApi/ApiRegistry';
import { initCharismaVideoModals } from './editeur/components/video/charismaVideoModal';
import './editeur/assets/css/index.css';

function PagePreviewApp({ json, apiCardsBaseUrl }) {
  const [ready, setReady] = useState(!apiCardsBaseUrl);

  useEffect(() => {
    if (!apiCardsBaseUrl) {
      setReady(true);
      return;
    }

    let cancelled = false;

    registerBackendApis(apiCardsBaseUrl, (adapter) => apiRegistry.register(adapter))
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) {
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiCardsBaseUrl]);

  useEffect(() => {
    if (!ready) return;

    const root = document.getElementById('page-preview-root');
    if (!root) return;

    initCharismaVideoModals(root, { observe: true });
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <AppProvider json={json} view={true}>
      <App />
    </AppProvider>
  );
}

const el = document.getElementById('page-preview-root');
if (el) {
  const json = el.dataset.json ?? '{}';
  const apiCardsBaseUrl = el.dataset.apiCardsBaseUrl?.trim() || null;
  const root = createRoot(el);
  root.render(
    React.createElement(PagePreviewApp, { json, apiCardsBaseUrl })
  );
}
