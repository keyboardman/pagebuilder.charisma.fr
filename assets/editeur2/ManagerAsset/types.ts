export type FileManagerType = 'iframe';

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

export interface FileManagerConfig {
  type: FileManagerType;
  filemanagerUrl?: string;
  resolveUrl?: string;
}

