import type { FC } from "react";
import Form from "../../../../components/form";
import type {
  CollectionDisplay,
  CollectionType,
  NodeCollectionType,
} from "../../index";
import type { CollectionView } from "../../View/collectionViews";
import { getCollectionViewOptions } from "../../View/collectionViews";
import { ListDisplaySettings } from "./ListDisplaySettings";
import { GridDisplaySettings } from "./GridDisplaySettings";
import { SlideshowDisplaySettings } from "./SlideshowDisplaySettings";

interface DisplayTabProps {
  node: NodeCollectionType;
  content: NodeCollectionType["content"];
  onChange: (node: NodeCollectionType) => void;
  collectionType: CollectionType;
  display: CollectionDisplay;
  view: CollectionView;
}

export const DisplayTab: FC<DisplayTabProps> = ({
  node,
  content,
  onChange,
  collectionType,
  display,
  view,
}) => {
  const setContent = (patch: Partial<NodeCollectionType["content"]>) => {
    onChange({ ...node, content: { ...content, ...patch } });
  };

  const list = content.list ?? { gap: 3 };
  const grid = content.grid ?? { columns: { desktop: 3, tablet: 2, mobile: 1 }, gap: 4 };
  const slideshow = content.slideshow ?? {};
  const viewOptions = getCollectionViewOptions(collectionType);

  return (
    <div className="space-y-2 text-xs">
      <Form.Select
        value={display}
        onChange={(value) => setContent({ display: value as CollectionDisplay })}
        options={[
          { value: "list", label: "Liste" },
          { value: "grid", label: "Grille" },
          { value: "slideshow", label: "Slideshow" },
        ]}
        className="h-7"
      />

      {viewOptions.length > 1 ? (
        <Form.Select
          value={view}
          onChange={(value) => setContent({ view: value as CollectionView })}
          options={viewOptions.map((opt) => ({
            value: opt.value,
            label: opt.label,
          }))}
          className="h-7"
        />
      ) : null}

      {display === "list" ? <ListDisplaySettings list={list} setContent={setContent} /> : null}

      {display === "grid" ? <GridDisplaySettings grid={grid} setContent={setContent} /> : null}

      {display === "slideshow" ? (
        <SlideshowDisplaySettings
          slideshow={slideshow}
          collectionType={collectionType}
          setContent={setContent}
        />
      ) : null}
    </div>
  );
};
