import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  captureCanvasScrollAnchor,
  getCanvasAnchorNodeId,
  restoreCanvasAnchorNode,
  restoreCanvasScrollAnchor,
} from "./canvasScrollPosition";

function mountCanvas(html: string) {
  document.body.innerHTML = html;
  return document.querySelector<HTMLElement>(".admin-layout__main")!;
}

function stubCanvasMetrics(
  canvas: HTMLElement,
  { scrollHeight, clientHeight }: { scrollHeight: number; clientHeight: number }
) {
  Object.defineProperty(canvas, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
  Object.defineProperty(canvas, "clientHeight", {
    configurable: true,
    value: clientHeight,
  });
}

describe("canvasScrollPosition", () => {
  beforeEach(() => {
    document.elementFromPoint = vi.fn().mockReturnValue(null);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("capture un ratio quand le canevas est absent", () => {
    expect(captureCanvasScrollAnchor()).toEqual({ type: "ratio", ratio: 0 });
  });

  it("capture un ratio scrollé sur le canevas", () => {
    const canvas = mountCanvas(
      '<div class="admin-layout__main"><div style="height:400px"></div></div>'
    );
    stubCanvasMetrics(canvas, { scrollHeight: 400, clientHeight: 100 });
    canvas.scrollTop = 150;

    const anchor = captureCanvasScrollAnchor();

    expect(anchor).toEqual({ type: "ratio", ratio: 0.5 });
  });

  it("restaure un ratio sur le canevas", () => {
    const canvas = mountCanvas(
      '<div class="admin-layout__main"><div style="height:400px"></div></div>'
    );
    stubCanvasMetrics(canvas, { scrollHeight: 400, clientHeight: 100 });

    restoreCanvasScrollAnchor({ type: "ratio", ratio: 0.5 });

    expect(canvas.scrollTop).toBe(150);
  });

  it("restaure la position d'un nœud ancré", () => {
    const canvas = mountCanvas(`
      <div class="admin-layout__main">
        <div class="node-root-content">
          <div data-ce-id="node-1">Bloc</div>
        </div>
      </div>
    `);
    stubCanvasMetrics(canvas, { scrollHeight: 600, clientHeight: 120 });

    const node = canvas.querySelector<HTMLElement>('[data-ce-id="node-1"]')!;
    node.getBoundingClientRect = () =>
      ({
        top: 80,
        bottom: 120,
        left: 0,
        right: 100,
        width: 100,
        height: 40,
        x: 0,
        y: 80,
        toJSON: () => ({}),
      }) as DOMRect;
    canvas.getBoundingClientRect = () =>
      ({
        top: 0,
        bottom: 120,
        left: 0,
        right: 100,
        width: 100,
        height: 120,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    restoreCanvasAnchorNode("node-1", 10);

    expect(canvas.scrollTop).toBe(70);
  });

  it("retourne null sans canevas pour getCanvasAnchorNodeId", () => {
    expect(getCanvasAnchorNodeId()).toBeNull();
  });

  it("détecte un nœud via elementFromPoint", () => {
    const canvas = mountCanvas(`
      <div class="admin-layout__main">
        <div data-ce-id="node-center">Centre</div>
      </div>
    `);
    stubCanvasMetrics(canvas, { scrollHeight: 200, clientHeight: 200 });
    canvas.getBoundingClientRect = () =>
      ({
        top: 0,
        bottom: 200,
        left: 0,
        right: 200,
        width: 200,
        height: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    const node = canvas.querySelector<HTMLElement>('[data-ce-id="node-center"]')!;
    vi.mocked(document.elementFromPoint).mockReturnValue(node);

    expect(getCanvasAnchorNodeId()).toBe("node-center");
  });
});
