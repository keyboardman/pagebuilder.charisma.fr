import type { ThemeAwareStyleSettingsProps } from "./types";
import { SpacingProperty2Settings } from "./SpacingProperty2Settings";

export type Padding2SettingsProps = ThemeAwareStyleSettingsProps;

export function Padding2Settings(props: Padding2SettingsProps) {
    return <SpacingProperty2Settings {...props} property="padding" title="Padding" />;
}
