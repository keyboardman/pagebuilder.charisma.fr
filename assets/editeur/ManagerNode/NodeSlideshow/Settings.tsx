import React, { type FC, useEffect, useMemo, useState } from "react";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { NodeSettingsWrapper } from "../components/NodeSettingsWrapper";
import { Base2Settings } from "../Settings";
import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { apiRegistry } from "../../ManagerApi/ApiRegistry";
import type { ApiAdapterType } from "../../ManagerApi/ApiAdapter";
import { Button } from "@/editeur/components/ui/button";
import { Switch } from "@/editeur/components/ui/switch";
import { cn } from "@/editeur/lib/utils";
import type { NodeSlideshowSlide, NodeSlideshowType } from ".";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/editeur/components/ui/table";
import { Monitor, Tablet, Phone } from "lucide-react";
const DEFAULT_SLIDE_SRC = "https://placehold.net/3-800x600.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/editeur/components/ui/tabs";

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
  const slideshowNode = node as NodeSlideshowType;

  const slidesSafe = useMemo<NodeSlideshowSlide[]>(() => {
    const slides = slideshowNode.content?.slides;
    if (!Array.isArray(slides) || slides.length === 0) {
      return [{ src: DEFAULT_SLIDE_SRC, alt: "", source: "media", link: "" }];
    }
    return slides;
  }, [slideshowNode.content?.slides]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const slidesMode = slideshowNode.content?.slidesMode ?? "manual";
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
  const effect =
    typeof slideshowNode.content?.effect === "string" &&
      slideshowNode.content.effect.trim().length > 0
      ? slideshowNode.content.effect
      : "slide";
  const imageBorderRadius =
    typeof slideshowNode.content?.imageBorderRadius === "string"
      ? slideshowNode.content.imageBorderRadius
      : "0px";
  const gap =
    typeof slideshowNode.content?.gap === "number" && slideshowNode.content.gap >= 0
      ? slideshowNode.content.gap
      : 10;

  const selectedSlide = slidesSafe[selectedIndex];
  const updateSlidesPerView = (
    key: keyof NodeSlideshowType["content"]["slidesPerViewByBreakpoint"],
    rawValue: string
  ) => {
    const num = parseInt(rawValue, 10);
    if (Number.isNaN(num) || num < 1) return;

    updateContent({
      slidesPerViewByBreakpoint: {
        ...(slidesPerViewByBreakpoint ?? {
          desktop: 1,
          tablet: 1,
          mobile: 1,
        }),
        [key]: num,
      },
    });
  };

  const imageFixedApiAdapters = useMemo(() => {
    // On limite aux APIs image en collection fixe (les items deviennent un “endpoint” de slides).
    // Si aucune API fixed n'existe, on laissera l'interface vide plutôt que de mixer les modes.
    return apiRegistry
      .list()
      .filter((a) => a.type === "image" && (a.collectionMode ?? "normal") === "fixed");
  }, []);

  const apiOptions = imageFixedApiAdapters.map((adapter) => ({
    value: adapter.id,
    label: adapter.label,
  }));

  const apiId = slideshowNode.content?.apiId ?? "";

  const loadSlidesFromApi = async (nextApiId: string) => {
    const adapter = apiRegistry.get(nextApiId);
    if (!adapter) return;

    setApiLoading(true);
    setApiError(null);
    try {
      const result = await adapter.fetchCollection({
        page: 1,
        limit: 200,
      });

      const mappedSlides: NodeSlideshowSlide[] = (result.items ?? [])
        .map((item) => adapter.mapItem(item))
        .filter((mapped) => (mapped.image ?? "").trim().length > 0)
        .map((mapped) => ({
          src: String(mapped.image ?? ""),
          alt: mapped.title ?? "",
          source: "api-fixed",
          link: mapped.link ?? "",
          apiId: nextApiId,
          itemId: mapped.id,
        }));

      const nextSlides =
        mappedSlides.length > 0
          ? mappedSlides
          : [{ src: DEFAULT_SLIDE_SRC, alt: "", source: "api-fixed" as const, link: "", apiId: nextApiId }];

      updateContent({
        slidesMode: "api-endpoint",
        apiId: nextApiId,
        slides: nextSlides,
      });
      setSelectedIndex(0);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Erreur lors du chargement depuis l'API");
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <Tabs className="flex min-h-0 flex-1 flex-col overflow-hidden" defaultValue="main">

      <NodeSettingsWrapper
        header={
          <>
            <Base2Settings
              attributes={node.attributes}
              onChange={(attributes: { className?: string; id?: string }) =>
                onChange({
                  ...node,
                  attributes: { ...node.attributes, ...attributes },
                })
              }
            />
            <TabsList className="justify-center w-full">
              <TabsTrigger value="main">Général</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

          </>



        }
        content={
          <>
            <TabsContent value="main">
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
                            onChange={(value) => updateSlidesPerView("desktop", value)}
                            className="h-7"
                          />
                        </TableCell>
                        <TableCell>
                          <Form.Input
                            type="number"
                            min={1}
                            step={1}
                            value={String(slidesPerViewByBreakpoint.tablet ?? 1)}
                            onChange={(value) => updateSlidesPerView("tablet", value)}
                            className="h-7"
                          />
                        </TableCell>
                        <TableCell>
                          <Form.Input
                            type="number"
                            min={1}
                            step={1}
                            value={String(slidesPerViewByBreakpoint.mobile ?? 1)}
                            onChange={(value) => updateSlidesPerView("mobile", value)}
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
                  <Form.Label text="Effet de transition" />
                  <Form.Select
                    value={effect}
                    onChange={(value) =>
                      updateContent({
                        effect: (value as NodeSlideshowType["content"]["effect"]) || "slide",
                      })
                    }
                    options={[
                      { value: "slide", label: "Slide (défaut)" },
                      { value: "fade", label: "Fade" },
                      { value: "cube", label: "Cube" },
                      { value: "coverflow", label: "Coverflow" },
                      { value: "flip", label: "Flip" },
                      { value: "cards", label: "Cards" },
                      { value: "creative", label: "Creative" },
                    ]}
                    className="h-7"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label text="Gap entre images (px)" />
                  <Form.Input
                    type="number"
                    min={0}
                    step={1}
                    value={String(gap)}
                    onChange={(value) => {
                      const num = parseInt(value, 10);
                      if (!Number.isNaN(num) && num >= 0) {
                        updateContent({ gap: num });
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
                <Form.Group>
                  <Form.Label text="Arrondi image (border-radius)" />
                  <Form.Input
                    type="text"
                    value={imageBorderRadius}
                    placeholder="Ex: 12px, 1rem, 20%"
                    onChange={(value) => updateContent({ imageBorderRadius: value ?? "0px" })}
                    className="h-7"
                  />
                </Form.Group>
              </div>
            </TabsContent>
            <TabsContent value="images">
              <div className="flex flex-col gap-3 text-sm">


                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="node-block-title font-medium text-xs m-0">Slides</p>
                    <div className="flex gap-3 items-center">
                      <Form.Select
                        value={slidesMode}
                        onChange={(value) => {
                          const nextMode = (value as "manual" | "api-endpoint") || "manual";
                          if (nextMode === "manual") {
                            const nextSlides = [
                              {
                                src: DEFAULT_SLIDE_SRC,
                                alt: "",
                                source: "media" as const,
                                link: "",
                              },
                            ];
                            updateContent({
                              slidesMode: "manual",
                              apiId: undefined,
                              slides: nextSlides,
                            });
                            setSelectedIndex(0);
                          } else {
                            const nextApiId = apiId;
                            const placeholderSlides = [
                              {
                                src: DEFAULT_SLIDE_SRC,
                                alt: "",
                                source: "api-fixed" as const,
                                link: "",
                                apiId: nextApiId || undefined,
                              },
                            ];
                            updateContent({
                              slidesMode: "api-endpoint",
                              apiId: nextApiId || undefined,
                              slides: placeholderSlides,
                            });
                            setSelectedIndex(0);
                            if (nextApiId) {
                              void loadSlidesFromApi(nextApiId);
                            }
                          }
                        }}
                        options={[
                          { value: "manual", label: "Liste manuelle" },
                          { value: "api-endpoint", label: "Depuis endpoint API" },
                        ]}
                      />
                    </div>
                  </div>

                  {slidesMode === "manual" ? (
                    <div className="flex">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const nextSlides = [
                            ...slidesSafe,
                            {
                              src: DEFAULT_SLIDE_SRC,
                              alt: "",
                              source: "media" as const,
                              link: "",
                            },
                          ];
                          updateContent({ slides: nextSlides });
                          setSelectedIndex(nextSlides.length - 1);
                        }}
                      >
                        Ajouter une slide
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Form.Group>
                        <Form.Label text="Endpoint API (image fixed)" />
                        <Form.Select
                          value={apiId}
                          onChange={(value) => {
                            const nextId = String(value ?? "");
                            if (!nextId) {
                              updateContent({ apiId: undefined });
                              return;
                            }
                            updateContent({ slidesMode: "api-endpoint", apiId: nextId });
                            void loadSlidesFromApi(nextId);
                          }}
                          options={apiOptions}
                          placeholder={apiOptions.length ? "Choisir une API..." : "Aucune API fixe"}
                          disabled={apiOptions.length === 0}
                        />
                      </Form.Group>
                      {apiLoading && <p className="text-xs text-muted-foreground">Chargement...</p>}
                      {apiError && (
                        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded p-2">
                          {apiError}
                        </p>
                      )}
                      <div className="flex">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!apiId) return;
                            void loadSlidesFromApi(apiId);
                          }}
                          disabled={!apiId || apiLoading}
                        >
                          Recharger
                        </Button>
                      </div>
                    </div>
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
                          loading="lazy"
                        />
                        <div className="mt-1 text-[10px] text-muted-foreground text-center">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">


                  {slidesMode === "manual" && (
                    <>
                      <p className="node-block-title font-medium text-xs m-0">
                        Image sélectionnée: {selectedIndex + 1}
                      </p>
                      <Form.Group>
                        <Form.Label text="Source (URL)" />
                        <Form.Input
                          type="text"
                          value={selectedSlide?.src ?? ""}
                          onChange={(value) => {
                            const nextSlides = [...slidesSafe];
                            if (!nextSlides[selectedIndex]) return;
                            nextSlides[selectedIndex] = {
                              ...nextSlides[selectedIndex],
                              src: value ?? DEFAULT_SLIDE_SRC,
                            };
                            updateContent({ slides: nextSlides });
                          }}

                          className="h-7"
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
                      <Form.Group>
                        <Form.Label text="Lien (optionnel)" />
                        <Form.Input
                          type="text"
                          value={selectedSlide?.link ?? ""}
                          placeholder="https://..."
                          onChange={(value) => {
                            const nextSlides = [...slidesSafe];
                            if (!nextSlides[selectedIndex]) return;
                            nextSlides[selectedIndex] = {
                              ...nextSlides[selectedIndex],
                              link: value ?? "",
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
                                slides: [
                                  {
                                    src: DEFAULT_SLIDE_SRC,
                                    alt: "",
                                    source: slidesMode === "manual" ? ("media" as const) : ("api-fixed" as const),
                                    link: "",
                                  },
                                ],
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
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </>
        }
      />
    </Tabs>
  );
};

export default Settings;

