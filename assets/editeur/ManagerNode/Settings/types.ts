export interface ThemeAwareStyleSettingsProps {
    style: React.CSSProperties;
    onChange: (style: React.CSSProperties) => void;
    /** Sélecteur CSS d'override thème (ex. `.ce-text`). */
    themeOverrideSelector?: string;
}
