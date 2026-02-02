import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";

export function BackgroundSettings() {

    const { node, onChange } = useNodeBuilderContext();

    const attributes = node.attributes;

    const style = attributes?.style ? attributes.style : {};

    return (
        <div className="flex flex-col gap-1 mb-1 mt-1">
            <Form.Group className="mb-0">
                <Form.Label text="Source de l'image" />
                <Form.InputUrl
                    type="text"
                    value={style?.backgroundImage?.toString() ?? ""}
                    onChange={(value) => {
                        onChange({
                            ...node,
                            attributes: {
                                ...node.attributes, style: {
                                    ...style, backgroundImage: value
                                }
                            },
                        })
                    }}
                    className="h-7 text-sm"
                />
            </Form.Group>

            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="color" />
                    <Form.InputColor
                        type="text"
                        value={style?.backgroundColor?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, backgroundColor: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>

                <Form.Group className="mb-0">
                    <Form.Label text="repeat" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'repeat', value: 'repeat' },
                        { label: 'no-repeat', value: 'no-repeat' },
                        { label: 'repeat-x', value: 'repeat-x' },
                        { label: 'repeat-y', value: 'repeat-y' }
                    ]}
                        value={style?.backgroundRepeat?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, backgroundRepeat: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>

            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="position" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'top', value: 'top' },
                        { label: 'left', value: 'left' },
                        { label: 'center', value: 'center' },
                        { label: 'right', value: 'right' },
                        { label: 'bottom', value: 'bottom' }
                    ]}
                        value={style?.backgroundPosition?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, backgroundPosition: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>

                <Form.Group className="mb-0">
                    <Form.Label text="size" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'cover', value: 'cover' },
                        { label: 'contain', value: 'contain' }
                    ]}
                        value={style?.backgroundSize?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, backgroundSize: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
        </div>
    );
}