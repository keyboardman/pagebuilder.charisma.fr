import { type FC } from "react";
import { Pencil } from "lucide-react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings, Background2Settings, Text2Settings, Border2Settings, Spacing2Settings, THEME_SELECTORS } from "../Settings";
// theme selectors added below
import { Button } from "@/editeur/components/ui/button";
import { useNodeRichTextEditor } from "./NodeRichTextEditorContext";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const { openEditor, isEditorOpen } = useNodeRichTextEditor();

  return (
    <NodeSettingsWrapper
      header={
        <Base2Settings
          attributes={node.attributes}
          onChange={(attributes: { className?: string; id?: string }) =>
            onChange({
              ...node,
              attributes: { ...node.attributes, ...attributes },
            })
          }
        />
      }
      content={
        <>
          <div className="mb-4">
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
          <Text2Settings
            
            themeOverrideSelector={THEME_SELECTORS.richText}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Background2Settings
            
            themeOverrideSelector={THEME_SELECTORS.richText}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Border2Settings
            
            themeOverrideSelector={THEME_SELECTORS.richText}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Spacing2Settings
            
            themeOverrideSelector={THEME_SELECTORS.richText}
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
