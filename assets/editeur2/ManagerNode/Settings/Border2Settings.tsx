import Form from "../../components/form";

export interface Border2SettingsProps {
    style: React.CSSProperties;
    onChange: (style: React.CSSProperties) => void;
}

export function Border2Settings({ style, onChange }: Border2SettingsProps) {

    return (
        <div className="flex flex-col gap-1 mb-2 mt-1">
            <div className="text-center text-sm py-0 leading-tight text-white bg-gray-200/50">Border</div>
            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="border-color" />
                    <Form.InputColor
                        type="text"
                        value={style?.borderColor?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, borderColor: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="border-width" />
                    <Form.Input
                        type="text"
                        value={style?.borderWidth?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, borderWidth: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="border-style" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'solid', value: 'solid' },
                        { label: 'dashed', value: 'dashed' },
                        { label: 'dotted', value: 'dotted' },
                        { label: 'double', value: 'double' },
                    ]}
                        value={style?.borderStyle?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, borderStyle: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="border-radius" />
                    <Form.Input
                        type="text"
                        value={style?.borderRadius?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, borderRadius: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
        </div>
    )
}