import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';

const INPUT_ID = 'theme-config-fonts';

/**
 * Polices au format { id, name, fallback, type: 'google'|'custom', googleFontUrl? }.
 * Met à jour l'input #theme-config-fonts (valeur "1,2,3") pour la soumission.
 *
 * @param {object} props
 * @param {Array<{id: number, name: string, fallback: string, type: string, googleFontUrl?: string|null}>} props.fonts
 * @param {number[]} props.selectedIds
 */
export function ThemeFontPicker({ fonts = [], selectedIds = [] }) {
  const [selected, setSelected] = useState(() => new Set(selectedIds));
  const addedLinksRef = useRef(/** @type {Set<string>} */ (new Set()));

  const syncInput = useCallback(() => {
    const input = document.getElementById(INPUT_ID);
    if (input && input instanceof HTMLInputElement) {
      input.value = Array.from(selected).join(',');
    }
  }, [selected]);

  useEffect(() => {
    syncInput();
  }, [syncInput]);

  useEffect(() => {
    const form = document.getElementById(INPUT_ID)?.closest('form');
    if (!form) return;
    const handler = () => syncInput();
    form.addEventListener('submit', handler, true);
    return () => form.removeEventListener('submit', handler, true);
  }, [syncInput]);

  const toggle = (id, font) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (font.type === 'google' && font.googleFontUrl) {
          const link = document.querySelector(`link[data-theme-font-picker="${font.googleFontUrl}"]`);
          if (link) link.remove();
          addedLinksRef.current.delete(font.googleFontUrl);
        }
      } else {
        next.add(id);
        if (font.type === 'google' && font.googleFontUrl && !addedLinksRef.current.has(font.googleFontUrl)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = font.googleFontUrl;
          link.setAttribute('data-theme-font-picker', font.googleFontUrl);
          document.head.appendChild(link);
          addedLinksRef.current.add(font.googleFontUrl);
        }
      }
      return next;
    });
  };

  const google = fonts.filter((f) => f.type === 'google');
  const custom = fonts.filter((f) => f.type === 'custom');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Polices du thème</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cochez les polices à importer (Google ou personnalisées). Elles seront disponibles pour body, titres, etc.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {google.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Google Fonts</h4>
              <div className="flex flex-wrap gap-2">
                {google.map((f) => (
                  <label
                    key={f.id}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm cursor-pointer transition-colors',
                      selected.has(f.id)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/50 hover:bg-muted'
                    )}
                    style={selected.has(f.id) && f.name ? { fontFamily: `"${f.name.replace(/"/g, '')}", ${f.fallback}` } : undefined}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(f.id)}
                      onChange={() => toggle(f.id, f)}
                      className="rounded border-input"
                    />
                    <span>{f.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {custom.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Polices personnalisées</h4>
              <div className="flex flex-wrap gap-2">
                {custom.map((f) => (
                  <label
                    key={f.id}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm cursor-pointer transition-colors',
                      selected.has(f.id)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/50 hover:bg-muted'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(f.id)}
                      onChange={() => toggle(f.id, f)}
                      className="rounded border-input"
                    />
                    <span>{f.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {fonts.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucune police Google ou personnalisée. Ajoutez-en dans la section Polices.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
