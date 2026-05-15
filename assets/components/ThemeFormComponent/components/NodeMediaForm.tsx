import { useState } from 'react';
import _ from 'lodash';
import { FolderOpen } from 'lucide-react';
import { Media } from './Preview';
import FormCss from './FormCss';
import { useTheme } from '../ThemeContext';
import { FileManagerIframePicker } from '@/editeur/ManagerAsset/FileManagerIframePicker';
import type { FileItem } from '@/editeur/ManagerAsset/types';
import {
  DEFAULT_VIDEO_PLAYER_ICON_URL,
  isSvgPath,
  toRelativeWebPath,
  toThemePreviewAssetUrl,
} from '../utils';

const MEDIAS = {
  'node-image': '.ce-image',
  'node-video': '.ce-video',
} as Record<string, string>;

function VideoPlayerIconPreview({ url }: { url: string }) {
  const previewUrl = toThemePreviewAssetUrl(url);
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center"
      title={url}
    >
      <span
        className="ce-icon-video-play block h-10 w-10 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${previewUrl}")` }}
      />
    </div>
  );
}

export function NodeMediaForm() {
  const {
    getOverrideField,
    updateOverrideField,
    getVideoPlayerIconUrl,
    setVideoPlayerIconUrl,
    filemanagerUrl,
  } = useTheme();
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  const playerIconUrl = getVideoPlayerIconUrl();

  const applyPlayerIconUrl = (raw: string) => {
    const relative = toRelativeWebPath(raw);
    if (!isSvgPath(relative)) {
      window.alert('Seuls les fichiers SVG sont acceptés pour l’icône du lecteur vidéo.');
      return;
    }
    setVideoPlayerIconUrl(relative);
  };

  const handleSelectFile = (file: FileItem) => {
    applyPlayerIconUrl(file.url);
    setIsFileManagerOpen(false);
  };

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
                  {key === 'node-video' ? (
                    <div className="mt-4 space-y-2">
                      <div className="font-semibold my-0">Icône lecteur (SVG)</div>
                      <p className="text-xs text-muted-foreground">
                        Fichier dans <span className="font-mono">public/</span> (ex.{' '}
                        <span className="font-mono">public{DEFAULT_VIDEO_PLAYER_ICON_URL}</span> → URL{' '}
                        <span className="font-mono">{DEFAULT_VIDEO_PLAYER_ICON_URL}</span>) ou SVG de la
                        médiathèque (<span className="font-mono">/media/…</span>). Le basePath est ajouté à la
                        génération du CSS.
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <VideoPlayerIconPreview url={playerIconUrl} />
                        <input
                          type="text"
                          className="input input-bordered min-w-0 flex-1 font-mono text-sm"
                          value={playerIconUrl}
                          onChange={(e) => setVideoPlayerIconUrl(e.target.value)}
                          onBlur={(e) => applyPlayerIconUrl(e.target.value)}
                          placeholder={DEFAULT_VIDEO_PLAYER_ICON_URL}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-outline shrink-0"
                          onClick={() => setIsFileManagerOpen(true)}
                          disabled={!filemanagerUrl}
                          title="Choisir un SVG dans la médiathèque"
                        >
                          <FolderOpen className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
      {!!filemanagerUrl && (
        <FileManagerIframePicker
          open={isFileManagerOpen}
          onOpenChange={setIsFileManagerOpen}
          onSelectFile={handleSelectFile}
          filemanagerUrl={filemanagerUrl}
          type="image"
        />
      )}
    </>
  );
}

export default NodeMediaForm;
