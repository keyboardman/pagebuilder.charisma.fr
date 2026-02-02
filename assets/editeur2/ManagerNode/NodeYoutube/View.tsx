import { type FC } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeYoutubeType } from ".";
import { useNodeContext } from "../../services/providers/NodeContext";
import YouTube from "react-youtube";
import { cn } from "@editeur/lib/utils";

const View: FC<NodeViewProps|NodeEditProps> = () => {
  const { node } = useNodeContext() as { node: NodeYoutubeType };
  const { id, className, style } = node.attributes ?? {};
  const videoId = node.content?.videoId ?? "";

  // Si pas de videoId, on ne retourne rien ou un placeholder
  if (!videoId) {
    return (
      <div
        data-ce-id={node.id}
        data-ce-type={node.type}
        id={id}
        className={className}
        style={style}
      >
        <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg">
          <p className="text-sm text-muted-foreground">Aucune vidéo YouTube configurée</p>
        </div>
      </div>
    );
  }

  // Options pour le player YouTube
  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      rel: 0,
      modestbranding: 1,
      controls: 1,
    },
  };

  return (
    <div
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={id}
      className={cn(className, "overflow-hidden relative w-full")}
      style={style}
    >
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute top-0 left-0 w-full h-full">
          <YouTube
            videoId={videoId}
            opts={opts}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default View;

