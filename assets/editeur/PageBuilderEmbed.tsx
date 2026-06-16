import { useCallback, useEffect } from "react";
import AppProvider from "./services/providers/AppProvider";
import BuilderInline from "./app/builder/BuilderInline";
import App from "./app/App";
import type { FileManagerConfig } from "./ManagerAsset/types";
import type { NodesType } from "./types/NodeType";
import type { BuilderThemeIcon } from "./types/BuilderThemeIcon";
import type { ThemeNodeOverrides, ThemeVars } from "./services/themeStyleHints";
import {
    normalizeThemeNodeOverrides,
    normalizeThemeVars,
} from "./services/themeStyleHints";
import { registerBackendApis } from "./ManagerApi/backendApiAdapter";
import { apiRegistry } from "./ManagerApi/ApiRegistry";

export interface PageBuilderEmbedProps {
  value: string;
  onChange: (json: string) => void;
  fileManagerConfig?: FileManagerConfig | null;
  /** Icônes du thème (liste + classes CSS générées dans le CSS du thème). */
  themeIcons?: BuilderThemeIcon[] | null;
  themeNodeOverrides?: ThemeNodeOverrides | Record<string, unknown> | null;
  themeVars?: ThemeVars | Record<string, unknown> | null;
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
  themeIcons = null,
  themeNodeOverrides = null,
  themeVars = null,
  apiCardsBaseUrl = null,
}: PageBuilderEmbedProps) {
  const pageBuilderApiBase = apiCardsBaseUrl?.trim() ? apiCardsBaseUrl.replace(/\/$/, "") : null;
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
      themeIcons={themeIcons}
      themeNodeOverrides={normalizeThemeNodeOverrides(themeNodeOverrides)}
      themeVars={normalizeThemeVars(themeVars)}
      pageBuilderApiBaseUrl={pageBuilderApiBase}
      onSaveCallback={handleSave}
    >
      <BuilderInline>
        <App />
      </BuilderInline>
    </AppProvider>
  );
}
