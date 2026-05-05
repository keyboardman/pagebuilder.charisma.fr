import FormCss from './FormCss';
import { useTheme } from '../ThemeContext';
import {type headerType } from './NodeHeaderForm';

interface NodeHeaderFormRowType {
    target: headerType
}

const NodeHeaderFormRow = ({ target }: NodeHeaderFormRowType) => {

    const { getOverrideField, updateOverrideField, getFonts } = useTheme();

    return (
        <>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                <FormCss
                    id={`${target.key}-font-family`}
                    value={getOverrideField(`.ce-header-${target.tag}`, 'font-family')}
                    onChange={(e) => updateOverrideField(`.ce-header-${target.tag}`, 'font-family', e.target.value)}
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
                    id={`${target.key}-font-size`}
                    value={getOverrideField(target.selector, 'font-size')}
                    onChange={(e) => updateOverrideField(`.ce-header-${target.tag}`, 'font-size', e.target.value)}
                    placeholder="var(--font-size-base)"
                    type="text"
                    label="font-size"
                />
                <FormCss
                    id={`${target.key}-font-weight`}
                    value={getOverrideField(target.selector, 'font-weight')}
                    onChange={(e) => updateOverrideField(`.ce-header-${target.tag}`, 'font-weight', e.target.value)}
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
                    id={`${target.key}-line-height`}
                    value={getOverrideField(target.selector, 'line-height')}
                    onChange={(e) => updateOverrideField(target.selector, 'line-height', e.target.value)}
                    placeholder="ex. 1.5, 1.75"
                    type="text"
                    label="line-height"
                />
                <FormCss
                    id={`${target.key}-color`}
                    value={getOverrideField(target.selector, 'color')}
                    onChange={(e) => updateOverrideField(target.selector, 'color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="color"
                />
                <FormCss
                    id={`${target.key}-background-color`}
                    value={getOverrideField(target.selector, 'background-color')}
                    onChange={(e) => updateOverrideField(target.selector, 'background-color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="background-color"
                />
                <FormCss
                    id={`${target.key}-border-width`}
                    value={getOverrideField(target.selector, 'border-width')}
                    onChange={(e) => updateOverrideField(target.selector, 'border-width', e.target.value)}
                    placeholder="ex. 1px, 2px, 3px"
                    type="text"
                    label="border-width"
                />
                <FormCss
                    id={`${target.key}-border-style`}
                    value={getOverrideField(target.selector, 'border-style')}
                    onChange={(e) => updateOverrideField(target.selector, 'border-style', e.target.value)}
                    placeholder="ex. solid, dashed, dotted, double"
                    type="select"
                    label="border-style"
                />
                <FormCss
                    id={`${target.key}-border-color`}
                    value={getOverrideField(`.ce-header-${target.tag}`, 'border-color')}
                    onChange={(e) => updateOverrideField(`.ce-header-${target.tag}`, 'border-color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="border-color"
                />
                <FormCss
                    id={`${target.key}-border-radius`}
                    value={getOverrideField(target.selector, 'border-radius')}
                    onChange={(e) => updateOverrideField(target.selector, 'border-radius', e.target.value)}
                    placeholder="ex. 12px, 1rem, 20%"
                    type="text"
                    label="border-radius"
                />
                <FormCss
                    id={`${target.key}-margin`}
                    value={getOverrideField(target.selector, 'margin')}
                    onChange={(e) => updateOverrideField(target.selector, 'margin', e.target.value)}
                    placeholder="ex. 12px, 1rem, 20%"
                    type="text"
                    label="margin"
                />
                      
                <FormCss
                    id={`${target.key}-padding`}
                    value={getOverrideField(target.selector, 'padding')}
                    onChange={(e) => updateOverrideField(target.selector, 'padding', e.target.value)}
                    placeholder="ex. 12px, 1rem, 20%"
                    type="text"
                    label="padding"
                />

            </div>
        </>
    );
};

export default NodeHeaderFormRow;