import Form from "../../components/form";

export interface Size2SettingsProps {
    style: React.CSSProperties;
    onChange: (style: React.CSSProperties) => void;
}

export function Size2Settings({ style, onChange }: Size2SettingsProps) {
    return (
        <div className="flex flex-col gap-1 mb-2 mt-1">
            <div className="text-center text-sm py-0 leading-tight text-white bg-gray-200/50">Taille min / max</div>
            <div className="grid grid-cols-2 gap-1">
                <Form.Group className="mb-0">
                    <Form.Label text="min-width" className="text-foreground" />
                    <Form.Input
                        type="text"
                        value={style?.minWidth?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, minWidth: value || undefined })}
                        className="h-7 text-sm"
                        placeholder="auto"
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="max-width" className="text-foreground" />
                    <Form.Input
                        type="text"
                        value={style?.maxWidth?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, maxWidth: value || undefined })}
                        className="h-7 text-sm"
                        placeholder="none"
                    />
                </Form.Group>
            </div>
            <div className="grid grid-cols-2 gap-1">
                <Form.Group className="mb-0">
                    <Form.Label text="min-height" className="text-foreground" />
                    <Form.Input
                        type="text"
                        value={style?.minHeight?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, minHeight: value || undefined })}
                        className="h-7 text-sm"
                        placeholder="auto"
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="max-height" className="text-foreground" />
                    <Form.Input
                        type="text"
                        value={style?.maxHeight?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, maxHeight: value || undefined })}
                        className="h-7 text-sm"
                        placeholder="none"
                    />
                </Form.Group>
            </div>
        </div>
    );
}
