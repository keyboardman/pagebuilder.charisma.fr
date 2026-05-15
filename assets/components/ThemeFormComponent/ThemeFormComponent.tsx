import type { ThemeFormProps } from './types';
import { buildInitialIcons, buildInitialVars, buildInitialVideoPlayerIconUrl, stringCssToMap } from './utils';
import { ThemeName } from './components/ThemeName';
import { NodeThemeNameForm } from './components/NodeThemeNameForm';
import { NodeVarsForm } from './components/NodeVarsForm';
import { NodeBodyForm } from './components/NodeBodyForm';
import { NodeHeaderForm } from './components/NodeHeaderForm';
import { NodeCardForm } from './components/NodeCardForm';
import { NodeMediaForm } from './components/NodeMediaForm';
import { NodeTextForm } from './components/NodeTextForm';
import { NodeFontsForm } from './components/NodeFontsForm';
import { NodeButtonForm } from './components/NodeButtonForm';
import { NodeFormForm } from './components/NodeFormForm';
import { NodeMenuForm } from './components/NodeMenuForm';
import { CustomCssForm } from './components/CustomCssForm';
import { NodeIconsForm } from './components/NodeIconsForm';
import { ThemeProvider } from './ThemeProvider';
import type { ThemeCssType } from './ThemeContext';
import TextareaNodeOverridesForm from './components/TextareaNodeOverridesForm';
import _ from 'lodash';
import './base-theme-preview.css';

export function ThemeFormComponent({ fonts, postUrl, initialConfig, filemanagerUrl }: ThemeFormProps) {

  let _config = {
    name: initialConfig?.name ?? '',
    fonts: initialConfig?.fonts ?? [],
    vars: buildInitialVars(initialConfig?.vars ?? null),
    node_overrides: _.mapValues(initialConfig?.node_overrides ?? {}, (value) => stringCssToMap(value)),
    custom_css: typeof initialConfig?.custom_css === 'string' ? initialConfig.custom_css : '',
    icons: buildInitialIcons(initialConfig?.icons),
    video_player_icon_url: buildInitialVideoPlayerIconUrl(initialConfig?.video_player_icon_url),
  } as unknown as ThemeCssType;

  return (
    <ThemeProvider config={_config} allFontsOptions={fonts} filemanagerUrl={filemanagerUrl} >
      <form method="post" action={postUrl} className="relative">
        <ThemeName />
        <div className="space-y-4">          
          <NodeThemeNameForm />
          <NodeFontsForm />
          <NodeVarsForm />
          <NodeIconsForm />
          <NodeBodyForm />
          <NodeHeaderForm />
          <NodeTextForm />
          <NodeButtonForm />
          <NodeMediaForm />
          <NodeFormForm />
          <NodeMenuForm />
          
          <details className="group border border-border rounded-lg">
            <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
              <span className="transition group-open:rotate-90">▶</span>
              NodeCard
            </summary>
            <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
              <p className="text-sm text-muted-foreground pt-2">
                Apercus des positions <span className="text-xs font-mono">top</span>,{' '}
                <span className="text-xs font-mono">left</span> et <span className="text-xs font-mono">right</span>{' '}
                avec reglages image, titre, texte et label.
              </p>
              <NodeCardForm  />
            </div>
          </details>

          <CustomCssForm />
        </div>
        <TextareaNodeOverridesForm />
       
      </form>
    </ThemeProvider>
  );
}
