import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/editeur/components/ui/dialog";
import { Button } from "@/editeur/components/ui/button";
import nodeHelper from "../../utils/nodeHelper";
import { getNodeDisplayLabel, getNodeTypeLabel } from "../../utils/nodeLabel";
import type { NodeType, NodesType } from "../../types/NodeType";

type NodeDeleteConfirmDialogProps = {
  node: NodeType | null;
  nodes: NodesType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function NodeDeleteConfirmDialog({
  node,
  nodes,
  open,
  onOpenChange,
  onConfirm,
}: NodeDeleteConfirmDialogProps) {
  if (!node) {
    return null;
  }

  const descendantCount = nodeHelper.countDescendants(nodes, node.id);
  const label = getNodeDisplayLabel(node);
  const typeLabel = getNodeTypeLabel(node);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer ce bloc ?</DialogTitle>
          <DialogDescription>
            {descendantCount > 0
              ? `Le bloc « ${label} » (${typeLabel}) et ${descendantCount} sous-bloc${descendantCount > 1 ? "s" : ""} seront supprimés définitivement.`
              : `Le bloc « ${label} » (${typeLabel}) sera supprimé définitivement.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
