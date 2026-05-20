import { type FC, useState, useEffect } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { useAppContext } from "../../services/providers/AppContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import Form from "../../components/form";
import type { NodeFormMethod, NodeFormType } from "./index";
import { Base2Settings, Background2Settings, Border2Settings, Spacing2Settings, Text2Settings } from "../Settings";

const methodOptions: { value: NodeFormMethod; label: string }[] = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
];

type CatalogItem = { id: string; title: string; action: string; honeypotField: string };

const Settings: FC<NodeSettingsProps> = () => {
  const { pageBuilderApiBaseUrl } = useAppContext();
  const { node, onChange } = useNodeBuilderContext();
  const formNode = node as NodeFormType;
  const content = formNode.content ?? { method: "POST", action: "" };
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);

  useEffect(() => {
    if (!pageBuilderApiBaseUrl) {
      setCatalogItems([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${pageBuilderApiBaseUrl}/forms/catalog`, { credentials: "same-origin" });
        if (!res.ok) return;
        const data = (await res.json()) as { items?: CatalogItem[] };
        if (!cancelled && Array.isArray(data.items)) setCatalogItems(data.items);
      } catch {
        if (!cancelled) setCatalogItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pageBuilderApiBaseUrl]);

  const catalogOptions = [
    { value: "", label: "— Aucun (URL manuelle) —" },
    ...catalogItems.map((i) => ({ value: i.id, label: i.title })),
  ];

  return (
    <NodeSettingsWrapper
      header={
        <>
          {pageBuilderApiBaseUrl ? (
            <Form.Group>
              <Form.Label text="Formulaire (backend)" />
              <Form.Select
                value={content.formConfigId ?? ""}
                onChange={(value) => {
                  if (!value) {
                    onChange({
                      ...node,
                      content: {
                        ...content,
                        formConfigId: undefined,
                      },
                    });
                    return;
                  }
                  const item = catalogItems.find((i) => i.id === value);
                  onChange({
                    ...node,
                    content: {
                      ...content,
                      formConfigId: value,
                      action: item?.action ?? content.action ?? "",
                      method: "POST",
                    },
                  });
                }}
                options={catalogOptions}
                placeholder={catalogItems.length ? "Choisir…" : "Aucun formulaire configuré"}
              />
            </Form.Group>
          ) : null}
          <Form.Group>
            <Form.Label text="Méthode HTTP" />
            <Form.Select
              value={content.method ?? "POST"}
              onChange={(value) =>
                onChange({
                  ...node,
                  content: {
                    ...content,
                    method: value as NodeFormMethod,
                  },
                })
              }
              options={methodOptions}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label text="URL d'action" />
            <Form.Input
              value={content.action ?? ""}
              onChange={(action) =>
                onChange({
                  ...node,
                  content: { ...content, action },
                })
              }
              placeholder="/contact ou https://…"
            />
          </Form.Group>
          <Base2Settings
            attributes={node.attributes}
            onChange={(attributes: { className?: string; id?: string }) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, ...attributes },
              })
            }
          />
        </>
      }
      content={
        <>
          <Background2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({ ...node, attributes: { ...node.attributes, style } })
            }
          />
          <Border2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({ ...node, attributes: { ...node.attributes, style } })
            }
          />
          <Spacing2Settings
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({ ...node, attributes: { ...node.attributes, style } })
            }
          />
        </>
      }
    />
  );
};

export default Settings;
