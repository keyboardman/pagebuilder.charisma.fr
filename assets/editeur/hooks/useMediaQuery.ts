import { useState, useEffect } from "react";

/**
 * Retourne true quand la viewport correspond à la media query.
 * Breakpoint tablet Tailwind md = 768px → max-width: 767px = tablet ou plus petit.
 */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** true quand largeur viewport <= breakpoint tablette (767px) */
export const MEDIA_MAX_TABLET = "(max-width: 767px)";
