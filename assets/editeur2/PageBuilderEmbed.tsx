import { useCallback, useEffect } from "react";
import AppProvider from "./services/providers/AppProvider";
import BuilderInline from "./app/builder/BuilderInline";
import App from "./app/App";
import type { FileManagerConfig } from "./ManagerAsset/types";
import type { NodesType } from "./types/NodeType";
import { registerBackendApis } from "./ManagerApi/backendApiAdapter";
import { apiRegistry } from "./ManagerApi/ApiRegistry";

export interface PageBuilderEmbedProps {
  value: string;
  onChange: (json: string) => void;
  fileManagerConfig?: FileManagerConfig | null;
  /** Base URL de l’API Symfony (ex. /page-builder/api) pour charger les APIs card enregistrées en PHP */
  apiCardsBaseUrl?: string | null;
}

/**
 * Composant builder embarqué, sans iframe, pour intégration dans pagebuilder.charisma.fr.
 */
export default function PageBuilderEmbed({
  value,
  onChange,
  fileManagerConfig = null,
  apiCardsBaseUrl = null,
}: PageBuilderEmbedProps) {
  useEffect(() => {
    if (apiCardsBaseUrl) {
      registerBackendApis(apiCardsBaseUrl, (adapter) => apiRegistry.register(adapter));
    }
  }, [apiCardsBaseUrl]);

  const handleSave = useCallback(
    (nodes: NodesType) => {
      onChange(JSON.stringify(nodes));
    },
    [onChange]
  );

  return (
    <AppProvider
      json={value}
      view={false}
      fileManagerConfig={fileManagerConfig}
      onSaveCallback={handleSave}
    >
      <BuilderInline>
        <App />
      </BuilderInline>
    </AppProvider>
  );
}
