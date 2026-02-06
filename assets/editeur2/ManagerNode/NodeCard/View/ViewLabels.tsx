import { type FC } from "react";
import { cn } from "@editeur/lib/utils";
import { Badge } from "@editeur/components/ui/badge";
import { styleForView } from "../../../utils/styleHelper";

export type ViewLabelsProps = {
  labels: string[];
  className?: string;
  style?: React.CSSProperties;
}

export const ViewLabels: FC<ViewLabelsProps> = ({ labels, className, style }) => (
  <div className={cn("flex flex-wrap gap-2", className)}>
    {labels.map((label, index) => (
      <Badge key={index} variant="secondary" style={styleForView(style)}>
        {label}
      </Badge>
    ))}
  </div>
);

export default ViewLabels;