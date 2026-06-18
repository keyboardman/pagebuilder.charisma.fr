const CANVAS_SELECTOR = ".admin-layout__main";

function getCanvasElement(): HTMLElement | null {
  return document.querySelector(CANVAS_SELECTOR);
}

export function getCanvasScrollRatio(): number {
  const el = getCanvasElement();
  if (!el) {
    return 0;
  }

  const maxScroll = el.scrollHeight - el.clientHeight;
  if (maxScroll <= 0) {
    return 0;
  }

  return el.scrollTop / maxScroll;
}

export function restoreCanvasScrollRatio(ratio: number): void {
  const el = getCanvasElement();
  if (!el) {
    return;
  }

  const maxScroll = el.scrollHeight - el.clientHeight;
  if (maxScroll <= 0) {
    el.scrollTop = 0;
    return;
  }

  el.scrollTop = Math.round(Math.max(0, Math.min(1, ratio)) * maxScroll);
}
