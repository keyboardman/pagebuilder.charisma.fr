import type { FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { Base2Settings, Spacing2Settings, Border2Settings } from "../Settings";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeYoutubeType } from ".";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const youtubeNode = node as NodeYoutubeType;
  const content = youtubeNode.content;

  return (
    <>
      <NodeSettingsWrapper

        header={
          <>
            <Base2Settings
              attributes={node.attributes}
              onChange={(attributes: { className?: string; id?: string }) => onChange({
                ...node,
                attributes: {
                  ...node.attributes,
                  ...attributes
                }
              })}
            />
            <Form.Group>
              <Form.Label text="ID de la vidéo YouTube" className="node-block-title text-sm" />
              <Form.Input
                type="text"
                value={content?.videoId ?? ""}
                onChange={(value) => {
                  onChange({
                    ...node,
                    content: { ...content, videoId: value },
                  });
                }}
                placeholder="Ex: dQw4w9WgXcQ"
              />
              <p className="node-block-title text-muted-foreground mt-1 text-sm">
                Entrez l'ID de la vidéo YouTube (visible dans l'URL de la vidéo)
              </p>
            </Form.Group>
          </>
        }

        content={<>
          <Spacing2Settings
            style={node.attributes?.style || {}}
            onChange={(style) => onChange({
              ...node,
              attributes: { ...node.attributes, style }
            })}
          />
          <Border2Settings
            style={node.attributes?.style || {}}
            onChange={(style) => onChange({
              ...node,
              attributes: { ...node.attributes, style }
            })}
          />
        </>}

      />
    </>
  );
};

export default Settings;

