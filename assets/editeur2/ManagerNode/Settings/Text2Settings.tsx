import Form from "../../components/form";
import { useTypographyOptions } from "../../services/typography";

export interface Text2SettingsProps {
    style: React.CSSProperties;
    onChange: (style: React.CSSProperties) => void;
}

export function Text2Settings({ style, onChange }: Text2SettingsProps) {

    const { fontSizeOptions } = useTypographyOptions();

    return (
        <div className="flex flex-col gap-1 mb-2 mt-1">
            <div className="text-center text-sm py-0 leading-tight text-white bg-gray-200/50">Text</div>
            <div className="flex flex-1">
                <Form.Group className="w-1/2">
                    <Form.Label text="font-size" />
                    <Form.Input
                        type="text"
                        list="node-card-title-font-sizes"
                        value={style?.fontSize?.toString() || ""}
                        onChange={(value) => onChange({
                            ...style, fontSize: value as React.CSSProperties['fontSize']
                        })}
                        placeholder="ex: 1.5rem"
                        className="h-7 text-sm"
                    />
                    <datalist id="node-card-title-font-sizes">
                        {fontSizeOptions.map((size) => (<option key={size} value={size} />))}
                    </datalist>
                </Form.Group>
                <Form.Group className="w-1/2">
                    <Form.Label text="font-weight" />
                    <Form.Select
                        options={[
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
                        value={style?.fontWeight?.toString() || ""}
                        onChange={(value) => onChange({ ...style, fontWeight: value as React.CSSProperties['fontWeight'] })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
            <div className="flex flex-1">
                <Form.Group className="w-1/2">
                    <Form.Label text="font-style" />
                    <Form.Select
                        options={[
                            { label: '...', value: '' },
                            { label: 'normal', value: 'normal' },
                            { label: 'italic', value: 'italic' },
                            { label: 'oblique', value: 'oblique' },
                        ]}
                        value={style?.fontStyle?.toString() || ""}
                        onChange={(value) => onChange({ ...style, fontStyle: value as React.CSSProperties['fontStyle'] })}
                        className="h-7 text-sm"
                    />
                </Form.Group>

                <Form.Group className="mb-0">
                    <Form.Label text="font-family" />
                    <Form.FontFamilySelect
                        value={style?.fontFamily?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, fontFamily: value as React.CSSProperties['fontFamily'] })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
            
            <div className="flex flex-1">
                <Form.Group className="mb-0 w-1/2">
                    <Form.Label text="text-align" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'left', value: 'left' },
                        { label: 'right', value: 'right' },
                        { label: 'center', value: 'center' },
                        { label: 'justify', value: 'justify' }
                    ]}
                        value={style?.textAlign?.toString() ?? ""}
                        onChange={(value) => onChange({
                            ...style, textAlign: value as React.CSSProperties['textAlign']
                        })}
                        className="h-7 text-sm"
                    />
                </Form.Group>

                <Form.Group className="mb-0">
                    <Form.Label text="color" />
                    <Form.InputColor
                        type="text"
                        value={style?.color?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, color: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
            <div className="flex flex-1" >
                <Form.Group className="w-1/2 mb-0">
                    <Form.Label text="decoration" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'underline', value: 'underline' },
                        { label: 'overline', value: 'overline' },
                        { label: 'line-through', value: 'line-through' }
                    ]}
                        value={style?.textDecoration?.toString() ?? ""}
                        onChange={(value) => onChange({
                            ...style, textDecoration: value as React.CSSProperties['textDecoration']
                        })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="line-height" />
                    <Form.Input
                        type="text"
                        value={style?.lineHeight?.toString() ?? ""}
                        onChange={(value) => onChange({...style, lineHeight: value as React.CSSProperties['lineHeight']})}
                        className="h-7 text-sm"
                        placeholder="ex: 1.5, 1.5rem, 24px"
                    />
                </Form.Group>
            </div>
        </div>
    )
}