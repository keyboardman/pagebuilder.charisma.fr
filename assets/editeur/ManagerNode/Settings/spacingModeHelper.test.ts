import { describe, expect, it } from "vitest";
import {
    applyPerSideValue,
    applyUnifiedValue,
    buildShorthandSpacing,
    collapsePerSideToUnified,
    detectSpacingMode,
    expandUnifiedToPerSide,
    getUnifiedValue,
} from "./spacingModeHelper";

describe("detectSpacingMode", () => {
    it("retourne unified pour un shorthand seul", () => {
        expect(detectSpacingMode({ margin: "1rem" }, "margin")).toBe("unified");
    });

    it("retourne unified pour des longhands égaux sur les quatre côtés", () => {
        expect(
            detectSpacingMode(
                { paddingTop: "1rem", paddingRight: "1rem", paddingBottom: "1rem", paddingLeft: "1rem" },
                "padding",
            ),
        ).toBe("unified");
    });

    it("retourne per-side pour des longhands asymétriques", () => {
        expect(
            detectSpacingMode({ marginTop: "1rem", marginBottom: "2rem" }, "margin"),
        ).toBe("per-side");
    });

    it("retourne per-side quand seulement certains côtés sont définis", () => {
        expect(detectSpacingMode({ paddingTop: "1rem" }, "padding")).toBe("per-side");
    });

    it("retourne unified quand tout est vide", () => {
        expect(detectSpacingMode({}, "margin")).toBe("unified");
    });
});

describe("getUnifiedValue", () => {
    it("lit le shorthand", () => {
        expect(getUnifiedValue({ margin: "2rem" }, "margin")).toBe("2rem");
    });

    it("lit une valeur commune sur les quatre longhands", () => {
        expect(
            getUnifiedValue(
                { marginTop: "1rem", marginRight: "1rem", marginBottom: "1rem", marginLeft: "1rem" },
                "margin",
            ),
        ).toBe("1rem");
    });

    it("retourne une chaîne vide pour des longhands partiels", () => {
        expect(getUnifiedValue({ paddingTop: "1rem", paddingBottom: "2rem" }, "padding")).toBe("");
    });

    it("dérive une shorthand à deux valeurs depuis les longhands", () => {
        expect(
            getUnifiedValue(
                { paddingTop: "10px", paddingRight: "5px", paddingBottom: "10px", paddingLeft: "5px" },
                "padding",
            ),
        ).toBe("10px 5px");
    });
});

describe("applyUnifiedValue", () => {
    it("écrit le shorthand et supprime les longhands", () => {
        expect(
            applyUnifiedValue(
                { marginTop: "1rem", marginRight: "2rem", margin: "old" },
                "margin",
                "1.5rem",
            ),
        ).toEqual({ margin: "1.5rem" });
    });

    it("supprime le shorthand quand la valeur est vide", () => {
        expect(applyUnifiedValue({ margin: "1rem", marginTop: "1rem" }, "margin", "")).toEqual({});
    });
});

describe("applyPerSideValue", () => {
    it("écrit un longhand et supprime le shorthand", () => {
        expect(applyPerSideValue({ padding: "1rem" }, "padding", "top", "2rem")).toEqual({
            paddingTop: "2rem",
        });
    });
});

describe("expandUnifiedToPerSide", () => {
    it("répartit la valeur unifiée sur les quatre côtés", () => {
        expect(expandUnifiedToPerSide({ margin: "1rem" }, "margin")).toEqual({
            marginTop: "1rem",
            marginRight: "1rem",
            marginBottom: "1rem",
            marginLeft: "1rem",
        });
    });

    it("décompose une shorthand à deux valeurs (vertical horizontal)", () => {
        expect(expandUnifiedToPerSide({ padding: "10px 5px" }, "padding")).toEqual({
            paddingTop: "10px",
            paddingRight: "5px",
            paddingBottom: "10px",
            paddingLeft: "5px",
        });
    });

    it("décompose une shorthand à trois valeurs (top horizontal bottom)", () => {
        expect(expandUnifiedToPerSide({ margin: "10px 5px 5px" }, "margin")).toEqual({
            marginTop: "10px",
            marginRight: "5px",
            marginBottom: "5px",
            marginLeft: "5px",
        });
    });

    it("décompose une shorthand à quatre valeurs (top right bottom left)", () => {
        expect(expandUnifiedToPerSide({ padding: "10px 5px 5px 10px" }, "padding")).toEqual({
            paddingTop: "10px",
            paddingRight: "5px",
            paddingBottom: "5px",
            paddingLeft: "10px",
        });
    });

    it("préserve calc() lors du découpage", () => {
        expect(expandUnifiedToPerSide({ margin: "calc(10px + 5px) 2rem" }, "margin")).toEqual({
            marginTop: "calc(10px + 5px)",
            marginRight: "2rem",
            marginBottom: "calc(10px + 5px)",
            marginLeft: "2rem",
        });
    });
});

describe("buildShorthandSpacing", () => {
    it("retourne une valeur unique quand les quatre côtés sont égaux", () => {
        expect(
            buildShorthandSpacing({ top: "1rem", right: "1rem", bottom: "1rem", left: "1rem" }),
        ).toBe("1rem");
    });

    it("retourne deux valeurs (vertical horizontal)", () => {
        expect(
            buildShorthandSpacing({ top: "10px", right: "5px", bottom: "10px", left: "5px" }),
        ).toBe("10px 5px");
    });

    it("retourne trois valeurs (top horizontal bottom)", () => {
        expect(
            buildShorthandSpacing({ top: "10px", right: "5px", bottom: "5px", left: "5px" }),
        ).toBe("10px 5px 5px");
    });

    it("retourne quatre valeurs quand tous les côtés diffèrent", () => {
        expect(
            buildShorthandSpacing({ top: "10px", right: "5px", bottom: "5px", left: "10px" }),
        ).toBe("10px 5px 5px 10px");
    });
});

describe("collapsePerSideToUnified", () => {
    it("convertit des longhands égaux en shorthand", () => {
        expect(
            collapsePerSideToUnified(
                { paddingTop: "1rem", paddingRight: "1rem", paddingBottom: "1rem", paddingLeft: "1rem" },
                "padding",
            ),
        ).toEqual({ padding: "1rem" });
    });

    it("convertit des longhands à deux valeurs en shorthand", () => {
        expect(
            collapsePerSideToUnified(
                { marginTop: "10px", marginRight: "5px", marginBottom: "10px", marginLeft: "5px" },
                "margin",
            ),
        ).toEqual({ margin: "10px 5px" });
    });

    it("convertit des longhands à trois valeurs en shorthand", () => {
        expect(
            collapsePerSideToUnified(
                { paddingTop: "10px", paddingRight: "5px", paddingBottom: "5px", paddingLeft: "5px" },
                "padding",
            ),
        ).toEqual({ padding: "10px 5px 5px" });
    });

    it("convertit des longhands à quatre valeurs distinctes en shorthand", () => {
        expect(
            collapsePerSideToUnified(
                { marginTop: "10px", marginRight: "5px", marginBottom: "5px", marginLeft: "10px" },
                "margin",
            ),
        ).toEqual({ margin: "10px 5px 5px 10px" });
    });

    it("ne modifie pas des longhands partiels", () => {
        const style = { marginTop: "1rem", marginBottom: "2rem" };
        expect(collapsePerSideToUnified(style, "margin")).toEqual(style);
    });
});
