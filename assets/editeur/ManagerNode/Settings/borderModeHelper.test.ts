import { describe, expect, it } from "vitest";
import {
    applyPerSideBorderValue,
    applyUnifiedBorderParts,
    applyUnifiedBorderValue,
    buildUnifiedBorder,
    collapsePerSideToUnified,
    detectBorderMode,
    expandUnifiedBorderToPerSide,
    getUnifiedBorder,
    getUnifiedBorderParts,
    parseUnifiedBorder,
} from "./borderModeHelper";

const ALL_SIDES_COLOR_BLUE = {
    borderTopColor: "blue",
    borderRightColor: "blue",
    borderBottomColor: "blue",
    borderLeftColor: "blue",
};

const ALL_SIDES_1PX_SOLID_BLACK = {
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: "#000",
    borderRightWidth: "1px",
    borderRightStyle: "solid",
    borderRightColor: "#000",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "#000",
    borderLeftWidth: "1px",
    borderLeftStyle: "solid",
    borderLeftColor: "#000",
};

describe("detectBorderMode", () => {
    it("retourne unified si border shorthand est defini", () => {
        expect(detectBorderMode({ border: "1px solid #000" })).toBe("unified");
    });

    it("retourne unified si les proprietes globales legacy sont definies", () => {
        expect(detectBorderMode({ borderWidth: "1px", borderStyle: "solid", borderColor: "#000" })).toBe("unified");
    });

    it("retourne per-side si un seul cote est defini", () => {
        expect(detectBorderMode({ borderBottom: "1px solid #000" })).toBe("per-side");
    });

    it("retourne per-side si les longhands par cote different", () => {
        expect(
            detectBorderMode({
                borderTopWidth: "1px",
                borderRightWidth: "2px",
                borderBottomWidth: "1px",
                borderLeftWidth: "2px",
            }),
        ).toBe("per-side");
    });
});

describe("unified border helpers", () => {
    it("construit la valeur shorthand depuis width/style/color", () => {
        expect(buildUnifiedBorder({ width: "1px", style: "solid", color: "#000" })).toBe("1px solid #000");
    });

    it("parse la valeur shorthand", () => {
        expect(parseUnifiedBorder("2px dashed #123456")).toEqual({
            width: "2px",
            style: "dashed",
            color: "#123456",
        });
    });

    it("classe un token couleur unique", () => {
        expect(parseUnifiedBorder("blue")).toEqual({
            width: "",
            style: "",
            color: "blue",
        });
    });

    it("classe un token style unique", () => {
        expect(parseUnifiedBorder("solid")).toEqual({
            width: "",
            style: "solid",
            color: "",
        });
    });

    it("parse width + style sans confondre style et width", () => {
        expect(parseUnifiedBorder("1px solid")).toEqual({
            width: "1px",
            style: "solid",
            color: "",
        });
    });

    it("parse style + color sans confondre style et width", () => {
        expect(parseUnifiedBorder("solid blue")).toEqual({
            width: "",
            style: "solid",
            color: "blue",
        });
    });

    it("lit une valeur unifiee depuis les proprietes legacy", () => {
        expect(getUnifiedBorder({ borderWidth: "1px", borderStyle: "solid", borderColor: "red" })).toBe("1px solid red");
    });

    it("retourne les parties depuis la shorthand prioritaire", () => {
        expect(getUnifiedBorderParts({ border: "3px dotted blue", borderWidth: "1px" })).toEqual({
            width: "3px",
            style: "dotted",
            color: "blue",
        });
    });
});

describe("applyUnifiedBorderParts", () => {
    it("repartit border-color sur les 4 cotes", () => {
        expect(applyUnifiedBorderParts({}, { width: "", style: "", color: "blue" })).toEqual(ALL_SIDES_COLOR_BLUE);
    });

    it("repartit width et style sur les 4 cotes sans melanger les champs", () => {
        expect(
            applyUnifiedBorderParts(ALL_SIDES_COLOR_BLUE, { width: "1px", style: "solid", color: "blue" }),
        ).toEqual({
            ...ALL_SIDES_COLOR_BLUE,
            borderTopWidth: "1px",
            borderTopStyle: "solid",
            borderRightWidth: "1px",
            borderRightStyle: "solid",
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderLeftWidth: "1px",
            borderLeftStyle: "solid",
        });
    });

    it("ne melange pas color et width lors de mises a jour successives", () => {
        let style = applyUnifiedBorderParts({}, { width: "", style: "", color: "blue" });
        style = applyUnifiedBorderParts(style, { width: "1px", style: "", color: "blue" });
        style = applyUnifiedBorderParts(style, { width: "1px", style: "solid", color: "blue" });

        expect(getUnifiedBorderParts(style)).toEqual({
            width: "1px",
            style: "solid",
            color: "blue",
        });
        expect(style.borderWidth).toBeUndefined();
        expect(style.border).toBeUndefined();
    });
});

describe("normalisation border shorthand/longhands", () => {
    it("applyUnifiedBorderValue migre vers les longhands par cote", () => {
        expect(
            applyUnifiedBorderValue(
                {
                    borderTop: "1px solid red",
                    borderBottom: "2px dashed blue",
                    borderWidth: "4px",
                },
                "1px solid #000",
            ),
        ).toEqual(ALL_SIDES_1PX_SOLID_BLACK);
    });

    it("applyPerSideBorderValue migre un cote vers ses longhands", () => {
        expect(
            applyPerSideBorderValue({ border: "1px solid #000", borderWidth: "1px" }, "bottom", "3px solid red"),
        ).toEqual({
            borderBottomWidth: "3px",
            borderBottomStyle: "solid",
            borderBottomColor: "red",
        });
    });

    it("expandUnifiedBorderToPerSide repartit la valeur sur les 4 cotes en longhands", () => {
        expect(expandUnifiedBorderToPerSide({ border: "1px solid #000" })).toEqual(ALL_SIDES_1PX_SOLID_BLACK);
    });
});

describe("collapsePerSideToUnified", () => {
    it("convertit des longhands identiques en longhands par cote", () => {
        expect(
            collapsePerSideToUnified({
                borderTop: "1px solid #000",
                borderRight: "1px solid #000",
                borderBottom: "1px solid #000",
                borderLeft: "1px solid #000",
            }),
        ).toEqual(ALL_SIDES_1PX_SOLID_BLACK);
    });

    it("convertit des longhands differents en longhands par cote", () => {
        expect(
            collapsePerSideToUnified({
                borderTop: "1px solid red",
                borderRight: "2px solid red",
                borderBottom: "1px solid red",
                borderLeft: "2px solid red",
            }),
        ).toEqual({
            borderTopWidth: "1px",
            borderTopStyle: "solid",
            borderTopColor: "red",
            borderRightWidth: "2px",
            borderRightStyle: "solid",
            borderRightColor: "red",
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            borderBottomColor: "red",
            borderLeftWidth: "2px",
            borderLeftStyle: "solid",
            borderLeftColor: "red",
        });
    });

    it("convertit des longhands partiels en longhands par cote", () => {
        const style = { borderTop: "1px solid red", borderBottom: "2px solid blue" };
        expect(collapsePerSideToUnified(style)).toEqual({
            borderTopWidth: "1px",
            borderTopStyle: "solid",
            borderTopColor: "red",
            borderBottomWidth: "2px",
            borderBottomStyle: "solid",
            borderBottomColor: "blue",
        });
    });
});

describe("getUnifiedBorderParts depuis longhands par cote", () => {
    it("lit les parties depuis des longhands identiques", () => {
        expect(getUnifiedBorderParts(ALL_SIDES_1PX_SOLID_BLACK)).toEqual({
            width: "1px",
            style: "solid",
            color: "#000",
        });
    });

    it("lit les parties depuis des longhands differents", () => {
        expect(
            getUnifiedBorderParts({
                borderTopWidth: "1px",
                borderTopStyle: "solid",
                borderTopColor: "red",
                borderRightWidth: "2px",
                borderRightStyle: "solid",
                borderRightColor: "red",
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
                borderBottomColor: "red",
                borderLeftWidth: "2px",
                borderLeftStyle: "solid",
                borderLeftColor: "red",
            }),
        ).toEqual({
            width: "1px 2px",
            style: "solid",
            color: "red",
        });
    });

    it("lit les parties depuis des longhands shorthand legacy", () => {
        expect(
            getUnifiedBorderParts({
                borderTop: "2px dashed blue",
                borderRight: "2px dashed blue",
                borderBottom: "2px dashed blue",
                borderLeft: "2px dashed blue",
            }),
        ).toEqual({
            width: "2px",
            style: "dashed",
            color: "blue",
        });
    });
});
