import {
  CollectionItemPickerModal,
} from "./CollectionItemPickerModal";
import type { CollectionApiMappedItem } from "../collectionApiUtils";

interface CollectionArticleItemPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (sourceId: string, item: CollectionApiMappedItem) => void;
}

/** @deprecated Prefer CollectionItemPickerModal with collectionType="article". */
export function CollectionArticleItemPickerModal(props: CollectionArticleItemPickerModalProps) {
  return <CollectionItemPickerModal {...props} collectionType="article" mode="dynamic" />;
}
