import type { CSSProperties } from "react";
import { cn } from "@/editeur/lib/utils";
import type { NodeTextIconName, NodeTextIconSizeVariant, NodeTextIconSource } from "./index";
import { ceIconBackgroundImageStyle, ceIconClassNames, sanitizeThemeIconClass } from "./shared";

interface MediaProps {
  iconSource: NodeTextIconSource;
  presetIcon: NodeTextIconName;
  themeIconClass?: string;
  themeIconUrl?: string;
  iconImageUrl?: string;
  iconSizeVariant: NodeTextIconSizeVariant;
  style?: CSSProperties;
}

/** Rendu : `<i className="ce-icon">` (+ small/large), image ou URL thème via `backgroundImage`. */
export function NodeTextIconMedia({
  iconSource,
  presetIcon,
  themeIconClass,
  themeIconUrl,
  iconImageUrl,
  iconSizeVariant,
  style,
}: MediaProps) {
  const baseStyle: CSSProperties = { flexShrink: 0, ...style };
  const sizeClass = ceIconClassNames(iconSizeVariant);

  if (iconSource === "image") {
    const url = (iconImageUrl ?? "").trim();
    if (!url) {
      return null;
    }
    return (
      <i
        className={sizeClass}
        style={{ ...baseStyle, ...ceIconBackgroundImageStyle(url) }}
        aria-hidden
      />
    );
  }

  if (iconSource === "theme") {
    const cls = sanitizeThemeIconClass(themeIconClass ?? "");
    if (cls) {
      return <i className={cn(sizeClass, cls)} style={baseStyle} aria-hidden />;
    }
    const u = (themeIconUrl ?? "").trim();
    if (!u) {
      return null;
    }
    return (
      <i
        className={sizeClass}
        style={{ ...baseStyle, ...ceIconBackgroundImageStyle(u) }}
        aria-hidden
      />
    );
  }

  if (presetIcon === "none") {
    return null;
  }

  return (
    <i
      className={cn(sizeClass, `ce-icon-preset-${presetIcon}`)}
      style={baseStyle}
      aria-hidden
    />
  );
}
