import FormCss from './FormCss';
import { Card } from './Preview';
import _ from 'lodash';
import { useTheme } from '../ThemeContext';

type CSS_SELECTOR_TYPE = string;

const CARD_VARIANTS = ['left', 'top', 'right', 'overlay'];

const CARDS = {
  'left': '.ce-card-position-left',
  'top': '.ce-card-position-top',
  'right': '.ce-card-position-right',
  'overlay': '.ce-card-position-overlay',
} as Record<string, CSS_SELECTOR_TYPE>;

const PARTS = {
  'card': '',
  'image': '.ce-card-image',
  'container-content': '.ce-card-container-content',
  'title': '.ce-card-title',
  'text': '.ce-card-text',
  'label': '.ce-card-label',
} as Record<string, CSS_SELECTOR_TYPE>;


function targetKey(position: string, part: string): CSS_SELECTOR_TYPE {
  return `${CARDS[position]} ${PARTS[part]}`.trim();
}

export function NodeCardForm() {

  const { getFonts, getOverrideField, updateOverrideField, themeState } = useTheme();
  return (
    <div className="space-y-6">
      {
        _.map(CARD_VARIANTS, (variant: string) => (
          <div key={variant} className="grid gap-2 grid-cols-4">
            <div className="space-y-1">
              <div className="sticky top-20">
               
                <Card 
                  position={variant} 
                  isApi={false} 
                  overrides={themeState.node_overrides}
                />
              </div>
            </div>
            <div className="space-y-1 col-span-3">
              <div className="space-y-1 border border-border rounded-md">
                <div className="font-semibold my-0">Card</div>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-1">
                  <FormCss
                    id={`node-card-${variant}-gap`}
                    value={getOverrideField(targetKey(variant, 'card'), 'gap')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'card'), 'gap', e.target.value)}
                    placeholder="1rem"
                    type="text"
                    label="gap"
                  />
                  <FormCss
                    id={`node-card-${variant}-background-color`}
                    value={getOverrideField(targetKey(variant, 'card'), 'background-color')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'card'), 'background-color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="background-color"
                    label="background-color"
                    name={`config[node_overrides][${targetKey(variant, 'card')}][background-color]`}
                  />
                  <FormCss
                    id={`node-card-${variant}-border-radius`}
                    value={getOverrideField(targetKey(variant, 'card'), 'border-radius')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'card'), 'border-radius', e.target.value)}
                    placeholder="0.5rem"
                    type="text"
                    label="border-radius"
                  />
                  <FormCss
                    id={`node-card-${variant}-border-color`}
                    value={getOverrideField(targetKey(variant, 'card'), 'border-color')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'card'), 'border-color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="border-color"
                  />
                  <FormCss
                    id={`node-card-${variant}-border-width`}
                    value={getOverrideField(targetKey(variant, 'card'), 'border-width')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'card'), 'border-width', e.target.value)}
                    placeholder="1px"
                    type="text"
                    label="border-width"
                  />
                  <FormCss
                    id={`node-card-${variant}-border-style`}
                    value={getOverrideField(targetKey(variant, 'card'), 'border-style')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'card'), 'border-style', e.target.value)}
                    placeholder="solid"
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
                    id={`node-card-${variant}-padding`}
                    value={getOverrideField(targetKey(variant, 'card'), 'padding')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'card'), 'padding', e.target.value)}
                    placeholder="0.5rem"
                    type="text"
                    label="padding"
                  />
                </div>
              </div>
              <div className="space-y-4 border border-border rounded-md">
                <div className="font-semibold my-0">Image</div>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-1">
                  <FormCss
                    id={`node-card-${variant}-image-border-radius`}
                    value={getOverrideField(targetKey(variant, 'image'), 'border-radius')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'image'), 'border-radius', e.target.value)}
                    placeholder="0.5rem"
                    type="text"
                    label="border-radius"
                  />
                  <FormCss
                    id={`node-card-${variant}-image-aspect-ratio`}
                    value={getOverrideField(targetKey(variant, 'image'), 'aspect-ratio')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'image'), 'aspect-ratio', e.target.value)}
                    placeholder="16 / 9"
                    type="text"
                    label="aspect-ratio"
                  />
                </div>
              </div>
              <div className="space-y-4 border border-border rounded-md">
                <div className="font-semibold my-0">Container Content</div>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-1">
                  <FormCss
                    id={`node-card-${variant}-container-content-background-color`}
                    value={getOverrideField(targetKey(variant, 'container-content'), 'background-color')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'container-content'), 'background-color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="background-color"
                    label="background-color"
                  />
                  <FormCss
                    id={`node-card-${variant}-container-content-gap`}
                    value={getOverrideField(targetKey(variant, 'container-content'), 'gap')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'container-content'), 'gap', e.target.value)}
                    placeholder="1rem"
                    type="text"
                    label="gap"
                  />
                  <FormCss
                    id={`node-card-${variant}-container-content-padding`}
                    value={getOverrideField(targetKey(variant, 'container-content'), 'padding')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'container-content'), 'padding', e.target.value)}
                    placeholder="0.5rem"
                    type="text"
                    label="padding"
                  />
                  <FormCss
                    id={`node-card-${variant}-container-content-border-radius`}
                    value={getOverrideField(targetKey(variant, 'container-content'), 'border-radius')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'container-content'), 'border-radius', e.target.value)}
                    placeholder="0.5rem"
                    type="text"
                    label="border-radius"
                  />
                  <FormCss
                    id={`node-card-${variant}-container-content-border-color`}
                    value={getOverrideField(targetKey(variant, 'container-content'), 'border-color')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'container-content'), 'border-color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="border-color"
                  />
                  <FormCss
                    id={`node-card-${variant}-container-content-border-width`}
                    value={getOverrideField(targetKey(variant, 'container-content'), 'border-width')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'container-content'), 'border-width', e.target.value)}
                    placeholder="1px"
                    type="text"
                    label="border-width"
                  />
                </div>
              </div>
              <div className="space-y-4 border border-border rounded-md">
                <div className="font-semibold my-0">Titre</div>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-1">
                  <FormCss
                    id={`node-card-${variant}-title-font-family`}
                    value={getOverrideField(targetKey(variant, 'title'), 'font-family')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'title'), 'font-family', e.target.value)}
                    placeholder="var(--font-family-base)"
                    type="select"
                    label="font-family"
                  >
                    <option value="">— Font Family —</option>
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
                    id={`node-card-${variant}-title-font-size`}
                    value={getOverrideField(targetKey(variant, 'title'), 'font-size')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'title'), 'font-size', e.target.value)}
                    placeholder="var(--font-size-base)"
                    type="text"
                    label="font-size"
                  />
                  <FormCss
                    id={`node-card-${variant}-title-font-weight`}
                    value={getOverrideField(targetKey(variant, 'title'), 'font-weight')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'title'), 'font-weight', e.target.value)}
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
                    id={`node-card-${variant}-title-line-height`}
                    value={getOverrideField(targetKey(variant, 'title'), 'line-height')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'title'), 'line-height', e.target.value)}
                    placeholder="ex. 1.5, 1.75"
                    type="text"
                    label="line-height"
                  />
                  <FormCss
                    id={`node-card-${variant}-title-color`}
                    value={getOverrideField(targetKey(variant, 'title'), 'color')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'title'), 'color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="color"
                  />
                  <FormCss
                    id={`node-card-${variant}-title-line-clamp`}
                    value={getOverrideField(targetKey(variant, 'title'), 'line-clamp')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'title'), 'line-clamp', e.target.value)}
                    placeholder="2"
                    type="text"
                    label="line-clamp"
                  />
                </div>
              </div>
              <div className="space-y-4 border border-border rounded-md">
                <div className="font-semibold my-0">Texte</div>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-1">
                  <FormCss
                    id={`node-card-${variant}-text-font-family`}
                    value={getOverrideField(targetKey(variant, 'text'), 'font-family')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'text'), 'font-family', e.target.value)}
                    placeholder="var(--font-family-base)"
                    type="select"
                    label="font-family"
                  >
                    <option value="">— Font Family —</option>
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
                    id={`node-card-${variant}-text-font-size`}
                    value={getOverrideField(targetKey(variant, 'text'), 'font-size')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'text'), 'font-size', e.target.value)}
                    placeholder="var(--font-size-base)"
                    type="text"
                    label="font-size"
                  />
                  <FormCss
                    id={`node-card-${variant}-text-font-weight`}
                    value={getOverrideField(targetKey(variant, 'text'), 'font-weight')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'text'), 'font-weight', e.target.value)}
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
                    id={`node-card-${variant}-text-line-height`}
                    value={getOverrideField(targetKey(variant, 'text'), 'line-height')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'text'), 'line-height', e.target.value)}
                    placeholder="ex. 1.5, 1.75"
                    type="text"
                    label="line-height"
                  />
                  <FormCss
                    id={`node-card-${variant}-text-color`}
                    value={getOverrideField(targetKey(variant, 'text'), 'color')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'text'), 'color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="color"
                  />
                  <FormCss
                    id={`node-card-${variant}-text-line-clamp`}
                    value={getOverrideField(targetKey(variant, 'text'), 'line-clamp')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'text'), 'line-clamp', e.target.value)}
                    placeholder="2"
                    type="text"
                    label="line-clamp"
                  />
                </div>
              </div>
              <div className="space-y-4 border border-border rounded-md">
                <div className="font-semibold my-0">Label</div>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-1">
                  <FormCss
                    id={`node-card-${variant}-label-font-family`}
                    value={getOverrideField(targetKey(variant, 'label'), 'font-family')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'label'), 'font-family', e.target.value)}
                    placeholder="var(--font-family-base)"
                    type="select"
                    label="font-family"
                  >
                    <option value="">— Font Family —</option>
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
                    id={`node-card-${variant}-label-font-size`}
                    value={getOverrideField(targetKey(variant, 'label'), 'font-size')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'label'), 'font-size', e.target.value)}
                    placeholder="var(--font-size-base)"
                    type="text"
                    label="font-size"
                  />
                  <FormCss
                    id={`node-card-${variant}-label-font-weight`}
                    value={getOverrideField(targetKey(variant, 'label'), 'font-weight')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'label'), 'font-weight', e.target.value)}
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
                    id={`node-card-${variant}-label-line-height`}
                    value={getOverrideField(targetKey(variant, 'label'), 'line-height')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'label'), 'line-height', e.target.value)}
                    placeholder="ex. 1.5, 1.75"
                    type="text"
                    label="line-height"
                  />
                  <FormCss
                    id={`node-card-${variant}-label-color`}
                    value={getOverrideField(targetKey(variant, 'label'), 'color')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'label'), 'color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="color"
                  />
                  <FormCss
                    id={`node-card-${variant}-label-background-color`}
                    value={getOverrideField(targetKey(variant, 'label'), 'background-color')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'label'), 'background-color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="background-color"
                    label="background-color"
                  />
                  <FormCss
                    id={`node-card-${variant}-label-border-radius`}
                    value={getOverrideField(targetKey(variant, 'label'), 'border-radius')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'label'), 'border-radius', e.target.value)}
                    placeholder="0.5rem"
                    type="text"
                    label="border-radius"
                  />
                  <FormCss
                    id={`node-card-${variant}-label-border-width`}
                    value={getOverrideField(targetKey(variant, 'label'), 'border-width')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'label'), 'border-width', e.target.value)}
                    placeholder="0.5rem"
                    type="text"
                    label="border-width"
                  />
                  <FormCss
                    id={`node-card-${variant}-label-border-color`}
                    value={getOverrideField(targetKey(variant, 'label'), 'border-color')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'label'), 'border-color', e.target.value)}
                    placeholder="var(--color-primary)"
                    type="color"
                    label="border-color"
                  />
                  <FormCss
                    id={`node-card-${variant}-label-padding`}
                    value={getOverrideField(targetKey(variant, 'label'), 'padding')}
                    onChange={(e) => updateOverrideField(targetKey(variant, 'label'), 'padding', e.target.value)}
                    placeholder="0.5rem"
                    type="text"
                    label="padding"
                  />
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default NodeCardForm;
