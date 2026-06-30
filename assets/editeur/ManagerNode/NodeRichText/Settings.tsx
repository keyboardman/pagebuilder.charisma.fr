import { type CSSProperties, type FC } from "react";
import { Pencil } from "lucide-react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import {
  Base2Settings,
  Background2Settings,
  Text2Settings,
  Border2Settings,
  Spacing2Settings,
  THEME_SELECTORS,
} from "../Settings";
import { Button } from "@/editeur/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { useNodeRichTextEditor } from "./NodeRichTextEditorContext";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const { openEditor, isEditorOpen } = useNodeRichTextEditor();

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
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => openEditor(node.id)}
                  >
                    <Pencil className="size-4" aria-hidden />
                    {isEditorOpen(node.id) ? "Éditeur ouvert" : "Modifier le texte"}
                  </Button>
                </div>
              </TabsContent>
            </>
          }
          content={
            <TabsContent value="container" className="mt-0">
              <Text2Settings
                themeOverrideSelector={THEME_SELECTORS.richText}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Background2Settings
                themeOverrideSelector={THEME_SELECTORS.richText}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Border2Settings
                themeOverrideSelector={THEME_SELECTORS.richText}
                style={node.attributes?.style || {}}
                onChange={updateStyle}
              />
              <Spacing2Settings
                themeOverrideSelector={THEME_SELECTORS.richText}
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
