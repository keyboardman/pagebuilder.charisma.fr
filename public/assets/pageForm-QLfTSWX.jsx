import React from 'react';
import { createRoot } from 'react-dom/client';
import { PageForm } from './components/PageForm';

const el = document.getElementById('page-form-root');
if (el) {
  const postUrl = el.dataset.postUrl ?? '';
  const themesJson = el.dataset.themes ?? '[]';
  const pageJson = el.dataset.page ?? '';
  const csrfToken = el.dataset.csrfToken ?? '';

  let themes = [];
  let initialPage = null;
  try {
    themes = JSON.parse(themesJson);
  } catch {
    themes = [];
  }
  try {
    if (pageJson) {
      initialPage = JSON.parse(pageJson);
    }
  } catch {
    initialPage = null;
  }

  const root = createRoot(el);
  root.render(
    <PageForm
      postUrl={postUrl}
      themes={themes}
      initialPage={initialPage}
      csrfToken={csrfToken}
    />
  );
}
