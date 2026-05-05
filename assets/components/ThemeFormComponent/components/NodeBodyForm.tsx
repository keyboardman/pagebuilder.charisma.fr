import FormCss from './FormCss';
import { useTheme } from '../ThemeContext';

export const NodeBodyForm = () => {

    const { getOverrideField, updateOverrideField, getStyleFromOverride, getFonts } = useTheme();

    return (
        <details className="group border border-border rounded-lg">
            
            <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
                <span className="transition group-open:rotate-90">▶</span>
                Body
            </summary>

            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border">
                <p style={getStyleFromOverride('body')}>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                </p>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                    <FormCss
                        id={`node-body-font-family`}
                        value={getOverrideField('body', 'font-family')}
                        onChange={(e) => updateOverrideField('body', 'font-family', e.target.value)}
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
                        id={`node-body-font-size`}
                        value={getOverrideField('body', 'font-size')}
                        onChange={(e) => updateOverrideField('body', 'font-size', e.target.value)}
                        placeholder="var(--font-size-base)"
                        type="text"
                        label="font-size"
                    />
                    <FormCss
                        id={`node-body-font-weight`}
                        value={getOverrideField('body', 'font-weight')}
                        onChange={(e) => updateOverrideField('body', 'font-weight', e.target.value)}
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
                        id={`node-body-line-height`}
                        value={getOverrideField('body', 'line-height')}
                        onChange={(e) => updateOverrideField('body', 'line-height', e.target.value)}
                        placeholder="ex. 1.5, 1.75"
                        type="text"
                        label="line-height"
                    />
                    <FormCss
                        id={`node-body-color`}
                        value={getOverrideField('body', 'color')}
                        onChange={(e) => updateOverrideField('body', 'color', e.target.value)}
                        placeholder="var(--color-primary)"
                        type="color"
                        label="color"
                    />
                    <FormCss
                        id={`node-body-background-color`}
                        value={getOverrideField('body', 'background-color')}
                        onChange={(e) => updateOverrideField('body', 'background-color', e.target.value)}
                        placeholder="var(--color-primary)"
                        type="color"
                        label="background-color"
                    />
                    <FormCss
                        id={`node-body-border-width`}
                        value={getOverrideField('body', 'border-width')}
                        onChange={(e) => updateOverrideField('body', 'border-width', e.target.value)}
                        placeholder="ex. 1px, 2px, 3px"
                        type="text"
                        label="border-width"
                    />
                    <FormCss
                        id={`node-body-border-style`}
                        value={getOverrideField('body', 'border-style')}
                        onChange={(e) => updateOverrideField('body', 'border-style', e.target.value)}
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
                        id={`node-body-border-color`}
                        value={getOverrideField('body', 'border-color')}
                        onChange={(e) => updateOverrideField('body', 'border-color', e.target.value)}
                        placeholder="var(--color-primary)"
                        type="color"
                        label="border-color"
                    />
                    <FormCss
                        id={`node-body-border-radius`}
                        value={getOverrideField('body', 'border-radius')}
                        onChange={(e) => updateOverrideField('body', 'border-radius', e.target.value)}
                        placeholder="ex. 12px, 1rem, 20%"
                        type="text"
                        label="border-radius"
                    />
                    <FormCss
                        id={`node-body-margin`}
                        value={getOverrideField('body', 'margin')}
                        onChange={(e) => updateOverrideField('body', 'margin', e.target.value)}
                        placeholder="ex. 12px, 1rem, 20%"
                        type="text"
                        label="margin"
                    />
                    <FormCss
                        id={`node-body-padding`}
                        value={getOverrideField('body', 'padding')}
                        onChange={(e) => updateOverrideField('body', 'padding', e.target.value)}
                        placeholder="ex. 12px, 1rem, 20%"
                        type="text"
                        label="padding"
                    />
                </div>
            </div>
        </details>
    );
};

export default NodeBodyForm;