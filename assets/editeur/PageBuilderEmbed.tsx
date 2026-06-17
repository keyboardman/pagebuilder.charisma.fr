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
  /** Base URL API Platform pour les cards (ex. /api/page-builder). */
  apiCardsBaseUrl?: string | null;
  /** Base URL API Platform page-builder (ex. /api/page-builder). */
  pageBuilderApiBaseUrl?: string | null;
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
  pageBuilderApiBaseUrl = null,
}: PageBuilderEmbedProps) {
  const cardsApiBase = apiCardsBaseUrl?.trim() ? apiCardsBaseUrl.replace(/\/$/, "") : null;
  const legacyApiBase = pageBuilderApiBaseUrl?.trim()
    ? pageBuilderApiBaseUrl.replace(/\/$/, "")
    : cardsApiBase;
  useEffect(() => {
    if (cardsApiBase) {
      registerBackendApis(cardsApiBase, (adapter) => apiRegistry.register(adapter));
    }
  }, [cardsApiBase]);

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
      pageBuilderApiBaseUrl={legacyApiBase}
      onSaveCallback={handleSave}
    >
      <BuilderInline>
        <App />
      </BuilderInline>
    </AppProvider>
  );
}
