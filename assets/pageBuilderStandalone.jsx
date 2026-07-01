import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import PageBuilderEmbed from './editeur/PageBuilderEmbed';
import AppProvider from './editeur/services/providers/AppProvider';
import App from './editeur/app/App';
import { registerBackendApis } from './editeur/ManagerApi/backendApiAdapter';
import { apiRegistry } from './editeur/ManagerApi/ApiRegistry';
import { registerThemeFont } from './editeur/services/typography';
import { initThemeFontFamilies, initThemeFontIds } from './editeur/ManagerFont/FontUsageRegistry';
import {
  normalizeThemeNodeOverrides,
  normalizeThemeVars,
} from './editeur/services/themeStyleHints';
import './editeur/assets/css/index.css';

// Config filemanager : si filemanagerUrl est fourni (backend), mode iframe keyboardman ; sinon custom (legacy)
function getFileManagerConfig(data) {
 
  const filemanagerUrl = typeof data?.filemanagerUrl === 'string' && data.filemanagerUrl ? data.filemanagerUrl : null;

  return { type: 'iframe', filemanagerUrl };
}

function makeLinksAbsolute(html, baseUrl) {
  if (!baseUrl) return html;
  const base = baseUrl.replace(/\/$/, '');
  return html
    .replace(/\s+href="\/(?!\/)/g, ` href="${base}/`)
    .replace(/\s+src="\/(?!\/)/g, ` src="${base}/`);
}

function buildFullDocument(bodyInnerHTML, { baseUrl = '', pageTitle = '', pageMetaTitle = '', pageDescription = '', themeCssUrl = '', renderCssUrls = [], renderScriptUrls = [] }) {
  const base = baseUrl.replace(/\/$/, '');
  const themeCssHref = themeCssUrl ? (themeCssUrl.startsWith('http') ? themeCssUrl : base + (themeCssUrl.startsWith('/') ? themeCssUrl : '/' + themeCssUrl)) : '';
  const documentTitle = pageMetaTitle || pageTitle;
  const descMeta = pageDescription
    ? `<meta name="description" content="${String(pageDescription).replace(/"/g, '&quot;')}">`
    : '';
  const cssLinks = Array.isArray(renderCssUrls)
    ? renderCssUrls
        .filter((url) => url && typeof url === 'string')
        .map((url) => `<link rel="stylesheet" href="${String(url).replace(/"/g, '&quot;')}">`)
        .join('\n')
    : '';
  const scriptTags = Array.isArray(renderScriptUrls)
    ? renderScriptUrls
        .filter((url) => url && typeof url === 'string')
        .map((url) => `<script src="${String(url).replace(/"/g, '&quot;')}"></script>`)
        .join('\n')
    : '';
  return (
    '<!DOCTYPE html>\n<html lang="fr">\n<head>\n' +
    '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    `<title>${String(documentTitle).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>\n` +
    descMeta +
    (themeCssHref ? `\n<link rel="stylesheet" href="${themeCssHref}">\n` : '') +
    (cssLinks ? `\n${cssLinks}\n` : '') +
    '</head>\n<body>\n' +
    bodyInnerHTML +
    (scriptTags ? `\n${scriptTags}\n` : '') +
    '\n</body>\n</html>'
  );
}

function generateFullRenderHtml(content, opts) {
  return new Promise((resolve) => {
    const boot = async () => {
      if (opts.apiCardsBaseUrl) {
        try {
          await registerBackendApis(opts.apiCardsBaseUrl, (adapter) => apiRegistry.register(adapter));
        } catch {
          // ignore — le rendu statique reste dégradé si les APIs ne sont pas disponibles
        }
      }

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
      }, opts.apiCardsBaseUrl ? 1200 : 400);
    };

    void boot();
  });
}

function PageBuilderStandalone({
  initialContent,
  csrfToken,
  saveUrl,
  backUrl = '',
  pageTitle = '',
  pageMetaTitle = '',
  apiCardsBaseUrl = null,
  pageBuilderApiBaseUrl = null,
  baseUrl = '',
  pageDescription = '',
  themeCssUrl = '',
  renderCssUrls = [],
  renderScriptUrls = [],
  fileManagerConfig = null,
  themeIcons = [],
  themeNodeOverrides = {},
  themeVars = {},
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
    const opts = {
      baseUrl,
      pageTitle,
      pageMetaTitle,
      pageDescription,
      themeCssUrl,
      renderCssUrls,
      renderScriptUrls,
      apiCardsBaseUrl,
    };
    generateFullRenderHtml(content, opts).then((fullHtml) => {
      saveContent(content, fullHtml);
    });
  }, [saveContent, content, baseUrl, pageTitle, pageMetaTitle, pageDescription, themeCssUrl, renderCssUrls, renderScriptUrls, apiCardsBaseUrl]);

  return (
    <div className="page-builder-standalone-shell relative grid min-h-0 flex-1 grid-rows-[auto_1fr] overflow-hidden">
      <header className="page-builder-standalone-shell__header relative z-20 flex items-center gap-4 border-b bg-background px-4 py-2">
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
      <div className="page-builder-standalone-shell__builder min-h-0 min-w-0 overflow-hidden">
        <PageBuilderEmbed
          value={content || '{"cylsqgudkwtz":{"id":"cylsqgudkwtz","type":"node-root","parent":null,"content":{"title":""}}}'}
          onChange={handleChange}
          fileManagerConfig={fileManagerConfig ?? getFileManagerConfig({})}
          apiCardsBaseUrl={apiCardsBaseUrl}
          pageBuilderApiBaseUrl={pageBuilderApiBaseUrl}
          themeIcons={themeIcons}
          themeNodeOverrides={themeNodeOverrides}
          themeVars={themeVars}
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
  let pageMetaTitle = '';
  let apiCardsBaseUrl = '';
  let pageBuilderApiBaseUrl = '';
  let baseUrl = '';
  let pageDescription = '';
  let themeCssUrl = '';
  let renderCssUrls = [];
  let renderScriptUrls = [];
  let fileManagerConfig = null;
  let themeIcons = [];
  let themeNodeOverrides = {};
  let themeVars = {};
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
    pageMetaTitle = typeof data.pageMetaTitle === 'string' ? data.pageMetaTitle : '';
    apiCardsBaseUrl = typeof data.apiCardsBaseUrl === 'string' ? data.apiCardsBaseUrl : '';
    pageBuilderApiBaseUrl = typeof data.pageBuilderApiBaseUrl === 'string' ? data.pageBuilderApiBaseUrl : '';
    baseUrl = typeof data.baseUrl === 'string' ? data.baseUrl : '';
    pageDescription = typeof data.pageDescription === 'string' ? data.pageDescription : '';
    themeCssUrl = typeof data.themeCssUrl === 'string' ? data.themeCssUrl : '';
    renderCssUrls = Array.isArray(data.renderCssUrls) ? data.renderCssUrls : [];
    renderScriptUrls = Array.isArray(data.renderScriptUrls) ? data.renderScriptUrls : [];
    fileManagerConfig = getFileManagerConfig(data);
    themeIcons = Array.isArray(data.themeIcons) ? data.themeIcons : [];
    themeNodeOverrides = normalizeThemeNodeOverrides(data.themeNodeOverrides);
    themeVars = normalizeThemeVars(data.themeVars);

    const themeFonts = data.themeFonts ?? [];
    const themeFontIds = Array.isArray(data.themeFontIds)
      ? data.themeFontIds.map((id) => Number(id)).filter((id) => id > 0)
      : [];
    initThemeFontFamilies(themeFonts.map((font) => font?.fontFamily).filter(Boolean));
    initThemeFontIds(themeFontIds);
    themeFonts.forEach((font) => {
      try {
        if (font?.name && font?.href && font?.fontFamily) {
          registerThemeFont({ name: font.name, href: font.href, fontFamily: font.fontFamily });
        }
      } catch (e) {
        console.warn('Erreur enregistrement police:', font?.name, e);
      }
    });
  } catch (error) {
    console.error('page-builder-data: échec du parsing JSON', error);
  }
  const root = createRoot(rootEl);

  root.render(
    <PageBuilderStandalone
      initialContent={initialContent}
      csrfToken={csrfToken}
      saveUrl={saveUrl}
      backUrl={backUrl}
      pageTitle={pageTitle}
      pageMetaTitle={pageMetaTitle}
      apiCardsBaseUrl={apiCardsBaseUrl || null}
      pageBuilderApiBaseUrl={pageBuilderApiBaseUrl || null}
      baseUrl={baseUrl}
      pageDescription={pageDescription}
      themeCssUrl={themeCssUrl}
      renderCssUrls={renderCssUrls}
      renderScriptUrls={renderScriptUrls}
      fileManagerConfig={fileManagerConfig}
      themeIcons={themeIcons}
      themeNodeOverrides={themeNodeOverrides}
      themeVars={themeVars}
    />
  );
}
