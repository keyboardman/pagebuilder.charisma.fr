import { useEffect, useMemo, useState, CSSProperties } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeCssType } from './ThemeContext';
import { toReactStyle } from './utils';
import { FontOption, ThemeIcon, ThemeVar } from './types';

export interface ThemeProviderProps {
  children: React.ReactNode;
  config: ThemeCssType;
  allFontsOptions: FontOption[];
  filemanagerUrl?: string;
}

export function ThemeProvider({ children, config, allFontsOptions, filemanagerUrl }: ThemeProviderProps) {

  const [themeState, setThemeState] = useState<ThemeCssType>(config);
  
  const updateOverrideField = (key: string, attribute: string, value: string) => {
    setThemeState((prev: ThemeCssType) => {
      const currentOverrides = prev.node_overrides;
      const currentNode = currentOverrides[key] ?? {};
      
      let _tmp = {
        ...prev,
        node_overrides: {
          ...currentOverrides,
          [key]: {
            ...currentNode,
            [attribute]: value,
          },
        },
      };

      return _tmp;
    });
  };

  const getOverrideField = (key: string, attribute: string): string => {
    return themeState.node_overrides[key]?.[attribute] ?? '';
  };

  const getStyleFromOverride = (key: string): CSSProperties => {
    return toReactStyle(themeState.node_overrides[key] ?? {});
  };

  const getThemeName = (): string => {  
    return themeState.name;
  };

  const setThemeName = (name: string): void => {
    setThemeState((prev: ThemeCssType) => {
      return { ...prev, name: name };
    });
  };

  const getVars = (): ThemeVar[] => {
    return themeState.vars;
  };

  const setVars = (vars: ThemeVar[]): void => {
    setThemeState((prev: ThemeCssType) => {
      return { ...prev, vars: vars as ThemeVar[] };
    });
  };


  const getFonts = useMemo(() => {
    return themeState.fonts.reduce((acc:string[], f: number) => {
      const fo = allFontsOptions.find((fo: FontOption) => fo.id === f);
      if (fo) {
        const _id = fo.id.toString();
        const _name = fo.name;

        acc.push( `${_id}|${_name}`);
      }
      return acc;
    }, []);
  }, [themeState.fonts, allFontsOptions]);


  const setFonts = (fonts: number[]): void => {
    setThemeState((prev: ThemeCssType) => {
      return { ...prev, fonts: fonts };
    });
  };

  const setCustomCss = (customCss: string): void => {
    setThemeState((prev: ThemeCssType) => {
      return { ...prev, custom_css: customCss };
    });
  };

  const getCustomCss = (): string => {
    return themeState.custom_css;
  };

  const getIcons = (): ThemeIcon[] => {
    return themeState.icons;
  };

  const setIcons = (icons: ThemeIcon[]): void => {
    setThemeState((prev: ThemeCssType) => {
      return { ...prev, icons: icons as ThemeIcon[] };
    });
  };

  const getVideoPlayerIconUrl = (): string => themeState.video_player_icon_url;

  const setVideoPlayerIconUrl = (url: string): void => {
    setThemeState((prev: ThemeCssType) => ({
      ...prev,
      video_player_icon_url: url,
    }));
  };

  return (
    <ThemeContext.Provider value={{ themeState, updateOverrideField, getOverrideField, getStyleFromOverride, getThemeName, setThemeName, getFonts, setFonts, getVars, setVars, allFontsOptions, setCustomCss, getCustomCss, getIcons, setIcons, getVideoPlayerIconUrl, setVideoPlayerIconUrl, filemanagerUrl }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;