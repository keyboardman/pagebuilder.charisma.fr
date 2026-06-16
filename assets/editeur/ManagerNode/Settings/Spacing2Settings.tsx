import Form from "../../components/form";
import { useThemeStylePlaceholder } from "../../services/themeStyleHints";
import type { ThemeAwareStyleSettingsProps } from "./types";

export type Spacing2SettingsProps = ThemeAwareStyleSettingsProps;

export function Spacing2Settings({ style, onChange, themeOverrideSelector }: Spacing2SettingsProps) {
    const marginTopPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "margin-top");
    const marginBottomPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "margin-bottom");
    const marginLeftPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "margin-left");
    const marginRightPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "margin-right");
    const paddingTopPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "padding-top");
    const paddingBottomPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "padding-bottom");
    const paddingLeftPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "padding-left");
    const paddingRightPlaceholder = useThemeStylePlaceholder(themeOverrideSelector, "padding-right");

    return (
        <>
            <div className="flex flex-col gap-1 mb-2 mt-1">
                <div className="text-center text-sm py-0 leading-tight text-muted-foreground bg-gray-200/50">Margin</div>
                <div className="grid grid-cols-2 gap-1">
                    <Form.Group className="mb-0">
                        <Form.Label text="top" className="text-foreground" />
                        <Form.Input
                            type="text"
                            value={style?.marginTop?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, marginTop: value })}
                            placeholder={marginTopPlaceholder}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                    <Form.Group className="mb-0">
                        <Form.Label text="bottom" className="text-foreground" />
                        <Form.Input
                            type="text"
                            value={style?.marginBottom?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, marginBottom: value })}
                            placeholder={marginBottomPlaceholder}
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
                            placeholder={marginLeftPlaceholder}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                    <Form.Group className="mb-0">
                        <Form.Label text="right" className="text-foreground" />
                        <Form.Input
                            type="text"
                            value={style?.marginRight?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, marginRight: value })}
                            placeholder={marginRightPlaceholder}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                </div>

            </div>
            <div className="flex flex-col gap-1 mb-2 mt-1">
                <div className="text-center text-sm py-0 leading-tight text-muted-foreground bg-gray-200/50">Padding</div>
                <div className="grid grid-cols-2 gap-1">
                    <Form.Group className="mb-0">
                        <Form.Label text="top" className="text-foreground" />
                        <Form.Input
                            type="text"
                            value={style?.paddingTop?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, paddingTop: value })}
                            placeholder={paddingTopPlaceholder}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                    <Form.Group className="mb-0">
                        <Form.Label text="bottom" className="text-foreground" />
                        <Form.Input
                            type="text"
                            value={style?.paddingBottom?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, paddingBottom: value })}
                            placeholder={paddingBottomPlaceholder}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                </div>
                <div className="grid grid-cols-2 gap-1">
                    <Form.Group className="mb-0">
                        <Form.Label text="left" className="text-foreground" />
                        <Form.Input
                            type="text"
                            value={style?.paddingLeft?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, paddingLeft: value })}
                            placeholder={paddingLeftPlaceholder}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                    <Form.Group className="mb-0">
                        <Form.Label text="right" />
                        <Form.Input
                            type="text"
                            value={style?.paddingRight?.toString() ?? ""}
                            onChange={(value) => onChange({ ...style, paddingRight: value })}
                            placeholder={paddingRightPlaceholder}
                            className="h-7 text-sm"
                        />
                    </Form.Group>
                </div>
            </div>
        </> 
    );
}
