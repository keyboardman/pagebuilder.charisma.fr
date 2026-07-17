import type { FC } from "react";
import Form from "../../../../components/form";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/editeur/components/ui/table";
import type { CollectionGridOptions, NodeCollectionType } from "../../index";
import { BreakpointTableHeader } from "./BreakpointTableHeader";
import { parseClampedInt } from "./parseClampedInt";

interface GridDisplaySettingsProps {
  grid: CollectionGridOptions;
  setContent: (patch: Partial<NodeCollectionType["content"]>) => void;
}

export const GridDisplaySettings: FC<GridDisplaySettingsProps> = ({ grid, setContent }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="node-block-title w-14 shrink-0 text-xs">Gap</span>
        <Form.Input
          type="number"
          value={String(grid.gap ?? 4)}
          onChange={(value) => {
            const n = parseClampedInt(value, 0, 10);
            if (n == null) return;
            setContent({ grid: { ...grid, gap: n } });
          }}
          className="h-7 flex-1 text-sm"
          min={0}
          max={10}
        />
      </div>

      <Table>
        <BreakpointTableHeader />
        <TableBody>
          <TableRow className="border-border/50">
            <TableCell className="node-block-title py-1 px-2 text-xs">C.</TableCell>
            <TableCell className="py-1 px-2">
              <Form.Input
                type="number"
                value={String(grid.columns?.desktop ?? 3)}
                onChange={(value) => {
                  const n = parseClampedInt(value, 1, 6);
                  if (n == null) return;
                  setContent({
                    grid: {
                      ...grid,
                      columns: { ...grid.columns, desktop: n },
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
                value={String(grid.columns?.tablet ?? 2)}
                onChange={(value) => {
                  const n = parseClampedInt(value, 1, 6);
                  if (n == null) return;
                  setContent({
                    grid: {
                      ...grid,
                      columns: { ...grid.columns, tablet: n },
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
                value={String(grid.columns?.mobile ?? 1)}
                onChange={(value) => {
                  const n = parseClampedInt(value, 1, 6);
                  if (n == null) return;
                  setContent({
                    grid: {
                      ...grid,
                      columns: { ...grid.columns, mobile: n },
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
  );
};
