import { type ReactNode } from "react";

/**
 * Rendu direct dans le document parent, sans iframe.
 * Utilisé pour l'intégration dans pagebuilder.charisma.fr (sans iframe).
 */
interface BuilderInlineProps {
  children: ReactNode;
}

export default function BuilderInline({ children }: BuilderInlineProps) {
  return <div className="builder-inline w-full min-h-[400px]">{children}</div>;
}
