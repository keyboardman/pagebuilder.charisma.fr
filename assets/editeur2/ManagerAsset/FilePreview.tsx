import { type FC } from 'react';
import type { FileItem } from './types';
import { Image, Video, FileText, Folder, Music } from 'lucide-react';

interface FilePreviewProps {
  file: FileItem;
  className?: string;
}

const FilePreview: FC<FilePreviewProps> = ({ file, className = '' }) => {
  // Si c'est un dossier, afficher l'icône de dossier
  // Vérifier isFolder, type === 'directory', type === 'folder', ou mimeType === 'directory'
  const isDirectory = file.isFolder || 
                      file.type === 'directory' || 
                      file.type === 'folder' ||
                      file.mimeType === 'directory';
  
  if (isDirectory) {
    return (
      <div className={`flex items-center justify-center bg-primary/10 ${className}`}>
        <div className="text-center p-2">
          <Folder className="h-8 w-8 text-primary mx-auto mb-1" />
          <div className="text-xs text-muted-foreground truncate max-w-[100px] font-medium">
            {file.name}
          </div>
        </div>
      </div>
    );
  }

  // Fonction pour détecter si c'est une image
  const isImage = (): boolean => {
    if (file.mimeType?.startsWith('image/')) return true;
    if (file.type === 'image') return true;
    
    // Détecter par extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif'];
    return imageExts.includes(ext || '');
  };

  // Fonction pour détecter si c'est une vidéo
  const isVideo = (): boolean => {
    if (file.mimeType?.startsWith('video/')) return true;
    if (file.type === 'video') return true;
    
    // Détecter par extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
    return videoExts.includes(ext || '');
  };

  // Fonction pour détecter si c'est un audio
  const isAudio = (): boolean => {
    if (file.mimeType?.startsWith('audio/')) return true;
    if (file.type === 'audio') return true;
    
    // Détecter par extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'wma', 'opus'];
    return audioExts.includes(ext || '');
  };

  if (isImage()) {
    return (
      <div className={`relative overflow-hidden bg-muted flex items-center justify-center ${className}`}>
        <img
          src={file.url}
          alt={file.name}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            // En cas d'erreur de chargement, afficher un placeholder
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const placeholder = target.parentElement?.querySelector('.image-placeholder');
            if (placeholder) {
              (placeholder as HTMLElement).style.display = 'flex';
            }
          }}
        />
        <div className="image-placeholder hidden absolute inset-0 items-center justify-center bg-muted">
          <Image className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isVideo()) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center p-2">
          <Video className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
          <div className="text-xs text-muted-foreground truncate max-w-[100px]">
            {file.name}
          </div>
        </div>
      </div>
    );
  }

  if (isAudio()) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="text-center p-2">
          <Music className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
          <div className="text-xs text-muted-foreground truncate max-w-[100px]">
            {file.name}
          </div>
        </div>
      </div>
    );
  }

  // Pour les autres types de fichiers, afficher une icône
  return (
    <div className={`flex items-center justify-center bg-muted ${className}`}>
      <div className="text-center p-2">
        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
        <div className="text-xs text-muted-foreground truncate max-w-[100px]">
          {file.name}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;

