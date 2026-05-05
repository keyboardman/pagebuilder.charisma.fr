import FormCss from './FormCss';
import { useTheme } from '../ThemeContext';

export function NodeMenuForm() {
    const { getOverrideField, updateOverrideField, getStyleFromOverride, getFonts } = useTheme();

    return (
        <details className="group border border-border rounded-lg">
            <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
                <span className="transition group-open:rotate-90">▶</span>
                NodeMenu
            </summary>
            <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
                <p className="text-sm text-muted-foreground pt-2">
                    Styles du bloc <span className="text-xs font-mono">.ce-menu</span> (NodeMenu, quelle que soit la balise
                    sous-jacente).

                </p>
                <div className="grid gap-2 grid-cols-2">
                    <div className="p-2 mb-2">
                        <p>Menu Navbar</p>
                        <div className="ce-menu ce-menu--navbar" style={getStyleFromOverride('.ce-menu--navbar')}>
                            <div className="ce-menu-content" style={getStyleFromOverride('.ce-menu--navbar .ce-menu-content')}>
                                <a href="#" className="ce-menu-item" style={getStyleFromOverride('.ce-nav-item')}>Item 1</a>
                                <a href="#" className="ce-menu-item" style={getStyleFromOverride('.ce-nav-item')}>Item 2</a>
                                <a href="#" className="ce-menu-item" style={getStyleFromOverride('.ce-nav-item')}>Item 3</a>
                            </div>
                        </div>
                    </div>
                    <div className="p-2 mb-2">
                        <div className="grid gap-2 grid-cols-3">
                            <FormCss
                                id={`ce-menu-navbar-background-color`}
                                value={getOverrideField('.ce-menu--navbar', 'background-color')}
                                onChange={(e) => updateOverrideField('.ce-menu--navbar', 'background-color', e.target.value)}
                                placeholder="var(--color-primary)"
                                type="color"
                                label="background-color"
                            />
                            <FormCss
                                id={`ce-menu-navbar-background-image`}
                                value={getOverrideField('.ce-menu--navbar', 'background-image')}
                                onChange={(e) => updateOverrideField('.ce-menu--navbar', 'background-image', e.target.value)}
                                placeholder="var(--color-primary)"
                                type="text"
                                label="background-image"
                            />
                            <FormCss
                                id={`ce-menu-navbar-padding`}
                                value={getOverrideField('.ce-menu--navbar .ce-menu-content', 'padding')}
                                onChange={(e) => updateOverrideField('.ce-menu--navbar .ce-menu-content', 'padding', e.target.value)}
                                placeholder=""
                                type="text"
                                label="padding"
                            />
                        </div>
                        <div className="grid gap-2 grid-cols-3">
                            <FormCss
                                id={`ce-nav-item-font-family`}
                                value={getOverrideField('.ce-nav-item', 'font-family')}
                                onChange={(e) => updateOverrideField('.ce-nav-item', 'font-family', e.target.value)}
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
                                id={`ce-nav-item-font-size`}
                                value={getOverrideField('.ce-nav-item', 'font-size')}
                                onChange={(e) => updateOverrideField('.ce-nav-item', 'font-size', e.target.value)}
                                placeholder="0.5rem"
                                type="text"
                                label="font-size"
                            />
                            <FormCss
                                id={`ce-nav-item-font-weight`}
                                value={getOverrideField('.ce-nav-item', 'font-weight')}
                                onChange={(e) => updateOverrideField('.ce-nav-item', 'font-weight', e.target.value)}
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
                                id={`ce-nav-item-line-height`}
                                value={getOverrideField('.ce-nav-item', 'line-height')}
                                onChange={(e) => updateOverrideField('.ce-nav-item', 'line-height', e.target.value)}
                                placeholder="ex. 1.5, 1.75"
                                type="text"
                                label="line-height"
                            />
                            <FormCss
                                id={`ce-nav-item-color`}
                                value={getOverrideField('.ce-nav-item', 'color')}
                                onChange={(e) => updateOverrideField('.ce-nav-item', 'color', e.target.value)}
                                placeholder="var(--color-primary)"
                                type="color"
                                label="color"
                            />
                        </div>

                    </div>
                </div>
                <div className="grid gap-2 grid-cols-2">
                    <div className="p-2 mb-2">
                        <p>Menu Burger</p>
                        <div
                            className="ce-menu-burger"
                            style={getStyleFromOverride('.ce-menu-burger')}
                        >
                            <a href="#" className="ce-menu-burger-item" style={getStyleFromOverride('.ce-menu-burger-item')}>Item 1</a>
                            <a href="#" className="ce-menu-burger-item" style={getStyleFromOverride('.ce-menu-burger-item')}>Item 2</a>
                            <a href="#" className="ce-menu-burger-item" style={getStyleFromOverride('.ce-menu-burger-item')}>Item 3</a>

                        </div>
                    </div>
                    <div className="p-2 mb-2">
                        <div className="grid gap-2 grid-cols-3">
                            <FormCss
                                id={`ce-menu-burger-background-color`}
                                value={getOverrideField('.ce-menu-burger', 'background-color')}
                                onChange={(e) => updateOverrideField('.ce-menu-burger', 'background-color', e.target.value)}
                                placeholder="var(--color-primary)"
                                type="color"
                                label="background-color"
                            />
                            <FormCss
                                id={`ce-menu-burger-padding`}
                                value={getOverrideField('.ce-menu-burger', 'padding')}
                                onChange={(e) => updateOverrideField('.ce-menu-burger', 'padding', e.target.value)}
                                placeholder="ex. 12px, 1rem, 20%"
                                type="text"
                                label="padding"
                            />
                            <FormCss
                                id={`ce-menu-burger-item-font-family`}
                                value={getOverrideField('.ce-menu-burger-item', 'font-family')}
                                onChange={(e) => updateOverrideField('.ce-menu-burger-item', 'font-family', e.target.value)}
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
                                id={`ce-menu-burger-item-font-size`}
                                value={getOverrideField('.ce-menu-burger-item', 'font-size')}
                                onChange={(e) => updateOverrideField('.ce-menu-burger-item', 'font-size', e.target.value)}
                                placeholder="0.5rem"
                                type="text"
                                label="font-size"
                            />
                            <FormCss
                                id={`ce-menu-burger-item-font-weight`}
                                value={getOverrideField('.ce-menu-burger-item', 'font-weight')}
                                onChange={(e) => updateOverrideField('.ce-menu-burger-item', 'font-weight', e.target.value)}
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
                                id={`ce-menu-burger-item-line-height`}
                                value={getOverrideField('.ce-menu-burger-item', 'line-height')}
                                onChange={(e) => updateOverrideField('.ce-menu-burger-item', 'line-height', e.target.value)}
                                placeholder="ex. 1.5, 1.75"
                                type="text"
                                label="line-height"
                            />
                            <FormCss
                                id={`ce-menu-burger-item-background-color`}
                                value={getOverrideField('.ce-menu-burger-item', 'color')}
                                onChange={(e) => updateOverrideField('.ce-menu-burger-item', 'color', e.target.value)}
                                placeholder="var(--color-primary)"
                                type="color"
                                label="color"
                            />

                        </div>
                    </div>
                </div>
                <div className="grid gap-2 grid-cols-2">
                    <div className="p-2 mb-2">
                        <p>Menu Liste</p>
                        <div
                            className="ce-menu--liste"
                            style={getStyleFromOverride('.ce-menu--liste')}
                        >
                            <div
                                className="ce-menu-content"
                                style={{
                                    display: 'flex',
                                    flexFlow: 'column wrap',
                                    justifyContent: 'flex-start',
                                    gap: '0rem'
                                }}
                            >
                                <a href="#" className="ce-nav-item" style={getStyleFromOverride('.ce-menu--liste .ce-nav-item')}>Item 1</a>
                                <a href="#" className="ce-nav-item" style={getStyleFromOverride('.ce-menu--liste .ce-nav-item')}>Item 2</a>
                                <a href="#" className="ce-nav-item" style={getStyleFromOverride('.ce-menu--liste .ce-nav-item')}>Item 3</a>
                            </div>

                        </div>
                    </div>
                    <div className="p-2 mb-2">
                        <div className="grid gap-2 grid-cols-3">
                            <FormCss
                                id={`ce-menu--liste-background-color`}
                                value={getOverrideField('.ce-menu--liste', 'background-color')}
                                onChange={(e) => updateOverrideField('.ce-menu--liste', 'background-color', e.target.value)}
                                placeholder="var(--font-family-base)"
                                type="color"
                                label="background-color"
                            />
                            <FormCss
                                id={`ce-menu--liste-padding`}
                                value={getOverrideField('.ce-menu--liste', 'padding')}
                                onChange={(e) => updateOverrideField('.ce-menu--liste', 'padding', e.target.value)}
                                placeholder="0.5rem"
                                type="text"
                                label="padding"
                            />
                            <FormCss
                                id={`ce-nav-item--liste-font-family`}
                                value={getOverrideField('.ce-menu--liste .ce-nav-item', 'font-family')}
                                onChange={(e) => updateOverrideField('.ce-menu--liste .ce-nav-item', 'font-family', e.target.value)}
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
                                id={`ce-nav-item--liste-font-size`}
                                value={getOverrideField('.ce-menu--liste .ce-nav-item', 'font-size')}
                                onChange={(e) => updateOverrideField('.ce-menu--liste .ce-nav-item', 'font-size', e.target.value)}
                                placeholder="0.5rem"
                                type="text"
                                label="font-size"
                            />
                            <FormCss
                                id={`ce-nav-item--liste-font-weight`}
                                value={getOverrideField('.ce-menu--liste .ce-nav-item', 'font-weight')}
                                onChange={(e) => updateOverrideField('.ce-menu--liste .ce-nav-item', 'font-weight', e.target.value)}
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
                                id={`ce-nav-item--liste-line-height`}
                                value={getOverrideField('.ce-menu--liste .ce-nav-item', 'line-height')}
                                onChange={(e) => updateOverrideField('.ce-menu--liste .ce-nav-item', 'line-height', e.target.value)}
                                placeholder="ex. 1.5, 1.75"
                                type="text"
                                label="line-height"
                            />
                            <FormCss
                                id={`ce-nav-item--liste-color`}
                                value={getOverrideField('.ce-menu--liste .ce-nav-item', 'color')}
                                onChange={(e) => updateOverrideField('.ce-menu--liste .ce-nav-item', 'color', e.target.value)}
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