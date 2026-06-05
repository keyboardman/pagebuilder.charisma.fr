/* eslint-disable react/prop-types */
import React from "react";

import { Button } from "@/editeur/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/editeur/components/ui/tooltip";
import { cn } from "@/editeur/lib/utils";

import Icon from "./Icon";

type NodeComponentButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon?: React.ReactNode;
  tooltip?: string;
};

const NodeComponentButton = React.forwardRef<
  HTMLButtonElement,
  NodeComponentButtonProps
>(function NodeComponentButton(
  { label, icon, className, tooltip, ...rest }: NodeComponentButtonProps,
  ref
) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          type="button"
          variant="outline"
          className={cn(
            "flex aspect-square h-20 w-full max-w-32 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card text-xs font-medium uppercase tracking-wide text-foreground shadow-sm transition focus-visible:ring-ring cursor-grab select-none active:cursor-grabbing hover:border-accent hover:bg-accent",
            className
          )}
          {...rest}
        >
          {icon ? (
            <Icon className="text-xl text-accent-foreground" icon={icon} />
          ) : null}
          <span className="text-xs text-muted-foreground">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <div
            dangerouslySetInnerHTML={{
                __html: tooltip || label,
            }}
        />
      </TooltipContent>
    </Tooltip>

  );
});

NodeComponentButton.displayName = "NodeComponentButton";

export default NodeComponentButton;