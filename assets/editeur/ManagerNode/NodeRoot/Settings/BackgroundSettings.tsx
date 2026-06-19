import { useState, type FC } from "react";
import Form from "../../../components/form";
import { Button } from "@/editeur/components/ui/button";
import { ImageIcon, Film } from "lucide-react";
import { FileManagerIframePicker } from "../../../ManagerAsset/FileManagerIframePicker";
import type { FileItem } from "../../../ManagerAsset/types";
import { useAppContext } from "../../../services/providers/AppContext";
import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import type { NodeRootBackground, NodeRootType } from "../index";
import { DEFAULT_NODE_ROOT_BACKGROUND, toAbsoluteUrl } from "../backgroundUtils";

type BackgroundType = NodeRootBackground["type"];

const BACKGROUND_TYPE_OPTIONS: { label: string; value: BackgroundType }[] = [
  { label: "Thème (défaut)", value: "default" },
  { label: "Couleur", value: "color" },
  { label: "Image", value: "image" },
  { label: "Vidéo", value: "video" },
];

const POSITION_OPTIONS = [
  { label: "center", value: "center" },
  { label: "top", value: "top" },
  { label: "left", value: "left" },
  { label: "right", value: "right" },
  { label: "bottom", value: "bottom" },
];

const SIZE_OPTIONS = [
  { label: "cover", value: "cover" },
  { label: "contain", value: "contain" },
];

const REPEAT_OPTIONS = [
  { label: "no-repeat", value: "no-repeat" },
  { label: "repeat", value: "repeat" },
  { label: "repeat-x", value: "repeat-x" },
  { label: "repeat-y", value: "repeat-y" },
];

const OBJECT_FIT_OPTIONS = [
  { label: "cover", value: "cover" },
  { label: "contain", value: "contain" },
];

function createBackgroundForType(type: BackgroundType): NodeRootBackground {
  switch (type) {
    case "color":
      return { type: "color", color: "" };
    case "image":
      return {
        type: "image",
        url: "",
        position: "center",
        size: "cover",
        repeat: "no-repeat",
      };
    case "video":
      return {
        type: "video",
        url: "",
        objectFit: "cover",
        objectPosition: "center",
      };
    default:
      return DEFAULT_NODE_ROOT_BACKGROUND;
  }
}

const BackgroundSettings: FC = () => {
  const { node, onChange } = useNodeBuilderContext();
  const rootNode = node as NodeRootType;
  const { fileManagerConfig } = useAppContext();
  const background = rootNode.content?.background ?? DEFAULT_NODE_ROOT_BACKGROUND;
  const backgroundType = background.type;

  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [videoPickerOpen, setVideoPickerOpen] = useState(false);
  const [posterPickerOpen, setPosterPickerOpen] = useState(false);

  const updateBackground = (next: NodeRootBackground) => {
    onChange({
      ...node,
      content: {
        ...rootNode.content,
        background: next,
      },
    });
  };

  const handleTypeChange = (type: BackgroundType) => {
    updateBackground(createBackgroundForType(type));
  };

  const handleSelectImage = (file: FileItem) => {
    if (background.type !== "image") return;
    updateBackground({
      ...background,
      url: toAbsoluteUrl(file.url),
    });
    setImagePickerOpen(false);
  };

  const handleSelectVideo = (file: FileItem) => {
    if (background.type !== "video") return;
    updateBackground({
      ...background,
      url: toAbsoluteUrl(file.url),
    });
    setVideoPickerOpen(false);
  };

  const handleSelectPoster = (file: FileItem) => {
    if (background.type !== "video") return;
    updateBackground({
      ...background,
      poster: toAbsoluteUrl(file.url),
    });
    setPosterPickerOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Form.Group>
        <Form.Label text="Type d'arrière-plan" />
        <Form.Select
          options={BACKGROUND_TYPE_OPTIONS}
          value={backgroundType}
          onChange={(value) => handleTypeChange(value as BackgroundType)}
          className="h-7 text-sm"
        />
      </Form.Group>

      {backgroundType === "color" && background.type === "color" ? (
        <Form.Group>
          <Form.Label text="Couleur" />
          <Form.InputColor
            value={background.color ?? ""}
            onChange={(value) => updateBackground({ ...background, color: value })}
            placeholder="ex: #ffffff, var(--background)"
          />
        </Form.Group>
      ) : null}

      {backgroundType === "image" && background.type === "image" ? (
        <>
          <Form.Group>
            <Form.Label text="Image" />
            <div className="flex gap-1">
              <Form.Input
                type="text"
                value={background.url ?? ""}
                onChange={(value) => updateBackground({ ...background, url: value })}
                placeholder="URL de l'image"
                className="h-7 text-sm flex-1 min-w-0"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => setImagePickerOpen(true)}
                title="Choisir une image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <FileManagerIframePicker
                open={imagePickerOpen}
                onOpenChange={setImagePickerOpen}
                onSelectFile={handleSelectImage}
                filemanagerUrl={fileManagerConfig?.filemanagerUrl ?? ""}
                type="image"
              />
            </div>
          </Form.Group>
          <div className="grid grid-cols-2 gap-2">
            <Form.Group>
              <Form.Label text="Position" />
              <Form.Select
                options={[{ label: "...", value: "" }, ...POSITION_OPTIONS]}
                value={background.position ?? ""}
                onChange={(value) =>
                  updateBackground({ ...background, position: value || "center" })
                }
                className="h-7 text-sm"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label text="Taille" />
              <Form.Select
                options={[{ label: "...", value: "" }, ...SIZE_OPTIONS]}
                value={background.size ?? ""}
                onChange={(value) =>
                  updateBackground({ ...background, size: value || "cover" })
                }
                className="h-7 text-sm"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label text="Repeat" />
              <Form.Select
                options={[{ label: "...", value: "" }, ...REPEAT_OPTIONS]}
                value={background.repeat ?? ""}
                onChange={(value) =>
                  updateBackground({ ...background, repeat: value || "no-repeat" })
                }
                className="h-7 text-sm"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label text="Couleur fallback" />
              <Form.InputColor
                value={background.color ?? ""}
                onChange={(value) => updateBackground({ ...background, color: value })}
                placeholder="sous l'image"
              />
            </Form.Group>
          </div>
        </>
      ) : null}

      {backgroundType === "video" && background.type === "video" ? (
        <>
          <Form.Group>
            <Form.Label text="Vidéo" />
            <div className="flex gap-1">
              <Form.Input
                type="text"
                value={background.url ?? ""}
                onChange={(value) => updateBackground({ ...background, url: value })}
                placeholder="URL de la vidéo"
                className="h-7 text-sm flex-1 min-w-0"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => setVideoPickerOpen(true)}
                title="Choisir une vidéo"
              >
                <Film className="h-4 w-4" />
              </Button>
              <FileManagerIframePicker
                open={videoPickerOpen}
                onOpenChange={setVideoPickerOpen}
                onSelectFile={handleSelectVideo}
                filemanagerUrl={fileManagerConfig?.filemanagerUrl ?? ""}
                type="video"
              />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label text="Poster (optionnel)" />
            <div className="flex gap-1">
              <Form.Input
                type="text"
                value={background.poster ?? ""}
                onChange={(value) => updateBackground({ ...background, poster: value })}
                placeholder="Image affichée avant le chargement"
                className="h-7 text-sm flex-1 min-w-0"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => setPosterPickerOpen(true)}
                title="Choisir une image poster"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <FileManagerIframePicker
                open={posterPickerOpen}
                onOpenChange={setPosterPickerOpen}
                onSelectFile={handleSelectPoster}
                filemanagerUrl={fileManagerConfig?.filemanagerUrl ?? ""}
                type="image"
              />
            </div>
          </Form.Group>
          <div className="grid grid-cols-2 gap-2">
            <Form.Group>
              <Form.Label text="Object fit" />
              <Form.Select
                options={OBJECT_FIT_OPTIONS}
                value={background.objectFit ?? "cover"}
                onChange={(value) =>
                  updateBackground({ ...background, objectFit: value || "cover" })
                }
                className="h-7 text-sm"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label text="Object position" />
              <Form.Select
                options={[{ label: "...", value: "" }, ...POSITION_OPTIONS]}
                value={background.objectPosition ?? ""}
                onChange={(value) =>
                  updateBackground({
                    ...background,
                    objectPosition: value || "center",
                  })
                }
                className="h-7 text-sm"
              />
            </Form.Group>
            <Form.Group className="col-span-2">
              <Form.Label text="Couleur fallback" />
              <Form.InputColor
                value={background.color ?? ""}
                onChange={(value) => updateBackground({ ...background, color: value })}
                placeholder="pendant le chargement"
              />
            </Form.Group>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default BackgroundSettings;
