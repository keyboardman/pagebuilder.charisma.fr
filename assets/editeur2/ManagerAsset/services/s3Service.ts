import { S3Client, PutObjectCommand, ListObjectsV2Command, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import type { FileItem, FileFilters, FileManagerConfig } from '../types';
import type { FileService } from './fileService';

export class S3Service implements FileService {
  private config: Required<Pick<FileManagerConfig, 's3'>>['s3'];
  private s3Client: S3Client;
  private defaultPrefix?: string;

  constructor(config: Required<Pick<FileManagerConfig, 's3'>>['s3'], defaultPrefix?: string) {
    this.config = config;
    this.defaultPrefix = defaultPrefix;
    
    // Initialiser le client S3
    const clientConfig: {
      region: string;
      credentials?: { accessKeyId: string; secretAccessKey: string };
      endpoint?: string;
      forcePathStyle?: boolean;
    } = {
      region: config.region || 'us-east-1',
    };

    // Ajouter les credentials si fournis
    if (config.accessKeyId && config.secretAccessKey) {
      clientConfig.credentials = {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      };
    }

    // Ajouter l'endpoint personnalisé si fourni (pour S3-compatible)
    if (config.endpoint) {
      clientConfig.endpoint = config.endpoint;
      clientConfig.forcePathStyle = true; // Nécessaire pour certains services S3-compatibles
    }

    this.s3Client = new S3Client(clientConfig);
  }

  private getFileType(mimeType?: string, fileName?: string): string {
    if (!mimeType && !fileName) return 'all';
    
    const type = mimeType?.split('/')[0] || '';
    if (type === 'image' || type === 'video' || type === 'audio') return type;
    
    // Détecter le type depuis l'extension si pas de mimeType
    if (fileName) {
      const ext = fileName.split('.').pop()?.toLowerCase();
      const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
      const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
      const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'wma', 'opus'];
      
      if (imageExts.includes(ext || '')) return 'image';
      if (videoExts.includes(ext || '')) return 'video';
      if (audioExts.includes(ext || '')) return 'audio';
    }
    
    return 'document';
  }

  private matchesFilter(file: FileItem, filters?: FileFilters): boolean {
    if (!filters || !filters.type || filters.type === 'all') return true;
    
    const fileType = this.getFileType(file.mimeType, file.name);
    return fileType === filters.type;
  }

  private normalizePath(path?: string): string {
    // Si un defaultPrefix est défini, l'utiliser comme base
    let basePath = this.defaultPrefix ? `${this.defaultPrefix}/` : 'uploads/';
    
    if (!path || path === '/') {
      return basePath;
    }
    
    // Si le path commence déjà par le basePath, on le garde tel quel
    if (path.startsWith(basePath)) {
      return path.endsWith('/') ? path : `${path}/`;
    }
    
    // Si le path ne commence pas par basePath, on l'ajoute
    const normalized = path.endsWith('/') ? path : `${path}/`;
    return normalized.startsWith(basePath) ? normalized : `${basePath}${normalized}`;
  }

  async listFiles(filters?: FileFilters, path?: string, _page?: number, _limit?: number): Promise<FileItem[]> {
    try {
      const prefix = this.normalizePath(path);
      
      const command = new ListObjectsV2Command({
        Bucket: this.config.bucket,
        Prefix: prefix,
        Delimiter: '/', // Utiliser le délimiteur pour séparer les dossiers
      });

      const response = await this.s3Client.send(command);
      
      const items: FileItem[] = [];

      // Ajouter les dossiers (CommonPrefixes)
      if (response.CommonPrefixes) {
        for (const prefixItem of response.CommonPrefixes) {
          if (prefixItem.Prefix) {
            const folderName = prefixItem.Prefix.replace(prefix, '').replace('/', '');
            items.push({
              id: prefixItem.Prefix,
              name: folderName,
              url: '',
              type: 'folder',
              isFolder: true,
              path: prefixItem.Prefix,
            });
          }
        }
      }

      // Ajouter les fichiers
      if (response.Contents) {
        for (const item of response.Contents) {
          // Ignorer les "fichiers" qui sont en fait des dossiers (se terminent par /)
          if (item.Key && !item.Key.endsWith('/')) {
            const fileName = item.Key.split('/').pop() || item.Key;
            const fileUrl = this.config.endpoint
              ? `${this.config.endpoint}/${this.config.bucket}/${item.Key}`
              : `https://${this.config.bucket}.s3.${this.config.region || 'us-east-1'}.amazonaws.com/${item.Key}`;

            items.push({
              id: item.Key,
              name: fileName,
              url: fileUrl,
              type: this.getFileType(undefined, fileName),
              size: item.Size,
              mimeType: undefined,
              path: item.Key,
            });
          }
        }
      }

      // Filtrer selon les filtres fournis (sauf pour les dossiers)
      return items.filter((item) => {
        if (item.isFolder) return true; // Toujours afficher les dossiers
        return this.matchesFilter(item, filters);
      });
    } catch (error: unknown) {
      console.error('Erreur lors de la liste des fichiers S3:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la liste des fichiers: ${errorMessage}`);
    }
  }

  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void,
    path?: string,
    _onStatus?: (message: string) => void
  ): Promise<FileItem> {
    try {
      // Générer une clé unique pour le fichier
      const prefix = this.normalizePath(path);
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const key = `${prefix}${timestamp}-${sanitizedName}`;

      // Convertir le File en ArrayBuffer pour éviter les problèmes de streaming
      // Le SDK AWS v3 a des problèmes avec l'objet File directement dans le navigateur
      if (onProgress) {
        onProgress(10);
      }

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      if (onProgress) {
        onProgress(50);
      }

      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: uint8Array,
        ContentType: file.type,
        ACL: 'public-read', // Rendre le fichier public (peut être configuré)
      });

      await this.s3Client.send(command);

      if (onProgress) {
        onProgress(100);
      }

      const fileUrl = this.config.endpoint
        ? `${this.config.endpoint}/${this.config.bucket}/${key}`
        : `https://${this.config.bucket}.s3.${this.config.region || 'us-east-1'}.amazonaws.com/${key}`;

      return {
        id: key,
        name: file.name,
        url: fileUrl,
        type: this.getFileType(file.type, file.name),
        size: file.size,
        mimeType: file.type,
      };
    } catch (error: unknown) {
      console.error('Erreur lors de l\'upload S3:', error);
      
      // Messages d'erreur plus explicites
      if (error instanceof Error) {
        if (error.name === 'CredentialsProviderError' || error.message.includes('credentials')) {
          throw new Error('Erreur d\'authentification AWS. Vérifiez vos credentials (accessKeyId, secretAccessKey).');
        }
        
        if (error.name === 'NoSuchBucket' || error.message.includes('bucket')) {
          throw new Error(`Le bucket "${this.config.bucket}" n'existe pas ou n'est pas accessible.`);
        }

        throw new Error(`Erreur lors de l'upload: ${error.message}`);
      }

      throw new Error('Erreur lors de l\'upload: Erreur inconnue');
    }
  }

  async renameFile(fileId: string, newName: string): Promise<FileItem> {
    try {
      // Construire la nouvelle clé en gardant le même préfixe
      const pathParts = fileId.split('/');
      pathParts.pop(); // Enlever l'ancien nom
      const sanitizedName = newName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const newKey = [...pathParts, sanitizedName].join('/');

      // Copier l'objet vers la nouvelle clé
      const copyCommand = new CopyObjectCommand({
        Bucket: this.config.bucket,
        CopySource: `${this.config.bucket}/${fileId}`,
        Key: newKey,
        ACL: 'public-read',
      });

      await this.s3Client.send(copyCommand);

      // Supprimer l'ancien objet
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: fileId,
      });

      await this.s3Client.send(deleteCommand);

      const fileUrl = this.config.endpoint
        ? `${this.config.endpoint}/${this.config.bucket}/${newKey}`
        : `https://${this.config.bucket}.s3.${this.config.region || 'us-east-1'}.amazonaws.com/${newKey}`;

      return {
        id: newKey,
        name: sanitizedName,
        url: fileUrl,
        type: this.getFileType(undefined, newName),
        mimeType: undefined,
      };
    } catch (error: unknown) {
      console.error('Erreur lors du renommage S3:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors du renommage: ${errorMessage}`);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: fileId,
      });

      await this.s3Client.send(command);
    } catch (error: unknown) {
      console.error('Erreur lors de la suppression S3:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la suppression: ${errorMessage}`);
    }
  }

  async createFolder(folderName: string, path?: string): Promise<FileItem> {
    try {
      const prefix = this.normalizePath(path);
      const sanitizedName = folderName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const folderKey = `${prefix}${sanitizedName}/`;

      // Créer un "fichier" vide pour représenter le dossier dans S3
      // S3 n'a pas de vrais dossiers, on crée un objet avec une clé se terminant par /
      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: folderKey,
        Body: '',
      });

      await this.s3Client.send(command);

      return {
        id: folderKey,
        name: sanitizedName,
        url: '',
        type: 'folder',
        isFolder: true,
        path: folderKey,
      };
    } catch (error: unknown) {
      console.error('Erreur lors de la création du dossier S3:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création du dossier: ${errorMessage}`);
    }
  }
}

