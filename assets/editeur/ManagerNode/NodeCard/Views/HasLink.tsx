import type { ReactNode } from "react";
import { useCanvasNavigation } from "@/editeur/hooks/useCanvasNavigation";

const HasLink = ({ link, children }: { link: string; children: ReactNode }) => {
  const { preventLinkClick } = useCanvasNavigation();

  if (!link) return children;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="ce-card-link"
      onClick={preventLinkClick}
    >
      {children}
    </a>
  );
};

export default HasLink;
