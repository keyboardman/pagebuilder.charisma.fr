import { type FC, useState, useRef } from 'react';
import { Progress } from "@editeur/components/ui/progress";
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onUpload: (
    file: File,
    onProgress?: (progress: number) => void,
    onStatus?: (message: string) => void
  ) => Promise<void>;
  disabled?: boolean;
  acceptedTypes?: string;
}

const FileUpload: FC<FileUploadProps> = ({ onUpload, disabled = false, acceptedTypes }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    setStatusMessage('Initialisation de l’upload...');

    try {
      await onUpload(
        file,
        (progress) => {
          setUploadProgress(progress);
        },
        (status) => {
          setStatusMessage(status);
        }
      );
      setUploadProgress(null);
      setStatusMessage('Upload terminé');
      setTimeout(() => setStatusMessage(null), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
      setUploadProgress(null);
      setStatusMessage(null);
    } finally {
      setIsUploading(false);
    }

    // Réinitialiser l'input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          accept={acceptedTypes}
          disabled={disabled || isUploading}
        />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {isUploading ? 'Upload en cours...' : 'Glissez-déposez un fichier ou cliquez pour sélectionner'}
        </p>
      </div>

      {uploadProgress !== null && (
        <div className="space-y-1">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-xs text-muted-foreground text-center">
            {uploadProgress}%
          </p>
        </div>
      )}

      {statusMessage && (
        <p className="text-xs text-muted-foreground text-center">
          {statusMessage}
        </p>
      )}

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;

