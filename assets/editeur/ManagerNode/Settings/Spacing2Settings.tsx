import type { ThemeAwareStyleSettingsProps } from "./types";
import { Margin2Settings } from "./Margin2Settings";
import { Padding2Settings } from "./Padding2Settings";

export type Spacing2SettingsProps = ThemeAwareStyleSettingsProps;

export function Spacing2Settings({ style, onChange, themeOverrideSelector }: Spacing2SettingsProps) {
    return (
        <>
            <Margin2Settings
                themeOverrideSelector={themeOverrideSelector}
                style={style}
                onChange={onChange}
            />
            <Padding2Settings
                themeOverrideSelector={themeOverrideSelector}
                style={style}
                onChange={onChange}
            />
        </>
    );
}
