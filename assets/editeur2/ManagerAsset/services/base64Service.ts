import type { FileItem, FileFilters } from '../types';
import type { FileService } from './fileService';

export class Base64Service implements FileService {
  private files: Map<string, FileItem> = new Map();

  async listFiles(filters?: FileFilters, _path?: string, _page?: number, _limit?: number): Promise<FileItem[]> {
    // En mode base64, on ne peut pas lister les fichiers persistants
    // On retourne seulement les fichiers uploadés dans cette session
    const files = Array.from(this.files.values());
    
    if (filters?.type && filters.type !== 'all') {
      return files.filter(file => {
        if (filters.type === 'image') {
          return file.mimeType?.startsWith('image/');
        }
        if (filters.type === 'video') {
          return file.mimeType?.startsWith('video/');
        }
        if (filters.type === 'audio') {
          return file.mimeType?.startsWith('audio/');
        }
        if (filters.type === 'document') {
          return file.mimeType && !file.mimeType.startsWith('image/') && !file.mimeType.startsWith('video/') && !file.mimeType.startsWith('audio/');
        }
        return true;
      });
    }
    
    return files;
  }

  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void,
    _path?: string,
    _onStatus?: (message: string) => void
  ): Promise<FileItem> {
    // Simuler la progression pour base64
    if (onProgress) {
      onProgress(0);
      setTimeout(() => onProgress(50), 100);
      setTimeout(() => onProgress(100), 200);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result as string;
        const fileItem: FileItem = {
          id: `base64_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: base64,
          type: file.type,
          size: file.size,
          mimeType: file.type,
        };
        
        this.files.set(fileItem.id, fileItem);
        resolve(fileItem);
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      
      // Seulement pour les images en base64
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reject(new Error('Le mode base64 ne supporte que les images'));
      }
    });
  }

  async renameFile(fileId: string, newName: string): Promise<FileItem> {
    const file = this.files.get(fileId);
    if (!file) {
      throw new Error('Fichier non trouvé');
    }
    
    const updatedFile: FileItem = {
      ...file,
      name: newName,
    };
    
    this.files.set(fileId, updatedFile);
    return updatedFile;
  }
}

