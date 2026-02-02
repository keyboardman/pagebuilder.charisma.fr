import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { useTypographyOptions } from "../../services/typography";

export function TextSettings() {
    const { node, onChange } = useNodeBuilderContext();
    const attributes = node.attributes;
    const style = attributes?.style ? attributes.style : {};
    const { fontSizeOptions } = useTypographyOptions();

    return (
        <div className="flex flex-col gap-1 mb-2 mt-1">
            <Form.Group className="mb-0">
                <Form.Label text="text-align" />
                <Form.Select options={[
                    { label: '...', value: '' },
                    { label: 'left', value: 'left' },
                    { label: 'right', value: 'right' },
                    { label: 'center', value: 'center' },
                    { label: 'justify', value: 'justify' }
                ]}
                    value={style?.textAlign?.toString() ?? ""}
                    onChange={(value) => {
                        onChange({
                            ...node,
                            attributes: {
                                ...node.attributes, style: {
                                    ...style, textAlign: value as React.CSSProperties['textAlign']
                                }
                            },
                        })
                    }}
                    className="h-7 text-sm"
                />
            </Form.Group>

            <Form.Group className="mb-0">
                <Form.Label text="font-family" />
                <Form.FontFamilySelect
                    value={style?.fontFamily?.toString() ?? ""}
                    onChange={(value) => {
                        onChange({
                            ...node,
                            attributes: {
                                ...node.attributes, style: {
                                    ...style, fontFamily: value as React.CSSProperties['fontFamily']
                                }
                            },
                        })
                    }}
                    className="h-7 text-sm"
                />
            </Form.Group>

            <Form.Group className="mb-0">
                <Form.Label text="color" />
                <Form.InputColor
                    type="text"
                    value={style?.color?.toString() ?? ""}
                    onChange={(value) => {
                        onChange({
                            ...node,
                            attributes: {
                                ...node.attributes, style: {
                                    ...style, color: value
                                }
                            },
                        })
                    }}
                    className="h-7 text-sm"
                />
            </Form.Group>

            <div className="flex flex-1">
                <Form.Group className="w-1/2 mb-0">
                    <Form.Label text="decoration" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'underline', value: 'underline' },
                        { label: 'overline', value: 'overline' },
                        { label: 'line-through', value: 'line-through' }
                    ]}
                        value={style?.textDecoration?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, textDecoration: value as React.CSSProperties['textDecoration']
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>

                <Form.Group className="w-1/2 mb-0">
                    <Form.Label text="size" />
                    <Form.Input
                        type="text"
                        list="text-settings-font-sizes"
                        value={style?.fontSize?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, fontSize: value as React.CSSProperties['fontSize']
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                    <datalist id="text-settings-font-sizes">
                        {fontSizeOptions.map((size) => (
                            <option key={size} value={size} />
                        ))}
                    </datalist>
                </Form.Group>
            </div>

            <Form.Group className="mb-0">
                <Form.Label text="line-height" />
                <Form.Input
                    type="text"
                    value={style?.lineHeight?.toString() ?? ""}
                    onChange={(value) => {
                        onChange({
                            ...node,
                            attributes: {
                                ...node.attributes, style: {
                                    ...style, lineHeight: value as React.CSSProperties['lineHeight']
                                }
                            },
                        })
                    }}
                    className="h-7 text-sm"
                    placeholder="ex: 1.5, 1.5rem, 24px"
                />
            </Form.Group>

            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="weight" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: '100', value: '100' },
                        { label: '200', value: '200' },
                        { label: '300', value: '300' },
                        { label: 'normal', value: 'normal' },
                        { label: '500', value: '500' },
                        { label: '600', value: '600' },
                        { label: 'bold', value: 'bold' },
                        { label: '800', value: '800' },
                        { label: '900', value: '900' },
                    ]}
                        value={style?.fontWeight?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, fontWeight: value as React.CSSProperties['fontWeight']
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>

                <Form.Group className="mb-0">
                    <Form.Label text="style" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'normal', value: 'normal' },
                        { label: 'italic', value: 'italic' }
                    ]}
                        value={style?.fontStyle?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, fontStyle: value as React.CSSProperties['fontStyle']
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
            <hr className="border-border/30 mb-2 mt-1"/>
        </div>
    )
}