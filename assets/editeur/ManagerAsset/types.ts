export type FileManagerType = 'iframe';

export interface FileItem {
  url: string;
}

export interface FileManagerConfig {
  type: FileManagerType;
  filemanagerUrl?: string;
}

