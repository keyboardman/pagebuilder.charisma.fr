import { type PropsWithChildren } from "react";
import { cn } from "@editeur/lib/utils";

interface SidebarRightProps extends PropsWithChildren {
  dark?: boolean;
}

const SidebarRight = ({ children, dark = false }: SidebarRightProps) => {
  // "admin-layout__right relative flex flex-col gap-6 bg-sidebar px-5 py-6 backdrop-blur h-full min-h-0"
  return (
    <aside className={cn("admin-layout__right relative gap-6 bg-sidebar px-5 py-6 ", dark && "dark")}>
      {children}
    </aside>
  );
};

export default SidebarRight;