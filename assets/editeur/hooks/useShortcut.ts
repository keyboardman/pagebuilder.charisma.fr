import { useEffect } from "react";

/**
 *
 * @param shortcut
 * @param callback
 *
 * useShortcut('a', () => {    setCount((prev) => prev + 1)  })
 */
export const useShortcut = (
  shortcut: string,
  callback: (event: KeyboardEvent) => void,
) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Single key shortcuts (e.g. pressing a)
    if (shortcut === event.key) {
      return callback(event);
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
};
