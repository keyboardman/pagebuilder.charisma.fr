import { createContext, useContext } from "react";
import type { BuilderType } from "../../types/BuilderType";

export const BuilderContext = createContext<BuilderType | null>(null);

export const useBuilderContext = (): BuilderType => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilderContext must be used within a BuilderProvider");
  }
  return context;
};

// Hook sécurisé qui retourne null si le contexte n'est pas disponible
export const useBuilderContextSafe = (): BuilderType | null => {
  return useContext(BuilderContext);
};
