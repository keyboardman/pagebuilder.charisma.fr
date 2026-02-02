import { type PropsWithChildren } from "react";
import { cn } from "@editeur/lib/utils";

interface HeaderProps extends PropsWithChildren {
  dark?: boolean;
}

const Header = ({ children, dark = false }: HeaderProps) => (
  <header className={cn("admin-layout__header border-b border-border bg-card px-6 py-4 shadow-sm backdrop-blur", dark && "dark")}>
    {children}
  </header>
);

export default Header;