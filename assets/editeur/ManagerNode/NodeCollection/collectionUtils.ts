import { parseFavoriCount } from "../../components/video/favoriCount";
import type {
  CollectionArticleDynamicEntry,
  CollectionDisplay,
  CollectionImageMediaEntry,
  CollectionMode,
  CollectionType,
  CollectionVideoDynamicEntry,
} from "./index";
import {
  fetchCollectionItemsPage,
  resolveCollectionEntries,
  type CollectionApiMappedItem,
} from "./collectionApiUtils";
import {
  normalizeCollectionView as normalizeViewForType,
  type CollectionView,
} from "./View/collectionViews";

export interface CollectionImageItem {
  id: string;
  collectionType: "image";
  image: string;
  alt?: string;
  link?: string;
}

export interface CollectionArticleItem {
  id: string;
  collectionType: "article";
  title: string;
  description?: string;
  image?: string;
  counter?: string | number;
  like?: string | number;
  link?: string;
  labels?: string[];
}

export interface CollectionVideoItem {
  id: string;
  collectionType: "video";
  apiId: string;
  itemId: string;
  src: string;
  poster: string;
  title?: string;
  link?: string;
  favoriCount?: number;
}

export type CollectionItem = CollectionImageItem | CollectionArticleItem | CollectionVideoItem;

export const DEFAULT_COLLECTION_ITEMS_PER_PAGE = 10;
export const MAX_COLLECTION_ITEMS_PER_PAGE = 100;

export function isShowEnabled(value: boolean | undefined): boolean {
  return value !== false;
}

export function hasCollectionMetricValue(value: unknown): boolean {
  if (value == null) {
    return false;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed !== "" && trimmed !== "0";
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  return true;
}

export function formatCounterValue(counter: string | number | undefined): string {
  if (!hasCollectionMetricValue(counter)) {
    return "";
  }
  return String(counter);
}

export const formatLikeValue = formatCounterValue;

export function mapMediaEntriesToCollectionImageItems(
  entries: CollectionImageMediaEntry[]
): Array<{ id: string; image: string; alt?: string; link?: string }> {
  return entries
    .filter((entry) => entry.src.trim().length > 0)
    .map((entry) => ({
      id: entry.id,
      image: entry.src.trim(),
      alt: entry.alt?.trim() || undefined,
      link: entry.link?.trim() || undefined,
    }));
}

export function normalizeCollectionType(value?: string): CollectionType {
  if (value === "image" || value === "video") {
    return value;
  }
  return "article";
}

export function normalizeCollectionMode(value?: string): CollectionMode {
  return value === "dynamic" ? "dynamic" : "fixed";
}

export function normalizeCollectionDisplay(value?: string): CollectionDisplay {
  if (value === "grid") {
    return "grid";
  }
  if (value === "slideshow") {
    return "slideshow";
  }
  return "list";
}

export function normalizeCollectionView(
  collectionType: CollectionType,
  value?: string
): CollectionView {
  return normalizeViewForType(collectionType, value);
}

export function normalizeCollectionPage(page?: number): number {
  return Math.max(1, page ?? 1);
}

export function normalizeCollectionItemsPerPage(value?: number): number {
  if (value == null || Number.isNaN(value) || value < 1) {
    return DEFAULT_COLLECTION_ITEMS_PER_PAGE;
  }
  return Math.min(value, MAX_COLLECTION_ITEMS_PER_PAGE);
}

export function paginateCollectionItems<T>(items: T[], page: number, itemsPerPage?: number): T[] {
  if (itemsPerPage == null || itemsPerPage < 1) {
    return items;
  }

  const safePage = normalizeCollectionPage(page);
  const safeSize = normalizeCollectionItemsPerPage(itemsPerPage);
  const start = (safePage - 1) * safeSize;
  return items.slice(start, start + safeSize);
}

function mapApiToImageItem(item: CollectionApiMappedItem): CollectionImageItem {
  return {
    id: item.id,
    collectionType: "image",
    image: item.image ?? "",
    alt: item.alt ?? item.title,
    link: item.link,
  };
}

function mapApiToArticleItem(item: CollectionApiMappedItem): CollectionArticleItem {
  const labels =
    item.labels ??
    (item.label != null && item.label !== "" ? [item.label] : undefined);

  return {
    id: item.id,
    collectionType: "article",
    title: item.title ?? "",
    description: item.description,
    image: item.image,
    counter: item.counter,
    like: item.like,
    link: item.link,
    labels,
  };
}

function mapApiToVideoItem(
  apiId: string,
  item: CollectionApiMappedItem,
  itemId = item.id
): CollectionVideoItem {
  const src = item.link || item.image || "";
  return {
    id: itemId,
    collectionType: "video",
    apiId,
    itemId,
    src,
    poster: item.image || "",
    title: item.title,
    link: item.link,
    favoriCount: parseFavoriCount(item),
  };
}

export async function fetchCollectionImageItemsFixed(
  apiId: string,
  page?: number,
  itemsPerPage?: number
): Promise<CollectionImageItem[]> {
  const response = await fetchCollectionItemsPage(
    apiId,
    normalizeCollectionPage(page),
    normalizeCollectionItemsPerPage(itemsPerPage)
  );
  return response.items.map(mapApiToImageItem);
}

export async function fetchCollectionArticleItemsFixed(
  apiId: string,
  page?: number,
  itemsPerPage?: number
): Promise<CollectionArticleItem[]> {
  const response = await fetchCollectionItemsPage(
    apiId,
    normalizeCollectionPage(page),
    normalizeCollectionItemsPerPage(itemsPerPage)
  );
  return response.items.map(mapApiToArticleItem);
}

export async function fetchCollectionVideoItemsFixed(
  apiId: string,
  page?: number,
  itemsPerPage?: number
): Promise<CollectionVideoItem[]> {
  const response = await fetchCollectionItemsPage(
    apiId,
    normalizeCollectionPage(page),
    normalizeCollectionItemsPerPage(itemsPerPage)
  );
  return response.items.map((item) => mapApiToVideoItem(apiId, item));
}

export function resolveCollectionImageItemsDynamic(
  entries: CollectionImageMediaEntry[]
): CollectionImageItem[] {
  return mapMediaEntriesToCollectionImageItems(entries).map((item) => ({
    id: item.id,
    collectionType: "image" as const,
    image: item.image,
    alt: item.alt,
    link: item.link,
  }));
}

export async function resolveCollectionArticleItemsDynamic(
  entries: CollectionArticleDynamicEntry[]
): Promise<CollectionArticleItem[]> {
  const resolved = await resolveCollectionEntries(
    entries.map((e) => ({ apiId: e.type, itemId: e.id }))
  );
  const byId = new Map(resolved.map((item) => [item.id, item]));
  const items: CollectionArticleItem[] = [];
  for (const entry of entries) {
    const item = byId.get(entry.id);
    if (item) {
      items.push(mapApiToArticleItem(item));
    }
  }
  return items;
}

export async function resolveCollectionVideoItemsDynamic(
  entries: CollectionVideoDynamicEntry[]
): Promise<CollectionVideoItem[]> {
  const resolved = await resolveCollectionEntries(
    entries.map((e) => ({ apiId: e.apiId, itemId: e.itemId }))
  );
  const byId = new Map(resolved.map((item) => [item.id, item]));
  const items: CollectionVideoItem[] = [];
  for (const entry of entries) {
    const item = byId.get(entry.itemId);
    if (item) {
      items.push(mapApiToVideoItem(entry.apiId, item, entry.itemId));
    }
  }
  return items;
}

export interface FetchCollectionItemsParams {
  collectionType: CollectionType;
  mode: CollectionMode;
  apiId?: string;
  page?: number;
  itemsPerPage?: number;
  dynamicImageItems?: CollectionImageMediaEntry[];
  dynamicArticleItems?: CollectionArticleDynamicEntry[];
  dynamicVideoItems?: CollectionVideoDynamicEntry[];
}

export async function fetchCollectionItems(
  params: FetchCollectionItemsParams
): Promise<CollectionItem[]> {
  const {
    collectionType,
    mode,
    apiId = "",
    page,
    itemsPerPage,
    dynamicImageItems = [],
    dynamicArticleItems = [],
    dynamicVideoItems = [],
  } = params;

  if (mode === "dynamic") {
    let items: CollectionItem[] = [];

    if (collectionType === "image") {
      items = resolveCollectionImageItemsDynamic(dynamicImageItems);
      return items;
    }

    if (collectionType === "article") {
      items = await resolveCollectionArticleItemsDynamic(dynamicArticleItems);
      return items;
    }

    items = await resolveCollectionVideoItemsDynamic(dynamicVideoItems);
    return items;
  }

  const trimmedApiId = apiId.trim();
  if (!trimmedApiId) {
    return [];
  }

  if (collectionType === "image") {
    return fetchCollectionImageItemsFixed(trimmedApiId, page, itemsPerPage);
  }

  if (collectionType === "article") {
    return fetchCollectionArticleItemsFixed(trimmedApiId, page, itemsPerPage);
  }

  return fetchCollectionVideoItemsFixed(trimmedApiId, page, itemsPerPage);
}

export function hasDynamicCollectionItems(params: FetchCollectionItemsParams): boolean {
  const { collectionType, dynamicImageItems = [], dynamicArticleItems = [], dynamicVideoItems = [] } =
    params;

  if (collectionType === "image") {
    return dynamicImageItems.length > 0;
  }
  if (collectionType === "article") {
    return dynamicArticleItems.length > 0;
  }
  return dynamicVideoItems.length > 0;
}
