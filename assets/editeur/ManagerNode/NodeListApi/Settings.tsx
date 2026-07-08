import { type FC, useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Base2Settings,
  Background2Settings,
  Border2Settings,
  ClassName2Settings,
  Spacing2Settings,
  Text2Settings,
} from "../Settings";
import Form from "../../components/form";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import type { NodeListApiType } from "./index";
import { LIST_API_ELIGIBLE_TYPE } from "./index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { apiRegistry } from "../../ManagerApi/ApiRegistry";
import { Switch } from "@/editeur/components/ui/switch";
import { THEME_SELECTORS } from "../Settings/themeOverrideSelectors";
import { fetchListApiCollectionCached } from "./listApiUtils";

const PART_SELECTORS = {
  list: THEME_SELECTORS.listApi,
  item: `${THEME_SELECTORS.listApi} .ce-list-api-item`,
  image: `${THEME_SELECTORS.listApi} .ce-list-api-image`,
  title: `${THEME_SELECTORS.listApi} .ce-list-api-title`,
  description: `${THEME_SELECTORS.listApi} .ce-list-api-description`,
  counter: `${THEME_SELECTORS.listApi} .ce-list-api-counter`,
  like: `${THEME_SELECTORS.listApi} .ce-list-api-like`,
} as const;

type StyledPartKey = keyof typeof PART_SELECTORS;
type OptionalFieldKey = "image" | "description" | "counter" | "like";

function StyledPartSettings({ part }: { part: StyledPartKey }) {
  const { node, onChange } = useNodeBuilderContext();
  const listNode = node as NodeListApiType;
  const partContent = listNode.content?.[part] ?? {};
  const className = partContent.className ?? "";
  const style = partContent.style ?? {};
  const themeOverrideSelector = PART_SELECTORS[part];
  const settingsVisibility = {
    showClassName: !["list", "item", "title", "description", "counter", "like"].includes(part),
    showText: !["list", "item"].includes(part),
    showBorder: part !== "item",
  };

  const updatePart = (patch: { className?: string; style?: CSSProperties }) => {
    onChange({
      ...node,
      content: {
        ...listNode.content,
        [part]: {
          ...partContent,
          ...patch,
        },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-1">
      {settingsVisibility.showClassName ? (
        <ClassName2Settings classes={className} onChange={(next) => updatePart({ className: next })} />
      ) : null}
      {settingsVisibility.showText ? (
        <Text2Settings
          themeOverrideSelector={themeOverrideSelector}
          style={style}
          onChange={(next) => updatePart({ style: next })}
        />
      ) : null}
      <Background2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={(next) => updatePart({ style: next })}
      />
      {settingsVisibility.showBorder ? (
        <Border2Settings
          themeOverrideSelector={themeOverrideSelector}
          style={style}
          onChange={(next) => updatePart({ style: next })}
        />
      ) : null}
      <Spacing2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={(next) => updatePart({ style: next })}
      />
    </div>
  );
}

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const listNode = node as NodeListApiType;
  const content = listNode.content ?? { show: {} };

  const apiOptions = useMemo(
    () =>
      apiRegistry.listByType(LIST_API_ELIGIBLE_TYPE).map((adapter) => ({
        value: adapter.id,
        label: adapter.label,
      })),
    []
  );

  // Stabiliser la référence adapter pour éviter de relancer `fetchCollection`
  // à chaque rerender (par ex. basculement d’onglets dans le panneau).
  const selectedAdapterApiId = (content.apiId ?? "").trim();
  const selectedAdapter = useMemo(
    () => (selectedAdapterApiId ? apiRegistry.get(selectedAdapterApiId) : null),
    [selectedAdapterApiId]
  );
  const [availableFields, setAvailableFields] = useState<Record<OptionalFieldKey, boolean>>({
    image: true,
    description: true,
    counter: true,
    like: true,
  });

  useEffect(() => {
    let cancelled = false;

    const evaluateOptionalFields = async () => {
      if (!selectedAdapter) {
        setAvailableFields({
          image: true,
          description: true,
          counter: true,
          like: true,
        });
        return;
      }

      const hasValue = (value: unknown): boolean => {
        if (value == null) return false;
        if (typeof value === "string") return value.trim() !== "";
        return true;
      };

      try {
        const isFixedCollection = selectedAdapter.collectionMode === "fixed";
        const mapped = await fetchListApiCollectionCached(selectedAdapter.id, {
          page: 1,
          limit: isFixedCollection ? 50 : 20,
        });

        if (cancelled) return;

        setAvailableFields({
          image: mapped.some((item) => hasValue(item.image)),
          description: mapped.some((item) => hasValue(item.description)),
          counter: mapped.some((item) => hasValue(item.counter)),
          like: mapped.some((item) => hasValue((item as { like?: unknown }).like)),
        });
      } catch {
        if (cancelled) return;
        // En cas d'erreur réseau, on laisse toutes les options visibles.
        setAvailableFields({
          image: true,
          description: true,
          counter: true,
          like: true,
        });
      }
    };

    void evaluateOptionalFields();

    return () => {
      cancelled = true;
    };
  }, [selectedAdapter]);

  const updateShow = (key: keyof NodeListApiType["content"]["show"], checked: boolean) => {
    onChange({
      ...node,
      content: {
        ...content,
        show: {
          ...content.show,
          [key]: checked,
        },
      },
    });
  };

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 grid h-auto w-full grid-cols-3 gap-1">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="list">Container</TabsTrigger>
                <TabsTrigger value="item">Item</TabsTrigger>
                {availableFields.image ? <TabsTrigger value="image">Image</TabsTrigger> : null}
                <TabsTrigger value="title">Titre</TabsTrigger>
                {availableFields.description ? <TabsTrigger value="description">Description</TabsTrigger> : null}
                {availableFields.counter ? <TabsTrigger value="counter">Compteur</TabsTrigger> : null}
                <TabsTrigger value="like">Like</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-0">
                <Base2Settings
                  attributes={node.attributes}
                  onChange={(attributes) =>
                    onChange({ ...node, attributes: { ...node.attributes, ...attributes } })
                  }
                />

                <div className="mt-2 space-y-2 text-xs">
                  <p className="node-block-title font-medium text-foreground text-sm">Liste API</p>

                  <div className="flex items-center gap-2">
                    <span className="node-block-title w-14 shrink-0 text-foreground text-sm">API</span>
                    <Form.Select
                      value={content.apiId ?? ""}
                      onChange={(v) =>
                        onChange({
                          ...node,
                          content: { ...content, apiId: v },
                        })
                      }
                      options={apiOptions}
                      placeholder={apiOptions.length ? "Choisir une API list…" : "Aucune API list"}
                      className="h-7 flex-1 min-w-0 text-[0.75rem]"
                    />
                  </div>

                  {selectedAdapter ? (
                    <p className="text-muted-foreground text-[0.7rem] px-1">
                      Source : <span className="font-medium text-foreground">{selectedAdapter.label}</span> (
                      {selectedAdapter.type})
                    </p>
                  ) : null}

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                    {availableFields.image ? (
                      <label className="flex items-center justify-between gap-2">
                        Image
                        <Switch
                          checked={content.show?.image !== false}
                          onCheckedChange={(checked) => updateShow("image", checked)}
                        />
                      </label>
                    ) : null}
                    <label className="flex items-center justify-between gap-2">
                      Titre
                      <Switch
                        checked={content.show?.title !== false}
                        onCheckedChange={(checked) => updateShow("title", checked)}
                      />
                    </label>
                    {availableFields.description ? (
                      <label className="flex items-center justify-between gap-2">
                        Description
                        <Switch
                          checked={content.show?.description !== false}
                          onCheckedChange={(checked) => updateShow("description", checked)}
                        />
                      </label>
                    ) : null}
                    {availableFields.counter ? (
                      <label className="flex items-center justify-between gap-2">
                        Compteur
                        <Switch
                          checked={content.show?.counter !== false}
                          onCheckedChange={(checked) => updateShow("counter", checked)}
                        />
                      </label>
                    ) : null}
                    <label className="flex items-center justify-between gap-2">
                      Like
                      <Switch
                        checked={content.show?.like !== false}
                        onCheckedChange={(checked) => updateShow("like", checked)}
                      />
                    </label>
                  </div>
                </div>
              </TabsContent>
            </>
          }
          content={
            <>
              <TabsContent value="list" className="mt-0 h-full">
                <StyledPartSettings part="list" />
              </TabsContent>
              <TabsContent value="item" className="mt-0 h-full">
                <StyledPartSettings part="item" />
              </TabsContent>
              {availableFields.image ? (
                <TabsContent value="image" className="mt-0 h-full">
                  <StyledPartSettings part="image" />
                </TabsContent>
              ) : null}
              <TabsContent value="title" className="mt-0 h-full">
                <StyledPartSettings part="title" />
              </TabsContent>
              {availableFields.description ? (
                <TabsContent value="description" className="mt-0 h-full">
                  <StyledPartSettings part="description" />
                </TabsContent>
              ) : null}
              {availableFields.counter ? (
                <TabsContent value="counter" className="mt-0 h-full">
                  <StyledPartSettings part="counter" />
                </TabsContent>
              ) : null}
              <TabsContent value="like" className="mt-0 h-full">
                <StyledPartSettings part="like" />
              </TabsContent>
            </>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
