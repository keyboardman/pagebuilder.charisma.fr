const BOLD_TAGS = new Set(["STRONG", "B"]);

function serializeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as Element;
  const inner = Array.from(element.childNodes).map(serializeNode).join("");

  if (BOLD_TAGS.has(element.tagName)) {
    return `<strong>${inner}</strong>`;
  }

  return inner;
}

/** Libellé NodeButton : texte brut ou HTML inline limité à strong/b. */
export function sanitizeButtonLabelHtml(html: string): string {
  const value = html ?? "";
  if (!value || !/[<>]/.test(value)) {
    return value;
  }

  const doc = new DOMParser().parseFromString(value, "text/html");
  return Array.from(doc.body.childNodes).map(serializeNode).join("");
}
