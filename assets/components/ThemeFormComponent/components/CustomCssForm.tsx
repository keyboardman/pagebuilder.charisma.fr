import { Component, type ReactNode, useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { useTheme } from '../ThemeContext';

type CodeEditorErrorBoundaryProps = {
  onError: () => void;
  children: ReactNode;
};

class CodeEditorErrorBoundary extends Component<CodeEditorErrorBoundaryProps> {
  state = { hasError: false };

  override componentDidCatch(): void {
    this.setState({ hasError: true });
    this.props.onError();
  }

  override render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export function CustomCssForm() {
  const { getCustomCss, setCustomCss } = useTheme();
  const [isCodeEditorUnavailable, setIsCodeEditorUnavailable] = useState(false);
  const cssExtensions = useMemo(() => [css()], []);
  const customCss = getCustomCss();

  return (
    <details className="group border border-border rounded-lg">
      <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
        <span className="transition group-open:rotate-90">▶</span>
        CSS personnalisé
      </summary>
      <div className="px-4 pb-4 pt-1 border-t border-border space-y-2">
        <p className="text-sm text-muted-foreground pt-2">
          Règles CSS ajoutées à la fin du fichier généré (classes non prévues par le générateur).
        </p>

        <input type="hidden" name="config[custom_css]" value={customCss} />

        {isCodeEditorUnavailable ? (
          <textarea
            id="config-custom-css"
            className="input input-bordered w-full font-mono text-sm min-h-[120px]"
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            placeholder=".ma-classe { color: red; }"
          />
        ) : (
          <CodeEditorErrorBoundary onError={() => setIsCodeEditorUnavailable(true)}>
            <div className="rounded-md border border-border overflow-hidden">
              <CodeMirror
                id="config-custom-css"
                value={customCss}
                height="220px"
                theme={oneDark}
                extensions={cssExtensions}
                onChange={(value) => setCustomCss(value)}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  highlightActiveLineGutter: true,
                }}
              />
            </div>
          </CodeEditorErrorBoundary>
        )}
      </div>
    </details>
  );
}

export default CustomCssForm;
