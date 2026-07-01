import { describe, expect, it, vi } from "vitest";

vi.mock("./View", () => ({ default: () => null }));
vi.mock("./Settings", () => ({ default: () => null }));

import NodeRoot, { NODE_ROOT_TYPE } from "./index";

describe("NodeRoot configuration", () => {
  it("expose le type et la configuration par défaut", () => {
    expect(NODE_ROOT_TYPE).toBe("node-root");
    expect(NodeRoot.type).toBe(NODE_ROOT_TYPE);
    expect(NodeRoot.default.content).toEqual({
      title: "",
      background: { type: "default" },
    });
    expect(NodeRoot.button).toBeNull();
    expect(NodeRoot.view).toBeTypeOf("function");
    expect(NodeRoot.settings).toBeTypeOf("function");
  });
});
