import { type FC } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings, Background2Settings, Text2Settings, Border2Settings, Spacing2Settings, THEME_SELECTORS } from "../Settings";
// theme selectors added below

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();

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
          <Text2Settings
            
            themeOverrideSelector={THEME_SELECTORS.html}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Background2Settings
            
            themeOverrideSelector={THEME_SELECTORS.html}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Border2Settings
            
            themeOverrideSelector={THEME_SELECTORS.html}
            style={node.attributes?.style || {}}
            onChange={(style) =>
              onChange({
                ...node,
                attributes: { ...node.attributes, style },
              })
            }
          />
          <Spacing2Settings
            
            themeOverrideSelector={THEME_SELECTORS.html}
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

