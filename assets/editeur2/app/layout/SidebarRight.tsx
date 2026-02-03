import { type PropsWithChildren } from "react";
import { cn } from "@editeur/lib/utils";

interface SidebarRightProps extends PropsWithChildren {
  dark?: boolean;
}

const SidebarRight = ({ children, dark = false }: SidebarRightProps) => {
  return (
    <aside className={cn("admin-layout__right relative flex flex-col overflow-hidden bg-sidebar px-5 py-6", dark && "dark")}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </aside>
  );
};

export default SidebarRight;