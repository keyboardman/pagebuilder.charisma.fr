import { createContext, useContext, CSSProperties } from 'react'
import { FontOption, ThemeIcon, ThemeVar } from './types';

export type ThemeCssType = {
    name: string;
    fonts: number[];
    vars: ThemeVar[];
    node_overrides: Record<string, Record<string, string>>;
    custom_css: string;
    icons: ThemeIcon[];
    video_player_icon_url: string;
}

export interface ThemeContextType {
    themeState: ThemeCssType
    allFontsOptions: FontOption[]
    filemanagerUrl?: string
    updateOverrideField: (key: string, attribute: string, value: string) => void
    getOverrideField: (key: string, attribute: string) => string
    getStyleFromOverride: (key: string) => CSSProperties
    getThemeName: () => string
    setThemeName: (name: string) => void
    getFonts: string[]
    setFonts: (fonts: number[]) => void
    getVars: () => ThemeVar[]
    setVars: (vars: ThemeVar[]) => void
    setCustomCss: (customCss: string) => void
    getCustomCss: () => string
    getIcons: () => ThemeIcon[]
    setIcons: (icons: ThemeIcon[]) => void
    getVideoPlayerIconUrl: () => string
    setVideoPlayerIconUrl: (url: string) => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
