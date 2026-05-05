import { type CSSProperties, type FC, useEffect, useMemo, useState } from "react";
import { IoArrowUpOutline } from "react-icons/io5";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeTopButtonType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import _ from "lodash";


const View: FC<NodeViewProps> = () => {
  const { mode } = useAppContext();
  const { node } = useNodeContext();
  const topButtonNode = node as NodeTopButtonType;
  const isFloatingMode = mode === APP_MODE.VIEW || mode === APP_MODE.PREVIEW;
  const [isVisible, setIsVisible] = useState(!isFloatingMode);
  const style = styleForView(node?.attributes?.style ?? {});
  const horizontalAlign = topButtonNode.content?.horizontalAlign ?? "right";
  const offsetBottom = topButtonNode.content?.offsetBottom ?? 24;
  const offsetSide = topButtonNode.content?.offsetSide ?? 24;

  const scrollContainer = useMemo(() => {
    let _container = null;
    if (mode === APP_MODE.PREVIEW) {
      _container = document.querySelector(".admin-layout__main") as HTMLElement | null;
    }
    if (mode === APP_MODE.VIEW) {
      _container = window;
    }
    return _container;
  }, [mode]);

  

  useEffect(() => {
    if (!isFloatingMode) {
      setIsVisible(true);
      return;
    }

    const onScroll = () => {
      const scrollTop = mode === APP_MODE.PREVIEW ? (scrollContainer as HTMLElement | null)?.scrollTop ?? 0 : window.scrollY ?? 0;
      setIsVisible(scrollTop > 0);
    };

    onScroll();
    scrollContainer?.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollContainer?.removeEventListener("scroll", onScroll);
  }, [isFloatingMode, mode, scrollContainer]);


  if (!isVisible) {
    return null;
  }

  const computedStyle: CSSProperties = isFloatingMode
    ? {
        ...style,
        position: "fixed",
        bottom: `${offsetBottom}px`,
        zIndex: 1000,
        left: horizontalAlign === "left" ? `${offsetSide}px` : "auto",
        right: horizontalAlign === "right" ? `${offsetSide}px` : "auto",
      }
    : style;

  return (
    <button
      type="button"
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id ?? undefined}
      className={cn("ce-top-button", isFloatingMode && "ce-top-button--fixed", node?.attributes?.className ?? "")}
      style={computedStyle}
      onClick={() => {
        scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
      }}
      aria-label={topButtonNode.content?.ariaLabel ?? "Retour en haut"}
    >
      <IoArrowUpOutline size={20} color={topButtonNode.content?.iconColor ?? "#ffffff"} />
    </button>
  );
};

export default View;
