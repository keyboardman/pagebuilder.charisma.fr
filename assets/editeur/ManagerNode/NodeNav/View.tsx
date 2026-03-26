import { type FC, useState } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import { styleForView } from "../../utils/styleHelper";
import type { NodeNavType, NodeNavOptions } from "./index";
import { cn } from "@/editeur/lib/utils";
import { IoMenuOutline } from "react-icons/io5";
import useMediaQuery, { MEDIA_MAX_TABLET } from "../../hooks/useMediaQuery";
import _ from "lodash";

const defaultOptions: NodeNavOptions = {
  direction: "horizontal",
  variant: "navbar",
  showBurger: false,
};

/** Burger visible quand largeur <= breakpoint tablette (contexte builder ou viewport) */
function useIsTabletOrSmaller(): boolean {
  const { mode, breakpoint } = useAppContext();
  const viewportMaxTablet = useMediaQuery(MEDIA_MAX_TABLET);
  const breakpointTabletOrMobile =
    mode !== APP_MODE.VIEW && (breakpoint === "tablet" || breakpoint === "mobile");
  return breakpointTabletOrMobile || viewportMaxTablet;
}

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node, getChildren } = useNodeContext();
  const isTabletOrSmaller = useIsTabletOrSmaller();
  const [burgerOpen, setBurgerOpen] = useState(false);

  const navNode = node as NodeNavType;
  const options = { ...defaultOptions, ...navNode?.content?.options };
  const children = getChildren("main");
  
  const isVertical = options.direction === "vertical";
  const variant = options.variant ?? "navbar";
  const showBurger = options.showBurger === true;
  const showBurgerLayout = showBurger && isTabletOrSmaller;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isVertical ? "column" : "row",
    justifyContent: !showBurgerLayout && options.justify ? options.justify : "flex-start",
    gap: options.gap != null ? `${options.gap * 0.25}rem` : "1rem",
    flexWrap: "wrap"
  };

  const navStyle: React.CSSProperties = navNode?.content?.nav?.style ?? {};
  const navClassName: string = navNode?.content?.nav?.className ?? "";
  const burgerStyle: React.CSSProperties = navNode?.content?.burger?.style ?? {};
  const burgerItemStyle: React.CSSProperties = navNode?.content?.burgerItem?.style ?? {};

  return (
    <>
      <nav
        data-ce-id={node.id}
        data-ce-type={node.type}
        data-ce-direction={options.direction}
        data-ce-justify={options.justify}
        data-ce-variant={variant}
        style={navStyle}
        className={cn("ce-menu", navClassName, `ce-menu--${variant}`)}
      >
        {/** Menu desktop*/}
        <div
          className={cn("ce-menu-content")}
          style={styleForView({ ...containerStyle })}
        >
          {!showBurgerLayout && (
            <NodeCollection nodes={children} parentId={node.id} zone="main" />
          )}

          {showBurgerLayout && (
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={burgerOpen}
              onClick={() => setBurgerOpen((o) => !o)}
              className="rounded hover:bg-black/5 shrink-0 text-white flex-end ml-2"
            >
              <IoMenuOutline className="w-6 h-6" />
            </button>)
          }

        </div>
        {/** Menu mobile */}

      </nav>
      {burgerOpen && (
        <div
          className="ce-menu-burger"
          style={burgerStyle}
        >
          {_.map(children, (child) => (
            <a
              href={child.content?.href}
              target={child.content?.target}
              className="ce-menu-burger-item"
              style={burgerItemStyle}
            >
              {child.content?.label}
            </a>
          ))}

        </div>
      )}
    </>
  );

};

export default View;
