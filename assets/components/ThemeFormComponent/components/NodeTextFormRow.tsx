import FormCss from './FormCss';
import { useTheme } from '../ThemeContext';

const NodeTextFormRow = () => {

    const { getOverrideField, updateOverrideField, getFonts } = useTheme();

    return (
        <>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                <FormCss
                    id={`node-text-font-family`}
                    value={getOverrideField('.ce-text', 'font-family')}
                    onChange={(e) => updateOverrideField('.ce-text', 'font-family', e.target.value)}
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
                    id={`node-text-font-size`}
                    value={getOverrideField('.ce-text', 'font-size')}
                    onChange={(e) => updateOverrideField('.ce-text', 'font-size', e.target.value)}
                    placeholder="var(--font-size-base)"
                    type="text"
                    label="font-size"
                />
                <FormCss
                    id={`node-text-font-weight`}
                    value={getOverrideField('.ce-text', 'font-weight')}
                    onChange={(e) => updateOverrideField('.ce-text', 'font-weight', e.target.value)}
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
                    id={`node-text-line-height`}
                    value={getOverrideField('.ce-text', 'line-height')}
                    onChange={(e) => updateOverrideField('.ce-text', 'line-height', e.target.value)}
                    placeholder="ex. 1.5, 1.75"
                    type="text"
                    label="line-height"
                />
                <FormCss
                    id={`node-text-color`}
                    value={getOverrideField('.ce-text', 'color')}
                    onChange={(e) => updateOverrideField('.ce-text', 'color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="color"
                />
                <FormCss
                    id={`node-text-background-color`}
                    value={getOverrideField('.ce-text', 'background-color')}
                    onChange={(e) => updateOverrideField('.ce-text', 'background-color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="background-color"
                />
                <FormCss
                    id={`node-text-border-width`}
                    value={getOverrideField('.ce-text', 'border-width')}
                    onChange={(e) => updateOverrideField('.ce-text', 'border-width', e.target.value)}
                    placeholder="ex. 1px, 2px, 3px"
                    type="text"
                    label="border-width"
                />
                <FormCss
                    id={`node-text-border-style`}
                    value={getOverrideField('.ce-text', 'border-style')}
                    onChange={(e) => updateOverrideField('.ce-text', 'border-style', e.target.value)}
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
                <FormCss
                    id={`node-text-border-color`}
                    value={getOverrideField('.ce-text', 'border-color')}
                    onChange={(e) => updateOverrideField('.ce-text', 'border-color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="border-color"
                />
                <FormCss
                    id={`node-text-border-radius`}
                    value={getOverrideField('.ce-text', 'border-radius')}
                    onChange={(e) => updateOverrideField('.ce-text', 'border-radius', e.target.value)}
                    placeholder="ex. 12px, 1rem, 20%"
                    type="text"
                    label="border-radius"
                />
                <FormCss
                    id={`node-text-margin`}
                    value={getOverrideField('.ce-text', 'margin')}
                    onChange={(e) => updateOverrideField('.ce-text', 'margin', e.target.value)}
                    placeholder="ex. 12px, 1rem, 20%"
                    type="text"
                    label="margin"
                />
                <FormCss
                    id={`node-text-padding`}
                    value={getOverrideField('.ce-text', 'padding')}
                    onChange={(e) => updateOverrideField('.ce-text', 'padding', e.target.value)}
                    placeholder="ex. 12px, 1rem, 20%"
                    type="text"
                    label="padding"
                />

            </div>
        </>
    );
};

export default NodeTextFormRow;