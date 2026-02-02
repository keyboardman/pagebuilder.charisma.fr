import { useState } from 'react';
import { Input } from './Input';
import { Button } from "@editeur/components/ui/button";
import { FolderOpen } from 'lucide-react';
import { useAppContext, APP_MODE } from '../../services/providers/AppContext';
import FileManager from '../../ManagerAsset/FileManager';
import { useFileManager } from '../../ManagerAsset/hooks/useFileManager';
import type { FileItem } from '../../ManagerAsset/types';

type InputFileProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value?: string;
  onChange?: (value: string) => void;
  acceptedTypes?: string;
};

export function InputFile({ value, onChange, acceptedTypes, ...rest }: InputFileProps) {
  const { mode } = useAppContext();
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const fileService = useFileManager();

  const isViewMode = mode === APP_MODE.VIEW;
  const isDisabled = rest.disabled || isViewMode;

  const handleSelectFile = (file: FileItem) => {
    onChange?.(file.url);
    setIsFileManagerOpen(false);
  };

  if (!fileService) {
    // Si le filemanager n'est pas configuré, afficher un input normal
    return (
      <Input
        type="text"
        value={value ?? ''}
        onChange={(value: string) => onChange?.(value)}
        disabled={isDisabled}
        {...rest}
      />
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        value={value ?? ''}
        onChange={(value: string) => onChange?.(value)}
        disabled={isDisabled}
        readOnly={isViewMode}
        className="flex-1"
        {...rest}
      />
      {!isViewMode && (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsFileManagerOpen(true)}
            disabled={isDisabled}
            title="Ouvrir le gestionnaire de fichiers"
          >
            <FolderOpen className="h-4 w-4" />
          </Button>
          <FileManager
            open={isFileManagerOpen}
            onOpenChange={setIsFileManagerOpen}
            onSelectFile={handleSelectFile}
            fileService={fileService}
            acceptedTypes={acceptedTypes}
          />
        </>
      )}
    </div>
  );
}

