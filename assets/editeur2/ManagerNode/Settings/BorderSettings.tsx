import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";

export function BorderSettings() {

    const { node, onChange } = useNodeBuilderContext();

    const attributes = node.attributes;

    const style = attributes?.style ? attributes.style : {};

    return (
        <div className="flex flex-1 flex-col gap-1 p-1 m-1 border border-border/30">
            <h3 className="text-center">Border</h3>

            <div className="flex flex-1">
                <Form.Group>
                    <Form.Label text="width" />
                    <Form.Input
                        type="text"
                        value={style?.borderWidth?.toString() ?? ""}
                        placeholder="ex: 1px, 2px"
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, borderWidth: value
                                    }
                                },
                            })
                        }}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label text="style" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'none', value: 'none' },
                        { label: 'solid', value: 'solid' },
                        { label: 'dashed', value: 'dashed' },
                        { label: 'dotted', value: 'dotted' },
                        { label: 'double', value: 'double' },
                        { label: 'groove', value: 'groove' },
                        { label: 'ridge', value: 'ridge' },
                        { label: 'inset', value: 'inset' },
                        { label: 'outset', value: 'outset' }
                    ]}
                        value={style?.borderStyle?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, borderStyle: value
                                    }
                                },
                            })
                        }}
                    />
                </Form.Group>
            </div>

            <div className="flex flex-1">
                <Form.Group>
                    <Form.Label text="color" />
                    <Form.InputColor
                        type="text"
                        value={style?.borderColor?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, borderColor: value
                                    }
                                },
                            })
                        }}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label text="radius" />
                    <Form.Input
                        type="text"
                        value={style?.borderRadius?.toString() ?? ""}
                        placeholder="ex: 4px, 50%"
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, borderRadius: value
                                    }
                                },
                            })
                        }}
                    />
                </Form.Group>
            </div>
        </div>
    );
}
