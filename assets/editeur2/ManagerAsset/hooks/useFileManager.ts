import { useMemo, useEffect, useRef } from 'react';
import { useAppContext } from '../../services/providers/AppContext';
import { createFileService } from '../services';
import type { FileService } from '../services/fileService';

const STANDARD_FOLDERS = ['images', 'videos', 'audios', 'fonts'];

async function initializeStandardFolders(
  fileService: FileService,
  defaultPrefix?: string
): Promise<void> {
  // Seulement pour les services qui supportent createFolder (S3 et custom si implémenté)
  if (!fileService.createFolder) {
    console.warn('Le service de fichiers ne supporte pas la création de dossiers');
    return;
  }

  // Créer les dossiers standards dans le préfixe (ou à la racine si pas de préfixe)
  const basePath = defaultPrefix || undefined;
  console.log(`Initialisation des dossiers standards dans: ${basePath || 'racine'}`);

  for (const folderName of STANDARD_FOLDERS) {
    try {
      console.log(`Création du dossier "${folderName}" dans "${basePath || '/'}"...`);
      await fileService.createFolder(folderName, basePath);
      console.log(`✓ Dossier "${folderName}" créé avec succès`);
    } catch (error) {
      // Ignorer silencieusement les erreurs de dossier déjà existant
      // Les autres erreurs sont loggées mais n'empêchent pas l'initialisation
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('existe') || errorMessage.includes('already exists') || errorMessage.includes('409')) {
        console.log(`ℹ Dossier "${folderName}" existe déjà`);
      } else {
        console.warn(`✗ Impossible de créer le dossier "${folderName}":`, errorMessage);
      }
    }
  }
}

export function useFileManager(): FileService | null {
  const { fileManagerConfig } = useAppContext();
  const initializedRef = useRef(false);

  const fileService = useMemo(() => {
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

  // Initialiser les dossiers standards une seule fois lors de la création du service
  useEffect(() => {
    if (fileService && !initializedRef.current) {
      initializedRef.current = true;
      // Créer les dossiers standards (dans le préfixe si défini, sinon à la racine)
      initializeStandardFolders(fileService, fileManagerConfig?.defaultPrefix).catch((error) => {
        console.error('Erreur lors de l\'initialisation des dossiers standards:', error);
      });
    }
  }, [fileService, fileManagerConfig]);

  return fileService;
}

