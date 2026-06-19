import { type FC, useState } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type {
  NodeTextIconType,
  NodeTextIconHorizontalAlign,
  NodeTextIconName,
  NodeTextIconPosition,
  NodeTextIconSizeVariant,
  NodeTextIconSource,
  NodeTextIconTag,
  NodeTextIconVerticalAlign,
} from "./index";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings } from "../Settings";
import { ContainerStyleSettings, IconStyleSettings, TextStyleSettings } from "./Settings/index";
import { useAppContext } from "../../services/providers/AppContext";
import { Button } from "@/editeur/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";
import { cn } from "@/editeur/lib/utils";
import { FolderOpen } from "lucide-react";
import { FileManagerIframePicker } from "../../ManagerAsset/FileManagerIframePicker";
import type { FileItem } from "../../ManagerAsset/types";
import {
  resolveNodeTextIconSource,
  resolveIconSizeVariant,
  resolveNodeTextIconTag,
  sanitizeThemeIconClass,
  ceIconClassNames,
  ceIconBackgroundImageStyle,
} from "./shared";

const ICON_SIZE_VARIANT_OPTIONS: { value: NodeTextIconSizeVariant; label: string }[] = [
  { value: "default", label: "Defaut (24px)" },
  { value: "small", label: "Petit (16px)" },
  { value: "large", label: "Grand (32px)" },
];

const TAG_OPTIONS: { value: NodeTextIconTag; label: string }[] = [
  { value: "div", label: "Div" },
  { value: "p", label: "Paragraphe" },
  { value: "h1", label: "Titre 1 (h1)" },
  { value: "h2", label: "Titre 2 (h2)" },
  { value: "h3", label: "Titre 3 (h3)" },
  { value: "h4", label: "Titre 4 (h4)" },
  { value: "h5", label: "Titre 5 (h5)" },
  { value: "h6", label: "Titre 6 (h6)" },
];

const ICON_SOURCE_OPTIONS: { value: NodeTextIconSource; label: string }[] = [
  { value: "preset", label: "Icones integrees" },
  { value: "theme", label: "Icone du theme" },
  { value: "image", label: "Image (URL ou mediatheque)" },
];

const ICON_OPTIONS: { value: NodeTextIconName; label: string }[] = [
  { value: "none", label: "Aucune" },
  { value: "checkmark", label: "Check" },
  { value: "star", label: "Etoile" },
  { value: "arrow", label: "Fleche" },
];

const ICON_POSITION_OPTIONS: { value: NodeTextIconPosition; label: string }[] = [
  { value: "before", label: "Avant le texte" },
  { value: "after", label: "Apres le texte" },
];

const HORIZONTAL_ALIGN_OPTIONS: { value: NodeTextIconHorizontalAlign; label: string }[] = [
  { value: "left", label: "Gauche" },
  { value: "center", label: "Centre" },
  { value: "right", label: "Droite" },
];

const VERTICAL_ALIGN_OPTIONS: { value: NodeTextIconVerticalAlign; label: string }[] = [
  { value: "top", label: "Haut" },
  { value: "middle", label: "Milieu" },
  { value: "bottom", label: "Bas" },
];

function toAbsoluteUrl(url: string): string {
  if (typeof window === "undefined" || !url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${window.location.origin}${path}`;
}

function SettingsIconPreview({
  url,
  className,
  iconSizeVariant,
}: {
  url: string;
  className: string;
  iconSizeVariant: NodeTextIconSizeVariant;
}) {
  const trimmedUrl = url.trim();
  const cls = sanitizeThemeIconClass(className);
  const sizeClass = ceIconClassNames(iconSizeVariant);

  if (cls) {
    return (
      <div
        className="mx-auto flex min-h-12 min-w-12 max-h-36 max-w-[13rem] shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-muted/40 p-1 sm:mx-0"
        title="Apercu (classe CSS du theme)"
      >
        <i className={cn(sizeClass, cls)} style={{ flexShrink: 0 }} aria-hidden />
      </div>
    );
  }

  if (!trimmedUrl) {
    return (
      <div className="mx-auto flex min-h-12 min-w-12 max-h-36 max-w-[13rem] shrink-0 items-center justify-center rounded border border-dashed border-border text-[10px] text-muted-foreground sm:mx-0">
        —
      </div>
    );
  }

  return (
    <div
      className="mx-auto flex min-h-12 min-w-12 max-h-36 max-w-[13rem] shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-muted/40 p-1 sm:mx-0"
      title="Apercu (background-image)"
    >
      <i
        className={sizeClass}
        style={{ ...ceIconBackgroundImageStyle(trimmedUrl), flexShrink: 0 }}
        aria-hidden
      />
    </div>
  );
}

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const textNode = node as NodeTextIconType;
  const { themeIcons, fileManagerConfig } = useAppContext();
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  const currentTag = resolveNodeTextIconTag(textNode.content?.tag);
  const icon = textNode.content?.icon ?? "none";
  const stored = textNode.content?.iconSource;
  const iconSource: NodeTextIconSource =
    stored === "preset" || stored === "theme" || stored === "image"
      ? stored
      : resolveNodeTextIconSource(textNode.content ?? {});

  const themeIconId = textNode.content?.themeIconId ?? "";
  const themeIconClass = textNode.content?.themeIconClass ?? "";
  const themeIconUrl = textNode.content?.themeIconUrl ?? "";
  const iconImageUrl = textNode.content?.iconImageUrl ?? "";

  const iconPosition = textNode.content?.iconPosition ?? "before";
  const storedVariant = textNode.content?.iconSizeVariant;
  const iconSizeVariant: NodeTextIconSizeVariant =
    storedVariant === "small" || storedVariant === "large" || storedVariant === "default"
      ? storedVariant
      : resolveIconSizeVariant(textNode.content ?? {});
  const linkUrl = textNode.content?.linkUrl ?? "";
  const horizontalAlign = textNode.content?.horizontalAlign ?? "left";
  const verticalAlign = textNode.content?.verticalAlign ?? "middle";
  const html = textNode.content?.html ?? "";

  const themeIconOptions = [
    { value: "", label: "Aucune" },
    ...themeIcons
      .filter((t) => t.id)
      .map((t) => ({
        value: t.id,
        label: t.name?.trim() ? t.name.trim() : t.className?.trim() || t.id,
      })),
  ];

  const applyThemeIconById = (id: string) => {
    if (!id) {
      onChange({
        ...node,
        content: {
          ...node.content,
          iconSource: "theme",
          themeIconId: "",
          themeIconClass: "",
          themeIconUrl: "",
          icon: "none",
        },
      });
      return;
    }
    const ti = themeIcons.find((i) => i.id === id);
    onChange({
      ...node,
      content: {
        ...node.content,
        iconSource: "theme",
        themeIconId: id,
        themeIconClass: ti ? sanitizeThemeIconClass(ti.className) : "",
        themeIconUrl: ti?.url?.trim() ? toAbsoluteUrl(ti.url.trim()) : "",
        icon: "none",
      },
    });
  };

  const handlePickImageFile = (file: FileItem) => {
    const absoluteUrl = toAbsoluteUrl(file.url);
    onChange({
      ...node,
      content: {
        ...node.content,
        iconSource: "image",
        iconImageUrl: absoluteUrl,
        icon: "none",
        themeIconId: "",
        themeIconClass: "",
        themeIconUrl: "",
      },
    });
    setIsFileManagerOpen(false);
  };

  return (
    <Tabs className="flex min-h-0 flex-1 flex-col overflow-hidden" defaultValue="container">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <NodeSettingsWrapper
          header={
            <>
              <Base2Settings
                attributes={node.attributes}
                onChange={(attributes: { className?: string; id?: string }) =>
                  onChange({ ...node, attributes: { ...node.attributes, ...attributes } })
                }
              />
              <Form.Group>
                <Form.Label text="Type de tag" />
                <Form.Select
                  value={currentTag}
                  onChange={(value) =>
                    onChange({
                      ...node,
                      content: { ...node.content, tag: value as NodeTextIconTag },
                    })
                  }
                  options={TAG_OPTIONS}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label text="Lien texte (URL)" />
                <Form.Input
                  type="text"
                  value={linkUrl}
                  onChange={(value) =>
                    onChange({
                      ...node,
                      content: { ...node.content, linkUrl: value ?? "" },
                    })
                  }
                  placeholder="https://..."
                />
              </Form.Group>
              <Form.Group>
                <Form.Label text="Alignement horizontal" />
                <Form.Select
                  value={horizontalAlign}
                  onChange={(value) =>
                    onChange({
                      ...node,
                      content: { ...node.content, horizontalAlign: value as NodeTextIconHorizontalAlign },
                    })
                  }
                  options={HORIZONTAL_ALIGN_OPTIONS}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label text="Alignement vertical" />
                <Form.Select
                  value={verticalAlign}
                  onChange={(value) =>
                    onChange({
                      ...node,
                      content: { ...node.content, verticalAlign: value as NodeTextIconVerticalAlign },
                    })
                  }
                  options={VERTICAL_ALIGN_OPTIONS}
                />
              </Form.Group>
              <TabsList className="mb-3 w-full justify-center">
                <TabsTrigger value="container">Conteneur</TabsTrigger>
                <TabsTrigger value="icon">Icône</TabsTrigger>
                <TabsTrigger value="text">Texte</TabsTrigger>
              </TabsList>
            </>
          }
          content={
            <>
              <TabsContent value="container" className="mt-0">
                <ContainerStyleSettings />
              </TabsContent>
              <TabsContent value="icon" className="mt-0">
                <Form.Group>
                  <Form.Label text="Type d'icone" />
                  <Form.Select
                    value={iconSource}
                    onChange={(value) => {
                      const next = value as NodeTextIconSource;
                      if (next === "preset") {
                        onChange({
                          ...node,
                          content: {
                            ...node.content,
                            iconSource: "preset",
                            themeIconId: "",
                            themeIconClass: "",
                            themeIconUrl: "",
                            iconImageUrl: "",
                          },
                        });
                      } else if (next === "theme") {
                        onChange({
                          ...node,
                          content: {
                            ...node.content,
                            iconSource: "theme",
                            icon: "none",
                            iconImageUrl: "",
                          },
                        });
                      } else {
                        onChange({
                          ...node,
                          content: {
                            ...node.content,
                            iconSource: "image",
                            icon: "none",
                            themeIconId: "",
                            themeIconClass: "",
                            themeIconUrl: "",
                          },
                        });
                      }
                    }}
                    options={ICON_SOURCE_OPTIONS}
                  />
                </Form.Group>
                {iconSource === "preset" && (
                  <Form.Group>
                    <Form.Label text="Icone integree" />
                    <Form.Select
                      value={icon}
                      onChange={(value) =>
                        onChange({
                          ...node,
                          content: {
                            ...node.content,
                            iconSource: "preset",
                            icon: value as NodeTextIconName,
                            themeIconId: "",
                            themeIconClass: "",
                            themeIconUrl: "",
                            iconImageUrl: "",
                          },
                        })
                      }
                      options={ICON_OPTIONS}
                    />
                  </Form.Group>
                )}
                {iconSource === "theme" && (
                  <Form.Group>
                    <Form.Label text="Icone du theme" />
                    {themeIcons.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Aucune icone definie dans le theme. Configurez-les dans l&apos;administration du theme.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <Form.Select
                            value={themeIconId}
                            onChange={(value) => applyThemeIconById(String(value))}
                            options={themeIconOptions}
                          />
                        </div>
                        <SettingsIconPreview url={themeIconUrl} className={themeIconClass} iconSizeVariant={iconSizeVariant} />
                      </div>
                    )}
                  </Form.Group>
                )}
                {iconSource === "image" && (
                  <Form.Group>
                    <Form.Label text="URL image" />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 gap-1">
                        <Form.Input
                          type="text"
                          value={iconImageUrl}
                          onChange={(value) =>
                            onChange({
                              ...node,
                              content: {
                                ...node.content,
                                iconSource: "image",
                                iconImageUrl: value ?? "",
                                icon: "none",
                                themeIconId: "",
                                themeIconClass: "",
                                themeIconUrl: "",
                              },
                            })
                          }
                          placeholder="/media/... ou https://..."
                          className="min-w-0 flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 shrink-0"
                          onClick={() => setIsFileManagerOpen(true)}
                          title="Choisir dans la mediatheque"
                          disabled={!fileManagerConfig?.filemanagerUrl}
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                      </div>
                      <SettingsIconPreview url={iconImageUrl} className="" iconSizeVariant={iconSizeVariant} />
                    </div>
                    {!!fileManagerConfig?.filemanagerUrl && (
                      <FileManagerIframePicker
                        open={isFileManagerOpen}
                        onOpenChange={setIsFileManagerOpen}
                        onSelectFile={handlePickImageFile}
                        filemanagerUrl={fileManagerConfig.filemanagerUrl}
                        type="image"
                      />
                    )}
                  </Form.Group>
                )}
                <Form.Group>
                  <Form.Label text="Position icone" />
                  <Form.Select
                    value={iconPosition}
                    onChange={(value) =>
                      onChange({
                        ...node,
                        content: { ...node.content, iconPosition: value as NodeTextIconPosition },
                      })
                    }
                    options={ICON_POSITION_OPTIONS}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label text="Taille icone" />
                  <Form.Select
                    value={iconSizeVariant}
                    onChange={(value) =>
                      onChange({
                        ...node,
                        content: {
                          ...node.content,
                          iconSizeVariant: value as NodeTextIconSizeVariant,
                        },
                      })
                    }
                    options={ICON_SIZE_VARIANT_OPTIONS}
                  />
                </Form.Group>
                <IconStyleSettings />
              </TabsContent>
              <TabsContent value="text" className="mt-0">
                <Form.Group>
                  <Form.Label text="Contenu" />
                  <Form.Textarea
                    value={html}
                    onChange={(value) =>
                      onChange({
                        ...node,
                        content: { ...node.content, html: value },
                      })
                    }
                    className="min-h-[6rem] text-sm"
                  />
                </Form.Group>
                <TextStyleSettings />
              </TabsContent>
            </>
          }
        />
      </div>
    </Tabs>
  );
};

export default Settings;
