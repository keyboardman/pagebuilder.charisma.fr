import Form from "../../components/form";

export interface Base2SettingsProps {
    attributes?: {
        className?: string;
        id?: string;
    };
    onChange: (attributes: { className?: string; id?: string }) => void;
}

export function Base2Settings({ attributes, onChange }: Base2SettingsProps) {

    const { id, className } = attributes || {};

    return (
        <div className="flex flex-col gap-1 mb-1 mt-1">
            <Form.Group className="mb-0">
                <Form.Label text="ID"  className="text-foreground" />
                <Form.Input
                    type="text"
                    value={id ?? ""}
                    onChange={(value) => onChange({ 
                        ...attributes, 
                        id: value ?? '' 
                    })}
                    className="h-7 text-sm"
                />
            </Form.Group>
            <Form.Group className="mb-0">
                <Form.Label text="Classe" className="text-foreground" />
                <Form.Input
                    type="text"
                    value={className ?? ""}
                    onChange={(value) => onChange({ ...attributes, className: value ?? '' })}
                    className="h-7 text-sm"
                />
            </Form.Group>
        </div>
    )
}