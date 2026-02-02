import { type PropsWithChildren } from "react";
import { cn } from "@editeur/lib/utils";
import { Button } from "@editeur/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@editeur/components/ui/tooltip";

interface SidebarLeftProps extends PropsWithChildren {
  collapsed?: boolean;
  onToggle?: () => void;
  dark?: boolean;
}

const SidebarLeft = ({ children, collapsed = false, onToggle, dark = false }: SidebarLeftProps) => {
  return (
    <div className="relative">
      <aside 
        className={cn(
          "admin-layout__left flex flex-col gap-6 overflow-y-auto bg-sidebar px-5 py-6 backdrop-blur transition-all duration-700 ease-in-out min-h-full h-full",
          collapsed && "admin-layout__left--collapsed",
          dark && "dark"
        )}
      >
        {!collapsed && children}
      </aside>
      {onToggle && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onToggle}
                aria-label={collapsed ? "Afficher la sidebar" : "Masquer la sidebar"}
                className={cn(
                  "absolute top-4 z-50 h-8 w-8 rounded-full border-2 bg-background shadow-md transition-all",
                  collapsed ? "left-2" : "right-[-16px]"
                )}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {collapsed ? "Afficher la bibliothèque" : "Masquer la bibliothèque"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default SidebarLeft;