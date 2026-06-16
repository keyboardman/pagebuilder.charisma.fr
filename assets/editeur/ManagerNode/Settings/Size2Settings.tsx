import Form from "../../components/form";
import { useThemeStylePlaceholder } from "../../services/themeStyleHints";
import type { ThemeAwareStyleSettingsProps } from "./types";
import { SettingsSectionTitle } from "./SettingsSectionTitle";

export type Size2SettingsProps = ThemeAwareStyleSettingsProps;

export function Size2Settings({ style, onChange, themeOverrideSelector }: Size2SettingsProps) {
    const minWidthPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "min-width", "auto");
    const maxWidthPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "max-width", "none");
    const minHeightPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "min-height", "auto");
    const maxHeightPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "max-height", "none");

    return (
        <div className="flex flex-col gap-1 mb-2 mt-1">
            <SettingsSectionTitle>Taille min / max</SettingsSectionTitle>
            <div className="grid grid-cols-2 gap-1">
                <Form.Group className="mb-0">
                    <Form.Label text="min-width" className="text-foreground" />
                    <Form.Input
                        type="text"
                        value={style?.minWidth?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, minWidth: value || undefined })}
                        className="h-7 text-sm"
                        placeholder={minWidthPlaceholder}
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="max-width" className="text-foreground" />
                    <Form.Input
                        type="text"
                        value={style?.maxWidth?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, maxWidth: value || undefined })}
                        className="h-7 text-sm"
                        placeholder={maxWidthPlaceholder}
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
                        placeholder={minHeightPlaceholder}
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="max-height" className="text-foreground" />
                    <Form.Input
                        type="text"
                        value={style?.maxHeight?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, maxHeight: value || undefined })}
                        className="h-7 text-sm"
                        placeholder={maxHeightPlaceholder}
                    />
                </Form.Group>
            </div>
        </div>
    );
}
