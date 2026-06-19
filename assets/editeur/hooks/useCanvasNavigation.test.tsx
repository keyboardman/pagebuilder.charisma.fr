import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AppContext, APP_MODE, type AppType } from "../services/providers/AppContext";
import { useCanvasNavigation } from "./useCanvasNavigation";

function createAppContextValue(mode: AppType["mode"]): AppType {
  return {
    nodes: {},
    setNodes: () => undefined,
    getNode: () => null,
    getChildren: () => ({}),
    mode,
    setMode: () => undefined,
    breakpoint: "desktop",
    setBreakpoint: () => undefined,
    fileManagerConfig: null,
    themeIcons: [],
    themeNodeOverrides: {},
    themeVars: {},
    pageBuilderApiBaseUrl: null,
  };
}

function wrapper(mode: AppType["mode"]) {
  return function AppWrapper({ children }: { children: ReactNode }) {
    return (
      <AppContext.Provider value={createAppContextValue(mode)}>
        {children}
      </AppContext.Provider>
    );
  };
}

describe("useCanvasNavigation", () => {
  it("désactive la navigation en mode édition", () => {
    const { result } = renderHook(() => useCanvasNavigation(), {
      wrapper: wrapper(APP_MODE.EDIT),
    });

    expect(result.current.isEditMode).toBe(true);
    expect(result.current.isNavigationEnabled).toBe(false);
  });

  it("active la navigation hors mode édition", () => {
    const { result } = renderHook(() => useCanvasNavigation(), {
      wrapper: wrapper(APP_MODE.PREVIEW),
    });

    expect(result.current.isNavigationEnabled).toBe(true);
  });

  it("empêche le clic sur les liens en mode édition", () => {
    const { result } = renderHook(() => useCanvasNavigation(), {
      wrapper: wrapper(APP_MODE.EDIT),
    });

    const event = { preventDefault: vi.fn() } as unknown as React.MouseEvent;
    result.current.preventLinkClick(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("n'exécute pas l'action de navigation en mode édition", () => {
    const { result } = renderHook(() => useCanvasNavigation(), {
      wrapper: wrapper(APP_MODE.EDIT),
    });

    const action = vi.fn();
    result.current.runNavigation(action);

    expect(action).not.toHaveBeenCalled();
  });

  it("exécute l'action de navigation en mode preview", () => {
    const { result } = renderHook(() => useCanvasNavigation(), {
      wrapper: wrapper(APP_MODE.PREVIEW),
    });

    const action = vi.fn();
    result.current.runNavigation(action);

    expect(action).toHaveBeenCalledOnce();
  });
});
