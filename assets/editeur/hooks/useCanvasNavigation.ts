import { useCallback } from "react";
import { APP_MODE, useAppContext } from "../services/providers/AppContext";

export function useCanvasNavigation() {
  const { mode } = useAppContext();
  const isEditMode = mode === APP_MODE.EDIT;

  const preventLinkClick = useCallback(
    (event: React.MouseEvent) => {
      if (isEditMode) {
        event.preventDefault();
      }
    },
    [isEditMode]
  );

  const runNavigation = useCallback(
    (action: () => void) => {
      if (!isEditMode) {
        action();
      }
    },
    [isEditMode]
  );

  return { isEditMode, isNavigationEnabled: !isEditMode, preventLinkClick, runNavigation };
}
