import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import type { NodeCardApiType } from "../index";
import { Background2Settings, Border2Settings, Spacing2Settings, getCardApiThemeSelector } from "../../Settings";

export function ContainerSettings() {
    const { node, onChange } = useNodeBuilderContext();
    const cardNode = node as NodeCardApiType;
  const themeOverrideSelector = getCardApiThemeSelector(cardNode.content?.container?.position, "container-content");
    const content = cardNode.content || {};
    const containerStyle = content?.container?.style || {};

    return (    
        <div className="flex flex-1 flex-col gap-1">
            <Background2Settings 
                themeOverrideSelector={themeOverrideSelector}
        style={containerStyle} 
                onChange={(style) => onChange({
                    ...node,
                    content: {
                        ...cardNode.content,
                        container: { ...cardNode.content?.container, style }
                    }
                })} 
            />
            <Border2Settings themeOverrideSelector={themeOverrideSelector}
        style={containerStyle} onChange={(style) => onChange({
                ...node,
                content: {
                    ...cardNode.content,
                    container: { ...cardNode.content?.container, style }
                }
            })} />
            
            <Spacing2Settings themeOverrideSelector={themeOverrideSelector}
        style={containerStyle} onChange={(style) => onChange({
                ...node,
                content: {
                    ...cardNode.content,
                    container: { ...cardNode.content?.container, style }
                }
            })} />
        </div >
    )
}