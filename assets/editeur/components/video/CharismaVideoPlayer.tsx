import { type FC, useEffect, useRef, useState } from "react";
import type Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import "./charismaVideo.css";

export interface CharismaVideoPlayerProps {
  src: string;
  poster?: string;
  mediaId?: string;
  favoriCount?: number;
  className?: string;
  autoplay?: boolean;
}

export const CharismaVideoPlayer: FC<CharismaVideoPlayerProps> = ({
  src,
  poster = "",
  mediaId,
  favoriCount,
  className = "w-full h-full",
  autoplay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !src) return;

    let cancelled = false;

    void import("./createCharismaVideoPlayer").then(({ createCharismaVideoPlayer, disposeCharismaVideoPlayer }) => {
      if (cancelled || !videoRef.current) return;

      const player = createCharismaVideoPlayer(videoRef.current, {
        src,
        poster,
        mediaId,
        favoriCount,
        autoplay,
      });
      playerRef.current = player;
      setReady(true);
    });

    return () => {
      cancelled = true;
      void import("./createCharismaVideoPlayer").then(({ disposeCharismaVideoPlayer }) => {
        disposeCharismaVideoPlayer(playerRef.current);
        playerRef.current = null;
      });
    };
  }, [src, poster, mediaId, favoriCount, autoplay]);

  return (
    <div data-vjs-player className={className} data-charisma-video-ready={ready ? "true" : "false"}>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered w-full h-full"
        playsInline
      />
    </div>
  );
};

export default CharismaVideoPlayer;
