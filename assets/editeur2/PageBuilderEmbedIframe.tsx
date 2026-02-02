import { useCallback } from "react";
import AppProvider from "./services/providers/AppProvider";
import BuilderProvider from "./services/providers/BuilderProvider";
import BuilderIframe from "./app/builder/BuilderIframe";
import App from "./app/App";
import type { FileManagerConfig } from "./ManagerAsset/types";
import type { NodesType } from "./types/NodeType";

export interface PageBuilderEmbedIframeProps {
  value: string;
  onChange: (json: string) => void;
  fileManagerConfig?: FileManagerConfig | null;
  /** URLs des feuilles CSS à injecter dans l'iframe (builder + thème) */
  cssFiles?: string[];
}

/**
 * Variante avec iframe pour le builder standalone.
 * Le drag and drop fonctionne correctement car le builder est isolé dans l'iframe,
 * comme dans l'éditeur de base.
 */
export default function PageBuilderEmbedIframe({
  value,
  onChange,
  fileManagerConfig = null,
  cssFiles = [],
}: PageBuilderEmbedIframeProps) {
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
      <BuilderProvider onSaveCallback={handleSave}>
        <BuilderIframe cssFiles={cssFiles}>
          <App />
        </BuilderIframe>
      </BuilderProvider>
    </AppProvider>
  );
}
