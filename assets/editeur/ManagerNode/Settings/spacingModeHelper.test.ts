import { describe, expect, it } from "vitest";
import {
    applyPerSideValue,
    applyUnifiedValue,
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

    it("retourne une chaîne vide pour des longhands asymétriques", () => {
        expect(getUnifiedValue({ paddingTop: "1rem", paddingBottom: "2rem" }, "padding")).toBe("");
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

    it("ne modifie pas des longhands asymétriques", () => {
        const style = { marginTop: "1rem", marginBottom: "2rem" };
        expect(collapsePerSideToUnified(style, "margin")).toEqual(style);
    });
});
