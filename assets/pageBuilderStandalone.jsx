import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import PageBuilderEmbed from './editeur2/PageBuilderEmbed';
import AppProvider from './editeur2/services/providers/AppProvider';
import App from './editeur2/app/App';
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

function makeLinksAbsolute(html, baseUrl) {
  if (!baseUrl) return html;
  const base = baseUrl.replace(/\/$/, '');
  return html
    .replace(/\s+href="\/(?!\/)/g, ` href="${base}/`)
    .replace(/\s+src="\/(?!\/)/g, ` src="${base}/`);
}

function buildFullDocument(bodyInnerHTML, { baseUrl = '', pageTitle = '', pageDescription = '', themeCssUrl = '', renderCssUrls = [] }) {
  const base = baseUrl.replace(/\/$/, '');
  const themeCssHref = themeCssUrl ? (themeCssUrl.startsWith('http') ? themeCssUrl : base + (themeCssUrl.startsWith('/') ? themeCssUrl : '/' + themeCssUrl)) : '';
  const descMeta = pageDescription
    ? `<meta name="description" content="${String(pageDescription).replace(/"/g, '&quot;')}">`
    : '';
  const cssLinks = Array.isArray(renderCssUrls)
    ? renderCssUrls
        .filter((url) => url && typeof url === 'string')
        .map((url) => `<link rel="stylesheet" href="${String(url).replace(/"/g, '&quot;')}">`)
        .join('\n')
    : '';
  return (
    '<!DOCTYPE html>\n<html lang="fr">\n<head>\n' +
    '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    `<title>${String(pageTitle).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>\n` +
    descMeta +
    (themeCssHref ? `\n<link rel="stylesheet" href="${themeCssHref}">\n` : '') +
    (cssLinks ? `\n${cssLinks}\n` : '') +
    '</head>\n<body>\n' +
    bodyInnerHTML +
    '\n</body>\n</html>'
  );
}

function generateFullRenderHtml(content, opts) {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;pointer-events:none;';
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(
      React.createElement(AppProvider, { json: content, view: true }, React.createElement(App))
    );
    setTimeout(() => {
      try {
        const bodyHtml = makeLinksAbsolute(container.innerHTML, opts.baseUrl);
        const fullDoc = buildFullDocument(bodyHtml, opts);
        root.unmount();
        document.body.removeChild(container);
        resolve(fullDoc);
      } catch (e) {
        root.unmount();
        if (container.parentNode) document.body.removeChild(container);
        resolve('');
      }
    }, 400);
  });
}

function PageBuilderStandalone({
  initialContent,
  csrfToken,
  saveUrl,
  backUrl = '',
  pageTitle = '',
  apiCardsBaseUrl = null,
  baseUrl = '',
  pageDescription = '',
  themeCssUrl = '',
  renderCssUrls = [],
}) {
  const [content, setContent] = useState(initialContent || '');
  const [saveStatus, setSaveStatus] = useState('idle');

  const saveContent = useCallback(
    async (newContent, renderHtml = null) => {
      setSaveStatus('saving');
      try {
        const body = { content: newContent, _token: csrfToken };
        if (renderHtml != null && renderHtml !== '') body.render = renderHtml;
        const res = await fetch(saveUrl, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
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
    },
    [saveUrl, csrfToken]
  );

  const handleChange = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  const handleSave = useCallback(() => {
    const opts = { baseUrl, pageTitle, pageDescription, themeCssUrl, renderCssUrls };
    generateFullRenderHtml(content, opts).then((fullHtml) => {
      saveContent(content, fullHtml);
    });
  }, [saveContent, content, baseUrl, pageTitle, pageDescription, themeCssUrl, renderCssUrls]);

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
  let baseUrl = '';
  let pageDescription = '';
  let themeCssUrl = '';
  let renderCssUrls = [];
  try {
    const data = JSON.parse(dataEl.textContent);

    const raw = data.content;

    console.log('raw',  data.apiCardsBaseUrl);

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
    baseUrl = typeof data.baseUrl === 'string' ? data.baseUrl : '';
    pageDescription = typeof data.pageDescription === 'string' ? data.pageDescription : '';
    themeCssUrl = typeof data.themeCssUrl === 'string' ? data.themeCssUrl : '';
    renderCssUrls = Array.isArray(data.renderCssUrls) ? data.renderCssUrls : [];
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
      baseUrl={baseUrl}
      pageDescription={pageDescription}
      themeCssUrl={themeCssUrl}
      renderCssUrls={renderCssUrls}
    />
  );
}
