import { type CSSProperties, type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import {
  Base2Settings,
  Background2Settings,
  Text2Settings,
  Border2Settings,
  Size2Settings,
  Spacing2Settings,
  THEME_SELECTORS,
} from "../Settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import type { NodeNavItemType } from "./index";

const TARGET_OPTIONS = [
  { value: "_self", label: "Même fenêtre" },
  { value: "_blank", label: "Nouvel onglet" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node: itemNode, onChange } = useNodeBuilderContext();
  const node = itemNode as NodeNavItemType;
  const c = itemNode.content ?? {};

  const updateContent = (patch: Partial<NodeNavItemType["content"]>) =>
    onChange({ ...node, content: { ...node.content, ...patch } });

  const updateStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      attributes: { ...node.attributes, style },
    });

  return (
    <Tabs className="flex h-full min-h-0 flex-1 flex-col overflow-hidden" defaultValue="general">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="container">Container</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="mt-0">
                <Base2Settings
                  attributes={node.attributes}
                  onChange={(attributes: { className?: string; id?: string }) =>
                    onChange({
                      ...node,
                      attributes: { ...node.attributes, ...attributes },
                    })
                  }
                />
                <Form.Group>
                  <Form.Label text="Libellé" />
                  <Form.Input
                    type="text"
                    value={c.label ?? ""}
                    onChange={(value) => updateContent({ label: value ?? "" })}
                    className="h-7 text-sm"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label text="URL (href)" />
                  <Form.Input
                    type="text"
                    value={c.href ?? ""}
                    onChange={(value) => updateContent({ href: value ?? "" })}
                    className="h-7 text-sm"
                    placeholder="https://..."
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label text="Cible (target)" />
                  <Form.Select
                    value={c.target ?? "_self"}
                    onChange={(value) => updateContent({ target: value ?? "_self" })}
                    options={TARGET_OPTIONS}
                  />
                </Form.Group>
              </TabsContent>
            </>
          }
          content={
            <TabsContent value="container" className="mt-0">
              <Text2Settings
                themeOverrideSelector={THEME_SELECTORS.navItem}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Background2Settings
                themeOverrideSelector={THEME_SELECTORS.navItem}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Border2Settings
                themeOverrideSelector={THEME_SELECTORS.navItem}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Size2Settings
                themeOverrideSelector={THEME_SELECTORS.navItem}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Spacing2Settings
                themeOverrideSelector={THEME_SELECTORS.navItem}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
            </TabsContent>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
