import { type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings,
  Background2Settings,
  Text2Settings,
  Border2Settings,
  Size2Settings,
  Spacing2Settings,
  Object2Settings, THEME_SELECTORS } from "../Settings";
import type { NodeNavItemType, NodeNavItemKind } from "./index";


const TARGET_OPTIONS = [
  { value: "_self", label: "Même fenêtre" },
  { value: "_blank", label: "Nouvel onglet" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node: itemNode, onChange } = useNodeBuilderContext();
  const node = itemNode as NodeNavItemType;
  const c = itemNode.content ?? {};

  const updateContent = (patch: Partial<NodeNavItemType["content"]>) => onChange({ ...node, content: { ...node.content, ...patch } });

  return (
    <NodeSettingsWrapper
      header={
        <>
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
        </>
      }
      content={
        <>
          <Text2Settings
            
            themeOverrideSelector={THEME_SELECTORS.navItem}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Background2Settings
            
            themeOverrideSelector={THEME_SELECTORS.navItem}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Border2Settings
            
            themeOverrideSelector={THEME_SELECTORS.navItem}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Size2Settings
            
            themeOverrideSelector={THEME_SELECTORS.navItem}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Spacing2Settings
            
            themeOverrideSelector={THEME_SELECTORS.navItem}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
        </>
      }
    />
  );
};

export default Settings;
