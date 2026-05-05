import React from 'react';
import { cn } from '@/lib/utils';
import FormCss from './FormCss';
import { useTheme } from '../ThemeContext';

const COLORS = [
    {
        key: 'ce-button-color-primary',
        label: 'Primary',
        selector: '.ce-button-primary'
    },
    {
        key: 'ce-button-color-secondary',
        label: 'Secondary',
        selector: '.ce-button-secondary'
    }
] as const;

const SIZES = [
    {
        key: 'ce-button-size-small',
        label: 'Small',
        selector: '.ce-button-small'
    },
    {
        key: 'ce-button-size-large',
        label: 'Large',
        selector: '.ce-button-large'
    }
] as const;


type CleanOptions = {
    removeNull?: boolean;
    removeUndefined?: boolean;
    removeEmptyString?: boolean;
    removeEmptyArray?: boolean;
    removeEmptyObject?: boolean;
    removeFalsy?: boolean;
};

export function cleanObject<T extends Record<string, any>>(
    obj: T,
    options: CleanOptions = {}
): Partial<T> {
    const {
        removeNull = true,
        removeUndefined = true,
        removeEmptyString = true,
        removeEmptyArray = false,
        removeEmptyObject = false,
        removeFalsy = false,
    } = options;

    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => {
            if (removeFalsy) return Boolean(value);

            if (removeNull && value === null) return false;
            if (removeUndefined && value === undefined) return false;
            if (removeEmptyString && value === '') return false;

            if (removeEmptyArray && Array.isArray(value) && value.length === 0) {
                return false;
            }

            if (
                removeEmptyObject &&
                typeof value === 'object' &&
                !Array.isArray(value) &&
                value !== null &&
                Object.keys(value).length === 0
            ) {
                return false;
            }

            return true;
        })
    ) as Partial<T>;
}

export function NodeButtonForm() {
    const { getOverrideField, updateOverrideField, getStyleFromOverride, getFonts } = useTheme();

    let _CeButtonDefault = cleanObject(getStyleFromOverride('.ce-button-default'));
    let _CeButtonPrimary = cleanObject(getStyleFromOverride('.ce-button-primary'));
    let _CeButtonSecondary = cleanObject(getStyleFromOverride('.ce-button-secondary'));

    let _CeButtonMedium = cleanObject(getStyleFromOverride('.ce-button-medium'));
    let _CeButtonLarge = cleanObject(getStyleFromOverride('.ce-button-large'));
    let _CeButtonSmall = cleanObject(getStyleFromOverride('.ce-button-small'));

    let _default = { ..._CeButtonDefault, ..._CeButtonMedium };
    let _colors = {
        'ce-button-color-primary': { ..._CeButtonPrimary, ..._CeButtonMedium },
        'ce-button-color-secondary': { ..._CeButtonSecondary, ..._CeButtonMedium },
    }

    let _sizes = {
        'ce-button-size-small': { ..._default, ..._CeButtonSmall },
        'ce-button-size-large': { ..._default, ..._CeButtonLarge },
    }

    return (
        <details className="group border border-border rounded-lg">
            <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
                <span className="transition group-open:rotate-90">▶</span>
                NodeButton
            </summary>
            <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
                <p className="text-sm text-muted-foreground pt-2">
                    Styles des boutons (classes <code className="text-xs">.ce-button</code>), alignés sur les réglages du builder.
                </p>
                <div>
                    <div className="border border-border rounded-md p-2 mb-2">
                        <div>
                            <button style={_default}>Défaut</button>
                        </div>
                        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                            <FormCss
                                id={`ce-button-medium-font-family`}
                                value={getOverrideField('.ce-button-medium', 'font-family')}
                                onChange={(e) => updateOverrideField('.ce-button-medium', 'font-family', e.target.value)}
                                placeholder="var(--font-family-base)"
                                type="select"
                                label="font-family"
                            >
                                <option value="">— Police —</option>
                                {getFonts.map((val) => {
                                    const [, name] = val.split('|');
                                    return (
                                        <option key={val} value={name ?? ''}>
                                            {name}
                                        </option>
                                    );
                                })}
                            </FormCss>
                            <FormCss
                                id={`ce-button-medium-font-size`}
                                value={getOverrideField('.ce-button-medium', 'font-size')}
                                onChange={(e) => updateOverrideField('.ce-button-medium', 'font-size', e.target.value)}
                                placeholder="var(--font-size-base)"
                                type="text"
                                label="font-size"
                            />
                            <FormCss
                                id={`ce-button-medium-font-weight`}
                                value={getOverrideField('.ce-button-medium', 'font-weight')}
                                onChange={(e) => updateOverrideField('.ce-button-medium', 'font-weight', e.target.value)}
                                placeholder="var(--font-weight-base)"
                                type="select"
                                label="font-weight"
                            >
                                <option value="">— Font Weight —</option>
                                <option value="100">100 (Thin)</option>
                                <option value="200">200 (Extra Light)</option>
                                <option value="300">300 (Light)</option>
                                <option value="400">400 (Regular)</option>
                                <option value="500">500 (Medium)</option>
                                <option value="600">600 (Semi Bold)</option>
                                <option value="700">700 (Bold)</option>
                                <option value="800">800 (Extra Bold)</option>
                                <option value="900">900 (Black)</option>
                            </FormCss>
                            <FormCss
                                id={`ce-button-medium-line-height`}
                                value={getOverrideField('.ce-button-medium', 'line-height')}
                                onChange={(e) => updateOverrideField('.ce-button-medium', 'line-height', e.target.value)}
                                placeholder="ex. 1.5, 1.75"
                                type="text"
                                label="line-height"
                            />
                            <FormCss
                                id={`ce-button-medium-margin`}
                                value={getOverrideField('.ce-button-medium', 'margin')}
                                onChange={(e) => updateOverrideField('.ce-button-medium', 'margin', e.target.value)}
                                placeholder="ex. 12px, 1rem, 20%"
                                type="text"
                                label="margin"
                            />

                            <FormCss
                                id={`ce-button-medium-padding`}
                                value={getOverrideField('.ce-button-medium', 'padding')}
                                onChange={(e) => updateOverrideField('.ce-button-medium', 'padding', e.target.value)}
                                placeholder="ex. 12px, 1rem, 20%"
                                type="text"
                                label="padding"
                            />
                            <FormCss
                                id={`ce-button-medium-border-width`}
                                value={getOverrideField('.ce-button-medium', 'border-width')}
                                onChange={(e) => updateOverrideField('.ce-button-medium', 'border-width', e.target.value)}
                                placeholder="ex. 1px, 2px, 3px"
                                type="text"
                                label="border-width"
                            />
                            <FormCss
                                id={`ce-button-medium-border-style`}
                                value={getOverrideField('.ce-button-medium', 'border-style')}
                                onChange={(e) => updateOverrideField('.ce-button-medium', 'border-style', e.target.value)}
                                placeholder="ex. solid, dashed, dotted, double"
                                type="select"
                                label="border-style"
                            />
                            <FormCss
                                id={`ce-button-medium-border-radius`}
                                value={getOverrideField('.ce-button-medium', 'border-radius')}
                                onChange={(e) => updateOverrideField('.ce-button-medium', 'border-radius', e.target.value)}
                                placeholder="ex. 12px, 1rem, 20%"
                                type="text"
                                label="border-radius"
                            />

                            <FormCss
                                id={`ce-button-default-background-color`}
                                value={getOverrideField('.ce-button-default', 'background-color')}
                                onChange={(e) => updateOverrideField('.ce-button-default', 'background-color', e.target.value)}
                                placeholder="var(--color-primary)"
                                type="color"
                                label="background-color"
                            />
                            <FormCss
                                id={`ce-button-default-color`}
                                value={getOverrideField('.ce-button-default', 'color')}
                                onChange={(e) => updateOverrideField('.ce-button-default', 'color', e.target.value)}
                                placeholder="var(--color-primary)"
                                type="color"
                                label="color"
                            />
                            <FormCss
                                id={`ce-button-default-border-color`}
                                value={getOverrideField('.ce-button-default', 'border-color')}
                                onChange={(e) => updateOverrideField('.ce-button-default', 'border-color', e.target.value)}
                                placeholder="var(--color-primary)"
                                type="color"
                                label="border-color"
                            />
                            <FormCss
                                id={`ce-button-default-background-image`}
                                value={getOverrideField('.ce-button-default', 'background-image')}
                                onChange={(e) => updateOverrideField('.ce-button-default', 'background-image', e.target.value)}
                                placeholder="ex. 12px, 1rem, 20%"
                                type="text"
                                label="background-image"
                            />
                        </div>
                    </div>
                    {COLORS.map((color) => (
                        <div key={color.key} className="border border-border rounded-md p-2 mb-2">
                            <div>
                                <button style={_colors[color.key]}>{color.label}</button>
                            </div>
                            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                                <FormCss
                                    id={`${color.key}-background-color`}
                                    value={getOverrideField(color.selector, 'background-color')}
                                    onChange={(e) => updateOverrideField(color.selector, 'background-color', e.target.value)}
                                    placeholder="var(--color-primary)"
                                    type="color"
                                    label="background-color"
                                />
                                <FormCss
                                    id={`${color.key}-color`}
                                    value={getOverrideField(color.selector, 'color')}
                                    onChange={(e) => updateOverrideField(color.selector, 'color', e.target.value)}
                                    placeholder="var(--color-primary)"
                                    type="color"
                                    label="color"
                                />
                                <FormCss
                                    id={`${color.key}-background-image`}
                                    value={getOverrideField(color.selector, 'background-image')}
                                    onChange={(e) => updateOverrideField(color.selector, 'background-image', e.target.value)}
                                    placeholder="var(--color-primary)"
                                    type="text"
                                    label="background-image"
                                />
                                <FormCss
                                    id={`${color.key}-border-color`}
                                    value={getOverrideField(color.selector, 'border-color')}
                                    onChange={(e) => updateOverrideField(color.selector, 'border-color', e.target.value)}
                                    placeholder="var(--color-primary)"
                                    type="color"
                                    label="border-color"
                                />
                                
                                <FormCss
                                    id={`${color.key}-border-width`}
                                    value={getOverrideField(color.selector, 'border-width')}
                                    onChange={(e) => updateOverrideField(color.selector, 'border-width', e.target.value)}
                                    placeholder="ex. 1px, 2px, 3px"
                                    type="text"
                                    label="border-width"
                                />
                                <FormCss
                                    id={`${color.key}-border-style`}
                                    value={getOverrideField(color.selector, 'border-style')}
                                    onChange={(e) => updateOverrideField(color.selector, 'border-style', e.target.value)}
                                    placeholder="ex. solid, dashed, dotted, double"
                                    type="select"
                                    label="border-style"
                                >
                                    <option value="solid">solid</option>
                                    <option value="dashed">dashed</option>
                                    <option value="dotted">dotted</option>
                                    <option value="double">double</option>
                                    <option value="groove">groove</option>
                                    <option value="ridge">ridge</option>
                                    <option value="inset">inset</option>
                                    <option value="outset">outset</option>
                                </FormCss>
                            </div>
                        </div>
                    ))}
                    {SIZES.map((size) => (
                        <div key={size.key} className="border border-border rounded-md p-2 mb-2">
                            <div>
                                <button style={_sizes[size.key]}>{size.label}</button>
                            </div>
                            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                                <FormCss
                                    id={`${size.key}-padding`}
                                    value={getOverrideField(size.selector, 'padding')}
                                    onChange={(e) => updateOverrideField(size.selector, 'padding', e.target.value)}
                                    placeholder="ex. 12px, 1rem, 20%"
                                    type="text"
                                    label="padding"
                                />
                                
                                <FormCss
                                    id={`${size.key}-font-size`}
                                    value={getOverrideField(size.selector, 'font-size')}
                                    onChange={(e) => updateOverrideField(size.selector, 'font-size', e.target.value)}
                                    placeholder="ex. 12px, 1rem, 20%"
                                    type="text"
                                    label="font-size"
                                />
                                <FormCss
                                    id={`${size.key}-font-weight`}
                                    value={getOverrideField(size.selector, 'font-weight')}
                                    onChange={(e) => updateOverrideField(size.selector, 'font-weight', e.target.value)}
                                    placeholder="ex. 12px, 1rem, 20%"
                                    type="select"
                                    label="font-weight"
                                >
                                    <option value="100">100 (Thin)</option>
                                    <option value="200">200 (Extra Light)</option>
                                    <option value="300">300 (Light)</option>
                                    <option value="400">400 (Regular)</option>
                                    <option value="500">500 (Medium)</option>
                                    <option value="600">600 (Semi Bold)</option>
                                    <option value="700">700 (Bold)</option>
                                    <option value="800">800 (Extra Bold)</option>
                                    <option value="900">900 (Black)</option>
                                </FormCss>
                                <FormCss
                                    id={`${size.key}-line-height`}
                                    value={getOverrideField(size.selector, 'line-height')}
                                    onChange={(e) => updateOverrideField(size.selector, 'line-height', e.target.value)}
                                    placeholder="ex. 12px, 1rem, 20%"
                                    type="text"
                                    label="line-height"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </details>

    );
}