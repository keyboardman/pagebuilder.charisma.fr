import { createRoot } from 'react-dom/client';
import { ThemeFormComponent } from './components/ThemeFormComponent';

function mountThemeForm(): void {
  const el = document.getElementById('theme-form-2');
  if (!el) return;

  const scriptEl = document.getElementById('theme-config-json');
  let initialConfig: Record<string, unknown> | null = null;
  if (scriptEl?.textContent) {
    try {
      initialConfig = JSON.parse(scriptEl.textContent) as Record<string, unknown>;
    } catch {
      initialConfig = null;
    }
  }

  const fontsJson = el.dataset.fonts ?? '[]';
  const postUrl = el.dataset.postUrl ?? window.location.pathname;
  const fieldName = el.dataset.fieldName ?? 'config[fonts]';

  let fonts: { id: number; name: string }[] = [];
  try {
    fonts = JSON.parse(fontsJson);
  } catch {
    fonts = [];
  }

  const root = createRoot(el);
  root.render(
    <ThemeFormComponent
      fonts={fonts}
      postUrl={postUrl}
      fieldName={fieldName}
      initialConfig={initialConfig}
    />
  );
}

mountThemeForm();