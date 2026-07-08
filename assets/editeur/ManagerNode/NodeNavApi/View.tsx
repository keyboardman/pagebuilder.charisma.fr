import { type FC, useEffect, useRef, useState } from "react";
import { useNodeContext } from "../../services/providers/NodeContext";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import { styleForView } from "../../utils/styleHelper";
import type { NodeNavApiType, NodeNavApiOptions, NavApiLinkItem } from "./index";
import { cn } from "@/editeur/lib/utils";
import { IoMenuOutline } from "react-icons/io5";
import useMediaQuery, { MEDIA_MAX_TABLET } from "../../hooks/useMediaQuery";

const defaultOptions: NodeNavApiOptions = {
  direction: "horizontal",
  variant: "navbar",
  showBurger: false,
  scrollWithoutScrollbar: false,
};

function useIsTabletOrSmaller(): boolean {
  const { mode, breakpoint } = useAppContext();
  const viewportMaxTablet = useMediaQuery(MEDIA_MAX_TABLET);
  const breakpointTabletOrMobile =
    mode !== APP_MODE.VIEW && (breakpoint === "tablet" || breakpoint === "mobile");
  return breakpointTabletOrMobile || viewportMaxTablet;
}

function mapItemsToLinks(items: Array<{ id?: unknown; title?: unknown; link?: unknown }>): NavApiLinkItem[] {
  return items
    .map((item) => {
      const id = String(item.id ?? "");
      const link = typeof item.link === "string" ? item.link.trim() : String(item.link ?? "");
      const title = typeof item.title === "string" ? item.title.trim() : String(item.title ?? "");
      if (!id || !link || !title) {
        return null;
      }

      return { id, title, link };
    })
    .filter((item): item is NavApiLinkItem => item !== null);
}

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node } = useNodeContext();
  const isTabletOrSmaller = useIsTabletOrSmaller();
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [links, setLinks] = useState<NavApiLinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const navNode = node as NodeNavApiType;
  const apiId = navNode.content?.apiId ?? "";
  const options = { ...defaultOptions, ...navNode?.content?.options };
  const linkTarget = options.target ?? "_self";

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!apiId) {
        setLinks([]);
        setError(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const res = await fetch(`/api/page-builder/lists/${encodeURIComponent(apiId)}/items`, {
          credentials: "same-origin",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error("fetch list items failed");
        }

        const data = (await res.json()) as { items: Array<{ id?: unknown; title?: unknown; link?: unknown }> };
        if (!cancelled) {
          setLinks(mapItemsToLinks(data.items ?? []));
        }
      } catch {
        if (!cancelled) {
          setLinks([]);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [apiId]);

  const isVertical = options.direction === "vertical";
  const variant = options.variant ?? "navbar";
  const showBurger = options.showBurger === true;
  const showBurgerLayout = showBurger && isTabletOrSmaller;
  const scrollWithoutScrollbar = options.scrollWithoutScrollbar === true && !showBurgerLayout;

  useEffect(() => {
    if (!scrollWithoutScrollbar || isVertical) {
      return;
    }

    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (delta === 0) {
        return;
      }

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) {
        return;
      }

      const next = Math.max(0, Math.min(maxScroll, el.scrollLeft + delta));
      if (next === el.scrollLeft) {
        return;
      }

      el.scrollLeft = next;
      event.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [scrollWithoutScrollbar, isVertical, links.length]);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isVertical ? "column" : "row",
    justifyContent: !showBurgerLayout && options.justify ? options.justify : "flex-start",
    gap: options.gap != null ? `${options.gap * 0.25}rem` : "1rem",
    flexWrap: scrollWithoutScrollbar ? "nowrap" : "wrap",
  };

  const navStyle: React.CSSProperties = navNode?.content?.nav?.style ?? {};
  const navClassName: string = navNode?.content?.nav?.className ?? "";
  const burgerStyle: React.CSSProperties = navNode?.content?.burger?.style ?? {};
  const burgerItemStyle: React.CSSProperties = navNode?.content?.burgerItem?.style ?? {};

  const renderLink = (item: NavApiLinkItem, className: string, style?: React.CSSProperties) => (
    <a
      key={item.id}
      href={item.link}
      target={linkTarget}
      rel={linkTarget === "_blank" ? "noopener noreferrer" : undefined}
      className={className}
      style={style}
    >
      {item.title}
    </a>
  );

  const menuLinks = !showBurgerLayout ? links.map((item) => renderLink(item, "ce-nav-item")) : null;

  const menuContent = (
    <div className="ce-menu-content" style={styleForView({ ...containerStyle })}>
      {menuLinks}
      {showBurgerLayout && (
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={burgerOpen}
          onClick={() => setBurgerOpen((open) => !open)}
          className="rounded hover:bg-black/5 shrink-0 text-white flex-end ml-2"
        >
          <IoMenuOutline className="w-6 h-6" />
        </button>
      )}
    </div>
  );

  return (
    <>
      <nav
        data-ce-id={node.id}
        data-ce-type={node.type}
        data-ce-direction={options.direction}
        data-ce-justify={options.justify}
        data-ce-variant={variant}
        data-ce-scroll={scrollWithoutScrollbar ? "true" : "false"}
        style={navStyle}
        className={cn(
          "ce-menu",
          "ce-menu-api",
          navClassName,
          `ce-menu--${variant}`,
          scrollWithoutScrollbar && "ce-menu-api--scroll"
        )}
      >
        {scrollWithoutScrollbar ? (
          <div
            ref={scrollRef}
            className="ce-menu-api-scroll"
            tabIndex={0}
            role="region"
            aria-label="Menu défilant"
          >
            {menuContent}
          </div>
        ) : (
          menuContent
        )}

        {loading ? <span className="ce-menu-api-status text-xs text-muted-foreground">Chargement…</span> : null}
        {!loading && error ? (
          <span className="ce-menu-api-status text-xs text-muted-foreground">Menu indisponible</span>
        ) : null}
        {!loading && !error && !apiId ? (
          <span className="ce-menu-api-status text-xs text-muted-foreground">Sélectionnez une API list</span>
        ) : null}
      </nav>

      {burgerOpen && showBurgerLayout ? (
        <div className="ce-menu-burger" style={burgerStyle}>
          {links.map((item) => renderLink(item, "ce-menu-burger-item", burgerItemStyle))}
        </div>
      ) : null}
    </>
  );
};

export default View;
