import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";

export function ObjectSettings() {
    const { node, onChange } = useNodeBuilderContext();

    const attributes = node.attributes;
    const style = attributes?.style ? attributes.style : {};

    return (
        <div className="flex flex-col gap-1 mb-1 mt-1">
            <Form.Group className="mb-0">
                <Form.Label text="object-fit" />
                <Form.Select options={[
                    { label: '...', value: '' },
                    { label: 'fill', value: 'fill' },
                    { label: 'contain', value: 'contain' },
                    { label: 'cover', value: 'cover' },
                    { label: 'none', value: 'none' },
                    { label: 'scale-down', value: 'scale-down' }
                ]}
                    value={style?.objectFit?.toString() ?? ""}
                    onChange={(value) => {
                        onChange({
                            ...node,
                            attributes: {
                                ...node.attributes, style: {
                                    ...style, objectFit: value as React.CSSProperties['objectFit']
                                }
                            },
                        })
                    }}
                    className="h-7 text-sm"
                />
            </Form.Group>

            <Form.Group className="mb-0">
                <Form.Label text="object-position" />
                <Form.Select options={[
                    { label: '...', value: '' },
                    { label: 'top', value: 'top' },
                    { label: 'bottom', value: 'bottom' },
                    { label: 'left', value: 'left' },
                    { label: 'right', value: 'right' },
                    { label: 'center', value: 'center' }
                ]}
                    value={style?.objectPosition?.toString() ?? ""}
                    onChange={(value) => {
                        onChange({
                            ...node,
                            attributes: {
                                ...node.attributes, style: {
                                    ...style, objectPosition: value as React.CSSProperties['objectPosition']
                                }
                            },
                        })
                    }}
                    className="h-7 text-sm"
                />
            </Form.Group>

            <Form.Group className="mb-0">
                <Form.Label text="aspect-ratio" />
                <Form.Input
                    type="text"
                    value={style?.aspectRatio?.toString() ?? ""}
                    placeholder="ex: 16/9, 4/3, 1/1, auto"
                    onChange={(value) => {
                        onChange({
                            ...node,
                            attributes: {
                                ...node.attributes, style: {
                                    ...style, aspectRatio: value
                                }
                            },
                        })
                    }}
                    className="h-7 text-sm"
                />
            </Form.Group>
        </div>
    )
}