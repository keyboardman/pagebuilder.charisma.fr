import { type FC, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/editeur/components/ui/dialog';
import type { FileItem } from './types';

const POST_MESSAGE_TYPE = 'filemanager:selected';

interface FileManagerIframePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFile: (file: FileItem) => void;
  filemanagerUrl: string;
  type?: string;
}

export const FileManagerIframePicker: FC<FileManagerIframePickerProps> = ({
  open,
  onOpenChange,
  onSelectFile,
  filemanagerUrl,
  type,
}) => {

  const handleParentOrigin = useCallback((event: MessageEvent) => {

    if (event.origin !== window.location.origin) {
      return;
    }
    if (event.data?.type !== 'REQUEST_PARENT_ORIGIN') return;

    event.source?.postMessage({ type: 'PARENT_ORIGIN', origin: window.location.origin }, { targetOrigin: event.origin } );
  }, []);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const data = event.data;
      if (!data || data.type !== POST_MESSAGE_TYPE) {
        return;
      }
      const { file } = data;
      if (typeof file !== 'string' || file === '') {
        return;
      }
      onSelectFile({
        url: file ?? ''
      });

    },
    [onSelectFile, onOpenChange]
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("message", handleParentOrigin);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener("message", handleParentOrigin);
      window.removeEventListener('message', handleMessage);
    }
  }, [open]);


  const params: Record<string, string> = {
    mode: 'iframe',
    media: type ?? '',
    crossdomain: 'true',
    target: 'my-file', // nécessaire même si on ne s'en sert pas
  };

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
