import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { vi } from "vitest";
import { NodeBuilderContext } from "@editeur/services/providers/NodeBuilderContext";
import type { NodeType } from "@editeur/types/NodeType";

type RenderWithNodeBuilderOptions = Omit<RenderOptions, "wrapper"> & {
  onChange?: ReturnType<typeof vi.fn>;
};

export function renderWithNodeBuilder(
  ui: ReactElement,
  node: NodeType,
  options: RenderWithNodeBuilderOptions = {}
) {
  const onChange = options.onChange ?? vi.fn();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NodeBuilderContext.Provider
        value={{
          node,
          drag: { ref: vi.fn(), handleRef: vi.fn() },
          onSelect: vi.fn(),
          onDelete: vi.fn(),
          onDuplicate: vi.fn(),
          onChange,
          getChildren: () => ({}),
          isSelected: () => false,
        }}
      >
        {children}
      </NodeBuilderContext.Provider>
    );
  }

  return {
    onChange,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}
