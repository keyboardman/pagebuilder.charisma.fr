import { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { newThemeIconId } from '../utils';
import _ from 'lodash';
import { FolderOpen } from 'lucide-react';
import { FileManagerIframePicker } from '@/editeur/ManagerAsset/FileManagerIframePicker';
import type { FileItem } from '@/editeur/ManagerAsset/types';

function toAbsoluteUrl(url: string): string {
  if (typeof window === 'undefined' || !url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${window.location.origin}${path}`;
}

function IconImagePreview({ url }: { url: string }) {
  const [loadError, setLoadError] = useState(false);
  const trimmed = url.trim();

  useEffect(() => {
    setLoadError(false);
  }, [trimmed]);

  if (!trimmed) {
    return (
      <span className="text-[10px] text-muted-foreground" title="Aucune image">
        —
      </span>
    );
  }

  if (loadError) {
    return (
      <span className="text-[10px] text-destructive" title="Impossible de charger l'image">
        !
      </span>
    );
  }

  return (
    <img
      src={trimmed}
      alt=""
      className="max-h-full max-w-full object-contain"
      loading="lazy"
      onLoad={() => setLoadError(false)}
      onError={() => setLoadError(true)}
    />
  );
}

export const NodeIconsForm = () => {
  const { getIcons, setIcons, filemanagerUrl } = useTheme();
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  const icons = getIcons();

  const addIcon = () => {
    const id = newThemeIconId();
    const nextIcons = [
      ...icons,
      { id, name: '', className: '', url: '' },
    ];

    setIcons(nextIcons);
  };

  const updateIcon = (
    id: string,
    patch: Partial<{ name: string; className: string; url: string }>
  ) => {
    const nextIcons = _.map(icons, (icon) =>
      icon.id === id ? { ...icon, ...patch } : icon
    );
    setIcons(nextIcons);
  };

  const removeIcon = (id: string, name?: string) => {
    const label = name && name.trim() ? name.trim() : 'cette icone';
    if (!window.confirm(`Supprimer l'icone « ${label} » ?`)) {
      return;
    }

    setIcons(icons.filter((icon) => icon.id !== id));
  };

  const openFileManagerForIcon = (iconId: string) => {
    setSelectedIconId(iconId);
    setIsFileManagerOpen(true);
  };

  const handleSelectFile = (file: FileItem) => {
    if (selectedIconId === null) {
      setIsFileManagerOpen(false);
      return;
    }
    updateIcon(selectedIconId, { url: toAbsoluteUrl(file.url) });
    setIsFileManagerOpen(false);
  };

  return (
    <details className="group border border-border rounded-lg">
      <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
        <span className="transition group-open:rotate-90">▶</span>
        Icones du thème
      </summary>
      <div className="px-4 pb-4 pt-1 border-t border-border space-y-2">
        <p className="text-sm text-muted-foreground pt-2">
          Definissez les icones disponibles (nom, classe CSS et lien vers une
          image : SVG, PNG ou JPEG) pour generer automatiquement les regles
          `mask`.
        </p>
        <div className="space-y-3">
          {icons.map((icon) => (
            <div
              key={icon.id}
              className="flex flex-col gap-3 rounded-md border border-border p-3 sm:flex-row items-center"
            >
              <i className="ce-icon" style={{ backgroundImage: `url(${icon.url})` }} />
              
              <div className="grid min-w-0 flex-1 gap-2 md:grid-cols-[1fr_1fr_2fr_auto_auto] md:items-center">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={icon.name}
                  onChange={(e) => updateIcon(icon.id, { name: e.target.value })}
                  placeholder="Nom (ex. Home)"
                />
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={icon.className}
                  onChange={(e) =>
                    updateIcon(icon.id, { className: e.target.value })
                  }
                  placeholder="Classe (ex. icon-home)"
                />
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={icon.url}
                  onChange={(e) => updateIcon(icon.id, { url: e.target.value })}
                  onBlur={(e) =>
                    updateIcon(icon.id, { url: toAbsoluteUrl(e.target.value.trim()) })
                  }
                  placeholder="Lien image (ex. /media/icon.svg ou .png)"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => openFileManagerForIcon(icon.id)}
                  title="Choisir une image dans la mediatheque (SVG, PNG, JPEG)"
                  disabled={!filemanagerUrl}
                >
                  <FolderOpen className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => removeIcon(icon.id, icon.name)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-sm btn-outline" onClick={addIcon}>
          Ajouter une icone
        </button>
        {!!filemanagerUrl && (
          <FileManagerIframePicker
            open={isFileManagerOpen}
            onOpenChange={setIsFileManagerOpen}
            onSelectFile={handleSelectFile}
            filemanagerUrl={filemanagerUrl}
            type="image"
          />
        )}
      </div>
    </details>
  );
};

export default NodeIconsForm;
