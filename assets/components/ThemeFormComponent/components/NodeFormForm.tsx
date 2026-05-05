import FormCss from './FormCss';
import { useTheme } from '../ThemeContext';

export function NodeFormForm() {

    const { getOverrideField, updateOverrideField, getStyleFromOverride, getFonts } = useTheme();

    return (
        <details className="group border border-border rounded-lg">
            <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
                <span className="transition group-open:rotate-90">▶</span>
                NodeForm
            </summary>
            <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
                <p className="text-sm text-muted-foreground pt-2">
                    Styles du bloc <span className="text-xs font-mono">.ce-form</span> (NodeForm, quelle que soit la balise
                    sous-jacente).
                </p>
                <div className="grid gap-2 grid-cols-4">
                    <div className="p-2 mb-2">
                        <div className="ce-form-field ce-form-field-input" style={getStyleFromOverride('.ce-form-field')}>
                            <label htmlFor="ce-form-field-input-label" style={getStyleFromOverride('.ce-form-label')}>Label</label>
                            <input
                                type="text"
                                className="ce-form-control"
                                placeholder="ex. Nom"
                                style={getStyleFromOverride('.ce-form-control')}
                                value="input value"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="col-span-3">
                        <h2 className="font-bold my-0">Label</h2>
                        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-2">
                            
                            <FormCss
                                id={`ce-form-label-font-family`}
                                value={getOverrideField('.ce-form-label', 'font-family')}
                                onChange={(e) => updateOverrideField('.ce-form-label', 'font-family', e.target.value)}
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
                                id={`ce-form-label-font-size`}
                                value={getOverrideField('.ce-form-label', 'font-size')}
                                onChange={(e) => updateOverrideField('.ce-form-label', 'font-size', e.target.value)}
                                placeholder="0.5rem"
                                type="text"
                                label="font-size"
                            />
                            <FormCss
                                id={`ce-form-label-font-weight`}
                                value={getOverrideField('.ce-form-label', 'font-weight')}
                                onChange={(e) => updateOverrideField('.ce-form-label', 'font-weight', e.target.value)}
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
                                id={`ce-form-label-line-height`}
                                value={getOverrideField('.ce-form-label', 'line-height')}
                                onChange={(e) => updateOverrideField('.ce-form-label', 'line-height', e.target.value)}
                                placeholder="ex. 1.5, 1.75"
                                type="text"
                                label="line-height"
                            />
                            <FormCss
                                id={`ce-form-label-color`}
                                value={getOverrideField('.ce-form-label', 'color')}
                                onChange={(e) => updateOverrideField('.ce-form-label', 'color', e.target.value)}
                                placeholder="var(--color-primary)"
                                type="color"
                                label="color"
                            />
                            <FormCss
                                id={`ce-form-field-gap`}
                                value={getOverrideField('.ce-form-field', 'gap')}
                                onChange={(e) => updateOverrideField('.ce-form-field', 'gap', e.target.value)}
                                placeholder="0.5rem"
                                type="text"
                                label="gap"
                            />
                        </div>
                        <h2 className="font-bold my-0">Input</h2>
                        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                            <FormCss
                                id={`ce-form-control-font-family`}
                                value={getOverrideField('.ce-form-control', 'font-family')}
                                onChange={(e) => updateOverrideField('.ce-form-control', 'font-family', e.target.value)}
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
                                id={`ce-form-control-font-size`}
                                value={getOverrideField('.ce-form-control', 'font-size')}
                                onChange={(e) => updateOverrideField('.ce-form-control', 'font-size', e.target.value)}
                                placeholder="0.5rem"
                                type="text"
                                label="font-size"
                            />
                            <FormCss
                                id={`ce-form-control-font-weight`}
                                value={getOverrideField('.ce-form-control', 'font-weight')}
                                onChange={(e) => updateOverrideField('.ce-form-control', 'font-weight', e.target.value)}
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
                                id={`ce-form-control-line-height`}
                                value={getOverrideField('.ce-form-control', 'line-height')}
                                onChange={(e) => updateOverrideField('.ce-form-control', 'line-height', e.target.value)}
                                placeholder="ex. 1.5, 1.75"
                                type="text"
                                label="line-height"
                            />

                            <FormCss
                                id={`ce-form-control-color`}
                                value={getOverrideField('.ce-form-control', 'color')}
                                onChange={(e) => updateOverrideField('.ce-form-control', 'color', e.target.value)}
                                placeholder="var(--color-primary)"
                                type="color"
                                label="color"
                            />
                            <FormCss
                                id={`ce-form-control-border-radius`}
                                value={getOverrideField('.ce-form-control', 'border-radius')}
                                onChange={(e) => updateOverrideField('.ce-form-control', 'border-radius', e.target.value)}
                                placeholder="ex. 12px, 1rem"
                                type="text"
                                label="border-radius"
                            />
                            <FormCss
                                id={`ce-form-control-padding`}
                                value={getOverrideField('.ce-form-control', 'padding')}
                                onChange={(e) => updateOverrideField('.ce-form-control', 'padding', e.target.value)}
                                placeholder="ex. 12px, 1rem"
                                type="text"
                                label="padding"
                            />
                        </div>
                    </div>

                </div>
                <div className="grid gap-2 grid-cols-4">
                    <div className="p-2 mb-2">
                        <fieldset style={getStyleFromOverride('.ce-form-field')}>
                            <legend style={getStyleFromOverride('.ce-form-label')}>Label</legend>
                            <div className="ce-form-radio-options">
                                <div className="ce-form-radio-row">
                                    <input type="radio" />
                                    <label style={getStyleFromOverride('.ce-form-radio-label')} >Option 1</label>
                                </div>
                                <div className="ce-form-radio-row">
                                    <input type="radio" />
                                    <label style={getStyleFromOverride('.ce-form-radio-label')}>Option 2</label>
                                </div> 
                            </div>
                        </fieldset>
                        
                    </div>
                    <div className="col-span-3">
                        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                            <FormCss
                                id={`ce-form-radio-label-font-family`}
                                value={getOverrideField('.ce-form-radio-label', 'font-family')}
                                onChange={(e) => updateOverrideField('.ce-form-radio-label', 'font-family', e.target.value)}
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
                                id={`ce-form-radio-label-font-size`}
                                value={getOverrideField('.ce-form-radio-label', 'font-size')}
                                onChange={(e) => updateOverrideField('.ce-form-radio-label', 'font-size', e.target.value)}
                                placeholder="0.5rem"
                                type="text"
                                label="font-size"
                            />
                            <FormCss
                                id={`ce-form-radio-label-font-weight`}
                                value={getOverrideField('.ce-form-radio-label', 'font-weight')}
                                onChange={(e) => updateOverrideField('.ce-form-radio-label', 'font-weight', e.target.value)}
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
                                id={`ce-form-radio-label-line-height`}
                                value={getOverrideField('.ce-form-radio-label', 'line-height')}
                                onChange={(e) => updateOverrideField('.ce-form-radio-label', 'line-height', e.target.value)}
                                placeholder="ex. 1.5, 1.75"
                                type="text"
                                label="line-height"
                            />
                            <FormCss
                                id={`ce-form-radio-label-color`}
                                value={getOverrideField('.ce-form-radio-label', 'color')}
                                onChange={(e) => updateOverrideField('.ce-form-radio-label', 'color', e.target.value)}
                                placeholder="var(--color-primary)"
                                type="color"
                                label="color"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </details>
    );
}