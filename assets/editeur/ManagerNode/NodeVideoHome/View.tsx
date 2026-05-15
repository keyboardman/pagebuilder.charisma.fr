import React, { type FC, useEffect, useMemo, useState } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import { useAppContext, APP_MODE } from "../../services/providers/AppContext";
import { cn } from "@/editeur/lib/utils";
import type { NodeVideoHomeItem, NodeVideoHomeType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { VideoPlayOverlayIcon } from "../components/VideoPlayOverlayIcon";
import { Dialog, DialogContent, DialogTitle } from "@/editeur/components/ui/dialog";
import { VisuallyHidden } from "@/editeur/components/ui/visually-hidden";
import { X } from "lucide-react";

type VideoHomeApiResponse = {
  member?: Array<{
    id?: string;
    type?: string;
    titre?: string;
    source?: string;
    poster?: string;
    uuid?: string;
  }>;
};

const ENDPOINT_DEFAULT = "https://api.charisma.fr/api/charisma/videos/homes";
const EXPECTED_VIDEOS_COUNT = 7;

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const { mode, breakpoint } = useAppContext();
  const videoHomeNode = node as NodeVideoHomeType;

  const endpoint = videoHomeNode.content?.endpoint || ENDPOINT_DEFAULT;
  const containerStyle = videoHomeNode.content?.container?.style ?? {};
  const cardStyle = videoHomeNode.content?.card?.style ?? {};
  const imageStyle = videoHomeNode.content?.image?.style ?? {};
  const titleStyle = videoHomeNode.content?.title?.style ?? {};

  const [videos, setVideos] = useState<NodeVideoHomeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<NodeVideoHomeItem | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(endpoint, { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = (await response.json()) as VideoHomeApiResponse;
        const nextVideos = mapVideos(data.member);

        if (cancelled) return;
        setVideos(nextVideos);
      } catch {
        if (cancelled) return;
        setVideos([]);
        setError(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  const isEditMode = mode === APP_MODE.EDIT;
  const isViewMode = mode === APP_MODE.VIEW;
  const currentBreakpoint = breakpoint || "desktop";
  const gridClassName = isViewMode
    ? "ce-video-home-grid ce-video-home-grid-responsive"
    : `ce-video-home-grid ce-video-home-grid-${currentBreakpoint}`;
  const hasExpectedCount = videos.length === EXPECTED_VIDEOS_COUNT;
  const displayVideos = useMemo(() => videos.slice(0, EXPECTED_VIDEOS_COUNT), [videos]);

  return (
    <>
      <section
        data-ce-id={node.id}
        data-ce-type={node.type}
        id={node?.attributes?.id ?? undefined}
        className={cn("ce-video-home", node?.attributes?.className ?? "")}
        style={{
          ...styleForView(node?.attributes?.style ?? {}),
          ...styleForView(containerStyle),
        }}
      >
        {loading ? <p className="ce-video-home-status">Chargement...</p> : null}
        {error ? <p className="ce-video-home-status">Impossible de charger les videos.</p> : null}
        {!loading && !error && displayVideos.length === 0 ? (
          <p className="ce-video-home-status">Aucune video disponible.</p>
        ) : null}
        {!loading && !error && !hasExpectedCount ? (
          <p className="ce-video-home-status">
            Nombre de videos inattendu ({videos.length}/{EXPECTED_VIDEOS_COUNT}).
          </p>
        ) : null}

        {!loading && !error ? (
          <div className={gridClassName}>
            {displayVideos.map((video, index) => (
              <article
                key={video.id}
                className={cn("ce-video-home-item", index === EXPECTED_VIDEOS_COUNT - 1 && "ce-video-home-item-last")}
              >
                <div
                  className="ce-card-video"
                  style={styleForView(cardStyle)}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (!isEditMode && video.source) {
                      setSelectedVideo(video);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (isEditMode || !video.source) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedVideo(video);
                    }
                  }}
                >
                  <div className="ce-card-video-wrapper ce-video">
                    {video.poster ? (
                      <img
                        src={video.poster}
                        alt={video.title}
                        className="ce-video-poster"
                        style={styleForView(imageStyle)}
                      />
                    ) : (
                      <div className="ce-card-video-placeholder">
                        <div className="ce-icon" />
                        <p>Aucune video</p>
                      </div>
                    )}
                    <VideoPlayOverlayIcon />
                  </div>
                  <div
                    className="ce-card-video-title"
                    style={styleForView(titleStyle)}
                    dangerouslySetInnerHTML={{ __html: video.title }}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] p-0 bg-transparent border-0 shadow-none [&>button]:hidden">
          <VisuallyHidden>
            <DialogTitle>{selectedVideo?.title ?? "Video"}</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            {selectedVideo ? (
              selectedVideo.type === "youtube" ? (
                <iframe
                  className="w-full h-full"
                  src={selectedVideo.source}
                  title={selectedVideo.title || "Video Youtube"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  className="w-full h-full"
                  src={selectedVideo.source}
                  poster={selectedVideo.poster}
                  controls
                  autoPlay
                />
              )
            ) : null}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute right-4 top-4 z-50 rounded-full bg-black/70 text-white p-2 hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

function mapVideos(items: VideoHomeApiResponse["member"]): NodeVideoHomeItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      const id = String(item?.id ?? item?.uuid ?? index);
      const title = (item?.titre ?? "").trim();
      const rawType = (item?.type ?? "").trim().toLowerCase();
      const type: NodeVideoHomeItem["type"] = rawType === "youtube" ? "youtube" : "charisma";
      const source = (item?.source ?? "").trim();
      const poster = (item?.poster ?? "").trim();

      if (!source) {
        return null;
      }

      return {
        id,
        title,
        type,
        source,
        poster,
      } satisfies NodeVideoHomeItem;
    })
    .filter((item): item is NodeVideoHomeItem => item !== null)
    .slice(0, EXPECTED_VIDEOS_COUNT);
}

export default View;
