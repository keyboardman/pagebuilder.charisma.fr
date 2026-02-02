import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import PageBuilderEmbed from './editeur2/PageBuilderEmbed';
import { registerFont } from './editeur2/services/typography';
import './editeur2/assets/css/index.css';

const fileManagerConfig = {
  type: 'custom',
  custom: {
    listEndpoint: '/media/api/list',
    uploadEndpoint: '/media/api/upload',
    renameEndpoint: '/media/api/rename',
    deleteEndpoint: '/media/api/delete',
    useXHR: true,
  },
};

function PageBuilderStandalone({ initialContent, csrfToken, saveUrl, backUrl = '', pageTitle = '', apiCardsBaseUrl = null }) {
  const [content, setContent] = useState(initialContent || '');
  const [saveStatus, setSaveStatus] = useState('idle');

  const saveContent = useCallback(async (newContent) => {
    setSaveStatus('saving');
    try {
      const res = await fetch(saveUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent, _token: csrfToken }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText);
        throw new Error(msg || 'Save failed');
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Erreur enregistrement:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [saveUrl, csrfToken]);

  const handleChange = useCallback((newContent) => {
    setContent(newContent);
    // Autosave désactivé
  }, []);

  const handleSave = useCallback(() => {
    saveContent(content);
  }, [saveContent, content]);

  return (
    <div className="admin-layout relative h-full flex flex-col overflow-hidden">
      <header className="shrink-0 flex items-center gap-4 px-4 py-2 border-b bg-background">
        <a href={backUrl} className="text-sm font-medium text-primary hover:underline">
          ← Retour à la page
        </a>
        <span className="text-sm text-muted-foreground">{pageTitle}</span>
        <div className="flex-1 min-w-0" />
        <button
          type="button"
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="px-3 py-1 rounded border bg-background hover:bg-muted text-sm font-medium disabled:opacity-50"
        >
          Enregistrer
        </button>
        {saveStatus === 'saving' && <span className="text-muted-foreground text-sm">Enregistrement…</span>}
        {saveStatus === 'saved' && <span className="text-green-600 text-sm">Enregistré</span>}
        {saveStatus === 'error' && <span className="text-red-600 text-sm">Erreur</span>}
      </header>
      <div className="flex-1 min-h-0 min-w-0 overflow-auto">
        <PageBuilderEmbed
          value={content || '{"cylsqgudkwtz":{"id":"cylsqgudkwtz","type":"node-root","parent":null,"content":{"title":""}}}'}
          onChange={handleChange}
          fileManagerConfig={fileManagerConfig}
          apiCardsBaseUrl={apiCardsBaseUrl}
        />
      </div>
    </div>
  );
}

const dataEl = document.getElementById('page-builder-data');
const rootEl = document.getElementById('page-builder-standalone-root');
if (dataEl && rootEl) {
  let initialContent = '';
  let csrfToken = '';
  let saveUrl = '';
  let backUrl = '';
  let pageTitle = '';
  let apiCardsBaseUrl = '';
  try {
    const data = JSON.parse(dataEl.textContent);

    const raw = data.content;

    initialContent =
      typeof raw === 'string'
        ? raw
        : typeof raw === 'object' && raw !== null
          ? JSON.stringify(raw)
          : '';

    csrfToken = data.csrfToken ?? '';
    saveUrl = data.saveUrl ?? '';
    backUrl = typeof data.backUrl === 'string' ? data.backUrl : '';
    pageTitle = typeof data.pageTitle === 'string' ? data.pageTitle : '';
    apiCardsBaseUrl = typeof data.apiCardsBaseUrl === 'string' ? data.apiCardsBaseUrl : '';
    const themeFonts = data.themeFonts ?? [];
    themeFonts.forEach((font) => {
      try {
        if (font?.name && font?.href && font?.fontFamily) {
          registerFont({ name: font.name, href: font.href, fontFamily: font.fontFamily });
        }
      } catch (e) {
        console.warn('Erreur enregistrement police:', font?.name, e);
      }
    });
  } catch (_) {}
  const root = createRoot(rootEl);

  root.render(
    <PageBuilderStandalone
      initialContent={initialContent}
      csrfToken={csrfToken}
      saveUrl={saveUrl}
      backUrl={backUrl}
      pageTitle={pageTitle}
      apiCardsBaseUrl={apiCardsBaseUrl || null}
    />
  );
}
