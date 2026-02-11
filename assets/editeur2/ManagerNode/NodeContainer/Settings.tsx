
import { type FC } from "react";
import { Base2Settings, Background2Settings, Border2Settings, Spacing2Settings, Size2Settings } from "../Settings";
import Button from "../../components/button";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";

const Settings: FC<NodeSettingsProps> = () => {

    const { node, onChange } = useNodeBuilderContext();

    return (
        <NodeSettingsWrapper header={
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
                <Button
                    onClick={() => {
                        onChange({
                            ...node,
                            attributes: {
                                ...node.attributes,
                                options: {
                                    ...node.attributes?.options,
                                    fluid: !(node.attributes?.options?.fluid ?? false)
                                }
                            }
                        })
                    }}
                >{node.attributes?.options?.fluid ? 'fluid' : 'no-fluid'}</Button >
            </>
        }
            content={<>
                <Background2Settings
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
                <Spacing2Settings
                    style={node.attributes?.style || {}}
                    onChange={(style) => onChange({
                        ...node,
                        attributes: { ...node.attributes, style }
                    })}
                />
                <Size2Settings
                    style={node.attributes?.style || {}}
                    onChange={(style) => onChange({
                        ...node,
                        attributes: { ...node.attributes, style }
                    })}
                />
            </>} />
    );
}

export default Settings
