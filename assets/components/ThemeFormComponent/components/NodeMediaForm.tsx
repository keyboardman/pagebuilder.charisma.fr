import _ from 'lodash';
import { Media } from './Preview';
import FormCss from './FormCss';
import { useTheme } from '../ThemeContext';

const MEDIAS = {
  'node-image': '.ce-image',
  'node-video': '.ce-video'
} as Record<string, string>;

function targetKey(target: string): string {
  return MEDIAS[target].trim();
}

export function NodeMediaForm() {

  const { getOverrideField, updateOverrideField } = useTheme();

  return (
    <>
      <details className="group border border-border rounded-lg">
        <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
          <span className="transition group-open:rotate-90">▶</span>
          NodeMedia
        </summary>
        <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
          <p className="text-sm text-muted-foreground pt-2">
            Styles media regroupes pour <span className="text-xs font-mono">.ce-image</span>,{' '}
            <span className="text-xs font-mono">.ce-video</span> et{' '}
            <span className="text-xs font-mono">.ce-youtube</span> (bordures et fond d&apos;arriere-plan).
          </p>
          <div className="space-y-6">
            {_.map(MEDIAS, (media, key) => (
              <div key={key} className="grid gap-2 grid-cols-4">
                <div className="space-y-1">
                  <Media type={key} />
                </div>
                <div className="space-y-1 col-span-3">
                  <div className="font-semibold my-0">Image</div>
                  <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-1">
                    <FormCss
                      id={`${key}-border-radius`}
                      value={getOverrideField(media, 'border-radius')}
                      onChange={(e) => updateOverrideField(media, 'border-radius', e.target.value)}
                      placeholder="0.5rem"
                      type="text"
                      label="border-radius"
                    />
                    <FormCss
                      id={`${key}-aspect-ratio`}
                      value={getOverrideField(media, 'aspect-ratio')}
                      onChange={(e) => updateOverrideField(media, 'aspect-ratio', e.target.value)}
                      placeholder="16/9"
                      type="text"
                      label="aspect-ratio"
                    />

                    <FormCss
                      id={`${key}-object-fit`}
                      value={getOverrideField(media, 'object-fit')}
                      onChange={(e) => updateOverrideField(media, 'object-fit', e.target.value)}
                      placeholder="cover"
                      type="select"
                      label="object-fit"
                    >
                      <option value="">— Object Fit —</option>
                      <option value="fill">fill</option>
                      <option value="contain">contain</option>
                      <option value="cover">cover</option>
                      <option value="none">none</option>
                      <option value="scale-down">scale-down</option>
                    </FormCss>
                  </div>
                  {key === 'node-video' ? (<>
                    <div className="font-semibold my-0">Icône</div>
                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 p-1">
                      <FormCss
                        id={`${key}-player-inner-border-radius`}
                        value={getOverrideField(`${targetKey(key)} .ce-video-icon-player-inner`, 'border-radius')}
                        onChange={(e) => updateOverrideField(`${targetKey(key)} .ce-video-icon-player-inner`, 'border-radius', e.target.value)}
                        placeholder="0.5rem"
                        type="text"
                        label="border-radius"
                      />
                      <FormCss
                        id={`${key}-player-inner-background-color`}
                        value={getOverrideField(`${targetKey(key)} .ce-video-icon-player-inner`, 'background-color')}
                        onChange={(e) => updateOverrideField(`${targetKey(key)} .ce-video-icon-player-inner`, 'background-color', e.target.value)}
                        placeholder="var(--color-primary)"
                        type="background-color"
                        label="background-color"
                      />
                      <FormCss
                        id={`${key}-icon-color`}
                        value={getOverrideField(`${targetKey(key)} .ce-icon`, 'background-color')}
                        onChange={(e) => updateOverrideField(`${targetKey(key)} .ce-icon`, 'background-color', e.target.value)}
                        placeholder="var(--color-primary)"
                        type="background-color"
                        label="background-color"
                      />
                    </div>
                  </>) : false}
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </>
  );
}

export default NodeMediaForm;
