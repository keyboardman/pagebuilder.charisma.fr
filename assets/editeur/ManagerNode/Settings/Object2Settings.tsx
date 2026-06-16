import Form from "../../components/form";
import { useThemeStylePlaceholder } from "../../services/themeStyleHints";
import type { ThemeAwareStyleSettingsProps } from "./types";

export type Object2SettingsProps = ThemeAwareStyleSettingsProps;

export function Object2Settings({ style, onChange, themeOverrideSelector }: Object2SettingsProps) {
    const objectFitLabel = useThemeStylePlaceholder(themeOverrideSelector, "object-fit") ?? "...";
    const objectPositionLabel = useThemeStylePlaceholder(themeOverrideSelector, "object-position") ?? "...";
    const aspectRatioPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "aspect-ratio");

    return (
        <div className="flex flex-col gap-1 mb-2 mt-1">
            <div className="text-center text-sm py-0 leading-tight text-muted-foreground bg-gray-200/50">Image</div>
            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="object-fit" className="text-foreground" />
                    <Form.Select options={[
                        { label: objectFitLabel, value: '' },
                        { label: 'fill', value: 'fill' },
                        { label: 'contain', value: 'contain' },
                        { label: 'cover', value: 'cover' },
                        { label: 'none', value: 'none' },
                        { label: 'scale-down', value: 'scale-down' }
                    ]}
                        value={style?.objectFit?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, objectFit: value as React.CSSProperties['objectFit'] })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="object-position" className="text-foreground" />
                    <Form.Select options={[
                        { label: objectPositionLabel, value: '' },
                        { label: 'top', value: 'top' },
                        { label: 'bottom', value: 'bottom' },
                        { label: 'left', value: 'left' },
                        { label: 'right', value: 'right' },
                        { label: 'center', value: 'center' }
                    ]}
                        value={style?.objectPosition?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, objectPosition: value as React.CSSProperties['objectPosition'] })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="aspect-ratio" className="text-foreground" />
                    <Form.Input
                        type="text"
                        value={style?.aspectRatio?.toString() ?? ""}
                        onChange={(value) => onChange({...style, aspectRatio: value as React.CSSProperties['aspectRatio']})}
                        placeholder={aspectRatioPlaceholder}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
        </div>
    )
}
