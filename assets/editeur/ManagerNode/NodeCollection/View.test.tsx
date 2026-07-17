import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CollectionDisplayList } from "./View/CollectionDisplay";
import type {
  CollectionArticleItem,
  CollectionImageItem,
  CollectionVideoItem,
} from "./collectionUtils";
import { AppContext, APP_MODE, type AppType } from "../../services/providers/AppContext";

vi.mock("../shared/card", async () => {
  const actual = await vi.importActual<typeof import("../shared/card")>("../shared/card");
  return {
    ...actual,
    HasLink: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

vi.mock("../components/VideoPlayOverlayIcon", () => ({
  VideoPlayOverlayIcon: () => <span data-testid="play-overlay" />,
}));

const articleItems: CollectionArticleItem[] = [
  {
    id: "1",
    collectionType: "article",
    title: "Article un",
    description: "Description",
  },
  {
    id: "2",
    collectionType: "article",
    title: "Article deux",
  },
];

const videoItems: CollectionVideoItem[] = [
  {
    id: "v1",
    collectionType: "video",
    title: "Vidéo un",
    src: "https://example.com/video.mp4",
    poster: "https://example.com/poster.jpg",
    apiId: "api",
    itemId: "1",
  },
];

function renderWithApp(ui: React.ReactElement) {
  const value = {
    mode: APP_MODE.EDIT,
  } as unknown as AppType;
  return render(<AppContext.Provider value={value}>{ui}</AppContext.Provider>);
}
describe("CollectionDisplayList", () => {
  it("renders article default view with ce-card", () => {
    const { container } = render(
      <CollectionDisplayList
        items={articleItems}
        view="default"
        content={{
          show: { title: true, description: true, image: false },
          container: { position: "top", align: "start", ratio: "full" },
        }}
      />
    );

    expect(container.querySelectorAll(".ce-card")).toHaveLength(2);
    expect(screen.getByText("Article un")).toBeInTheDocument();
  });

  it("renders article list-api view with ce-list-api markup", () => {
    const { container } = render(
      <CollectionDisplayList
        items={articleItems}
        view="article"
        content={{
          show: { title: true, description: true },
        }}
      />
    );

    expect(container.querySelector(".ce-list-api-items")).toBeInTheDocument();
    expect(container.querySelectorAll(".ce-list-api-item")).toHaveLength(2);
    expect(screen.getByText("Article deux")).toBeInTheDocument();
  });

  it("applies default gap-3 when list.gap is unset", () => {
    const { container } = render(
      <CollectionDisplayList items={articleItems} view="default" content={{}} />
    );

    expect(container.querySelector(".ce-collection-list")).toHaveClass("gap-3");
  });

  it("applies list.gap class when set", () => {
    const { container } = render(
      <CollectionDisplayList
        items={articleItems}
        view="default"
        content={{ list: { gap: 6 } }}
      />
    );

    expect(container.querySelector(".ce-collection-list")).toHaveClass("gap-6");
  });

  it("applies gap-0 when list.gap is 0", () => {
    const { container } = render(
      <CollectionDisplayList
        items={articleItems}
        view="article"
        content={{ list: { gap: 0 } }}
      />
    );

    expect(container.querySelector(".ce-collection-list")).toHaveClass("gap-0");
  });

  it("applies card position and ratio classes like NodeCardApi", () => {
    const itemsWithImage: CollectionArticleItem[] = [
      {
        id: "1",
        collectionType: "article",
        title: "Card",
        description: "Texte",
        image: "https://example.com/img.jpg",
        labels: ["Tag"],
      },
    ];

    const { container } = render(
      <CollectionDisplayList
        items={itemsWithImage}
        view="default"
        content={{
          show: { image: true, title: true, description: true, labels: true },
          container: { position: "left", align: "center", ratio: "1_3" },
        }}
      />
    );

    const card = container.querySelector(".ce-card");
    expect(card).toHaveClass("ce-card-position-left");
    expect(card).toHaveClass("ce-card-align-center");
    expect(container.querySelector(".ce-card-image-ratio-1_3")).toBeInTheDocument();
    expect(container.querySelector(".ce-card-title")).toBeInTheDocument();
    expect(container.querySelector(".ce-card-text")).toBeInTheDocument();
    expect(container.querySelector(".ce-card-label")).toBeInTheDocument();
  });

  it("hides description when show.description is false", () => {
    const { container } = render(
      <CollectionDisplayList
        items={articleItems}
        view="default"
        content={{
          show: { title: true, description: false, image: false },
          container: { position: "top", align: "start", ratio: "full" },
        }}
      />
    );

    expect(screen.getByText("Article un")).toBeInTheDocument();
    expect(container.querySelector(".ce-card-text")).not.toBeInTheDocument();
    expect(screen.queryByText("Description")).not.toBeInTheDocument();
  });

  it("applies list-api part styles on variante article", () => {
    const { container } = render(
      <CollectionDisplayList
        items={articleItems}
        view="article"
        content={{
          show: { title: true, description: true },
          title: { style: { color: "rgb(255, 0, 0)" } },
          item: { style: { padding: "8px" } },
        }}
      />
    );

    const title = container.querySelector(".ce-list-api-title");
    expect(title).toHaveStyle({ color: "rgb(255, 0, 0)" });
    const item = container.querySelector(".ce-list-api-item");
    expect(item).toHaveStyle({ padding: "8px" });
  });

  it("applies NodeVideoApi card/title styles on video items", () => {
    const { container } = renderWithApp(
      <CollectionDisplayList
        items={videoItems}
        view="default"
        content={{
          show: { title: true },
          card: { style: { backgroundColor: "rgb(0, 0, 255)" } },
          title: { style: { color: "rgb(0, 128, 0)" } },
        }}
      />
    );

    const card = container.querySelector(".ce-card");
    expect(card).toHaveStyle({ backgroundColor: "rgb(0, 0, 255)" });
    expect(screen.getByText("Vidéo un")).toHaveStyle({ color: "rgb(0, 128, 0)" });
  });

  it("wraps image items with an anchor when link is set", () => {
    const imageItems: CollectionImageItem[] = [
      {
        id: "img-1",
        collectionType: "image",
        image: "https://example.com/photo.jpg",
        alt: "Photo",
        link: "https://example.com/target",
      },
    ];

    const { container } = render(
      <CollectionDisplayList items={imageItems} view="default" content={{}} />
    );

    const anchor = container.querySelector("a.ce-image-link");
    expect(anchor).toHaveAttribute("href", "https://example.com/target");
    expect(anchor?.querySelector("img.ce-image")).toHaveAttribute(
      "src",
      "https://example.com/photo.jpg"
    );
  });

  it("does not wrap image items when link is empty", () => {
    const imageItems: CollectionImageItem[] = [
      {
        id: "img-2",
        collectionType: "image",
        image: "https://example.com/photo.jpg",
        alt: "Photo",
      },
    ];

    const { container } = render(
      <CollectionDisplayList items={imageItems} view="default" content={{}} />
    );

    expect(container.querySelector("a.ce-image-link")).not.toBeInTheDocument();
    expect(container.querySelector("img.ce-image")).toHaveAttribute(
      "src",
      "https://example.com/photo.jpg"
    );
  });
});
