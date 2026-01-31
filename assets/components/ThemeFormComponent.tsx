import React, { useRef, useState } from 'react';
import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  useComboboxAnchor,
  ComboboxChips,
  ComboboxChip,
  ComboboxValue,
  ComboboxChipsInput,
  ComboboxEmpty,
} from './ui/combobox';

type FontOption = { id: number; name: string };

type BodyConfig = {
  fontFamily: string;
  lineHeight: string;
  fontSize: string;
  color: string;
  margin: string;
  padding: string;
};

/** JSON du DTO (route /theme/font/{id}) : nom, fonts, vars, body, h1..p */
type ThemeConfigJson = {
  nom?: string;
  fonts?: number[];
  vars?: Record<string, string>;
  body?: Record<string, string>;
  h1?: Record<string, string>;
  h2?: Record<string, string>;
  h3?: Record<string, string>;
  h4?: Record<string, string>;
  h5?: Record<string, string>;
  h6?: Record<string, string>;
  div?: Record<string, string>;
  p?: Record<string, string>;
};

type Props = {
  fonts: FontOption[];
  postUrl: string;
  fieldName: string; // ex: "config[fonts]"
  /** Config complète du thème (JSON du DTO), fournie par la route /theme/font/{id} */
  initialConfig?: ThemeConfigJson | null;
};

type ThemeVar = {
  id: number;
  name: string;
  value: string;
};

const TAILWIND_DEFAULT_VARS: Record<string, string> = {
  '--color-primary': '#570df8',
  '--color-link': '#3b82f6',
  '--color-info': '#0ea5e9',
  '--color-success': '#22c55e',
  '--color-warning': '#eab308',
  '--color-danger': '#ef4444',
  '--color-light': '#f5f5f5',
  '--color-dark': '#1f2937',
  '--color-black': '#000000',
  '--color-white': '#ffffff',
  '--font-size-base': '16px',
};

const buildInitialVars = (initial: Record<string, string> | null | undefined): ThemeVar[] => {
  const source =
    initial && Object.keys(initial).length > 0 ? initial : TAILWIND_DEFAULT_VARS;

  return Object.entries(source).map(([name, value], index) => ({
    id: index + 1,
    name,
    value: String(value ?? ''),
  }));
};

const normalizeVarNameForSubmit = (raw: string): string => {
  let name = raw.trim();
  if (!name) return '';
  if (!name.startsWith('--')) {
    name = '--' + name.replace(/^(-)*/, '');
  }
  return name;
};

const BODY_DEFAULTS: BodyConfig = {
  fontFamily: '',
  lineHeight: '',
  fontSize: 'var(--font-size-base)',
  color: 'var(--color-primary)',
  margin: '0',
  padding: '0',
};

const HEADING_AND_P_BLOCKS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] as const;

function defaultBlocks(): Record<string, BodyConfig> {
  return Object.fromEntries(
    HEADING_AND_P_BLOCKS.map((block) => [block, { ...BODY_DEFAULTS }])
  );
}

const BLOCK_KEY_TO_CAMEL: Record<string, string> = {
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'line-height': 'lineHeight',
  color: 'color',
  margin: 'margin',
  padding: 'padding',
};

function blockToCamelCase(block: Record<string, string> | null | undefined): Partial<BodyConfig> {
  if (!block || typeof block !== 'object') return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(block)) {
    const key = BLOCK_KEY_TO_CAMEL[k] ?? k;
    out[key] = String(v ?? '');
  }
  return out as Partial<BodyConfig>;
}

function configToSelectedFontValues(config: ThemeConfigJson | null | undefined, fonts: FontOption[]): string[] {
  const ids = config?.fonts;
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return ids
    .map((id) => {
      const f = fonts.find((font) => font.id === Number(id));
      return f ? `${f.id}|${f.name}` : null;
    })
    .filter((v): v is string => v !== null);
}

function blockToStyle(block: BodyConfig): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (block.fontFamily) style.fontFamily = block.fontFamily.includes(',') ? block.fontFamily : `"${block.fontFamily}", sans-serif`;
  if (block.fontSize) style.fontSize = block.fontSize;
  if (block.lineHeight) style.lineHeight = block.lineHeight;
  if (block.color) style.color = block.color;
  if (block.margin) style.margin = block.margin;
  if (block.padding) style.padding = block.padding;
  return style;
}

export function ThemeFormComponent({ fonts, postUrl, fieldName, initialConfig }: Props) {
  const anchor = useComboboxAnchor();

  const items = fonts.map((f) => `${f.id}|${f.name}`);

  const [themeName, setThemeName] = useState<string>(() => {
    if (initialConfig?.nom != null && initialConfig.nom !== '') return String(initialConfig.nom);
    return '';
  });
  const [selectedFontValues, setSelectedFontValues] = useState<string[]>(() => {
    if (initialConfig) return configToSelectedFontValues(initialConfig, fonts);
    return [];
  });
  const [body, setBody] = useState<BodyConfig>(() => {
    if (initialConfig?.body) {
      return { ...BODY_DEFAULTS, ...blockToCamelCase(initialConfig.body) } as BodyConfig;
    }
    return { ...BODY_DEFAULTS };
  });
  const [blocks, setBlocks] = useState<Record<string, BodyConfig>>(() => {
    const base = defaultBlocks();
    if (initialConfig) {
      for (const key of HEADING_AND_P_BLOCKS) {
        const blockData = initialConfig[key as keyof ThemeConfigJson];
        if (blockData && typeof blockData === 'object') {
          base[key] = { ...BODY_DEFAULTS, ...blockToCamelCase(blockData as Record<string, string>) } as BodyConfig;
        }
      }
    }
    return base;
  });
  const [vars, setVars] = useState<ThemeVar[]>(() => buildInitialVars(initialConfig?.vars ?? null));
  const nextVarId = useRef<number>(vars.length + 1);

  const updateBlock = (blockKey: string, patch: Partial<BodyConfig>) => {
    setBlocks((prev) => ({
      ...prev,
      [blockKey]: { ...prev[blockKey], ...patch },
    }));
  };

  const addVar = () => {
    setVars((current) => {
      const next = [...current, { id: nextVarId.current, name: '--', value: '' }];
      nextVarId.current += 1;
      return next;
    });
  };

  const updateVar = (id: number, patch: Partial<Pick<ThemeVar, 'name' | 'value'>>) => {
    setVars((current) =>
      current.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    );
  };

  const removeVar = (id: number, name?: string) => {
    const label = name && name.trim() ? name.trim() : 'cette variable';
    if (!window.confirm(`Supprimer la variable « ${label} » ?`)) {
      return;
    }
    setVars((current) => current.filter((v) => v.id !== id));
  };

  return (
    <form method="post" action={postUrl} className="space-y-4">
      <div className="space-y-2 max-w-xs">
        <label htmlFor="theme-name" className="text-sm font-medium">
          Nom du thème
        </label>
        <input
          id="theme-name"
          type="text"
          name="config[nom]"
          className="input input-bordered w-full "
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
          placeholder="Ex. Mon thème"
        />
      </div>
      <h1 className="text-xl font-semibold">Polices du thème</h1>
      <Combobox
        multiple
        autoHighlight
        items={items}
        value={selectedFontValues}
        onValueChange={setSelectedFontValues}
      >
        <ComboboxChips ref={anchor} className="w-full max-w-xs">
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => {
                  const [, name] = value.split('|');
                  const fontFamily = name ? `"${String(name).replace(/"/g, '')}", sans-serif` : undefined;
                  return (
                    <ComboboxChip key={value} style={fontFamily ? { fontFamily } : undefined}>
                      {name}
                    </ComboboxChip>
                  );
                })}
                <ComboboxChipsInput />
                {values.map((value) => {
                  const [id] = value.split('|');
                  return (
                    <input
                      key={`hidden-${id}`}
                      type="hidden"
                      name={`${fieldName}[]`}
                      value={id}
                    />
                  );
                })}
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>Aucune police trouvée.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => {
              const [id, name] = item.split('|');
              const fontFamily = name ? `"${String(name).replace(/"/g, '')}", sans-serif` : undefined;
              return (
                <ComboboxItem key={id} value={item} style={fontFamily ? { fontFamily } : undefined}>
                  {name}
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <div className="space-y-2">
        <h2 className="text-base font-semibold">Variables du thème</h2>
        <p className="text-sm text-muted-foreground">
          Variables CSS inspirées des valeurs par défaut Tailwind. Vous pouvez les
          modifier, en ajouter ou en supprimer.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {vars.map((v) => (
            <div key={v.id} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <input
                type="text"
                className="input input-bordered w-full sm:w-1/3"
                value={v.name}
                onChange={(e) => updateVar(v.id, { name: e.target.value })}
                placeholder="--ma-variable"
              />
              <input
                type="text"
                className="input input-bordered flex-1"
                value={v.value}
                onChange={(e) => updateVar(v.id, { value: e.target.value })}
                placeholder="Valeur (ex. #000000, 16px, oklch(...))"
              />
              <button
                type="button"
                className="btn btn-sm btn-ghost mt-1 sm:mt-0"
                onClick={() => removeVar(v.id, v.name)}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={addVar}
        >
          Ajouter une variable
        </button>

        {vars.map((v) => {
          const name = normalizeVarNameForSubmit(v.name);
          const value = v.value.trim();
          if (!name || !value) {
            return null;
          }
          return (
            <input
              key={`hidden-${v.id}`}
              type="hidden"
              name={`config[vars][${name}]`}
              value={value}
            />
          );
        })}
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold">Body</h2>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-6">
          <div className="space-y-1">
            <label htmlFor="body-font-family" className="text-sm font-medium">
              font-family
            </label>
            <select
              id="body-font-family"
              name="config[body][font-family]"
              className="input input-bordered w-full"
              value={body.fontFamily}
              onChange={(e) => setBody((b) => ({ ...b, fontFamily: e.target.value }))}
            >
              <option value="">— Police —</option>
              {selectedFontValues.map((val) => {
                const [, name] = val.split('|');
                return (
                  <option key={val} value={name ?? ''}>
                    {name}
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-muted-foreground">Polices sélectionnées ci-dessus</p>
          </div>
          <div className="space-y-1">
            <label htmlFor="body-font-size" className="text-sm font-medium">
              font-size
            </label>
            <input
              id="body-font-size"
              type="text"
              name="config[body][font-size]"
              className="input input-bordered w-full"
              value={body.fontSize}
              onChange={(e) => setBody((b) => ({ ...b, fontSize: e.target.value }))}
              placeholder="var(--font-size-base)"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="body-line-height" className="text-sm font-medium">
              line-height
            </label>
            <input
              id="body-line-height"
              type="text"
              name="config[body][line-height]"
              className="input input-bordered w-full"
              value={body.lineHeight}
              onChange={(e) => setBody((b) => ({ ...b, lineHeight: e.target.value }))}
              placeholder="ex. 1.5, 1.75"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="body-color" className="text-sm font-medium">
              color
            </label>
            <input
              id="body-color"
              type="text"
              name="config[body][color]"
              className="input input-bordered w-full"
              value={body.color}
              onChange={(e) => setBody((b) => ({ ...b, color: e.target.value }))}
              placeholder="var(--color-primary)"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="body-margin" className="text-sm font-medium">
              margin
            </label>
            <input
              id="body-margin"
              type="text"
              name="config[body][margin]"
              className="input input-bordered w-full"
              value={body.margin}
              onChange={(e) => setBody((b) => ({ ...b, margin: e.target.value }))}
              placeholder="0"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="body-padding" className="text-sm font-medium">
              padding
            </label>
            <input
              id="body-padding"
              type="text"
              name="config[body][padding]"
              className="input input-bordered w-full"
              value={body.padding}
              onChange={(e) => setBody((b) => ({ ...b, padding: e.target.value }))}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {HEADING_AND_P_BLOCKS.map((blockKey) => {
        const data = blocks[blockKey] ?? BODY_DEFAULTS;
        return (
          <div key={blockKey} className="space-y-3">
            <h2 className="text-base font-semibold">{blockKey}</h2>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-6">
              <div className="space-y-1">
                <label htmlFor={`${blockKey}-font-family`} className="text-sm font-medium">
                  font-family
                </label>
                <select
                  id={`${blockKey}-font-family`}
                  name={`config[${blockKey}][font-family]`}
                  className="input input-bordered w-full"
                  value={data.fontFamily}
                  onChange={(e) => updateBlock(blockKey, { fontFamily: e.target.value })}
                >
                  <option value="">— Police —</option>
                  {selectedFontValues.map((val) => {
                    const [, name] = val.split('|');
                    return (
                      <option key={val} value={name ?? ''}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor={`${blockKey}-font-size`} className="text-sm font-medium">
                  font-size
                </label>
                <input
                  id={`${blockKey}-font-size`}
                  type="text"
                  name={`config[${blockKey}][font-size]`}
                  className="input input-bordered w-full"
                  value={data.fontSize}
                  onChange={(e) => updateBlock(blockKey, { fontSize: e.target.value })}
                  placeholder="var(--font-size-base)"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={`${blockKey}-line-height`} className="text-sm font-medium">
                  line-height
                </label>
                <input
                  id={`${blockKey}-line-height`}
                  type="text"
                  name={`config[${blockKey}][line-height]`}
                  className="input input-bordered w-full"
                  value={data.lineHeight}
                  onChange={(e) => updateBlock(blockKey, { lineHeight: e.target.value })}
                  placeholder="ex. 1.5, 1.75"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={`${blockKey}-color`} className="text-sm font-medium">
                  color
                </label>
                <input
                  id={`${blockKey}-color`}
                  type="text"
                  name={`config[${blockKey}][color]`}
                  className="input input-bordered w-full"
                  value={data.color}
                  onChange={(e) => updateBlock(blockKey, { color: e.target.value })}
                  placeholder="var(--color-primary)"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={`${blockKey}-margin`} className="text-sm font-medium">
                  margin
                </label>
                <input
                  id={`${blockKey}-margin`}
                  type="text"
                  name={`config[${blockKey}][margin]`}
                  className="input input-bordered w-full"
                  value={data.margin}
                  onChange={(e) => updateBlock(blockKey, { margin: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor={`${blockKey}-padding`} className="text-sm font-medium">
                  padding
                </label>
                <input
                  id={`${blockKey}-padding`}
                  type="text"
                  name={`config[${blockKey}][padding]`}
                  className="input input-bordered w-full"
                  value={data.padding}
                  onChange={(e) => updateBlock(blockKey, { padding: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
        <h2 className="text-base font-semibold mb-3">Aperçu du thème</h2>
        <div style={blockToStyle(body)} className="space-y-2">
          <h1 style={blockToStyle(blocks.h1)}>Titre 1</h1>
          <h2 style={blockToStyle(blocks.h2)}>Titre 2</h2>
          <h3 style={blockToStyle(blocks.h3)}>Titre 3</h3>
          <h4 style={blockToStyle(blocks.h4)}>Titre 4</h4>
          <h5 style={blockToStyle(blocks.h5)}>Titre 5</h5>
          <h6 style={blockToStyle(blocks.h6)}>Titre 6</h6>
          <p style={blockToStyle(blocks.p)}>
            Paragraphe : le texte de démonstration permet de visualiser le rendu des polices et des styles
            (couleur, taille, interligne, marges) pour le body, les titres h1 à h6 et le paragraphe.
          </p>
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Enregistrer
      </button>
    </form>
  );
}