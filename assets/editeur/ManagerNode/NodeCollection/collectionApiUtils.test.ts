import { describe, expect, it } from "vitest";
import { mapRawToCollectionApiItem } from "./collectionApiUtils";

describe("collectionApiUtils", () => {
  it("maps standard collection fields including counter and like", () => {
    expect(
      mapRawToCollectionApiItem({
        id: "1",
        title: "Hello",
        image: "https://example.com/a.jpg",
        description: "Desc",
        label: "News",
        counter: 12,
        like: 3,
        link: "https://example.com",
        alt: "Alt",
      })
    ).toEqual({
      id: "1",
      title: "Hello",
      image: "https://example.com/a.jpg",
      description: "Desc",
      label: "News",
      labels: undefined,
      counter: 12,
      like: 3,
      link: "https://example.com",
      alt: "Alt",
      text: undefined,
    });
  });

  it("omits zero metrics", () => {
    const mapped = mapRawToCollectionApiItem({ id: "1", counter: 0, like: "0" });
    expect(mapped.counter).toBeUndefined();
    expect(mapped.like).toBeUndefined();
  });
});
