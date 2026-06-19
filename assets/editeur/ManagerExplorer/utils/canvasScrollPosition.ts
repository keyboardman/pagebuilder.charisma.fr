import type { NodeID } from "../../types/NodeType";

const CANVAS_SELECTOR = ".admin-layout__main";
const BREAKPOINT_WIDTH_TRANSITION_MS = 520;
const LAYOUT_STABLE_MAX_WAIT_MS = 1200;
const LAYOUT_STABLE_FRAMES = 3;

export type CanvasScrollAnchor =
  | { type: "node"; nodeId: NodeID; offsetFromViewportTop: number }
  | { type: "ratio"; ratio: number };

export type CanvasScrollRestoreReason = "mode" | "breakpoint";

let activeRestoreCancel: (() => void) | null = null;

function getCanvasElement(): HTMLElement | null {
  return document.querySelector(CANVAS_SELECTOR);
}

function getCanvasScrollRatio(canvas: HTMLElement): number {
  const maxScroll = canvas.scrollHeight - canvas.clientHeight;
  if (maxScroll <= 0) {
    return 0;
  }

  return canvas.scrollTop / maxScroll;
}

function restoreCanvasScrollRatio(canvas: HTMLElement, ratio: number): void {
  const maxScroll = canvas.scrollHeight - canvas.clientHeight;
  if (maxScroll <= 0) {
    canvas.scrollTop = 0;
    return;
  }

  canvas.scrollTop = Math.round(Math.max(0, Math.min(1, ratio)) * maxScroll);
}

function findNodeIdFromElement(el: Element | null, canvas: HTMLElement): NodeID | null {
  let current: Element | null = el;

  while (current && current !== canvas) {
    if (current instanceof HTMLElement) {
      const nodeId = current.getAttribute("data-ce-id");
      if (nodeId) {
        return nodeId;
      }
    }
    current = current.parentElement;
  }

  return null;
}

function findClosestNodeByViewportCenter(canvas: HTMLElement, centerY: number): NodeID | null {
  const nodes = canvas.querySelectorAll<HTMLElement>("[data-ce-id]");
  let bestId: NodeID | null = null;
  let bestDistance = Infinity;

  for (const node of nodes) {
    const rect = node.getBoundingClientRect();
    const containsCenter = rect.top <= centerY && rect.bottom >= centerY;
    const distance = containsCenter
      ? Math.abs(rect.top + rect.height / 2 - centerY) - 10_000
      : Math.min(Math.abs(rect.top - centerY), Math.abs(rect.bottom - centerY));

    if (distance < bestDistance) {
      bestDistance = distance;
      bestId = node.getAttribute("data-ce-id");
    }
  }

  return bestId;
}

export function getCanvasAnchorNodeId(): NodeID | null {
  const canvas = getCanvasElement();
  if (!canvas) {
    return null;
  }

  const rect = canvas.getBoundingClientRect();
  const centerX = Math.min(Math.max(rect.left + 8, rect.left + rect.width / 2), rect.right - 8);
  const centerY = Math.min(
    Math.max(rect.top + 8, rect.top + canvas.clientHeight / 2),
    rect.bottom - 8
  );

  const fromPoint = findNodeIdFromElement(document.elementFromPoint(centerX, centerY), canvas);
  if (fromPoint) {
    return fromPoint;
  }

  return findClosestNodeByViewportCenter(canvas, centerY);
}

export function captureCanvasScrollAnchor(): CanvasScrollAnchor {
  const canvas = getCanvasElement();
  if (!canvas) {
    return { type: "ratio", ratio: 0 };
  }

  const nodeId = getCanvasAnchorNodeId();
  if (nodeId) {
    const el = canvas.querySelector(`[data-ce-id="${CSS.escape(nodeId)}"]`);
    if (el) {
      const canvasRect = canvas.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      return {
        type: "node",
        nodeId,
        offsetFromViewportTop: elRect.top - canvasRect.top,
      };
    }
  }

  return { type: "ratio", ratio: getCanvasScrollRatio(canvas) };
}

export function restoreCanvasAnchorNode(
  nodeId: NodeID,
  offsetFromViewportTop: number
): void {
  const canvas = getCanvasElement();
  if (!canvas) {
    return;
  }

  const el = canvas.querySelector(`[data-ce-id="${CSS.escape(nodeId)}"]`);
  if (!el) {
    return;
  }

  const canvasRect = canvas.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const relativeTop = elRect.top - canvasRect.top + canvas.scrollTop;
  const maxScroll = canvas.scrollHeight - canvas.clientHeight;

  canvas.scrollTop = Math.round(
    Math.max(0, Math.min(maxScroll, relativeTop - offsetFromViewportTop))
  );
}

export function restoreCanvasScrollAnchor(anchor: CanvasScrollAnchor): void {
  if (anchor.type === "node") {
    restoreCanvasAnchorNode(anchor.nodeId, anchor.offsetFromViewportTop);
    return;
  }

  const canvas = getCanvasElement();
  if (!canvas) {
    return;
  }

  restoreCanvasScrollRatio(canvas, anchor.ratio);
}

function getLayoutObserveTarget(canvas: HTMLElement): HTMLElement {
  return canvas.querySelector<HTMLElement>(".node-root-content") ?? canvas;
}

function getBreakpointWidthTransitionTarget(canvas: HTMLElement): HTMLElement | null {
  return canvas.querySelector<HTMLElement>(".node-root-content > div");
}

function waitForLayoutStable(
  element: HTMLElement,
  onSettled: () => void,
  maxWaitMs: number
): () => void {
  let lastWidth = element.clientWidth;
  let lastHeight = element.scrollHeight;
  let stableFrames = 0;
  let rafId = 0;
  let timeoutId = 0;
  let done = false;

  const cleanup = () => {
    window.clearTimeout(timeoutId);
    window.cancelAnimationFrame(rafId);
    observer.disconnect();
  };

  const finish = () => {
    if (done) {
      return;
    }
    done = true;
    cleanup();
    onSettled();
  };

  const tick = () => {
    const width = element.clientWidth;
    const height = element.scrollHeight;

    if (width === lastWidth && height === lastHeight) {
      stableFrames += 1;
      if (stableFrames >= LAYOUT_STABLE_FRAMES) {
        finish();
        return;
      }
    } else {
      stableFrames = 0;
      lastWidth = width;
      lastHeight = height;
    }

    rafId = window.requestAnimationFrame(tick);
  };

  const observer = new ResizeObserver(() => {
    stableFrames = 0;
  });

  observer.observe(element);
  rafId = window.requestAnimationFrame(tick);
  timeoutId = window.setTimeout(finish, maxWaitMs);

  return cleanup;
}

function waitForBreakpointWidthTransition(
  target: HTMLElement,
  onComplete: () => void
): () => void {
  let done = false;
  let timeoutId = 0;

  const cleanup = () => {
    window.clearTimeout(timeoutId);
    target.removeEventListener("transitionend", onTransitionEnd);
  };

  const finish = () => {
    if (done) {
      return;
    }
    done = true;
    cleanup();
    onComplete();
  };

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== target) {
      return;
    }

    if (event.propertyName === "max-width" || event.propertyName === "width") {
      finish();
    }
  };

  target.addEventListener("transitionend", onTransitionEnd);
  timeoutId = window.setTimeout(finish, BREAKPOINT_WIDTH_TRANSITION_MS);

  return cleanup;
}

function restoreCanvasScrollAnchorAfterLayout(
  anchor: CanvasScrollAnchor,
  reason: CanvasScrollRestoreReason
): () => void {
  const canvas = getCanvasElement();
  if (!canvas) {
    restoreCanvasScrollAnchor(anchor);
    return () => undefined;
  }

  const observeTarget = getLayoutObserveTarget(canvas);
  let cancelLayoutWatch: (() => void) | null = null;
  let cancelWidthTransition: (() => void) | null = null;
  let cancelled = false;

  const startLayoutWatch = () => {
    if (cancelled) {
      return;
    }

    cancelLayoutWatch?.();
    cancelLayoutWatch = waitForLayoutStable(
      observeTarget,
      () => {
        if (!cancelled) {
          restoreCanvasScrollAnchor(anchor);
        }
      },
      LAYOUT_STABLE_MAX_WAIT_MS
    );
  };

  const cancel = () => {
    cancelled = true;
    cancelWidthTransition?.();
    cancelLayoutWatch?.();
  };

  if (reason === "breakpoint") {
    const widthTarget = getBreakpointWidthTransitionTarget(canvas);
    if (!widthTarget) {
      startLayoutWatch();
      return cancel;
    }

    cancelWidthTransition = waitForBreakpointWidthTransition(widthTarget, startLayoutWatch);
    return cancel;
  }

  window.requestAnimationFrame(startLayoutWatch);
  return cancel;
}

export function scheduleCanvasScrollAnchorRestore(
  anchor: CanvasScrollAnchor,
  reason: CanvasScrollRestoreReason
): void {
  activeRestoreCancel?.();
  activeRestoreCancel = restoreCanvasScrollAnchorAfterLayout(anchor, reason);
}
