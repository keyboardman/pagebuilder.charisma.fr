import type { FileItem, FileFilters, PaginatedFileResponse } from '../types';

export interface FileService {
  listFiles(filters?: FileFilters, path?: string, page?: number, limit?: number): Promise<FileItem[] | PaginatedFileResponse>;
  uploadFile(
    file: File,
    onProgress?: (progress: number) => void,
    path?: string,
    onStatus?: (message: string) => void
  ): Promise<FileItem>;
  renameFile(fileId: string, newName: string): Promise<FileItem>;
  deleteFile?(fileId: string): Promise<void>;
  createFolder?(folderName: string, path?: string): Promise<FileItem>;
}

