import { type FC, useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@editeur/components/ui/dialog";
import { Button } from "@editeur/components/ui/button";
import { Input } from "@editeur/components/ui/input";
import FileList from './FileList';
import FileUpload from './FileUpload';
import type { FileItem, FileFilters, PaginatedFileResponse, PaginationInfo } from './types';
import type { FileService } from './services/fileService';
import { FolderPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext, APP_MODE } from '../services/providers/AppContext';
import { VisuallyHidden } from "@editeur/components/ui/visually-hidden";

interface FileManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFile: (file: FileItem) => void;
  fileService: FileService;
  acceptedTypes?: string;
}

const FILTER_OPTIONS: Array<{ value: FileFilters['type']; label: string }> = [
  { value: 'all', label: 'Tous' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Vidéos' },
  { value: 'audio', label: 'Audio' },
  { value: 'document', label: 'Documents' },
];

const FileManager: FC<FileManagerProps> = ({
  open,
  onOpenChange,
  onSelectFile,
  fileService,
  acceptedTypes,
}) => {
  const { mode, fileManagerConfig } = useAppContext();
  
  // Empêcher l'ouverture du FileManager en mode view
  const isViewMode = mode === APP_MODE.VIEW;
  const effectiveOpen = open && !isViewMode;
  
  // Fermer automatiquement si on passe en mode view
  useEffect(() => {
    if (isViewMode && open) {
      onOpenChange(false);
    }
  }, [isViewMode, open, onOpenChange]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FileFilters>({ type: 'all' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Initialiser currentPath avec le defaultPrefix si défini
  const [currentPath, setCurrentPath] = useState<string | undefined>(fileManagerConfig?.defaultPrefix);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(25); // Limite par défaut

  const loadFiles = useCallback(async (path?: string, page: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fileService.listFiles(filters, path, page, pageLimit);
      
      // Vérifier si la réponse est paginée
      if (response && typeof response === 'object' && 'items' in response && 'pagination' in response) {
        const paginatedResponse = response as PaginatedFileResponse;
        setFiles(paginatedResponse.items);
        setPagination(paginatedResponse.pagination);
        // Synchroniser currentPage avec la page retournée par le serveur
        setCurrentPage((prevPage) => {
          if (paginatedResponse.pagination.page !== prevPage) {
            return paginatedResponse.pagination.page;
          }
          return prevPage;
        });
      } else {
        // Réponse non paginée (rétrocompatibilité)
        setFiles(response as FileItem[]);
        setPagination(null);
        setCurrentPage((prevPage) => {
          if (prevPage !== 1) {
            return 1;
          }
          return prevPage;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des fichiers');
    } finally {
      setIsLoading(false);
    }
  }, [fileService, filters, pageLimit]);

  useEffect(() => {
    if (effectiveOpen) {
      // Réinitialiser avec le defaultPrefix si défini
      const initialPath = fileManagerConfig?.defaultPrefix;
      setCurrentPath(initialPath);
      setSelectedFileId(null);
      setCurrentPage(1);
      loadFiles(initialPath, 1);
    }
  }, [effectiveOpen, loadFiles, fileManagerConfig?.defaultPrefix]);

  useEffect(() => {
    if (effectiveOpen) {
      setCurrentPage(1);
      loadFiles(currentPath, 1);
    }
  }, [effectiveOpen, filters, currentPath, loadFiles]);

  useEffect(() => {
    if (effectiveOpen && currentPage !== 1) {
      loadFiles(currentPath, currentPage);
    }
  }, [currentPage, effectiveOpen, currentPath, loadFiles]);

  const handleUpload = async (
    file: File,
    onProgress?: (progress: number) => void,
    onStatus?: (message: string) => void
  ) => {
    const uploadedFile = await fileService.uploadFile(file, onProgress, currentPath, onStatus);
    setFiles((prev) => [uploadedFile, ...prev]);
    setSelectedFileId(uploadedFile.id);
  };

  const handleRename = async (fileId: string, newName: string) => {
    const renamedFile = await fileService.renameFile(fileId, newName);
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? renamedFile : f))
    );
  };

  const handleSelectFile = (file: FileItem) => {
    // Détecter si c'est un dossier : isFolder, type === 'directory', type === 'folder', ou mimeType === 'directory'
    const isDirectory = file.isFolder || 
                       file.type === 'directory' || 
                       file.type === 'folder' ||
                       file.mimeType === 'directory';
    
    if (isDirectory) {
      // Naviguer dans le dossier
      // Le path du dossier contient déjà le chemin complet (ex: "uploads/folder1/")
      setCurrentPath(file.path || file.id);
      setSelectedFileId(null);
    } else {
      setSelectedFileId(file.id);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !fileService.createFolder) return;

    try {
      const folder = await fileService.createFolder(newFolderName.trim(), currentPath);
      setFiles((prev) => [folder, ...prev]);
      setNewFolderName('');
      setShowCreateFolder(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du dossier');
    }
  };

  const handleNavigateUp = () => {
    if (!currentPath) return;
    
    const defaultPrefix = fileManagerConfig?.defaultPrefix;
    
    // Remonter d'un niveau
    const pathParts = currentPath.split('/').filter(p => p);
    pathParts.pop();
    
    // Si un defaultPrefix est défini, ne pas remonter en dessous
    if (defaultPrefix) {
      const prefixParts = defaultPrefix.split('/').filter(p => p);
      // Si on est déjà au niveau du préfixe ou en dessous, ne pas remonter
      // Mais on peut remonter jusqu'au préfixe exact
      if (pathParts.length < prefixParts.length) {
        return;
      }
    }
    
    // Construire le nouveau path
    let newPath: string | undefined;
    if (pathParts.length > 0) {
      newPath = pathParts.join('/');
      // Ajouter un slash à la fin si ce n'est pas déjà le cas
      if (!newPath.endsWith('/')) {
        newPath += '/';
      }
    } else {
      // Si on est à la racine, utiliser le defaultPrefix si défini, sinon undefined
      newPath = defaultPrefix || undefined;
    }
    
    setCurrentPath(newPath);
    setSelectedFileId(null);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleConfirmSelection = () => {
    const selectedFile = files.find((f) => f.id === selectedFileId);
    if (selectedFile) {
      onSelectFile(selectedFile);
      onOpenChange(false);
    }
  };

  // Ne pas rendre le FileManager en mode view
  if (isViewMode) {
    return null;
  }

  return (
    <Dialog open={effectiveOpen} onOpenChange={onOpenChange}>
      <DialogContent className="file-manager-ui p-0 flex flex-col w-[calc(100vw-40px)] h-[calc(100vh-40px)] max-w-[calc(100vw-40px)] max-h-[calc(100vh-40px)] left-[20px] top-[20px] translate-x-0 translate-y-0">
        <VisuallyHidden asChild>
          <DialogTitle>Gestionnaire de fichiers</DialogTitle>
        </VisuallyHidden>
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle>Gestionnaire de fichiers</DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier ou uploadez-en un nouveau
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-4 shrink-0 border-b space-y-4">
          <FileUpload
            onUpload={handleUpload}
            acceptedTypes={acceptedTypes}
          />

          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={filters?.type === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters({ ...filters, type: option.value })}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 text-sm text-muted-foreground truncate">
              {currentPath ? `📁 ${currentPath}` : '📁 Racine'}
            </div>
            {fileService.createFolder && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateFolder(!showCreateFolder)}
                className="flex items-center gap-1"
              >
                <FolderPlus className="h-4 w-4" />
                Nouveau dossier
              </Button>
            )}
          </div>

          {showCreateFolder && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Input
                placeholder="Nom du dossier"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateFolder();
                  } else if (e.key === 'Escape') {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }
                }}
                autoFocus
              />
              <Button size="sm" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                Créer
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName('');
                }}
              >
                Annuler
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 px-6 pb-4 flex flex-col overflow-hidden">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded mb-4 shrink-0">
              {error}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Chargement des fichiers...</p>
              </div>
            ) : (
              <FileList
                files={files}
                selectedFileId={selectedFileId}
                onSelectFile={handleSelectFile}
                onRenameFile={handleRename}
                filters={filters}
                onFilterChange={setFilters}
                currentPath={currentPath}
                onNavigateUp={handleNavigateUp}
                showFilters={false}
              />
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} sur {pagination.totalPages} ({pagination.total} fichiers)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="min-w-[2.5rem]"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-background shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirmSelection}
            disabled={!selectedFileId}
          >
            Sélectionner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileManager;

