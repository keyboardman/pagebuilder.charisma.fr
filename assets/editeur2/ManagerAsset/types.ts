export type FileManagerType = 'base64' | 's3' | 'custom';

export interface FileItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  mimeType?: string;
  isFolder?: boolean;
  path?: string;
}

export interface FileFilters {
  type?: 'image' | 'video' | 'audio' | 'document' | 'all';
  mimeType?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedFileResponse {
  items: FileItem[];
  pagination: PaginationInfo;
}

export interface ChunkUploadConfig {
  initEndpoint: string;
  chunkEndpoint: string;
  completeEndpoint: string;
  abortEndpoint?: string;
  chunkSize?: number; // Taille souhaitée pour chaque chunk (bytes)
  threshold?: number; // Taille minimale du fichier pour activer le chunk (bytes)
  force?: boolean; // Force toujours le chunk upload
}

export interface FileManagerConfig {
  type: FileManagerType;
  defaultPrefix?: string; // Répertoire de départ par défaut (ex: "mon-repertoire")
  // Pour S3
  s3?: {
    endpoint?: string;
    region?: string;
    bucket: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
  // Pour custom
  custom?: {
    listEndpoint: string;
    uploadEndpoint: string;
    renameEndpoint: string;
    deleteEndpoint?: string;
    apiKey?: string; // Clé API pour l'authentification
    useXHR?: boolean; // Forcer l'utilisation de XMLHttpRequest pour les uploads
    chunkUpload?: ChunkUploadConfig;
  };
}

