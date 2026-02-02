import { type FC, useMemo, useState } from 'react';
import type { FileItem, FileFilters } from './types';
import FilePreview from './FilePreview';
import { Input } from "@editeur/components/ui/input";
import { Button } from "@editeur/components/ui/button";
import { Pencil, Check, X, FolderUp, Maximize2 } from 'lucide-react';
import { cn } from "@editeur/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@editeur/components/ui/dialog";
import { VisuallyHidden } from "@editeur/components/ui/visually-hidden";

const FILE_FILTER_OPTIONS: Array<{ value: FileFilters['type']; label: string }> = [
  { value: 'all', label: 'Tous' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Vidéos' },
  { value: 'audio', label: 'Audio' },
  { value: 'document', label: 'Documents' },
];

interface FileListProps {
  files: FileItem[];
  selectedFileId: string | null;
  onSelectFile: (file: FileItem) => void;
  onRenameFile: (fileId: string, newName: string) => Promise<void>;
  filters?: FileFilters;
  onFilterChange?: (filters: FileFilters) => void;
  currentPath?: string;
  onNavigateUp?: () => void;
  showFilters?: boolean;
}

const FileList: FC<FileListProps> = ({
  files,
  selectedFileId,
  onSelectFile,
  onRenameFile,
  filters,
  onFilterChange,
  currentPath,
  onNavigateUp,
  showFilters = true,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<FileItem | null>(null);

  const handleStartEdit = (file: FileItem) => {
    setEditingId(file.id);
    setEditingName(file.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async (fileId: string) => {
    if (!editingName.trim()) {
      return;
    }

    setIsRenaming(true);
    try {
      await onRenameFile(fileId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Erreur lors du renommage:', error);
    } finally {
      setIsRenaming(false);
    }
  };

  // Fonction pour détecter si c'est une image
  const isImage = (file: FileItem): boolean => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif'];
    return (
      file.mimeType?.startsWith('image/') ||
      file.type === 'image' ||
      imageExts.includes(ext || '')
    );
  };

  // Fonction pour détecter si c'est une vidéo
  const isVideo = (file: FileItem): boolean => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
    return (
      file.mimeType?.startsWith('video/') ||
      file.type === 'video' ||
      videoExts.includes(ext || '')
    );
  };

  // Fonction pour détecter si c'est un audio
  const isAudio = (file: FileItem): boolean => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'wma', 'opus'];
    return (
      file.mimeType?.startsWith('audio/') ||
      file.type === 'audio' ||
      audioExts.includes(ext || '')
    );
  };

  const isFolder = (file: FileItem): boolean =>
    Boolean(file.isFolder || file.type === 'directory' || file.type === 'folder' || file.mimeType === 'directory');

  const sortedFiles = useMemo(() => {
    const copy = [...files];
    copy.sort((a, b) => {
      const aIsFolder = isFolder(a);
      const bIsFolder = isFolder(b);

      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;

      return a.name.localeCompare(b.name, undefined, { sensitivity: 'accent', numeric: true });
    });
    return copy;
  }, [files]);

  const handlePreviewMedia = (file: FileItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (isImage(file) || isVideo(file) || isAudio(file)) {
      setPreviewMedia(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtres */}
      {showFilters && onFilterChange && (
        <div className="flex gap-2 flex-wrap">
          {FILE_FILTER_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={filters?.type === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange({ ...filters, type: option.value })}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}

      {/* Liste des fichiers */}
      {files.length === 0 && !currentPath ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Aucun fichier disponible</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4">
          {/* Élément ".." pour remonter d'un niveau */}
          {currentPath && onNavigateUp && (
            <div
              className={cn(
                'relative border rounded-lg overflow-hidden cursor-pointer transition-all group',
                'border-border hover:border-primary/50 hover:shadow-md bg-muted/50'
              )}
              onClick={onNavigateUp}
              title="Remonter d'un niveau"
            >
              <div className="flex items-center justify-center bg-primary/10 h-24 w-full">
                <div className="text-center p-2">
                  <FolderUp className="h-8 w-8 text-primary mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground font-medium">
                    ..
                  </div>
                </div>
              </div>
              <div className="p-2">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs truncate flex-1 font-medium" title="..">
                    ..
                  </p>
                </div>
              </div>
            </div>
          )}
          {sortedFiles.map((file) => (
            <div
              key={file.id}
              className={cn(
                'relative border rounded-lg overflow-hidden cursor-pointer transition-all group',
                selectedFileId === file.id
                  ? 'ring-2 ring-primary border-primary'
                  : 'border-border hover:border-primary/50 hover:shadow-md'
              )}
              onClick={() => onSelectFile(file)}
              onDoubleClick={() => handlePreviewMedia(file)}
            >
              <div className="relative">
                <FilePreview file={file} className="h-24 w-full" />
                {(isImage(file) || isVideo(file) || isAudio(file)) && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handlePreviewMedia(file, e)}
                    title="Afficher en grand"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="p-2">
                {editingId === file.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit(file.id);
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      className="h-6 text-xs"
                      autoFocus
                      disabled={isRenaming}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEdit(file.id);
                      }}
                      disabled={isRenaming}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelEdit();
                      }}
                      disabled={isRenaming}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs truncate flex-1" title={file.name}>
                      {file.name}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(file);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog de prévisualisation agrandie */}
      <Dialog open={!!previewMedia} onOpenChange={(open) => !open && setPreviewMedia(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <VisuallyHidden asChild>
            <DialogTitle>{previewMedia?.name || 'Prévisualisation'}</DialogTitle>
          </VisuallyHidden>
          {previewMedia && (
            <div className="relative w-full h-full flex items-center justify-center bg-muted p-4">
              {isImage(previewMedia) && (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.name}
                  className="max-w-full max-h-[85vh] object-contain"
                />
              )}
              {isVideo(previewMedia) && (
                <video
                  src={previewMedia.url}
                  controls
                  className="max-w-full max-h-[85vh]"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              )}
              {isAudio(previewMedia) && (
                <div className="w-full max-w-2xl flex flex-col items-center gap-4">
                  <audio
                    src={previewMedia.url}
                    controls
                    className="w-full"
                  >
                    Votre navigateur ne supporte pas la lecture audio.
                  </audio>
                  <p className="text-sm font-medium text-center">{previewMedia.name}</p>
                </div>
              )}
              {!isImage(previewMedia) && !isVideo(previewMedia) && !isAudio(previewMedia) && (
                <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-2 pointer-events-none">
                  <p className="text-sm font-medium text-center">{previewMedia.name}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileList;

