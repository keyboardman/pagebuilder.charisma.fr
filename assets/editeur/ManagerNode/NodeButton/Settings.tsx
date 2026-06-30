import { type CSSProperties, type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeButtonType, NodeButtonButtonType, NodeButtonVariantType, NodeButtonSizeType } from "./index";
import { NODE_BUTTON_VARIANT_OPTIONS, NODE_BUTTON_SIZE_OPTIONS } from "./index";
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
import TagNameEditable from "./components/TagNameEditable";

const BUTTON_TYPE_OPTIONS: { value: NodeButtonButtonType; label: string }[] = [
  { value: "button", label: "Bouton" },
  { value: "submit", label: "Submit" },
  { value: "link", label: "Lien" },
];

const TARGET_OPTIONS = [
  { value: "_self", label: "Même fenêtre" },
  { value: "_blank", label: "Nouvel onglet" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const buttonNode = node as NodeButtonType;
  const buttonType = buttonNode.content?.buttonType ?? "button";
  const href = buttonNode.content?.href ?? "";
  const target = buttonNode.content?.target ?? "_self";
  const variant = buttonNode.content?.variant ?? "default";
  const size = buttonNode.content?.size ?? "medium";
  const label = buttonNode.content?.label ?? "";

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
                  <Form.Label text="Type" />
                  <Form.Select
                    value={buttonType}
                    onChange={(value) =>
                      onChange({
                        ...node,
                        content: { ...node.content, buttonType: value as NodeButtonButtonType },
                      })
                    }
                    options={BUTTON_TYPE_OPTIONS}
                  />
                </Form.Group>
                {buttonType === "link" && (
                  <>
                    <Form.Group>
                      <Form.Label text="URL (href)" />
                      <Form.Input
                        type="text"
                        value={href}
                        onChange={(value) =>
                          onChange({
                            ...node,
                            content: { ...node.content, href: value ?? "" },
                          })
                        }
                        className="h-7 text-sm"
                        placeholder="https://..."
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label text="Cible (target)" />
                      <Form.Select
                        value={target}
                        onChange={(value) =>
                          onChange({
                            ...node,
                            content: { ...node.content, target: value ?? "_self" },
                          })
                        }
                        options={TARGET_OPTIONS}
                      />
                    </Form.Group>
                  </>
                )}
                <Form.Group>
                  <Form.Label text="Libellé" />
                  <div className="rounded-md border border-border bg-background p-2">
                    <TagNameEditable
                      tagName="div"
                      label={label}
                      onChange={(value) =>
                        onChange({
                          ...node,
                          content: { ...node.content, label: value },
                        })
                      }
                      allowPartialBold
                      className="min-h-[2rem] w-full text-sm"
                      style={{}}
                    />
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label text="Variant" />
                  <Form.Select
                    value={variant}
                    onChange={(value) =>
                      onChange({
                        ...node,
                        content: { ...node.content, variant: value as NodeButtonVariantType },
                      })
                    }
                    options={NODE_BUTTON_VARIANT_OPTIONS}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label text="Size" />
                  <Form.Select
                    value={size}
                    onChange={(value) =>
                      onChange({
                        ...node,
                        content: { ...node.content, size: value as NodeButtonSizeType },
                      })
                    }
                    options={NODE_BUTTON_SIZE_OPTIONS}
                  />
                </Form.Group>
              </TabsContent>
            </>
          }
          content={
            <TabsContent value="container" className="mt-0">
              <Text2Settings
                themeOverrideSelector={THEME_SELECTORS.button}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Background2Settings
                themeOverrideSelector={THEME_SELECTORS.button}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Border2Settings
                themeOverrideSelector={THEME_SELECTORS.button}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Size2Settings
                themeOverrideSelector={THEME_SELECTORS.button}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Spacing2Settings
                themeOverrideSelector={THEME_SELECTORS.button}
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
