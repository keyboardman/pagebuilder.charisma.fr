import { type FC } from "react";
import type { NodeRootBackground } from "./index";
import { resolveNodeRootBackground, toAbsoluteUrl } from "./backgroundUtils";

interface PageBackgroundProps {
  background?: NodeRootBackground;
}

const PageBackground: FC<PageBackgroundProps> = ({ background }) => {
  const resolved = resolveNodeRootBackground(background);

  if (resolved.type !== "video" || !resolved.url?.trim()) {
    return null;
  }

  const objectFit = resolved.objectFit === "contain" ? "contain" : "cover";

  return (
    <video
      className="node-root-page-background-video pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      style={{
        objectFit,
        objectPosition: resolved.objectPosition ?? "center",
      }}
      src={toAbsoluteUrl(resolved.url.trim())}
      poster={
        resolved.poster?.trim()
          ? toAbsoluteUrl(resolved.poster.trim())
          : undefined
      }
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
    />
  );
};

export default PageBackground;
