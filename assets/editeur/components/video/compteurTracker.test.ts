import { describe, expect, it } from "vitest";
import { createCompteurTracker } from "./compteurTracker";

describe("createCompteurTracker", () => {
  it("autorise un seul envoi compteur par instance", () => {
    const tracker = createCompteurTracker();

    expect(tracker.shouldSend()).toBe(true);
    tracker.markSent();
    expect(tracker.shouldSend()).toBe(false);
    expect(tracker.shouldSend()).toBe(false);
  });
});
