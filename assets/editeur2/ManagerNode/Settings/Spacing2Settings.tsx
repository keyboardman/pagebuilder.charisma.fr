import Form from "../../components/form";

export interface Spacing2SettingsProps {
    style: React.CSSProperties;
    onChange: (style: React.CSSProperties) => void;
}

export function Spacing2Settings({ style, onChange }: Spacing2SettingsProps) {
    return (
        <>
            <div className="flex flex-col gap-1 mb-2 mt-1">
                <div className="text-center text-sm py-0 leading-tight text-white bg-gray-200/50">Margin</div>
                <div className="grid grid-cols-2 gap-1">
                    <Form.Group className="mb-0">
                        <Form.Label text="top" />
                        <Form.Input
                            type="text"
                            value={style?.marginTop?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, marginTop: value })}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                    <Form.Group className="mb-0">
                        <Form.Label text="bottom" />
                        <Form.Input
                            type="text"
                            value={style?.marginBottom?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, marginBottom: value })}
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
                            onChange={(value) => onChange({ ...style, marginLeft: value })}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                    <Form.Group className="mb-0">
                        <Form.Label text="right" />
                        <Form.Input
                            type="text"
                            value={style?.marginRight?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, marginRight: value })}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                </div>

            </div>
            <div className="flex flex-col gap-1 mb-2 mt-1">
                <div className="text-center text-sm py-0 leading-tight text-white bg-gray-200/50">Padding</div>
                <div className="grid grid-cols-2 gap-1">
                    <Form.Group className="mb-0">
                        <Form.Label text="top" />
                        <Form.Input
                            type="text"
                            value={style?.paddingTop?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, paddingTop: value })}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                    <Form.Group className="mb-0">
                        <Form.Label text="bottom" />
                        <Form.Input
                            type="text"
                            value={style?.paddingBottom?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, paddingBottom: value })}
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
                            onChange={(value) => onChange({ ...style, paddingLeft: value })}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                    <Form.Group className="mb-0">
                        <Form.Label text="right" />
                        <Form.Input
                            type="text"
                            value={style?.paddingRight?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, paddingRight: value })}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                </div>
            </div>
        </> 
    );
}