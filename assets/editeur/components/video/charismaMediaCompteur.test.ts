import { describe, expect, it, vi } from "vitest";
import { setupCharismaMediaCompteur } from "./charismaMediaCompteur";
import { createCompteurTracker } from "./compteurTracker";
import type Player from "video.js/dist/types/player";

function createMockPlayer(initialTime = 0) {
  let currentTime = initialTime;
  const handlers = new Map<string, Set<(...args: unknown[]) => void>>();

  const player = {
    currentTime: () => currentTime,
    on: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
      const set = handlers.get(event) ?? new Set();
      set.add(handler);
      handlers.set(event, set);
    }),
    off: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
      handlers.get(event)?.delete(handler);
    }),
    setCurrentTime: (time: number) => {
      currentTime = time;
    },
    emit: (event: string) => {
      for (const handler of handlers.get(event) ?? []) {
        handler.call(player);
      }
    },
  };

  return player as unknown as Player & {
    setCurrentTime: (time: number) => void;
    emit: (event: string) => void;
  };
}

describe("setupCharismaMediaCompteur", () => {
  it("n'envoie pas avant 1 seconde de lecture", () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const player = createMockPlayer(0);

    setupCharismaMediaCompteur(player, "159", { send, minPlaybackSec: 1 });

    player.setCurrentTime(0.5);
    player.emit("timeupdate");

    expect(send).not.toHaveBeenCalled();
  });

  it("envoie une fois à 1 seconde de lecture", () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const player = createMockPlayer(0);

    setupCharismaMediaCompteur(player, "159", { send, minPlaybackSec: 1 });

    player.setCurrentTime(1);
    player.emit("timeupdate");

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith("159");

    player.setCurrentTime(2);
    player.emit("timeupdate");
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("n'envoie pas une seconde fois après pause/reprise", () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const tracker = createCompteurTracker();
    const player = createMockPlayer(0);

    setupCharismaMediaCompteur(player, "159", { send, tracker, minPlaybackSec: 1 });

    player.setCurrentTime(1.2);
    player.emit("timeupdate");
    player.setCurrentTime(3);
    player.emit("timeupdate");

    expect(send).toHaveBeenCalledTimes(1);
  });

  it("retire le listener timeupdate au dispose", () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const player = createMockPlayer(0);

    setupCharismaMediaCompteur(player, "159", { send, minPlaybackSec: 1 });
    player.emit("dispose");

    expect(player.off).toHaveBeenCalledWith("timeupdate", expect.any(Function));
  });

  it("ignore les erreurs réseau à l'envoi", async () => {
    const send = vi.fn().mockRejectedValue(new Error("network"));
    const player = createMockPlayer(0);

    setupCharismaMediaCompteur(player, "159", { send, minPlaybackSec: 1 });
    player.setCurrentTime(1);
    player.emit("timeupdate");

    await Promise.resolve();
    expect(send).toHaveBeenCalledWith("159");
  });

  it("traite un currentTime indéfini comme 0", () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const player = {
      currentTime: () => undefined,
      on: vi.fn(),
      off: vi.fn(),
    } as unknown as Player;

    setupCharismaMediaCompteur(player, "159", { send, minPlaybackSec: 1 });

    const handler = vi.mocked(player.on).mock.calls.find(([event]) => event === "timeupdate")?.[1] as
      | (() => void)
      | undefined;
    handler?.call(player);
    expect(send).not.toHaveBeenCalled();
  });
});
