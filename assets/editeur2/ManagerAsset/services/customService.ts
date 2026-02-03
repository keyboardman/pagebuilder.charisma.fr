import type {
  FileItem,
  FileFilters,
  FileManagerConfig,
  PaginatedFileResponse,
  ChunkUploadConfig,
} from '../types';
import { MEDIA_PUBLIC_PATH } from '../types';
import type { FileService } from './fileService';

/** Normalise l’URL d’un fichier : /media/file/… → /media/… (accès direct public). */
function normalizeFileUrl(url: string | undefined): string {
  if (!url) return '';
  return url.replace(/\/media\/file\//, `${MEDIA_PUBLIC_PATH}/`);
}

export class CustomService implements FileService {
  private config: Required<Pick<FileManagerConfig, 'custom'>>['custom'];
  private defaultPrefix?: string;

  constructor(config: Required<Pick<FileManagerConfig, 'custom'>>['custom'], defaultPrefix?: string) {
    this.config = config;
    this.defaultPrefix = defaultPrefix;
  }

  private getHeaders(contentType: string = 'application/json'): HeadersInit {
    const headers: HeadersInit = {};
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    // Ajouter l'API_KEY si configurée
    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
      // Alternative: utiliser Authorization header si préféré
      // headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }
    
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = this.getHeaders();

    let response: Response;
    try {
      response = await fetch(endpoint, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Erreur réseau: ${msg}`);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      const detail = body ? ` - ${body.slice(0, 200)}` : '';
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}${detail}`);
    }

    const text = await response.text().catch(() => '');
    if (text === '') {
      return {} as T;
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error(`Réponse invalide (JSON attendu): ${text.slice(0, 200)}`);
    }
  }

  private uploadWithXHR(
    file: File,
    endpoint: string,
    onProgress?: (progress: number) => void,
    path?: string
  ): Promise<FileItem> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      if (path !== undefined && path !== '') {
        formData.append('path', path);
      }
      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response?.url) response.url = normalizeFileUrl(response.url);
            resolve(response);
          } catch (parseError) {
            console.error('Réponse invalide du serveur', parseError);
            reject(new Error('Réponse invalide du serveur'));
          }
        } else {
          reject(new Error(`Erreur HTTP: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Erreur réseau lors de l\'upload'));
      };

      xhr.open('POST', endpoint);
      
      // Ajouter l'API_KEY dans les headers XHR
      if (this.config.apiKey) {
        xhr.setRequestHeader('X-API-Key', this.config.apiKey);
        // Alternative: utiliser Authorization header si préféré
        // xhr.setRequestHeader('Authorization', `Bearer ${this.config.apiKey}`);
      }
      
      xhr.send(formData);
    });
  }

  private async uploadWithFetch(
    file: File,
    endpoint: string,
    path?: string
  ): Promise<FileItem> {
    const formData = new FormData();
    formData.append('file', file);
    if (path !== undefined && path !== '') {
      formData.append('path', path);
    }

    // Pour FormData, on ne définit pas Content-Type (le navigateur le fait automatiquement)
    // Mais on inclut quand même l'API_KEY si configurée
    const headers: HeadersInit = {};
    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data?.url) data.url = normalizeFileUrl(data.url);
    return data;
  }

  async listFiles(
    filters?: FileFilters,
    path?: string,
    page?: number,
    limit?: number
  ): Promise<FileItem[] | PaginatedFileResponse> {
    const params = new URLSearchParams();
    
    // Paramètres de pagination
    if (page !== undefined) {
      params.append('page', page.toString());
    }
    if (limit !== undefined) {
      params.append('limit', limit.toString());
    }
    
    // Filtres
    if (filters?.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }
    if (filters?.mimeType) {
      params.append('mimeType', filters.mimeType);
    }
    
    // Chemin : si path est fourni, l'utiliser tel quel (il contient déjà le defaultPrefix si nécessaire)
    // Sinon, utiliser defaultPrefix comme base si défini
    const effectivePath = path !== undefined ? path : (this.defaultPrefix ? this.defaultPrefix : '/');
    params.append('path', effectivePath);

    const url = `${this.config.listEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.request<PaginatedFileResponse | FileItem[]>(url);
    
    const mapItems = (items: FileItem[]) =>
      items.map((item) => {
        const normalized = { ...item };
        if ((item.type === 'directory' || item.type === 'folder' || item.mimeType === 'directory') && !item.isFolder) {
          normalized.isFolder = true;
          normalized.type = item.type || 'folder';
        }
        if (!normalized.isFolder && normalized.url) {
          normalized.url = normalizeFileUrl(normalized.url);
        }
        return normalized;
      });

    // Réponse paginée : items + pagination
    if (response && typeof response === 'object' && 'items' in response && 'pagination' in response) {
      const paginatedResponse = response as PaginatedFileResponse;
      paginatedResponse.items = mapItems(Array.isArray(paginatedResponse.items) ? paginatedResponse.items : []);
      return paginatedResponse;
    }

    // Réponse avec items sans pagination (ex: MediaController { items, path })
    if (response && typeof response === 'object' && 'items' in response) {
      const data = response as { items?: unknown };
      const items = Array.isArray(data.items) ? data.items : [];
      return mapItems(items as FileItem[]);
    }

    // Tableau simple (rétrocompatibilité)
    const fileList = Array.isArray(response) ? response : [];
    return mapItems(fileList as FileItem[]);
  }

  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void,
    path?: string,
    onStatus?: (message: string) => void
  ): Promise<FileItem> {
    // Utiliser defaultPrefix comme base si défini
    const effectivePath = path || (this.defaultPrefix ? this.defaultPrefix : undefined);
    
    // Ajouter le path dans l'endpoint si fourni
    let uploadEndpoint = this.config.uploadEndpoint;
    if (effectivePath) {
      const separator = uploadEndpoint.includes('?') ? '&' : '?';
      uploadEndpoint = `${uploadEndpoint}${separator}path=${encodeURIComponent(effectivePath)}`;
    }

    const chunkConfig = this.config.chunkUpload;
    if (this.shouldUseChunkUpload(file, chunkConfig)) {
      return this.uploadFileChunked(file, {
        chunkConfig: chunkConfig as ChunkUploadConfig,
        path,
        onProgress,
        onStatus,
      });
    }

    const xhrAvailable = typeof XMLHttpRequest !== 'undefined';
    const forceXHR = this.config.useXHR === true;

    if (forceXHR && !xhrAvailable) {
      throw new Error(
        'XMLHttpRequest n’est pas disponible dans cet environnement. Désactivez l’option "useXHR" pour revenir au mode fetch.'
      );
    }

    // Utiliser XHR si disponible (forcé ou lorsque la progression est demandée)
    if ((forceXHR || !!onProgress) && xhrAvailable) {
      return this.uploadWithXHR(file, uploadEndpoint, onProgress, effectivePath);
    }

    // Fallback sur fetch
    return this.uploadWithFetch(file, uploadEndpoint, effectivePath);
  }

  private shouldUseChunkUpload(file: File, chunkConfig?: ChunkUploadConfig): chunkConfig is ChunkUploadConfig {
    if (!chunkConfig) {
      return false;
    }

    if (chunkConfig.force) {
      return true;
    }

    const threshold = chunkConfig.threshold ?? 8 * 1024 * 1024; // 8 MB par défaut
    return file.size >= threshold;
  }

  private async uploadFileChunked(
    file: File,
    {
      chunkConfig,
      path,
      onProgress,
      onStatus,
    }: {
      chunkConfig: ChunkUploadConfig;
      path?: string;
      onProgress?: (progress: number) => void;
      onStatus?: (message: string) => void;
    }
  ): Promise<FileItem> {
    if (!chunkConfig.initEndpoint || !chunkConfig.chunkEndpoint || !chunkConfig.completeEndpoint) {
      throw new Error('Configuration chunkUpload invalide : initEndpoint, chunkEndpoint et completeEndpoint sont requis');
    }

    // Utiliser defaultPrefix comme base si défini
    const effectivePath = path || (this.defaultPrefix ? this.defaultPrefix : undefined);

    const defaultChunkSize = chunkConfig.chunkSize ?? 2 * 1024 * 1024; // 2 MB
    const estimatedChunks = Math.ceil(file.size / defaultChunkSize);

    onStatus?.('Initialisation de l\'upload...');

    const initResponse = await this.request<{
      uploadId: string;
      chunkSize?: number;
      expiresAt?: string;
    }>(chunkConfig.initEndpoint, {
      method: 'POST',
      body: JSON.stringify({
        fileName: file.name,
        totalSize: file.size,
        mimeType: file.type,
        totalChunks: estimatedChunks,
        chunkSize: defaultChunkSize,
        path: effectivePath,
      }),
    });

    const uploadId = initResponse.uploadId;
    if (!uploadId) {
      throw new Error('Réponse d’initialisation chunk invalide (uploadId manquant)');
    }

    const effectiveChunkSize = initResponse.chunkSize ?? defaultChunkSize;
    const totalChunks = Math.ceil(file.size / effectiveChunkSize);

    let uploadedBytes = 0;

    try {
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
        const start = chunkIndex * effectiveChunkSize;
        const end = Math.min(start + effectiveChunkSize, file.size);
        const chunk = file.slice(start, end);

        onStatus?.(`Envoi du chunk ${chunkIndex + 1}/${totalChunks}`);

        await this.sendChunk(
          chunkConfig.chunkEndpoint,
          uploadId,
          chunkIndex,
          chunk,
          file.name
        );

        uploadedBytes += chunk.size;
        if (onProgress) {
          const percent = Math.min(100, Math.round((uploadedBytes / file.size) * 100));
          onProgress(percent);
        }
      }

      onStatus?.('Finalisation de l’upload...');
      const result = await this.postFormAndParse<FileItem>(chunkConfig.completeEndpoint, {
        uploadId,
      });
      onProgress?.(100);
      onStatus?.('Upload terminé');
      return result;
    } catch (error) {
      onStatus?.('Erreur lors de l’upload, annulation...');
      if (chunkConfig.abortEndpoint) {
        try {
          await this.postFormAndParse(chunkConfig.abortEndpoint, {
            uploadId,
          });
        } catch (abortError) {
          console.error('Erreur lors de l’annulation du chunk upload:', abortError);
        }
      }
      throw error;
    }
  }

  private async sendChunk(
    endpoint: string,
    uploadId: string,
    chunkIndex: number,
    chunk: Blob,
    originalFileName: string
  ): Promise<void> {
    const formData = new FormData();
    formData.append('uploadId', uploadId);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('chunk', chunk, `${originalFileName}.part${chunkIndex}`);

    const headers: HeadersInit = {};
    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l’envoi du chunk ${chunkIndex}: ${response.status} ${response.statusText}`);
    }
  }

  private async postFormAndParse<T = unknown>(
    endpoint: string,
    data: Record<string, string>
  ): Promise<T> {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const headers: HeadersInit = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('Réponse invalide lors de la requête formulaire:', text, error);
      throw new Error('Réponse invalide du serveur (format JSON attendu)');
    }
  }

  async renameFile(fileId: string, newName: string): Promise<FileItem> {
    const item = await this.request<FileItem>(this.config.renameEndpoint, {
      method: 'POST',
      body: JSON.stringify({ id: fileId, name: newName }),
    });
    if (item?.url) item.url = normalizeFileUrl(item.url);
    return item;
  }

  async deleteFile(fileId: string): Promise<void> {
    if (this.config.deleteEndpoint) {
      await this.request(this.config.deleteEndpoint, {
        method: 'POST',
        body: JSON.stringify({ id: fileId }),
      });
    } else {
      throw new Error('Delete endpoint non configuré');
    }
  }

  async createFolder(folderName: string, path?: string): Promise<FileItem> {
    // Si path est fourni, l'utiliser tel quel (il contient déjà le defaultPrefix si nécessaire)
    // Sinon, utiliser defaultPrefix comme base si défini
    const effectivePath = path !== undefined ? path : (this.defaultPrefix ? this.defaultPrefix : '/');
    
    // Construire l'endpoint de création de dossier
    // Par défaut, utiliser un endpoint basé sur uploadEndpoint (remplacer /upload par /folder)
    // Sinon, utiliser un endpoint dédié si configuré
    let createFolderEndpoint = this.config.uploadEndpoint.replace(/\/upload$/, '/folder');
    
    // Si l'endpoint n'a pas été modifié (pas de /upload trouvé), essayer avec listEndpoint
    if (createFolderEndpoint === this.config.uploadEndpoint) {
      createFolderEndpoint = this.config.listEndpoint.replace(/\/list$/, '/folder');
    }

    // Ajouter le path comme paramètre de requête (comme pour listFiles et uploadFile)
    const params = new URLSearchParams();
    params.append('name', folderName);
    if (effectivePath && effectivePath !== '/') {
      params.append('path', effectivePath);
    }

    const url = `${createFolderEndpoint}${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await this.request<FileItem>(url, {
      method: 'POST',
      // Envoyer aussi dans le body pour compatibilité avec certains backends
      body: JSON.stringify({
        name: folderName,
        path: effectivePath,
      }),
    });

    // S'assurer que le FileItem retourné a les bonnes propriétés pour un dossier
    return {
      ...response,
      isFolder: true,
      type: response.type || 'folder',
      path: response.path || `${effectivePath}${effectivePath.endsWith('/') ? '' : '/'}${folderName}/`,
    };
  }
}

