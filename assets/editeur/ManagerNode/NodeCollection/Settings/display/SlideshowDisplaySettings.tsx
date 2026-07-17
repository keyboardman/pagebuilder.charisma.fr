import type { FC } from "react";
import Form from "../../../../components/form";
import { Switch } from "@/editeur/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/editeur/components/ui/table";
import type {
  CollectionSlideshowOptions,
  CollectionType,
  NodeCollectionType,
} from "../../index";
import { BreakpointTableHeader } from "./BreakpointTableHeader";
import { parseClampedInt } from "./parseClampedInt";

const EFFECT_OPTIONS: Array<{
  value: NonNullable<CollectionSlideshowOptions["effect"]>;
  label: string;
}> = [
  { value: "slide", label: "Slide" },
  { value: "fade", label: "Fade" },
  { value: "cube", label: "Cube" },
  { value: "coverflow", label: "Coverflow" },
  { value: "flip", label: "Flip" },
  { value: "cards", label: "Cards" },
  { value: "creative", label: "Creative" },
];

interface SlideshowDisplaySettingsProps {
  slideshow: CollectionSlideshowOptions;
  collectionType: CollectionType;
  setContent: (patch: Partial<NodeCollectionType["content"]>) => void;
}

export const SlideshowDisplaySettings: FC<SlideshowDisplaySettingsProps> = ({
  slideshow,
  collectionType,
  setContent,
}) => {
  const navigationEnabled = slideshow.navigationEnabled !== false;
  const paginationEnabled = slideshow.paginationEnabled !== false;
  const autoplayEnabled = slideshow.autoplayEnabled !== false;
  const defaultSlides = slideshow.slidesPerViewByBreakpoint ?? {
    desktop: 1,
    tablet: 1,
    mobile: 1,
  };

  return (
    <div className="space-y-2 rounded border border-border p-2">
      <div className="flex items-center justify-between gap-2">
        <span>Navigation</span>
        <Switch
          checked={navigationEnabled}
          onCheckedChange={(checked) =>
            setContent({ slideshow: { ...slideshow, navigationEnabled: checked } })
          }
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span>Pagination</span>
        <Switch
          checked={paginationEnabled}
          onCheckedChange={(checked) =>
            setContent({ slideshow: { ...slideshow, paginationEnabled: checked } })
          }
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span>Autoplay</span>
        <Switch
          checked={autoplayEnabled}
          onCheckedChange={(checked) =>
            setContent({ slideshow: { ...slideshow, autoplayEnabled: checked } })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="node-block-title text-sm" title="Speed (ms)">
            Speed (ms)
          </span>
          <Form.Input
            type="number"
            value={String(slideshow.speedMs ?? 300)}
            onChange={(value) => {
              const n = parseClampedInt(value, 0, 10000);
              if (n == null) return;
              setContent({ slideshow: { ...slideshow, speedMs: n } });
            }}
            className="h-7 w-full text-center text-sm"
            min={0}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <span className="node-block-title text-sm" title="Delay (ms)">
            Delay (ms)
          </span>
          <Form.Input
            type="number"
            value={String(slideshow.autoplayDelayMs ?? 3000)}
            onChange={(value) => {
              const n = parseClampedInt(value, 0, 100000);
              if (n == null) return;
              setContent({ slideshow: { ...slideshow, autoplayDelayMs: n } });
            }}
            className="h-7 w-full text-center text-sm"
            min={0}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <span className="node-block-title text-sm" title="Gap">
            Gap
          </span>
          <Form.Input
            type="number"
            value={String(slideshow.gap ?? 10)}
            onChange={(value) => {
              const n = parseClampedInt(value, 0, 50);
              if (n == null) return;
              setContent({ slideshow: { ...slideshow, gap: n } });
            }}
            className="h-7 w-full text-center text-sm"
            min={0}
            max={50}
          />
        </div>
      </div>

      <div className="space-y-1">
        <p className="node-block-title m-0 text-xs font-medium">Slides visibles</p>
        <Table>
          <BreakpointTableHeader />
          <TableBody>
            <TableRow className="border-border/50">
              <TableCell className="node-block-title py-1 px-2 text-xs">Nb</TableCell>
              <TableCell className="py-1 px-2">
                <Form.Input
                  type="number"
                  value={String(defaultSlides.desktop ?? 1)}
                  onChange={(value) => {
                    const n = parseClampedInt(value, 1, 6);
                    if (n == null) return;
                    setContent({
                      slideshow: {
                        ...slideshow,
                        slidesPerViewByBreakpoint: { ...defaultSlides, desktop: n },
                      },
                    });
                  }}
                  className="h-7 text-center text-sm"
                  min={1}
                  max={6}
                />
              </TableCell>
              <TableCell className="py-1 px-2">
                <Form.Input
                  type="number"
                  value={String(defaultSlides.tablet ?? 1)}
                  onChange={(value) => {
                    const n = parseClampedInt(value, 1, 6);
                    if (n == null) return;
                    setContent({
                      slideshow: {
                        ...slideshow,
                        slidesPerViewByBreakpoint: { ...defaultSlides, tablet: n },
                      },
                    });
                  }}
                  className="h-7 text-center text-sm"
                  min={1}
                  max={6}
                />
              </TableCell>
              <TableCell className="py-1 px-2">
                <Form.Input
                  type="number"
                  value={String(defaultSlides.mobile ?? 1)}
                  onChange={(value) => {
                    const n = parseClampedInt(value, 1, 6);
                    if (n == null) return;
                    setContent({
                      slideshow: {
                        ...slideshow,
                        slidesPerViewByBreakpoint: { ...defaultSlides, mobile: n },
                      },
                    });
                  }}
                  className="h-7 text-center text-sm"
                  min={1}
                  max={6}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className={collectionType === "image" ? "" : "col-span-2"}>
          <Form.Select
            value={(slideshow.effect ?? "slide") as NonNullable<CollectionSlideshowOptions["effect"]>}
            onChange={(effect) =>
              setContent({
                slideshow: {
                  ...slideshow,
                  effect: effect as NonNullable<CollectionSlideshowOptions["effect"]>,
                },
              })
            }
            options={EFFECT_OPTIONS}
            className="h-7"
          />
        </div>

        {collectionType === "image" ? (
          <>
            <div>
              <Form.Input
                value={String(slideshow.aspectRatio ?? "16/9")}
                onChange={(aspectRatio) => setContent({ slideshow: { ...slideshow, aspectRatio } })}
                className="h-7 w-full px-2 text-xs"
                placeholder="Aspect ratio (ex: 16/9, auto)"
              />
            </div>

            <div className="col-span-2">
              <Form.Input
                value={String(slideshow.imageBorderRadius ?? "0px")}
                onChange={(imageBorderRadius) =>
                  setContent({ slideshow: { ...slideshow, imageBorderRadius } })
                }
                className="h-7 w-full px-2 text-xs"
                placeholder="Image border radius (ex: 0px, 8px)"
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
