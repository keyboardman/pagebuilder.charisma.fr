import Form from "../../components/form";

export interface Background2SettingsProps {
    style: React.CSSProperties;
    onChange: (style: React.CSSProperties) => void;
}

export function Background2Settings({ style, onChange }: Background2SettingsProps) {

    return (
        <div className="flex flex-col gap-1 mb-2 mt-1">
            <div className="text-center text-sm py-0 leading-tight text-white bg-gray-200/50">Background</div>
            <Form.Group className="mb-0">
                <Form.Label text="background-image" />
                <Form.Input
                    type="text"
                    value={style?.backgroundImage?.toString() ?? ""}
                    onChange={(value) => onChange({ ...style, backgroundImage: value as React.CSSProperties['backgroundImage'] })}
                    className="h-7 text-sm"
                />
            </Form.Group>
            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="color" />
                    <Form.InputColor
                        type="text"
                        value={style?.backgroundColor?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, backgroundColor: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
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
                        onChange={(value) => onChange({ ...style, backgroundPosition: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="size" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'cover', value: 'cover' },
                        { label: 'contain', value: 'contain' }
                    ]}
                        value={style?.backgroundSize?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, backgroundSize: value })}
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
                        onChange={(value) => onChange({ ...style, backgroundRepeat: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
        </div>
    )
}