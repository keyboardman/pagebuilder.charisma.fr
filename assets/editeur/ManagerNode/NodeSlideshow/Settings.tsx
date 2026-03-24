import React, { type FC, useEffect, useMemo, useState } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings } from "../Settings";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { useAppContext } from "../../services/providers/AppContext";
import { InputFile } from "../../components/form/InputFile";
import { FileManagerIframePicker } from "../../ManagerAsset/FileManagerIframePicker";
import { Button } from "@/editeur/components/ui/button";
import { Switch } from "@/editeur/components/ui/switch";
import { cn } from "@/editeur/lib/utils";
import type { NodeSlideshowSlide, NodeSlideshowType } from ".";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/editeur/components/ui/table";
import { Monitor, Tablet, Phone } from "lucide-react";
const DEFAULT_SLIDE_SRC = "https://placehold.net/3-800x600.png";

function moveIndex<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function computeNewSelectedIndex(from: number, to: number, selectedIndex: number): number {
  if (from === selectedIndex) return to;
  if (from < selectedIndex && to >= selectedIndex) return selectedIndex - 1;
  if (from > selectedIndex && to <= selectedIndex) return selectedIndex + 1;
  return selectedIndex;
}

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const { fileManagerConfig } = useAppContext();
  const slideshowNode = node as NodeSlideshowType;

  const slidesSafe = useMemo<NodeSlideshowSlide[]>(() => {
    const slides = slideshowNode.content?.slides;
    if (!Array.isArray(slides) || slides.length === 0) {
      return [{ src: DEFAULT_SLIDE_SRC, alt: "" }];
    }
    return slides;
  }, [slideshowNode.content?.slides]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    setSelectedIndex((idx) => Math.min(Math.max(0, idx), slidesSafe.length - 1));
  }, [slidesSafe.length]);

  const updateContent = (patch: Partial<NodeSlideshowType["content"]>) => {
    onChange({
      ...node,
      content: {
        ...(node.content ?? {}),
        ...patch,
      },
    });
  };

  const navigationEnabled = slideshowNode.content?.navigationEnabled !== false;
  const paginationEnabled = slideshowNode.content?.paginationEnabled !== false;
  const autoplayConfiguredEnabled = slideshowNode.content?.autoplayEnabled !== false;
  const autoplayDelayMs =
    typeof slideshowNode.content?.autoplayDelayMs === "number"
      ? slideshowNode.content.autoplayDelayMs
      : 3000;
  const autoplayEnabled = autoplayConfiguredEnabled;
  const speedMs =
    typeof slideshowNode.content?.speedMs === "number" ? slideshowNode.content.speedMs : 300;
  const slidesPerViewByBreakpoint =
    slideshowNode.content?.slidesPerViewByBreakpoint ?? {
      desktop: 1,
      tablet: 1,
      mobile: 1,
    };
  const aspectRatio =
    typeof slideshowNode.content?.aspectRatio === "string" &&
      slideshowNode.content?.aspectRatio.trim().length > 0
      ? slideshowNode.content.aspectRatio
      : "16/9";

  const selectedSlide = slidesSafe[selectedIndex];

  return (
    <NodeSettingsWrapper
      header={
        <Base2Settings
          attributes={node.attributes}
          onChange={(attributes: { className?: string; id?: string }) =>
            onChange({
              ...node,
              attributes: { ...node.attributes, ...attributes },
            })
          }
        />
      }
      content={
        <div className="flex flex-col gap-3 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="node-block-title font-medium text-foreground text-xs">
                Navigation
              </span>
              <Switch
                checked={navigationEnabled}
                onCheckedChange={(checked) => updateContent({ navigationEnabled: checked })}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="node-block-title font-medium text-foreground text-xs">
                Pagination
              </span>
              <Switch
                checked={paginationEnabled}
                onCheckedChange={(checked) => updateContent({ paginationEnabled: checked })}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="node-block-title font-medium text-foreground text-xs">
                Autoplay
              </span>
              <Switch
                checked={autoplayEnabled}
                onCheckedChange={(checked) =>
                  updateContent({ autoplayEnabled: checked })
                }
              />
            </div>
            {autoplayEnabled && (
              <Form.Group>
                <Form.Label text="Délai autoplay (ms)" />
                <Form.Input
                  type="number"
                  min={0}
                  step={100}
                  value={String(autoplayDelayMs)}
                  onChange={(value) => {
                    const num = parseInt(value, 10);
                    if (!Number.isNaN(num) && num >= 0) {
                      updateContent({ autoplayDelayMs: num });
                    }
                  }}
                  className="h-7"
                />
              </Form.Group>
            )}

            <div className="mt-2 space-y-2">
              <p className="node-block-title font-medium text-foreground text-xs m-0">
                Slides visibles
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Monitor className="h-4 w-4 mx-auto" />
                    </TableHead>
                    <TableHead>
                      <Tablet className="h-4 w-4 mx-auto" />
                    </TableHead>
                    <TableHead>
                      <Phone className="h-4 w-4 mx-auto" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Form.Input
                        type="number"
                        min={1}
                        step={1}
                        value={String(slidesPerViewByBreakpoint.desktop ?? 1)}
                        onChange={(value) => {
                          const num = parseInt(value, 10);
                          if (!Number.isNaN(num) && num >= 1) {
                            updateContent({
                              slidesPerViewByBreakpoint: {
                                ...(slidesPerViewByBreakpoint ?? {
                                  desktop: 1,
                                  tablet: 1,
                                  mobile: 1,
                                }),
                                desktop: num,
                              },
                            });
                          }
                        }}
                        className="h-7"
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Input
                        type="number"
                        min={1}
                        step={1}
                        value={String(slidesPerViewByBreakpoint.desktop ?? 1)}
                        onChange={(value) => {
                          const num = parseInt(value, 10);
                          if (!Number.isNaN(num) && num >= 1) {
                            updateContent({
                              slidesPerViewByBreakpoint: {
                                ...(slidesPerViewByBreakpoint ?? {
                                  desktop: 1,
                                  tablet: 1,
                                  mobile: 1,
                                }),
                                tablet: num,
                              },
                            });
                          }
                        }}
                        className="h-7"
                      />
                    </TableCell>
                    <TableCell>
                      <Form.Input
                        type="number"
                        min={1}
                        step={1}
                        value={String(slidesPerViewByBreakpoint.desktop ?? 1)}
                        onChange={(value) => {
                          const num = parseInt(value, 10);
                          if (!Number.isNaN(num) && num >= 1) {
                            updateContent({
                              slidesPerViewByBreakpoint: {
                                ...(slidesPerViewByBreakpoint ?? {
                                  desktop: 1,
                                  tablet: 1,
                                  mobile: 1,
                                }),
                                mobile: num,
                              },
                            });
                          }
                        }}
                        className="h-7"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <Form.Group>
              <Form.Label text="Vitesse (ms)" />
              <Form.Input
                type="number"
                min={0}
                step={50}
                value={String(speedMs)}
                onChange={(value) => {
                  const num = parseInt(value, 10);
                  if (!Number.isNaN(num) && num >= 0) {
                    updateContent({ speedMs: num });
                  }
                }}
                className="h-7"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label text="Aspect ratio" />
              <Form.Input
                type="text"
                value={aspectRatio}
                placeholder="Ex: 16/9, 4/3, 1/1, auto"
                onChange={(value) => updateContent({ aspectRatio: value })}
                className="h-7"
              />

            </Form.Group>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="node-block-title font-medium text-xs m-0">Slides</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(true)}
                disabled={!fileManagerConfig?.filemanagerUrl}
              >
                Ajouter
              </Button>
            </div>

            {fileManagerConfig?.filemanagerUrl && (
              <FileManagerIframePicker
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                onSelectFile={(file) => {
                  const nextSlides = [...slidesSafe, { src: file.url, alt: "" }];
                  const nextSelectedIndex = nextSlides.length - 1;
                  updateContent({ slides: nextSlides });
                  setSelectedIndex(nextSelectedIndex);
                  setIsAddOpen(false);
                }}
                filemanagerUrl={fileManagerConfig.filemanagerUrl}
                type="image"
              />
            )}

            <div className="flex flex-wrap gap-2">
              {slidesSafe.map((slide, idx) => (
                <div
                  key={`${slide.src}-${idx}`}
                  draggable
                  onDragStart={(e) => {
                    // Certaines implémentations HTML5 DnD nécessitent un dataTransfer pour autoriser le drop.
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(idx));
                    setDraggingIndex(idx);
                    setDragOverIndex(idx);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverIndex(idx);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggingIndex == null) return;
                    if (draggingIndex === idx) return;
                    const nextSlides = moveIndex(slidesSafe, draggingIndex, idx);
                    const nextSelected = computeNewSelectedIndex(
                      draggingIndex,
                      idx,
                      selectedIndex
                    );
                    updateContent({ slides: nextSlides });
                    setSelectedIndex(nextSelected);
                    setDraggingIndex(null);
                    setDragOverIndex(null);
                  }}
                  onDragEnd={() => {
                    setDraggingIndex(null);
                    setDragOverIndex(null);
                  }}
                  onClick={() => setSelectedIndex(idx)}
                  className={cn(
                    "ce-slideshow-thumb relative cursor-pointer rounded border p-1",
                    idx === selectedIndex
                      ? "border-primary"
                      : "border-border/50 hover:border-border/80",
                    dragOverIndex === idx && draggingIndex !== null
                      ? "ring-2 ring-primary/30"
                      : ""
                  )}
                >
                  <img
                    src={slide.src}
                    alt={slide.alt ?? ""}
                    className="w-20 h-14 object-cover rounded"
                  />
                  <div className="mt-1 text-[10px] text-muted-foreground text-center">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">


            <p className="node-block-title font-medium text-xs m-0">
              Image sélectionnée: {selectedIndex + 1}
            </p>

            <Form.Group>
              <Form.Label text="Source" />
              <InputFile
                type="text"
                value={selectedSlide?.src ?? ""}
                onChange={(value: string) => {
                  const nextSlides = [...slidesSafe];
                  if (!nextSlides[selectedIndex]) return;
                  nextSlides[selectedIndex] = {
                    ...nextSlides[selectedIndex],
                    src: value ?? DEFAULT_SLIDE_SRC,
                  };
                  updateContent({ slides: nextSlides });
                }}
                typeMedia="image"
                className="h-7 text-sm"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label text="Alt" />
              <Form.Input
                type="text"
                value={selectedSlide?.alt ?? ""}
                onChange={(value) => {
                  const nextSlides = [...slidesSafe];
                  if (!nextSlides[selectedIndex]) return;
                  nextSlides[selectedIndex] = {
                    ...nextSlides[selectedIndex],
                    alt: value ?? "",
                  };
                  updateContent({ slides: nextSlides });
                }}
                className="h-7"
              />
            </Form.Group>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (slidesSafe.length <= 1) {
                    // On garde toujours au moins 1 slide pour éviter un Swiper vide.
                    updateContent({
                      slides: [{ src: DEFAULT_SLIDE_SRC, alt: "" }],
                    });
                    setSelectedIndex(0);
                    return;
                  }
                  const nextSlides = slidesSafe.filter((_, idx) => idx !== selectedIndex);
                  const nextSelected = Math.min(selectedIndex, nextSlides.length - 1);
                  updateContent({ slides: nextSlides });
                  setSelectedIndex(nextSelected);
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Settings;

