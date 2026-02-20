import { useState } from "react";
import Form from "../../components/form";
import { Button } from "@editeur/components/ui/button";
import { ImageIcon } from "lucide-react";
import { FileManagerIframePicker } from "../../ManagerAsset/FileManagerIframePicker";
import type { FileItem } from "../../ManagerAsset/types";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";

function toAbsoluteUrl(url: string): string {
    if (typeof window === "undefined" || !url) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${window.location.origin}${path}`;
}

export interface Background2SettingsProps {
    style: React.CSSProperties;
    onChange: (style: React.CSSProperties) => void;
}

export function Background2Settings({ style, onChange }: Background2SettingsProps) {
    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
    const { fileManagerConfig } = useAppContext();

    const handleSelectImage = (file: FileItem) => {
        const absoluteUrl = toAbsoluteUrl(file.url);
        onChange({
            ...style,
            backgroundImage: `url(${absoluteUrl})`,
            backgroundPosition: style?.backgroundPosition ?? "center",
        });
        setIsFileManagerOpen(false);
    };

    return (
        <div className="flex flex-col gap-1 mb-2 mt-1">
            <div className="text-center text-sm py-0 leading-tight text-white bg-gray-200/50">Background</div>

            <Form.Group className="mb-0">
                <Form.Label text="background-image" className="text-foreground" />
                <div className="flex gap-1">
                    <Form.Input
                        type="text"
                        value={style?.backgroundImage?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, backgroundImage: value as React.CSSProperties["backgroundImage"] })}
                        className="h-7 text-sm flex-1 min-w-0"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => setIsFileManagerOpen(true)}
                        title="Choisir une image"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                    <FileManagerIframePicker
                        open={isFileManagerOpen}
                        onOpenChange={setIsFileManagerOpen}
                        onSelectFile={handleSelectImage}
                        filemanagerUrl={fileManagerConfig?.filemanagerUrl ?? ''}
                        resolveUrl={fileManagerConfig?.resolveUrl}
                        type="image"
                    />
                </div>
            </Form.Group>
            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="color" className="text-foreground" />
                    <Form.InputColor
                        type="text"
                        value={style?.backgroundColor?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, backgroundColor: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="position" className="text-foreground" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'top', value: 'top' },
                        { label: 'left', value: 'left' },
                        { label: 'center', value: 'center' },
                        { label: 'right', value: 'right' },
                        { label: 'bottom', value: 'bottom' }
                    ]}
                        value={style?.backgroundPosition?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, backgroundPosition: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
            <div className="flex flex-1">
                <Form.Group className="mb-0">
                    <Form.Label text="size" className="text-foreground" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'cover', value: 'cover' },
                        { label: 'contain', value: 'contain' }
                    ]}
                        value={style?.backgroundSize?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, backgroundSize: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
                <Form.Group className="mb-0">
                    <Form.Label text="repeat" className="text-foreground" />
                    <Form.Select options={[
                        { label: '...', value: '' },
                        { label: 'repeat', value: 'repeat' },
                        { label: 'no-repeat', value: 'no-repeat' },
                        { label: 'repeat-x', value: 'repeat-x' },
                        { label: 'repeat-y', value: 'repeat-y' }
                    ]}
                        value={style?.backgroundRepeat?.toString() ?? ""}
                        onChange={(value) => onChange({ ...style, backgroundRepeat: value })}
                        className="h-7 text-sm"
                    />
                </Form.Group>
            </div>
        </div>
    )
}