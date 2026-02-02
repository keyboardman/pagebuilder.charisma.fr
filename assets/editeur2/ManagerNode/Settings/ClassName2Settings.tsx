import Form from "../../components/form";

export interface ClassName2SettingsProps {
    classes: string;
    onChange: (className: string) => void;
}

export function ClassName2Settings({ classes, onChange }: ClassName2SettingsProps) {

    return (
        <div className="flex flex-col gap-1 mb-2 mt-1">
            <Form.Group>
                <Form.Label text="class" />
                <Form.Input
                    type="text"
                    value={classes}
                    onChange={(value) => onChange(value)}
                    placeholder="ex: gap-3"
                    className="h-7 text-sm"
                />
            </Form.Group>

        </div>
    )
}