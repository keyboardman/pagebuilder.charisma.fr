import Form from "../../../components/form";
import {
  DEFAULT_COLLECTION_ITEMS_PER_PAGE,
  MAX_COLLECTION_ITEMS_PER_PAGE,
} from "../collectionUtils";

interface CollectionDisplayPaginationSettingsProps {
  page?: number;
  itemsPerPage?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function CollectionDisplayPaginationSettings({
  page,
  itemsPerPage,
  totalPages = 0,
  onPageChange,
  onItemsPerPageChange,
}: CollectionDisplayPaginationSettingsProps) {
  const currentPage = Math.max(1, page ?? 1);
  const maxPage = totalPages > 0 ? totalPages : undefined;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      <div className="flex items-center gap-1.5">
        <span className="node-block-title shrink-0 whitespace-nowrap text-foreground text-sm">N° Page</span>
        <Form.Input
          type="number"
          value={String(currentPage)}
          onChange={(value: string) => {
            const num = parseInt(value, 10);
            if (Number.isNaN(num) || num < 1) {
              return;
            }

            if (maxPage != null && num > maxPage) {
              onPageChange(maxPage);
              return;
            }

            onPageChange(num);
          }}
          className="h-7 w-11 shrink-0 px-1 text-center text-[0.75rem]"
          min={1}
          max={maxPage}
        />
        {maxPage != null ? (
          <span className="shrink-0 whitespace-nowrap text-[0.65rem] text-muted-foreground">/ {maxPage}</span>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="node-block-title shrink-0 whitespace-nowrap text-foreground text-sm">Nb Items</span>
        <Form.Input
          type="number"
          value={String(itemsPerPage ?? DEFAULT_COLLECTION_ITEMS_PER_PAGE)}
          onChange={(value: string) => {
            const num = parseInt(value, 10);
            if (Number.isNaN(num) || num < 1) {
              return;
            }

            onItemsPerPageChange(Math.min(num, MAX_COLLECTION_ITEMS_PER_PAGE));
          }}
          className="h-7 w-12 shrink-0 px-1 text-center text-[0.75rem]"
          min={1}
          max={MAX_COLLECTION_ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}
