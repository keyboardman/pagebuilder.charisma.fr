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
} from '../ui/combobox';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import type { BodyConfig, ButtonConfig, ButtonColorOnly, ButtonSizeConfig, ThemeConfigJson, ThemeFormProps } from './types';
import {
  resolveColorValue,
  buildInitialVars,
  normalizeVarNameForSubmit,
  BODY_DEFAULTS,
  HEADING_AND_P_BLOCKS,
  defaultBlocks,
  BLOCK_KEY_TO_CAMEL,
  blockToCamelCase,
  rawToButtonConfig,
  rawToButtonSizeConfig,
  rawToButtonColorOnly,
  configToSelectedFontValues,
  blockToStyle,
  buttonConfigToStyle,
  mergeButtonWithSize,
  getVariantButtonStyle,
  getStateButtonStyle,
  TAILWIND_DEFAULT_VARS,
  BUTTON_BASE_KEYS,
  BUTTON_SIZE_KEYS,
  BUTTON_VARIANT_KEYS,
  BUTTON_VARIANT_LABELS,
  BUTTON_VARIANT_COLOR_KEYS,
} from './utils';

/** Témoin de couleur à afficher à gauche d'un input background, color ou border-color */
function ColorSwatch({
  value,
  prop,
}: {
  value: string;
  prop: 'background' | 'color' | 'border-color';
}) {
  const resolved = value.trim() ? resolveColorValue(value.trim()) : '';
  const style = prop === 'background'
    ? { background: resolved || 'transparent' }
    : { backgroundColor: resolved || 'transparent' };
  return (
    <span
      className="w-5 h-5 rounded border border-border shrink-0"
      style={style}
      title={resolved || '—'}
      aria-hidden
    />
  );
}

export function ThemeFormComponent({ fonts, postUrl, fieldName, initialConfig }: ThemeFormProps) {
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
  const [vars, setVars] = useState(buildInitialVars(initialConfig?.vars ?? null));
  const nextVarId = useRef<number>(vars.length + 1);

  const [ch_btn, setChBtn] = useState<ButtonConfig>(() =>
    rawToButtonConfig(initialConfig?.ch_btn ?? null)
  );
  const [ch_btn_primary, setChBtnPrimary] = useState<ButtonConfig>(() =>
    rawToButtonConfig(initialConfig?.ch_btn_primary ?? null)
  );
  const [ch_btn_info, setChBtnInfo] = useState<ButtonConfig>(() =>
    rawToButtonConfig(initialConfig?.ch_btn_info ?? null)
  );
  const [ch_btn_warning, setChBtnWarning] = useState<ButtonConfig>(() =>
    rawToButtonConfig(initialConfig?.ch_btn_warning ?? null)
  );
  const [ch_btn_success, setChBtnSuccess] = useState<ButtonConfig>(() =>
    rawToButtonConfig(initialConfig?.ch_btn_success ?? null)
  );
  const [ch_btn_danger, setChBtnDanger] = useState<ButtonConfig>(() =>
    rawToButtonConfig(initialConfig?.ch_btn_danger ?? null)
  );
  const [ch_btn_hover, setChBtnHover] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_hover ?? null)
  );
  const [ch_btn_disabled, setChBtnDisabled] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_disabled ?? null)
  );
  const [ch_btn_primary_hover, setChBtnPrimaryHover] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_primary_hover ?? null)
  );
  const [ch_btn_primary_disabled, setChBtnPrimaryDisabled] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_primary_disabled ?? null)
  );
  const [ch_btn_info_hover, setChBtnInfoHover] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_info_hover ?? null)
  );
  const [ch_btn_info_disabled, setChBtnInfoDisabled] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_info_disabled ?? null)
  );
  const [ch_btn_warning_hover, setChBtnWarningHover] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_warning_hover ?? null)
  );
  const [ch_btn_warning_disabled, setChBtnWarningDisabled] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_warning_disabled ?? null)
  );
  const [ch_btn_success_hover, setChBtnSuccessHover] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_success_hover ?? null)
  );
  const [ch_btn_success_disabled, setChBtnSuccessDisabled] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_success_disabled ?? null)
  );
  const [ch_btn_danger_hover, setChBtnDangerHover] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_danger_hover ?? null)
  );
  const [ch_btn_danger_disabled, setChBtnDangerDisabled] = useState<ButtonColorOnly>(() =>
    rawToButtonColorOnly(initialConfig?.ch_btn_danger_disabled ?? null)
  );
  const [ch_btn_sm, setChBtnSm] = useState<ButtonSizeConfig>(() =>
    rawToButtonSizeConfig(initialConfig?.ch_btn_sm ?? null)
  );
  const [ch_btn_lg, setChBtnLg] = useState<ButtonSizeConfig>(() =>
    rawToButtonSizeConfig(initialConfig?.ch_btn_lg ?? null)
  );
  const [customCss, setCustomCss] = useState<string>(() =>
    typeof initialConfig?.custom_css === 'string' ? initialConfig.custom_css : ''
  );

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

  const updateVar = (id: number, patch: Partial<{ name: string; value: string }>) => {
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
    <form method="post" action={postUrl} className="relative">
      <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-4 flex items-center justify-between gap-4 border-b bg-background px-6 py-3 shadow-sm">
        <span className="font-semibold truncate" title={themeName || 'Sans nom'}>
          {themeName || 'Sans nom'}
        </span>
        <button type="submit" className="btn btn-primary shrink-0">
          Enregistrer
        </button>
      </div>
      <div className="space-y-4">
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

      <details className="group border border-border rounded-lg" open>
        <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
          <span className="transition group-open:rotate-90">▶</span>
          Variables du thème
        </summary>
        <div className="px-4 pb-4 pt-1 space-y-2 border-t border-border">
        <p className="text-sm text-muted-foreground pt-2">
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
      </details>

      <details className="group border border-border rounded-lg" open>
        <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
          <span className="transition group-open:rotate-90">▶</span>
          Body
        </summary>
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border">
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
            <label htmlFor="body-font-weight" className="text-sm font-medium">
              font-weight
            </label>
            <select
              id="body-font-weight"
              name="config[body][font-weight]"
              className="input input-bordered w-full"
              value={body.fontWeight ?? ''}
              onChange={(e) => setBody((b) => ({ ...b, fontWeight: e.target.value }))}
            >
              <option value="">—</option>
              <option value="100">100 (Thin)</option>
              <option value="200">200 (Extra Light)</option>
              <option value="300">300 (Light)</option>
              <option value="400">400 (Regular)</option>
              <option value="500">500 (Medium)</option>
              <option value="600">600 (Semi Bold)</option>
              <option value="700">700 (Bold)</option>
              <option value="800">800 (Extra Bold)</option>
              <option value="900">900 (Black)</option>
            </select>
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
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <ColorSwatch value={body.color} prop="color" />
              </InputGroupAddon>
              <InputGroupInput
                id="body-color"
                type="text"
                name="config[body][color]"
                value={body.color}
                onChange={(e) => setBody((b) => ({ ...b, color: e.target.value }))}
                placeholder="var(--color-primary)"
              />
            </InputGroup>
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
      </details>

      <details className="group border border-border rounded-lg">
        <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
          <span className="transition group-open:rotate-90">▶</span>
          Titres et paragraphes (h1…p)
        </summary>
        <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
      {HEADING_AND_P_BLOCKS.map((blockKey) => {
        const data = blocks[blockKey] ?? BODY_DEFAULTS;
        return (
          <div key={blockKey} className="space-y-3">
            <h2 className="text-base font-semibold">{blockKey}</h2>
            <div className="overflow-x-auto">
              <div className="grid gap-2 w-full grid-cols-[repeat(7,minmax(0,1fr))]">
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
                <label htmlFor={`${blockKey}-font-weight`} className="text-sm font-medium">
                  font-weight
                </label>
                <select
                  id={`${blockKey}-font-weight`}
                  name={`config[${blockKey}][font-weight]`}
                  className="input input-bordered w-full"
                  value={data.fontWeight ?? ''}
                  onChange={(e) => updateBlock(blockKey, { fontWeight: e.target.value })}
                >
                  <option value="">—</option>
                  <option value="100">100 (Thin)</option>
                  <option value="200">200 (Extra Light)</option>
                  <option value="300">300 (Light)</option>
                  <option value="400">400 (Regular)</option>
                  <option value="500">500 (Medium)</option>
                  <option value="600">600 (Semi Bold)</option>
                  <option value="700">700 (Bold)</option>
                  <option value="800">800 (Extra Bold)</option>
                  <option value="900">900 (Black)</option>
                </select>
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
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <ColorSwatch value={data.color} prop="color" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={`${blockKey}-color`}
                    type="text"
                    name={`config[${blockKey}][color]`}
                    value={data.color}
                    onChange={(e) => updateBlock(blockKey, { color: e.target.value })}
                    placeholder="var(--color-primary)"
                  />
                </InputGroup>
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
          </div>
        );
      })}
        </div>
      </details>

      <details className="group border border-border rounded-lg">
        <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
          <span className="transition group-open:rotate-90">▶</span>
          Boutons (ch_btn)
        </summary>
        <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
        <p className="text-sm text-muted-foreground pt-2">
          Styles des classes .ch_btn (base), variantes et tailles .ch_btn_sm, .ch_btn_lg.
        </p>

        {BUTTON_VARIANT_KEYS.map((key) => {
          const data =
            key === 'ch_btn'
              ? ch_btn
              : key === 'ch_btn_primary'
                ? ch_btn_primary
                : key === 'ch_btn_info'
                  ? ch_btn_info
                  : key === 'ch_btn_warning'
                    ? ch_btn_warning
                    : key === 'ch_btn_success'
                      ? ch_btn_success
                      : ch_btn_danger;
          const setData =
            key === 'ch_btn'
              ? setChBtn
              : key === 'ch_btn_primary'
                ? setChBtnPrimary
                : key === 'ch_btn_info'
                  ? setChBtnInfo
                  : key === 'ch_btn_warning'
                    ? setChBtnWarning
                    : key === 'ch_btn_success'
                      ? setChBtnSuccess
                      : setChBtnDanger;
          const label = BUTTON_VARIANT_LABELS[key];
          const propsToShow = key === 'ch_btn' ? BUTTON_BASE_KEYS : [...BUTTON_VARIANT_COLOR_KEYS];
          const hoverData =
            key === 'ch_btn'
              ? ch_btn_hover
              : key === 'ch_btn_primary'
                ? ch_btn_primary_hover
                : key === 'ch_btn_info'
                  ? ch_btn_info_hover
                  : key === 'ch_btn_warning'
                    ? ch_btn_warning_hover
                    : key === 'ch_btn_success'
                      ? ch_btn_success_hover
                      : ch_btn_danger_hover;
          const setHoverData =
            key === 'ch_btn'
              ? setChBtnHover
              : key === 'ch_btn_primary'
                ? setChBtnPrimaryHover
                : key === 'ch_btn_info'
                  ? setChBtnInfoHover
                  : key === 'ch_btn_warning'
                    ? setChBtnWarningHover
                    : key === 'ch_btn_success'
                      ? setChBtnSuccessHover
                      : setChBtnDangerHover;
          const disabledData =
            key === 'ch_btn'
              ? ch_btn_disabled
              : key === 'ch_btn_primary'
                ? ch_btn_primary_disabled
                : key === 'ch_btn_info'
                  ? ch_btn_info_disabled
                  : key === 'ch_btn_warning'
                    ? ch_btn_warning_disabled
                    : key === 'ch_btn_success'
                      ? ch_btn_success_disabled
                      : ch_btn_danger_disabled;
          const setDisabledData =
            key === 'ch_btn'
              ? setChBtnDisabled
              : key === 'ch_btn_primary'
                ? setChBtnPrimaryDisabled
                : key === 'ch_btn_info'
                  ? setChBtnInfoDisabled
                  : key === 'ch_btn_warning'
                    ? setChBtnWarningDisabled
                    : key === 'ch_btn_success'
                      ? setChBtnSuccessDisabled
                      : setChBtnDangerDisabled;

          const renderColorFields = (
            stateKey: string,
            stateData: ButtonColorOnly,
            setState: (patch: Partial<ButtonColorOnly>) => void
          ) => (
            <div className="grid gap-2 grid-cols-3">
              {BUTTON_VARIANT_COLOR_KEYS.map((prop) => {
                const camel = BLOCK_KEY_TO_CAMEL[prop] ?? prop;
                const value = (stateData as Record<string, string>)[camel] ?? '';
                return (
                  <div key={prop} className="space-y-1">
                    <label htmlFor={`${key}-${stateKey}-${prop}`} className="text-xs font-medium">
                      {prop}
                    </label>
                    <InputGroup className="h-8">
                      <InputGroupAddon align="inline-start">
                        <ColorSwatch value={value} prop={prop} />
                      </InputGroupAddon>
                      <InputGroupInput
                        id={`${key}-${stateKey}-${prop}`}
                        type="text"
                        name={`config[${key}_${stateKey}][${prop}]`}
                        className="text-sm"
                        value={value}
                        onChange={(e) => setState({ [camel]: e.target.value })}
                      />
                    </InputGroup>
                  </div>
                );
              })}
            </div>
          );

          return (
            <div key={key} className="space-y-2 rounded border border-border p-3">
              <h3 className="text-sm font-medium">{label}</h3>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                {propsToShow.map((prop) => {
                  const camel = BLOCK_KEY_TO_CAMEL[prop] ?? prop;
                  const value = (data as Record<string, string>)[camel] ?? '';
                  return (
                    <div key={prop} className="space-y-1">
                      <label htmlFor={`${key}-${prop}`} className="text-xs font-medium">
                        {prop}
                      </label>
                      {prop === 'font-family' ? (
                        <select
                          id={`${key}-${prop}`}
                          name={`config[${key}][${prop}]`}
                          className="input input-bordered input-sm w-full"
                          value={value}
                          onChange={(e) => setData((b) => ({ ...b, [camel]: e.target.value }))}
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
                      ) : prop === 'font-weight' ? (
                        <select
                          id={`${key}-${prop}`}
                          name={`config[${key}][${prop}]`}
                          className="input input-bordered input-sm w-full"
                          value={value}
                          onChange={(e) => setData((b) => ({ ...b, [camel]: e.target.value }))}
                        >
                          <option value="">—</option>
                          <option value="100">100</option>
                          <option value="200">200</option>
                          <option value="300">300</option>
                          <option value="400">400</option>
                          <option value="500">500</option>
                          <option value="600">600</option>
                          <option value="700">700</option>
                          <option value="800">800</option>
                          <option value="900">900</option>
                        </select>
                      ) : (prop === 'background' || prop === 'color' || prop === 'border-color') ? (
                        <InputGroup className="h-8">
                          <InputGroupAddon align="inline-start">
                            <ColorSwatch value={value} prop={prop} />
                          </InputGroupAddon>
                          <InputGroupInput
                            id={`${key}-${prop}`}
                            type="text"
                            name={`config[${key}][${prop}]`}
                            className="text-sm"
                            value={value}
                            onChange={(e) => setData((b) => ({ ...b, [camel]: e.target.value }))}
                          />
                        </InputGroup>
                      ) : (
                        <input
                          id={`${key}-${prop}`}
                          type="text"
                          name={`config[${key}][${prop}]`}
                          className="input input-bordered input-sm w-full"
                          value={value}
                          onChange={(e) => setData((b) => ({ ...b, [camel]: e.target.value }))}
                          placeholder={prop === 'border-radius' ? '0.375rem' : ''}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 space-y-2 border-t border-border pt-2">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Au survol (hover)</h4>
                  {renderColorFields('hover', hoverData, (patch) => setHoverData((s) => ({ ...s, ...patch })))}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Désactivé (disabled)</h4>
                  {renderColorFields('disabled', disabledData, (patch) => setDisabledData((s) => ({ ...s, ...patch })))}
                </div>
              </div>
            </div>
          );
        })}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 rounded border border-border p-3">
            <h3 className="text-sm font-medium">ch_btn_sm (taille)</h3>
            <div className="grid gap-2 grid-cols-3">
              {BUTTON_SIZE_KEYS.map((prop) => {
                const camel = BLOCK_KEY_TO_CAMEL[prop] ?? prop;
                return (
                  <div key={prop} className="space-y-1">
                    <label htmlFor={`ch_btn_sm-${prop}`} className="text-xs font-medium">
                      {prop}
                    </label>
                    <input
                      id={`ch_btn_sm-${prop}`}
                      type="text"
                      name={`config[ch_btn_sm][${prop}]`}
                      className="input input-bordered input-sm w-full"
                      value={(ch_btn_sm as Record<string, string>)[camel] ?? ''}
                      onChange={(e) =>
                        setChBtnSm((s) => ({ ...s, [camel]: e.target.value }))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-2 rounded border border-border p-3">
            <h3 className="text-sm font-medium">ch_btn_lg (taille)</h3>
            <div className="grid gap-2 grid-cols-3">
              {BUTTON_SIZE_KEYS.map((prop) => {
                const camel = BLOCK_KEY_TO_CAMEL[prop] ?? prop;
                return (
                  <div key={prop} className="space-y-1">
                    <label htmlFor={`ch_btn_lg-${prop}`} className="text-xs font-medium">
                      {prop}
                    </label>
                    <input
                      id={`ch_btn_lg-${prop}`}
                      type="text"
                      name={`config[ch_btn_lg][${prop}]`}
                      className="input input-bordered input-sm w-full"
                      value={(ch_btn_lg as Record<string, string>)[camel] ?? ''}
                      onChange={(e) =>
                        setChBtnLg((s) => ({ ...s, [camel]: e.target.value }))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      </details>

      <details className="group border border-border rounded-lg">
        <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
          <span className="transition group-open:rotate-90">▶</span>
          CSS personnalisé
        </summary>
        <div className="px-4 pb-4 pt-1 border-t border-border space-y-2">
          <p className="text-sm text-muted-foreground pt-2">
            Règles CSS ajoutées à la fin du fichier généré (classes non prévues par le générateur).
          </p>
          <textarea
            id="config-custom-css"
            name="config[custom_css]"
            className="input input-bordered w-full font-mono text-sm min-h-[120px]"
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            placeholder=".ma-classe { color: red; }"
          />
        </div>
      </details>

      <details className="group border border-border rounded-lg mt-8 bg-muted/30" open>
        <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
          <span className="transition group-open:rotate-90">▶</span>
          Aperçu du thème
        </summary>
        <div className="p-4 pt-1 border-t border-border">
        <div
          style={
            (() => {
              const fromState = Object.fromEntries(
                vars
                  .map((v) => {
                    const name = normalizeVarNameForSubmit(v.name);
                    const value = v.value.trim();
                    return name && value ? [name, resolveColorValue(value)] : null;
                  })
                  .filter((e): e is [string, string] => e !== null)
              );
              const defaultsResolved = Object.fromEntries(
                Object.entries(TAILWIND_DEFAULT_VARS).map(([k, v]) => [k, resolveColorValue(v)])
              );
              return { ...defaultsResolved, ...fromState } as React.CSSProperties;
            })()
          }
        >
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
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2">Normal</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {BUTTON_VARIANT_KEYS.map((key) => {
                  const config =
                    key === 'ch_btn' ? ch_btn : key === 'ch_btn_primary' ? ch_btn_primary : key === 'ch_btn_info' ? ch_btn_info : key === 'ch_btn_warning' ? ch_btn_warning : key === 'ch_btn_success' ? ch_btn_success : ch_btn_danger;
                  const style = key === 'ch_btn' ? buttonConfigToStyle(config) : getVariantButtonStyle(ch_btn, config);
                  return (
                    <span key={key} className="inline-block cursor-default" style={style}>
                      {BUTTON_VARIANT_LABELS[key]}
                    </span>
                  );
                })}
                <span className="inline-block cursor-default" style={mergeButtonWithSize(ch_btn, ch_btn_sm)}>
                  Default + sm
                </span>
                <span className="inline-block cursor-default" style={mergeButtonWithSize(ch_btn, ch_btn_lg)}>
                  Default + lg
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2">Au survol (hover)</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {BUTTON_VARIANT_KEYS.map((key) => {
                  const config =
                    key === 'ch_btn' ? ch_btn : key === 'ch_btn_primary' ? ch_btn_primary : key === 'ch_btn_info' ? ch_btn_info : key === 'ch_btn_warning' ? ch_btn_warning : key === 'ch_btn_success' ? ch_btn_success : ch_btn_danger;
                  const baseStyle = key === 'ch_btn' ? buttonConfigToStyle(config) : getVariantButtonStyle(ch_btn, config);
                  const hoverData =
                    key === 'ch_btn' ? ch_btn_hover : key === 'ch_btn_primary' ? ch_btn_primary_hover : key === 'ch_btn_info' ? ch_btn_info_hover : key === 'ch_btn_warning' ? ch_btn_warning_hover : key === 'ch_btn_success' ? ch_btn_success_hover : ch_btn_danger_hover;
                  const style = getStateButtonStyle(baseStyle, hoverData);
                  return (
                    <span key={key} className="inline-block cursor-default" style={style}>
                      {BUTTON_VARIANT_LABELS[key]}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2">Désactivé (disabled)</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {BUTTON_VARIANT_KEYS.map((key) => {
                  const config =
                    key === 'ch_btn' ? ch_btn : key === 'ch_btn_primary' ? ch_btn_primary : key === 'ch_btn_info' ? ch_btn_info : key === 'ch_btn_warning' ? ch_btn_warning : key === 'ch_btn_success' ? ch_btn_success : ch_btn_danger;
                  const baseStyle = key === 'ch_btn' ? buttonConfigToStyle(config) : getVariantButtonStyle(ch_btn, config);
                  const disabledData =
                    key === 'ch_btn' ? ch_btn_disabled : key === 'ch_btn_primary' ? ch_btn_primary_disabled : key === 'ch_btn_info' ? ch_btn_info_disabled : key === 'ch_btn_warning' ? ch_btn_warning_disabled : key === 'ch_btn_success' ? ch_btn_success_disabled : ch_btn_danger_disabled;
                  const style = {
                    ...getStateButtonStyle(baseStyle, disabledData),
                    cursor: 'not-allowed',
                    opacity: 0.7,
                  };
                  return (
                    <span key={key} className="inline-block cursor-default" style={style} aria-disabled>
                      {BUTTON_VARIANT_LABELS[key]}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </details>
      </div>
    </form>
  );
}
