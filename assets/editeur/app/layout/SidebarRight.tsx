import { type PropsWithChildren } from "react";
import { cn } from "@/editeur/lib/utils";
import { Button } from "@/editeur/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/editeur/components/ui/tooltip";

interface SidebarRightProps extends PropsWithChildren {
  collapsed?: boolean;
  onToggle?: () => void;
  dark?: boolean;
}

const SidebarRight = ({ children, collapsed = false, onToggle, dark = false }: SidebarRightProps) => {
  return (
    <div className="relative">
      <aside
        className={cn(
          "admin-layout__right flex min-h-0 flex-col gap-6 overflow-hidden bg-sidebar px-5 py-6 backdrop-blur transition-all duration-700 ease-in-out h-full",
          collapsed && "admin-layout__right--collapsed",
          dark && "dark"
        )}
      >
        {!collapsed && (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </div>
        )}
      </aside>
      {onToggle && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onToggle}
                aria-label={collapsed ? "Afficher les réglages" : "Masquer les réglages"}
                className={cn(
                  "absolute top-4 z-50 h-8 w-8 rounded-full border-2 bg-background shadow-md transition-all",
                  collapsed ? "right-2" : "left-[-16px]"
                )}
              >
                {collapsed ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {collapsed ? "Afficher les réglages" : "Masquer les réglages"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default SidebarRight;
