import type { ThemeAwareStyleSettingsProps } from "./types";
import { SpacingProperty2Settings } from "./SpacingProperty2Settings";

export type Margin2SettingsProps = ThemeAwareStyleSettingsProps;

export function Margin2Settings(props: Margin2SettingsProps) {
    return <SpacingProperty2Settings {...props} property="margin" title="Margin" />;
}
