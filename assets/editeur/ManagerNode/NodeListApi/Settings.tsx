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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { Switch } from "@/editeur/components/ui/switch";
import { THEME_SELECTORS } from "../Settings/themeOverrideSelectors";
import { fetchListApiCollectionCached, hasListMetricValue, normalizeListApiItemsPerPage, normalizeListApiPage } from "./listApiUtils";
import { ListApiDisplayPaginationSettings } from "./ListApiDisplayPaginationSettings";

const PART_SELECTORS = {
  list: THEME_SELECTORS.listApi,
  item: `${THEME_SELECTORS.listApi} .ce-list-api-item`,
  title: `${THEME_SELECTORS.listApi} .ce-list-api-title`,
  description: `${THEME_SELECTORS.listApi} .ce-list-api-description`,
  counter: `${THEME_SELECTORS.listApi} .ce-list-api-counter`,
  like: `${THEME_SELECTORS.listApi} .ce-list-api-like`,
} as const;

type StyledPartKey = keyof typeof PART_SELECTORS;
type OptionalFieldKey = "description" | "counter" | "like";

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

  const [listSources, setListSources] = useState<Array<{ id: string; label: string; collectionMode?: string }>>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/page-builder/lists", {
          credentials: "same-origin",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = (await res.json()) as { items: Array<{ id: string; label: string; collectionMode?: string }> };
        if (!cancelled) setListSources(data.items ?? []);
      } catch {
        // ignore : en cas d'erreur on laisse la liste vide
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedListApiId = (content.apiId ?? "").trim();
  const selectedListSource = useMemo(
    () => (selectedListApiId ? listSources.find((s) => s.id === selectedListApiId) ?? null : null),
    [listSources, selectedListApiId]
  );

  const apiOptions = useMemo(
    () =>
      listSources.map((s) => ({
        value: s.id,
        label: s.label,
      })),
    [listSources]
  );
  const [availableFields, setAvailableFields] = useState<Record<OptionalFieldKey, boolean>>({
    description: true,
    counter: true,
    like: false,
  });
  const [totalPages, setTotalPages] = useState(0);

  const currentPage = normalizeListApiPage(content.page);
  const currentItemsPerPage = normalizeListApiItemsPerPage(content.itemsPerPage);

  useEffect(() => {
    let cancelled = false;

    const evaluateOptionalFields = async () => {
      if (!selectedListSource) {
        setAvailableFields({
          description: true,
          counter: true,
          like: false,
        });
        setTotalPages(0);
        return;
      }

      try {
        const response = await fetchListApiCollectionCached(
          selectedListSource.id,
          currentPage,
          currentItemsPerPage
        );

        if (cancelled) return;

        setTotalPages(response.totalPages);
        setAvailableFields({
          description: response.items.some((item) => (item.description?.trim() ?? "") !== ""),
          counter: response.items.some((item) => hasListMetricValue(item.counter)),
          like: response.items.some((item) => hasListMetricValue(item.like)),
        });
      } catch {
        if (cancelled) return;
        setTotalPages(0);
        setAvailableFields({
          description: true,
          counter: true,
          like: false,
        });
      }
    };

    void evaluateOptionalFields();

    return () => {
      cancelled = true;
    };
  }, [selectedListSource, currentPage, currentItemsPerPage]);

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
                <TabsTrigger value="title">Titre</TabsTrigger>
                {availableFields.description ? <TabsTrigger value="description">Description</TabsTrigger> : null}
                {availableFields.counter ? <TabsTrigger value="counter">Compteur</TabsTrigger> : null}
                {availableFields.like ? <TabsTrigger value="like">Like</TabsTrigger> : null}
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

                  {selectedListSource ? (
                    <p className="text-muted-foreground text-[0.7rem] px-1">
                      Source : <span className="font-medium text-foreground">{selectedListSource.label}</span>
                    </p>
                  ) : null}

                  <ListApiDisplayPaginationSettings
                    page={content.page}
                    itemsPerPage={content.itemsPerPage}
                    totalPages={totalPages}
                    onPageChange={(page) =>
                      onChange({
                        ...node,
                        content: { ...content, page },
                      })
                    }
                    onItemsPerPageChange={(itemsPerPage) =>
                      onChange({
                        ...node,
                        content: {
                          ...content,
                          itemsPerPage,
                          page: 1,
                        },
                      })
                    }
                  />

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
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
                    {availableFields.like ? (
                      <label className="flex items-center justify-between gap-2">
                        Like
                        <Switch
                          checked={content.show?.like !== false}
                          onCheckedChange={(checked) => updateShow("like", checked)}
                        />
                      </label>
                    ) : null}
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
              {availableFields.like ? (
                <TabsContent value="like" className="mt-0 h-full">
                  <StyledPartSettings part="like" />
                </TabsContent>
              ) : null}
            </>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
