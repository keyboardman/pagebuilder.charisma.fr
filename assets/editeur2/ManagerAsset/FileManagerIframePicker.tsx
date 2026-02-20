import { type FC, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@editeur/components/ui/dialog';
import type { FileItem } from './types';

const POST_MESSAGE_TYPE = 'keyboardman.filemanager.picked';

interface FileManagerIframePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFile: (file: FileItem) => void;
  filemanagerUrl: string;
  resolveUrl?: string;
  type?: string;
}

export const FileManagerIframePicker: FC<FileManagerIframePickerProps> = ({
  open,
  onOpenChange,
  onSelectFile,
  filemanagerUrl,
  resolveUrl,
  type,
}) => {

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }


      const data = event.data;
      if (!data || data.type !== POST_MESSAGE_TYPE) {
        return;
      }
      const { path: pathVal, filesystem } = data;
      if (typeof pathVal !== 'string' || pathVal === '') {
        return;
      }
      const fs = typeof filesystem === 'string' && filesystem !== '' ? filesystem : 'default';
      const _resolveUrl = `${resolveUrl}?filesystem=${encodeURIComponent(fs)}&path=${encodeURIComponent(pathVal)}`;

      fetch(_resolveUrl)
        .then((res) => res.json())
        .then((json: { url?: string }) => {
          const url = typeof json?.url === 'string' ? json.url : '';
          if (url) {
            const name = pathVal.split('/').pop() ?? pathVal;
            onSelectFile({
              id: pathVal,
              name,
              url,
              type: 'file',
              path: pathVal,
            });
            onOpenChange(false);
          }
        })
        .catch((err) => {
          console.error('Erreur résolution URL filemanager:', err);
        });
    },
    [onSelectFile, onOpenChange]
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [open, handleMessage]);

  const params: Record<string, string> = {
    picker: String(1),
    channel: 'form_fileUrl',
    resolve_url: resolveUrl ? '' : ''
  };

  if (type) {
    params['filter[type]'] = type;
  }

  const url = new URL(filemanagerUrl);
  url.search = new URLSearchParams(params).toString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="file-manager-ui p-0 flex flex-col w-[calc(100vw-40px)] h-[calc(100vh-40px)] max-w-[calc(100vw-40px)] max-h-[calc(100vh-40px)] left-[20px] top-[20px] translate-x-0 translate-y-0"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Choisir un fichier</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 relative">
          <iframe
            title="File manager"
            src={url.toString()}
            className="absolute inset-0 w-full h-full border-0 rounded"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
