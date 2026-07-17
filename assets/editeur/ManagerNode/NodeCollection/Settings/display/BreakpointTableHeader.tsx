import { Monitor, Phone, Tablet } from "lucide-react";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/editeur/components/ui/table";

export function BreakpointTableHeader() {
  return (
    <TableHeader>
      <TableRow className="border-border/50">
        <TableHead className="node-block-title w-8 py-1.5 px-2 text-xs font-medium" />
        <TableHead
          className="node-block-title py-1.5 px-2 text-xs font-medium text-center"
          title="Desktop"
        >
          <Monitor className="mx-auto h-4 w-4" />
        </TableHead>
        <TableHead
          className="node-block-title py-1.5 px-2 text-xs font-medium text-center"
          title="Tablet"
        >
          <Tablet className="mx-auto h-4 w-4" />
        </TableHead>
        <TableHead
          className="node-block-title py-1.5 px-2 text-xs font-medium text-center"
          title="Mobile"
        >
          <Phone className="mx-auto h-4 w-4" />
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
