import { useState } from 'react';
import { Input } from './Input';
import { Button } from "@editeur/components/ui/button";
import { FolderOpen } from 'lucide-react';
import { useAppContext, APP_MODE } from '../../services/providers/AppContext';
import { FileManagerIframePicker } from '../../ManagerAsset/FileManagerIframePicker';
import type { FileItem } from '../../ManagerAsset/types';

type InputFileProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value?: string;
  onChange?: (value: string) => void;
  acceptedTypes?: string;
  typeMedia?: string;
};

export function InputFile({ value, onChange, acceptedTypes, typeMedia, ...rest }: InputFileProps) {
  const { fileManagerConfig } = useAppContext();
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  const handleSelectFile = (file: FileItem) => {
    onChange?.(file.url);
    setIsFileManagerOpen(false);
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        value={value ?? ''}
        onChange={(value: string) => onChange?.(value)}
        className="flex-1"
        {...rest}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setIsFileManagerOpen(true)}
        title="Ouvrir le gestionnaire de fichiers"
      >
        <FolderOpen className="h-4 w-4" />
      </Button>
      <FileManagerIframePicker
        open={isFileManagerOpen}
        onOpenChange={setIsFileManagerOpen}
        onSelectFile={handleSelectFile}
        filemanagerUrl={fileManagerConfig!.filemanagerUrl!}
        resolveUrl={fileManagerConfig!.resolveUrl!}
        type={typeMedia}
      />
    </div>
  );
}

