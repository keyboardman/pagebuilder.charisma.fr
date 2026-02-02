import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";

export function SpacingSettings() {
    const { node, onChange } = useNodeBuilderContext();
    const attributes = node.attributes;
    const style = attributes?.style ? attributes.style : {};

    return (
        <div className="flex flex-col gap-1 mb-1 mt-1">
            <div className="text-center text-sm py-0 leading-tight">Margin</div>

            <div className="grid grid-cols-2 gap-1">
                <Form.Group className="mb-0">
                    <Form.Label text="top" />
                    <Form.Input
                        type="text"
                        value={style?.marginTop?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, marginTop: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>

                <Form.Group className="mb-0">
                    <Form.Label text="bottom" />
                    <Form.Input
                        type="text"
                        value={style?.marginBottom?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, marginBottom: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
            <div className="grid grid-cols-2 gap-1">
                <Form.Group className="mb-0">
                    <Form.Label text="left" />
                    <Form.Input
                        type="text"
                        value={style?.marginLeft?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, marginLeft: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>

                <Form.Group className="mb-0">
                    <Form.Label text="right" />
                    <Form.Input
                        type="text"
                        value={style?.marginRight?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, marginRight: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>

            <hr className="border-border/30 mb-2 mt-1" />
            <div className="text-center text-sm py-0 leading-tight">Padding</div>

            <div className="grid grid-cols-2 gap-1">
                <Form.Group className="mb-0">
                    <Form.Label text="top" />
                    <Form.Input
                        type="text"
                        value={style?.paddingTop?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, paddingTop: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="bottom" />
                    <Form.Input
                        type="text"
                        value={style?.paddingBottom?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, paddingBottom: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
            <div className="grid grid-cols-2 gap-1">
                <Form.Group className="mb-0">
                    <Form.Label text="left" />
                    <Form.Input
                        type="text"
                        value={style?.paddingLeft?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, paddingLeft: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="right" />
                    <Form.Input
                        type="text"
                        value={style?.paddingRight?.toString() ?? ""}
                        onChange={(value) => {
                            onChange({
                                ...node,
                                attributes: {
                                    ...node.attributes, style: {
                                        ...style, paddingRight: value
                                    }
                                },
                            })
                        }}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
        </div>
    )
}