import type { FC } from "react";
import { BaseSettings, BackgroundSettings, BorderSettings, SpacingSettings } from "../Settings";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import Form from "../../components/form";
import { Switch } from "@editeur/components/ui/switch";
import type { NodeTwoColumnsType, ColumnWidth, NodeTwoColumnsLayout } from "./index";

const widthOptions = [
  { label: "33-66", value: "33-66" },
  { label: "50-50", value: "50-50" },
  { label: "66-33", value: "66-33" },
  { label: "100-100", value: "100-100" },
];

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const twoColumnsNode = node as NodeTwoColumnsType;
  
  const layout: NodeTwoColumnsLayout = twoColumnsNode.attributes?.layout || {
    desktop: "50-50",
    tablet: "50-50",
    mobile: "50-50",
    reverseDesktop: false,
    reverseTablet: false,
    reverseMobile: false
  };

  const updateLayout = (updates: Partial<NodeTwoColumnsLayout>) => {
    onChange({
      ...node,
      attributes: {
        ...twoColumnsNode.attributes,
        layout: {
          ...layout,
          ...updates
        }
      } as NodeTwoColumnsType['attributes']
    });
  };

  return (
    <>
      <BaseSettings />
      
      <div className="flex flex-col gap-6 mt-4">
        <h3 className="text-sm font-semibold text-foreground/80">Layout des colonnes</h3>
        
        {/* Desktop */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-foreground/70">Desktop</h4>
          <Form.Group>
            <Form.Label text="Largeur" />
            <Form.Select
              value={layout.desktop || "50-50"}
              onChange={(value) => updateLayout({ desktop: value as ColumnWidth })}
              options={widthOptions}
            />
          </Form.Group>
          <Form.Group>
            <div className="flex items-center justify-between">
              <Form.Label text="Inverser l'ordre" />
              <Switch
                checked={layout.reverseDesktop || false}
                onCheckedChange={(checked) => updateLayout({ reverseDesktop: checked })}
              />
            </div>
          </Form.Group>
        </div>

        {/* Tablet */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-foreground/70">Tablet</h4>
          <Form.Group>
            <Form.Label text="Largeur" />
            <Form.Select
              value={layout.tablet || "50-50"}
              onChange={(value) => updateLayout({ tablet: value as ColumnWidth })}
              options={widthOptions}
            />
          </Form.Group>
          <Form.Group>
            <div className="flex items-center justify-between">
              <Form.Label text="Inverser l'ordre" />
              <Switch
                checked={layout.reverseTablet || false}
                onCheckedChange={(checked) => updateLayout({ reverseTablet: checked })}
              />
            </div>
          </Form.Group>
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-medium text-foreground/70">Mobile</h4>
          <Form.Group>
            <Form.Label text="Largeur" />
            <Form.Select
              value={layout.mobile || "50-50"}
              onChange={(value) => updateLayout({ mobile: value as ColumnWidth })}
              options={widthOptions}
            />
          </Form.Group>
          <Form.Group>
            <div className="flex items-center justify-between">
              <Form.Label text="Inverser l'ordre" />
              <Switch
                checked={layout.reverseMobile || false}
                onCheckedChange={(checked) => updateLayout({ reverseMobile: checked })}
              />
            </div>
          </Form.Group>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <Form.Group>
          <div className="flex items-center justify-between">
            <Form.Label text="Largeur fluide" />
            <Switch
              checked={twoColumnsNode.attributes?.options?.fluid ?? false}
              onCheckedChange={(checked) => {
                onChange({
                  ...node,
                  attributes: {
                    ...twoColumnsNode.attributes,
                    options: {
                      ...twoColumnsNode.attributes?.options,
                      fluid: checked
                    }
                  }
                });
              }}
            />
          </div>
        </Form.Group>
      </div>
      
      <SpacingSettings />
      <BackgroundSettings />
      <BorderSettings />
    </>
  );
}

export default Settings;
