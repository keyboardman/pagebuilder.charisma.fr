import NodeTextFormRow from './NodeTextFormRow';
import { useTheme } from '../ThemeContext';

const NODE_TEXT_PREVIEW_LOREM =
  'Le renard brun rapide saute par-dessus le chien paresseux. Ce bloc illustre comment le corps du texte, l’interligne et la couleur s’appliquent au contenu éditorial dans vos pages.';

export function NodeTextForm() {
  const { getStyleFromOverride, getFonts } = useTheme();

  return (
    <details className="group border border-border rounded-lg">
      <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
        <span className="transition group-open:rotate-90">▶</span>
        NodeText
      </summary>
      <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
        <p className="text-sm text-muted-foreground pt-2">
          Styles du bloc <span className="text-xs font-mono">.ce-text</span> (NodeText, quelle que soit la balise
          sous-jacente).
        </p>
        <div>
          <div className="ce-text" style={getStyleFromOverride('.ce-text')}>
            {NODE_TEXT_PREVIEW_LOREM}
          </div>
          <hr style={{ border: '1px solid #e0e0e0', margin: '1rem 0' }} />
          <NodeTextFormRow />
        </div>
      </div>
    </details>
  );
}

export default NodeTextForm;
