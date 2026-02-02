import { useCallback } from "react";
import AppProvider from "./services/providers/AppProvider";
import BuilderInline from "./app/builder/BuilderInline";
import App from "./app/App";
import type { FileManagerConfig } from "./ManagerAsset/types";
import type { NodesType } from "./types/NodeType";

export interface PageBuilderEmbedProps {
  value: string;
  onChange: (json: string) => void;
  fileManagerConfig?: FileManagerConfig | null;
}

/**
 * Composant builder embarqué, sans iframe, pour intégration dans pagebuilder.charisma.fr.
 */
export default function PageBuilderEmbed({
  value,
  onChange,
  fileManagerConfig = null,
}: PageBuilderEmbedProps) {
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
