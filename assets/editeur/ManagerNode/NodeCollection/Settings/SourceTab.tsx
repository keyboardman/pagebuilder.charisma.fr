import type { FC } from "react";
import { Base2Settings } from "../../Settings";
import Form from "../../../components/form";
import type { CollectionMode, CollectionType, NodeCollectionType } from "../index";
import {
  normalizeCollectionDisplay,
  normalizeCollectionMode,
  normalizeCollectionType,
} from "../collectionUtils";
import { COLLECTION_VIEW_REGISTRY, type CollectionView } from "../View/collectionViews";
import { CollectionDisplayPaginationSettings } from "./CollectionDisplayPaginationSettings";
import { CollectionImageDynamicItemsSettings } from "./CollectionImageDynamicItemsSettings";
import { CollectionArticleDynamicItemsSettings } from "./CollectionArticleDynamicItemsSettings";
import { CollectionVideoDynamicItemsSettings } from "./CollectionVideoDynamicItemsSettings";

type Option = { value: string; label: string };

interface SourceTabProps {
  node: NodeCollectionType;
  onChange: (node: NodeCollectionType) => void;
  content: NodeCollectionType["content"];
  collectionType: CollectionType;
  mode: CollectionMode;
  apiOptions: Option[];
  totalPages: number;
  currentPage: number;
  currentItemsPerPage: number;
}

function resetSourceOnTypeChange(
  node: NodeCollectionType,
  nextType: CollectionType,
  onChange: (node: NodeCollectionType) => void
) {
  const content = node.content ?? {};
  const nextDisplay = normalizeCollectionDisplay(content.display);

  onChange({
    ...node,
    content: {
      ...content,
      collectionType: nextType,
      apiId: "",
      dynamicImageItems: [],
      dynamicArticleItems: [],
      dynamicVideoItems: [],
      display: nextDisplay,
      view: COLLECTION_VIEW_REGISTRY[nextType].defaultView as CollectionView,
    },
  });
}

export const SourceTab: FC<SourceTabProps> = ({
  node,
  onChange,
  content,
  collectionType,
  mode,
  apiOptions,
  totalPages,
  currentPage,
  currentItemsPerPage,
}) => {
  return (
    <div className="mt-0 space-y-2">
      <Base2Settings
        attributes={node.attributes}
        onChange={(attributes) => onChange({ ...node, attributes: { ...node.attributes, ...attributes } })}
      />

      <div className="space-y-2 text-xs">
        <label className="block text-muted-foreground">Type</label>
        <Form.Select
          value={collectionType}
          onChange={(value) => resetSourceOnTypeChange(node, normalizeCollectionType(value), onChange)}
          options={[
            { value: "article", label: "Article" },
            { value: "image", label: "Image" },
            { value: "video", label: "Vidéo" },
          ]}
          className="h-7"
        />

        <label className="block text-muted-foreground">Mode</label>
        <Form.Select
          value={mode}
          onChange={(value) => onChange({ ...node, content: { ...content, mode: normalizeCollectionMode(value) } })}
          options={[
            { value: "fixed", label: "Fixe (API)" },
            { value: "dynamic", label: "Dynamique" },
          ]}
          className="h-7"
        />

        {mode === "fixed" ? (
          <>
            <label className="block text-muted-foreground">API source</label>
            <Form.Select
              value={content.apiId ?? ""}
              onChange={(v) => onChange({ ...node, content: { ...content, apiId: v } })}
              options={apiOptions}
              placeholder="Choisir une API…"
              className="h-7"
            />
            {apiOptions.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">
                Aucune API {collectionType} en mode fixe. Vérifiez le type déclaré dans Admin → APIs
                collection (ex. une API « image » n’apparaît qu’avec Type = Image).
              </p>
            ) : null}
            <CollectionDisplayPaginationSettings
              page={currentPage}
              itemsPerPage={currentItemsPerPage}
              totalPages={totalPages}
              onPageChange={(page) => onChange({ ...node, content: { ...content, page } })}
              onItemsPerPageChange={(itemsPerPage) =>
                onChange({ ...node, content: { ...content, itemsPerPage, page: 1 } })
              }
            />
          </>
        ) : null}

        {mode === "dynamic" && collectionType === "image" ? (
          <CollectionImageDynamicItemsSettings
            items={content.dynamicImageItems ?? []}
            onChange={(dynamicImageItems) =>
              onChange({ ...node, content: { ...content, dynamicImageItems } })
            }
          />
        ) : null}

        {mode === "dynamic" && collectionType === "article" ? (
          <CollectionArticleDynamicItemsSettings
            items={content.dynamicArticleItems ?? []}
            onChange={(dynamicArticleItems) =>
              onChange({ ...node, content: { ...content, dynamicArticleItems } })
            }
          />
        ) : null}

        {mode === "dynamic" && collectionType === "video" ? (
          <CollectionVideoDynamicItemsSettings
            items={content.dynamicVideoItems ?? []}
            onChange={(dynamicVideoItems) =>
              onChange({ ...node, content: { ...content, dynamicVideoItems } })
            }
          />
        ) : null}
      </div>
    </div>
  );
};

