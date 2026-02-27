import type {NodesType } from "../types/NodeType";
export interface AutoSaveOptions {
  endpoint: string;
  interval: number; // en secondes
}

export interface AutoSaveController {
  stop: () => void;
}

let currentIntervalId: NodeJS.Timeout | null = null;
let currentGetData: (() => NodesType) | null = null;

/**
 * Envoie les données JSON vers l'endpoint configuré
 */
async function saveToEndpoint(endpoint: string, data: NodesType): Promise<void> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    // Log l'erreur mais ne fait pas crasher l'application
    console.error('[AutoSave] Erreur lors de la sauvegarde:', error);
  }
}

/**
 * Démarre l'autosave avec la configuration fournie
 */
export function startAutoSave(
  config: AutoSaveOptions,
  getData: () => NodesType
): AutoSaveController {
  // Arrêter l'autosave précédent s'il existe
  if (currentIntervalId !== null) {
    clearInterval(currentIntervalId);
    currentIntervalId = null;
  }

  // Valider l'intervalle
  if (config.interval <= 0) {
    throw new Error('L\'intervalle doit être un nombre positif');
  }

  // Stocker la fonction de récupération des données
  currentGetData = getData;

  // Convertir l'intervalle de secondes en millisecondes
  const intervalMs = config.interval * 1000;

  // Démarrer l'autosave
  currentIntervalId = setInterval(() => {
    if (currentGetData) {
      const data = currentGetData();
      saveToEndpoint(config.endpoint, data);
    }
  }, intervalMs);

  // Retourner un contrôleur pour arrêter l'autosave
  return {
    stop: () => {
      if (currentIntervalId !== null) {
        clearInterval(currentIntervalId);
        currentIntervalId = null;
        currentGetData = null;
      }
    },
  };
}

/**
 * Arrête l'autosave actuel
 */
export function stopAutoSave(): void {
  if (currentIntervalId !== null) {
    clearInterval(currentIntervalId);
    currentIntervalId = null;
    currentGetData = null;
  }
}
