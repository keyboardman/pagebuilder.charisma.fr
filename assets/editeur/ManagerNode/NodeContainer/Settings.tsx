import { type CSSProperties, type FC } from "react";
import {
  Base2Settings,
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
  Size2Settings,
  THEME_SELECTORS,
} from "../Settings";
import Button from "../../components/button";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();

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
                      attributes: {
                        ...node.attributes,
                        ...attributes,
                      },
                    })
                  }
                />
                <Button
                  onClick={() => {
                    onChange({
                      ...node,
                      attributes: {
                        ...node.attributes,
                        options: {
                          ...node.attributes?.options,
                          fluid: !(node.attributes?.options?.fluid ?? false),
                        },
                      },
                    });
                  }}
                >
                  {node.attributes?.options?.fluid ? "fluid" : "no-fluid"}
                </Button>
              </TabsContent>
            </>
          }
          content={
            <TabsContent value="container" className="mt-0">
              <Background2Settings
                themeOverrideSelector={THEME_SELECTORS.container}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Border2Settings
                themeOverrideSelector={THEME_SELECTORS.container}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Spacing2Settings
                themeOverrideSelector={THEME_SELECTORS.container}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Size2Settings
                themeOverrideSelector={THEME_SELECTORS.container}
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
