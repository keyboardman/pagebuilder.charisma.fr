import { type FC, useEffect, useMemo, useState } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings } from "../Settings";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeListImageMediaEntry, NodeListImageType } from "./index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { ListApiDisplayPaginationSettings } from "../NodeListApi/ListApiDisplayPaginationSettings";
import {
  fetchListImageCatalog,
  fetchListImageCollectionCached,
  LIST_IMAGE_MEDIA_TYPE,
  normalizeListImageItemsPerPage,
  normalizeListImageMode,
  normalizeListImagePage,
  type ListImageSourceMeta,
} from "./listImageApiUtils";
import { ListImageDynamicItemsSettings } from "./ListImageDynamicItemsSettings";
import {
  Background2Settings,
  Border2Settings,
  Margin2Settings,
  Object2Settings,
  Padding2Settings,
  Size2Settings,
  Spacing2Settings,
  THEME_SELECTORS,
} from "../Settings";
import type { CSSProperties } from "react";

const PART_SELECTORS = {
  list: THEME_SELECTORS.listImageApi,
  item: ".ce-list-image .ce-list-image-item",
  image: ".ce-list-image .ce-list-image-media",
} as const;

type StyledPartKey = keyof typeof PART_SELECTORS;

function ContainerItemPartSettings({ part }: { part: "list" | "item" }) {
  const { node, onChange } = useNodeBuilderContext();
  const listNode = node as NodeListImageType;
  const partContent = listNode.content?.[part] ?? {};
  const style = partContent.style ?? {};
  const themeOverrideSelector = PART_SELECTORS[part];

  const updatePart = (patch: { style?: CSSProperties }) => {
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
      <Background2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={(next) => updatePart({ style: next })}
      />
      <Margin2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={(next) => updatePart({ style: next })}
      />
      <Padding2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={(next) => updatePart({ style: next })}
      />
    </div>
  );
}

function ImagePartSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const listNode = node as NodeListImageType;
  const partContent = listNode.content?.image ?? {};
  const style = partContent.style ?? {};
  const themeOverrideSelector = PART_SELECTORS.image;

  const updatePart = (nextStyle: CSSProperties) => {
    onChange({
      ...node,
      content: {
        ...listNode.content,
        image: {
          ...partContent,
          style: nextStyle,
        },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-1">
      <Object2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={updatePart}
      />
      <Border2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={updatePart}
      />
      <Spacing2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={updatePart}
      />
      <Size2Settings
        themeOverrideSelector={THEME_SELECTORS.image}
        style={style}
        onChange={updatePart}
      />
    </div>
  );
}

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const listNode = node as NodeListImageType;
  const content = listNode.content ?? {};
  const listMode = normalizeListImageMode(content.listMode);
  const dynamicItems = useMemo(
    () =>
      (content.dynamicItems ?? []).filter(
        (entry): entry is NodeListImageMediaEntry =>
          entry.type === LIST_IMAGE_MEDIA_TYPE && typeof entry.src === "string"
      ),
    [content.dynamicItems]
  );

  const [listSources, setListSources] = useState<ListImageSourceMeta[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const items = await fetchListImageCatalog();
        if (!cancelled) setListSources(items);
      } catch {
        // ignore
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

  const currentPage = normalizeListImagePage(content.page);
  const currentItemsPerPage = normalizeListImageItemsPerPage(content.itemsPerPage);

  useEffect(() => {
    if (listMode !== "fixed" || !selectedListApiId) {
      setTotalPages(0);
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetchListImageCollectionCached(
          selectedListApiId,
          currentPage,
          currentItemsPerPage
        );
        if (!cancelled) {
          setTotalPages(response.totalPages);
        }
      } catch {
        if (!cancelled) {
          setTotalPages(0);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [listMode, selectedListApiId, currentPage, currentItemsPerPage]);

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 grid h-auto w-full grid-cols-4 gap-1">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="list">Container</TabsTrigger>
                <TabsTrigger value="item">Item</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-0">
                <Base2Settings
                  attributes={node.attributes}
                  onChange={(attributes) =>
                    onChange({ ...node, attributes: { ...node.attributes, ...attributes } })
                  }
                />

                <div className="mt-2 space-y-2 text-xs">
                  <p className="node-block-title font-medium text-foreground text-sm">Liste Image API</p>

                  <div className="flex items-center gap-2">
                    <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Mode</span>
                    <Form.Select
                      value={listMode}
                      onChange={(value) => {
                        const nextMode = normalizeListImageMode(value);
                        if (nextMode === "dynamic") {
                          onChange({
                            ...node,
                            content: {
                              ...content,
                              listMode: "dynamic",
                              dynamicItems: dynamicItems.length > 0 ? dynamicItems : [],
                            },
                          });
                          return;
                        }

                        onChange({
                          ...node,
                          content: {
                            ...content,
                            listMode: "fixed",
                            apiId: content.apiId ?? "",
                          },
                        });
                      }}
                      options={[
                        { value: "fixed", label: "Collection fixe" },
                        { value: "dynamic", label: "Médiathèque" },
                      ]}
                      className="h-7 flex-1 min-w-0 text-[0.75rem]"
                    />
                  </div>

                  {listMode === "fixed" ? (
                    <>
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
                          placeholder={apiOptions.length ? "Choisir une API image…" : "Aucune API image"}
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
                    </>
                  ) : (
                    <ListImageDynamicItemsSettings
                      items={dynamicItems}
                      onChange={(nextItems) =>
                        onChange({
                          ...listNode,
                          content: {
                            ...listNode.content,
                            listMode: "dynamic",
                            dynamicItems: nextItems,
                          },
                        })
                      }
                    />
                  )}
                </div>
              </TabsContent>
            </>
          }
          content={
            <>
              <TabsContent value="list" className="mt-0 h-full">
                <ContainerItemPartSettings part="list" />
              </TabsContent>
              <TabsContent value="item" className="mt-0 h-full">
                <ContainerItemPartSettings part="item" />
              </TabsContent>
              <TabsContent value="image" className="mt-0 h-full">
                <ImagePartSettings />
              </TabsContent>
            </>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
