import { type FC, useMemo } from "react";
import {
  Base2Settings,
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
  Size2Settings,
  Text2Settings,
} from "../Settings";
import Form from "../../components/form";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import type { NodeNavApiType, NodeNavDirection, NodeNavVariant, NodeNavApiTarget } from "./index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { apiRegistry } from "../../ManagerApi/ApiRegistry";

const DIRECTION_OPTIONS: { value: NodeNavDirection; label: string }[] = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
];

const VARIANT_OPTIONS: { value: NodeNavVariant; label: string }[] = [
  { value: "navbar", label: "Navbar" },
  { value: "liste", label: "Liste" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node: navNode, onChange } = useNodeBuilderContext();
  const node = navNode as NodeNavApiType;

  const listApiOptions = useMemo(
    () =>
      apiRegistry.listByType("list").map((adapter) => ({
        value: adapter.id,
        label: adapter.label,
      })),
    []
  );

  const selectedAdapter = node.content?.apiId ? apiRegistry.get(node.content.apiId) : null;

  return (
    <Tabs defaultValue="nav" className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <Base2Settings
                attributes={node.attributes}
                onChange={(attributes: { className?: string; id?: string }) =>
                  onChange({ ...node, attributes: { ...node.attributes, ...attributes } })
                }
              />

              <div className="mt-2 space-y-2 text-xs">
                <p className="node-block-title font-medium text-foreground text-sm">Menu Nav API</p>

                <div className="flex items-center gap-2">
                  <span className="node-block-title w-14 shrink-0 text-foreground text-sm">API list</span>
                  <Form.Select
                    value={node.content?.apiId ?? ""}
                    onChange={(v) =>
                      onChange({
                        ...node,
                        content: { ...node.content, apiId: v },
                      })
                    }
                    options={listApiOptions}
                    placeholder={listApiOptions.length ? "Choisir une API…" : "Aucune API list"}
                    className="h-7 flex-1 min-w-0 text-[0.75rem]"
                  />
                </div>

                {selectedAdapter ? (
                  <p className="text-muted-foreground text-[0.7rem] px-1">
                    Source : <span className="font-medium text-foreground">{selectedAdapter.label}</span>
                  </p>
                ) : null}

                <div className="flex items-center gap-2">
                  <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Target</span>
                  <Form.Select
                    value={(node.content?.options?.target as string) ?? "_self"}
                    onChange={(v) =>
                      onChange({
                        ...node,
                        content: {
                          ...node.content,
                          options: { ...node.content?.options, target: v as NodeNavApiTarget },
                        },
                      })
                    }
                    options={[
                      { value: "_self", label: "Même fenêtre" },
                      { value: "_blank", label: "Nouvel onglet" },
                    ]}
                    className="h-7 flex-1 min-w-0 text-[0.75rem]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Direction</span>
                  <Form.Select
                    value={(node.content?.options?.direction as string) ?? "horizontal"}
                    onChange={(v) =>
                      onChange({
                        ...node,
                        content: {
                          ...node.content,
                          options: { ...node.content?.options, direction: v as NodeNavDirection },
                        },
                      })
                    }
                    options={DIRECTION_OPTIONS}
                    className="h-7 flex-1 min-w-0 text-[0.75rem]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Variante</span>
                  <Form.Select
                    value={(node.content?.options?.variant as string) ?? "navbar"}
                    onChange={(v) =>
                      onChange({
                        ...node,
                        content: {
                          ...node.content,
                          options: { ...node.content?.options, variant: v as NodeNavVariant },
                        },
                      })
                    }
                    options={VARIANT_OPTIONS}
                    className="h-7 flex-1 min-w-0 text-[0.75rem]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Justify</span>
                  <Form.Select
                    value={(node.content?.options?.justify as string) ?? "flex-start"}
                    onChange={(v) =>
                      onChange({
                        ...node,
                        content: {
                          ...node.content,
                          options: { ...node.content?.options, justify: v },
                        },
                      })
                    }
                    options={[
                      { value: "flex-start", label: "Début" },
                      { value: "center", label: "Centre" },
                      { value: "flex-end", label: "Fin" },
                      { value: "space-between", label: "Between" },
                      { value: "space-around", label: "Around" },
                      { value: "space-evenly", label: "Evenly" },
                    ]}
                    className="h-7 flex-1 min-w-0 text-[0.75rem]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Gap</span>
                  <Form.Input
                    type="number"
                    value={(node.content?.options?.gap ?? 0).toString()}
                    onChange={(value: string) => {
                      const num = parseInt(value, 10);
                      if (!Number.isNaN(num) && num >= 0 && num <= 20) {
                        onChange({
                          ...node,
                          content: {
                            ...node.content,
                            options: { ...node.content?.options, gap: num },
                          },
                        });
                      }
                    }}
                    className="h-7 flex-1 min-w-0 text-[0.75rem]"
                    min={0}
                    max={20}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Défilement</span>
                  <input
                    type="checkbox"
                    checked={node.content?.options?.scrollWithoutScrollbar === true}
                    onChange={(e) =>
                      onChange({
                        ...node,
                        content: {
                          ...node.content,
                          options: {
                            ...node.content?.options,
                            scrollWithoutScrollbar: e.target.checked,
                          },
                        },
                      })
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-[0.7rem] text-muted-foreground">sans barre</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="node-block-title w-14 shrink-0 text-foreground text-sm">Icône burger</span>
                  <input
                    type="checkbox"
                    checked={node.content?.options?.showBurger === true}
                    onChange={(e) =>
                      onChange({
                        ...node,
                        content: {
                          ...node.content,
                          options: { ...node.content?.options, showBurger: e.target.checked },
                        },
                      })
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                </div>
              </div>

              <TabsList className="justify-center w-full mt-2">
                <TabsTrigger value="nav">Nav</TabsTrigger>
                <TabsTrigger value="burger">Burger</TabsTrigger>
              </TabsList>
            </>
          }
          content={
            <>
              <TabsContent value="nav">
                <Background2Settings
                  style={node.content?.nav?.style || {}}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: {
                        ...node.content,
                        nav: { ...node.content?.nav, style, className: node.content?.nav?.className ?? "" },
                      },
                    })
                  }
                />
                <Border2Settings
                  style={node.content?.nav?.style || {}}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...node.content, nav: { ...node.content?.nav, style } },
                    })
                  }
                />
                <Spacing2Settings
                  style={node.content?.nav?.style || {}}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...node.content, nav: { ...node.content?.nav, style } },
                    })
                  }
                />
                <Size2Settings
                  style={node.content?.nav?.style || {}}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...node.content, nav: { ...node.content?.nav, style } },
                    })
                  }
                />
              </TabsContent>
              <TabsContent value="burger">
                <Background2Settings
                  style={node.content?.burger?.style || {}}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...node.content, burger: { ...node.content?.burger, style } },
                    })
                  }
                />
                <Border2Settings
                  style={node.content?.burger?.style || {}}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...node.content, burger: { ...node.content?.burger, style } },
                    })
                  }
                />
                <Spacing2Settings
                  style={node.content?.burgerItem?.style || {}}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...node.content, burgerItem: { ...node.content?.burgerItem, style } },
                    })
                  }
                />
                <Text2Settings
                  style={node.content?.burgerItem?.style || {}}
                  onChange={(style) =>
                    onChange({
                      ...node,
                      content: { ...node.content, burgerItem: { ...node.content?.burgerItem, style } },
                    })
                  }
                />
              </TabsContent>
            </>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
