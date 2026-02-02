import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Folder, FileText, Video, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const API = '/media/api';
const FILE_URL = '/media/file';
const CHUNK_SIZE = 8 * 1024 * 1024; // 8 Mo par chunk

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|svg|bmp|avif)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|avi|mkv|m4v|ogv)$/i;
const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i;

type Item = { name: string; path: string; type: 'file' | 'dir'; size?: number };

function getMediaType(name: string): 'image' | 'video' | 'audio' | 'other' {
  if (IMAGE_EXT.test(name)) return 'image';
  if (VIDEO_EXT.test(name)) return 'video';
  if (AUDIO_EXT.test(name)) return 'audio';
  return 'other';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' o';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
}

function getCsrfToken(): string {
  const el = document.getElementById('file-manager-root');
  return el?.dataset?.csrfToken ?? '';
}

const ICON_SIZE = 'size-10 shrink-0';

function ItemIcon({
  item,
  fileUrl,
  onPreviewClick,
}: {
  item: Item;
  fileUrl: string;
  onPreviewClick?: (item: Item) => void;
}) {
  const [thumbError, setThumbError] = useState(false);
  const mediaType = item.type === 'file' ? getMediaType(item.name) : null;
  const isPreviewable = item.type === 'file' && mediaType !== null && mediaType !== 'other';

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewable && onPreviewClick) {
      e.preventDefault();
      e.stopPropagation();
      onPreviewClick(item);
    }
  };

  const wrapper = (content: React.ReactNode) =>
    isPreviewable ? (
      <button
        type="button"
        onClick={handleClick}
        className={cn('flex shrink-0 items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-ring', ICON_SIZE)}
        aria-label={`Prévisualiser ${item.name}`}
      >
        {content}
      </button>
    ) : (
      <span className={cn('shrink-0', ICON_SIZE)}>{content}</span>
    );

  if (item.type === 'dir') {
    return wrapper(<Folder className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />);
  }
  if (mediaType === 'image' && !thumbError) {
    return wrapper(
      <img
        src={fileUrl}
        alt=""
        width={40}
        height={40}
        className={cn(ICON_SIZE, 'rounded object-cover border border-border')}
        onError={() => setThumbError(true)}
      />
    );
  }
  if (mediaType === 'video') {
    return wrapper(<Video className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />);
  }
  if (mediaType === 'audio') {
    return wrapper(<Music className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />);
  }
  return wrapper(<FileText className={cn(ICON_SIZE, 'text-muted-foreground')} aria-hidden />);
}

export function FileManager() {
  const [path, setPath] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<Item | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadXhrRef = useRef<XMLHttpRequest | null>(null);

  const fetchList = useCallback(async (currentPath: string) => {
    setLoading(true);
    setError(null);
    try {
      const q = currentPath ? `?path=${encodeURIComponent(currentPath)}` : '';
      const res = await fetch(`${API}/list${q}`);
      if (!res.ok) throw new Error('Erreur chargement');
      const data = await res.json();
      setItems(data.items || []);
      setPath(data.path ?? currentPath);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList(path);
  }, []);

  const openFolder = (item: Item) => {
    if (item.type === 'dir') {
      const newPath = path ? `${path}/${item.name}` : item.name;
      fetchList(newPath);
    }
  };

  const goUp = () => {
    if (!path) return;
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    fetchList(parts.join('/'));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setError(null);
    setUploadFileName(file.name);
    setUploadProgress(0);

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = crypto.randomUUID();

    const sendChunk = (chunkIndex: number): Promise<void> =>
      new Promise((resolve, reject) => {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const blob = file.slice(start, end);

        const formData = new FormData();
        formData.append('path', path);
        formData.append('name', file.name);
        formData.append('upload_id', uploadId);
        formData.append('chunk_index', String(chunkIndex));
        formData.append('total_chunks', String(totalChunks));
        formData.append('chunk', blob);
        formData.append('_token', getCsrfToken());

        const xhr = new XMLHttpRequest();
        uploadXhrRef.current = xhr;

        xhr.upload.addEventListener('progress', (ev) => {
          if (ev.lengthComputable && totalChunks > 0) {
            const chunkRatio = ev.loaded / ev.total;
            const pct = ((chunkIndex + chunkRatio) / totalChunks) * 100;
            setUploadProgress(Math.round(pct));
          }
        });

        xhr.addEventListener('load', () => {
          uploadXhrRef.current = null;
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
            return;
          }
          let msg = 'Erreur upload';
          try {
            const data = JSON.parse(xhr.responseText);
            if (data?.error) msg = data.error;
          } catch {
            if (xhr.responseText) msg = xhr.responseText.slice(0, 200);
          }
          reject(new Error(msg));
        });

        xhr.addEventListener('error', () => {
          uploadXhrRef.current = null;
          reject(new Error('Erreur réseau lors de l\'upload'));
        });

        xhr.addEventListener('abort', () => {
          uploadXhrRef.current = null;
          reject(new Error('Upload annulé'));
        });

        xhr.open('POST', `${API}/upload-chunk`);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(formData);
      });

    (async () => {
      try {
        for (let i = 0; i < totalChunks; i++) {
          await sendChunk(i);
        }
        setUploadProgress(null);
        setUploadFileName(null);
        fetchList(path);
      } catch (err) {
        setUploadProgress(null);
        setUploadFileName(null);
        setError(err instanceof Error ? err.message : 'Erreur upload');
      }
    })();
  };

  const createFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    setCreatingFolder(true);
    try {
      const res = await fetch(`${API}/mkdir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
        body: new URLSearchParams({ path, name, _token: getCsrfToken() }),
      });
      if (!res.ok) throw new Error('Erreur création dossier');
      setNewFolderName('');
      fetchList(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setCreatingFolder(false);
    }
  };

  const deleteItem = async (item: Item) => {
    if (!confirm(`Supprimer "${item.name}" ?`)) return;
    try {
      const res = await fetch(`${API}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
        body: new URLSearchParams({ path: item.path, _token: getCsrfToken() }),
      });
      if (!res.ok) throw new Error('Erreur suppression');
      fetchList(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const fileUrl = (item: Item) => `${FILE_URL}/${encodeURIComponent(item.path)}`;

  const previewMediaType = previewItem && previewItem.type === 'file' ? getMediaType(previewItem.name) : null;
  const previewUrl = previewItem ? fileUrl(previewItem) : '';

  return (
    <>
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent
          onClose={() => setPreviewItem(null)}
          className="flex max-h-[90dvh] flex-col p-0"
        >
          {previewItem && (
            <div className="flex flex-1 flex-col overflow-hidden p-4 pt-12">
              <p className="mb-2 truncate text-sm font-medium text-muted-foreground" title={previewItem.name}>
                {previewItem.name}
              </p>
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-md bg-muted/30">
                {previewMediaType === 'image' && (
                  <img
                    src={previewUrl}
                    alt={previewItem.name}
                    className="max-h-[75dvh] max-w-full object-contain"
                  />
                )}
                {previewMediaType === 'video' && (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-[75dvh] max-w-full"
                    preload="metadata"
                  />
                )}
                {previewMediaType === 'audio' && (
                  <div className="w-full max-w-md space-y-2 p-4">
                    <audio src={previewUrl} controls className="w-full" preload="metadata" />
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Médiathèque</CardTitle>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Nouveau dossier"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createFolder()}
            className="w-40"
          />
          <Button variant="outline" size="sm" onClick={createFolder} disabled={creatingFolder || !newFolderName.trim()}>
            Nouveau dossier
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadProgress != null}
          >
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={goUp} disabled={!path}>
            ↑ Dossier parent
          </Button>
          {path && <span className="truncate">/{path}</span>}
        </div>
        {error && (
          <p className="text-destructive text-sm mb-2">{error}</p>
        )}
        {uploadProgress != null && uploadFileName && (
          <div className="mb-3 rounded-md border bg-muted/50 p-2">
            <p className="text-muted-foreground text-xs mb-1 truncate" title={uploadFileName}>
              Upload : {uploadFileName}
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-muted-foreground text-xs mt-1">{uploadProgress} %</p>
          </div>
        )}
        {loading ? (
          <p className="text-muted-foreground text-sm">Chargement…</p>
        ) : (
          <ul className="border rounded-md divide-y">
            {items.length === 0 && !loading && (
              <li className="px-4 py-6 text-center text-muted-foreground text-sm">Dossier vide</li>
            )}
            {items.map((item) => (
              <li
                key={item.path}
                className={cn(
                  'flex items-center justify-between gap-2 px-4 py-2 hover:bg-muted/50',
                  item.type === 'dir' && 'cursor-pointer'
                )}
              >
                <div
                  className="flex-1 min-w-0 flex items-center gap-3"
                  onClick={() => openFolder(item)}
                  role={item.type === 'dir' ? 'button' : undefined}
                >
                  <ItemIcon item={item} fileUrl={fileUrl(item)} onPreviewClick={setPreviewItem} />
                  <span className={item.type === 'dir' ? 'font-medium' : ''}>
                    {item.name}
                  </span>
                  {item.type === 'file' && item.size != null && (
                    <span className="text-muted-foreground text-xs shrink-0">{formatSize(item.size)}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {item.type === 'file' && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={fileUrl(item)} target="_blank" rel="noopener noreferrer">
                        Ouvrir
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteItem(item)} className="text-destructive hover:text-destructive">
                    Supprimer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
    </>
  );
}
