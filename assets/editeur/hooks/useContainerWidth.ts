import { useEffect, useRef, useState } from "react";

export function useContainerWidth<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let previousWidth = element.offsetWidth;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const newWidth = entry.contentRect.width;

      if (newWidth !== previousWidth) {
        previousWidth = newWidth;
        setWidth(newWidth);
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
}