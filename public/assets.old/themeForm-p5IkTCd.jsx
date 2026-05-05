import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeFontPicker } from './components/ThemeFontPicker';

const el = document.getElementById('theme-font-picker');
if (el) {
  const fontsJson = el.dataset.fonts || '[]';
  const selectedJson = el.dataset.selected || '[]';

  let fonts = [];
  let selectedIds = [];
  try {
    fonts = JSON.parse(fontsJson);
    selectedIds = JSON.parse(selectedJson);
  } catch (_) {}

  const root = createRoot(el);
  root.render(
    <ThemeFontPicker
      fonts={fonts}
      selectedIds={Array.isArray(selectedIds) ? selectedIds.map(Number).filter((n) => !Number.isNaN(n)) : []}
    />
  );
}
