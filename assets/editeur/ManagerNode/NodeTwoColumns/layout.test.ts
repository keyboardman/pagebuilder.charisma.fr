import { describe, expect, it } from "vitest";
import {
  buildEditOrderClasses,
  buildResponsiveOrderClasses,
  buildResponsiveSpanClasses,
  isReversed,
} from "./layout";

describe("NodeTwoColumns layout", () => {
  it("applique l'inversion responsive par breakpoint", () => {
    const layout = {
      reverseMobile: true,
      reverseTablet: false,
      reverseDesktop: false,
    };

    expect(buildResponsiveOrderClasses(layout)).toEqual({
      left: "order-2 sm:order-1 lg:order-1",
      right: "order-1 sm:order-2 lg:order-2",
    });
  });

  it("simule un breakpoint unique en édition", () => {
    const layout = { reverseMobile: true, reverseTablet: false, reverseDesktop: false };

    expect(buildEditOrderClasses(isReversed(layout, "mobile"))).toEqual({
      left: "order-2",
      right: "order-1",
    });
    expect(buildEditOrderClasses(isReversed(layout, "desktop"))).toEqual({
      left: "order-1",
      right: "order-2",
    });
  });

  it("génère les classes lg:col-span attendues pour le desktop", () => {
    const left = buildResponsiveSpanClasses("100-100", "100-100", "33-66", false, "left");
    const right = buildResponsiveSpanClasses("100-100", "100-100", "33-66", false, "right");

    expect(left).toContain("lg:col-span-1");
    expect(right).toContain("lg:col-span-2");
  });
});
