import { describe, expect, it } from "vitest";
import {
    applyPerSideBorderValue,
    applyUnifiedBorderValue,
    buildUnifiedBorder,
    detectBorderMode,
    expandUnifiedBorderToPerSide,
    getUnifiedBorder,
    getUnifiedBorderParts,
    parseUnifiedBorder,
} from "./borderModeHelper";

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

describe("normalisation border shorthand/longhands", () => {
    it("applyUnifiedBorderValue supprime les longhands et legacy", () => {
        expect(
            applyUnifiedBorderValue(
                {
                    borderTop: "1px solid red",
                    borderBottom: "2px dashed blue",
                    borderWidth: "4px",
                },
                "1px solid #000",
            ),
        ).toEqual({ border: "1px solid #000" });
    });

    it("applyPerSideBorderValue supprime la shorthand globale", () => {
        expect(
            applyPerSideBorderValue({ border: "1px solid #000", borderWidth: "1px" }, "bottom", "3px solid red"),
        ).toEqual({ borderBottom: "3px solid red" });
    });

    it("expandUnifiedBorderToPerSide repartit la valeur sur les 4 cotes", () => {
        expect(expandUnifiedBorderToPerSide({ border: "1px solid #000" })).toEqual({
            borderTop: "1px solid #000",
            borderRight: "1px solid #000",
            borderBottom: "1px solid #000",
            borderLeft: "1px solid #000",
        });
    });
});

