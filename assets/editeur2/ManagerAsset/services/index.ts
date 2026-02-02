import type { FileManagerConfig } from '../types';
import type { FileService } from './fileService';
import { Base64Service } from './base64Service';
import { S3Service } from './s3Service';
import { CustomService } from './customService';

export function createFileService(config: FileManagerConfig): FileService {
  const defaultPrefix = config.defaultPrefix;
  
  switch (config.type) {
    case 'base64':
      return new Base64Service();
    case 's3':
      if (!config.s3) {
        throw new Error('Configuration S3 manquante');
      }
      return new S3Service(config.s3, defaultPrefix);
    case 'custom':
      if (!config.custom) {
        throw new Error('Configuration custom manquante');
      }
      return new CustomService(config.custom, defaultPrefix);
    default:
      throw new Error(`Type de filemanager non supporté: ${config.type}`);
  }
}

export { Base64Service, S3Service, CustomService };

