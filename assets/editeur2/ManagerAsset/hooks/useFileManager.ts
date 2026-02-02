import { useMemo } from 'react';
import { useAppContext } from '../../services/providers/AppContext';
import { createFileService } from '../services';

export function useFileManager() {
  const { fileManagerConfig } = useAppContext();

  return useMemo(() => {
    if (!fileManagerConfig) {
      return null;
    }
    try {
      return createFileService(fileManagerConfig);
    } catch (error) {
      console.error('Erreur lors de la création du service de fichiers:', error);
      return null;
    }
  }, [fileManagerConfig]);
}

