import type { FC } from "react";
import Form from "../../../../components/form";
import type { CollectionListOptions, NodeCollectionType } from "../../index";
import { parseClampedInt } from "./parseClampedInt";

interface ListDisplaySettingsProps {
  list: CollectionListOptions;
  setContent: (patch: Partial<NodeCollectionType["content"]>) => void;
}

export const ListDisplaySettings: FC<ListDisplaySettingsProps> = ({ list, setContent }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="node-block-title w-14 shrink-0 text-xs">Gap</span>
      <Form.Input
        type="number"
        value={String(list.gap ?? 3)}
        onChange={(value) => {
          const n = parseClampedInt(value, 0, 10);
          if (n == null) return;
          setContent({ list: { ...list, gap: n } });
        }}
        className="h-7 flex-1 text-sm"
        min={0}
        max={10}
      />
    </div>
  );
};
