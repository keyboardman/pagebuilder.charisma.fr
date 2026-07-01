import { describe, expect, it } from "vitest";
import * as video from "./index";

describe("video/index", () => {
  it("réexporte les symboles publics du module", () => {
    expect(video.CHARISMA_MEDIA_COMPTEUR_URL).toBeTruthy();
    expect(video.sendCharismaMediaCompteur).toBeTypeOf("function");
    expect(video.parseFavoriCount).toBeTypeOf("function");
    expect(video.createCompteurTracker).toBeTypeOf("function");
    expect(video.CharismaVideoPlayer).toBeTruthy();
    expect(video.openCharismaVideoModal).toBeTypeOf("function");
  });
});
