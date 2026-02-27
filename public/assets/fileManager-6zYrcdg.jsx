import React from 'react';
import { createRoot } from 'react-dom/client';
import { FileManager } from './components/FileManager';

const el = document.getElementById('file-manager-root');
if (el) {
  const root = createRoot(el);
  root.render(<FileManager />);
}
