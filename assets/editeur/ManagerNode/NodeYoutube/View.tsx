import { type FC } from "react";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import type { NodeYoutubeType } from ".";
import { useNodeContext } from "../../services/providers/NodeContext";
import YouTube from "react-youtube";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../utils/styleHelper";

const YoutubePlaceholder: FC<{ text?: string }> = ({ text = "Aucune vidéo YouTube configurée" } = { text: "Aucune vidéo YouTube configurée" }) => {
  return (
    <div className="ce-youtube-placeholder" >
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg">
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node } = useNodeContext() as { node: NodeYoutubeType };
  const { id, className, style } = node.attributes ?? {};
  const videoId = node.content?.videoId ?? "";

  // Si pas de videoId, on ne retourne rien ou un placeholder
  if (!videoId) {
    return <YoutubePlaceholder />;
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
      id={id ?? ""}
      className={cn("ce-youtube", className)} 
      style={styleForView(style)}
    >
      <YouTube
        videoId={videoId}
        opts={opts}
        className="ce-youtube-player"
      />
    </div>
  )

}

export default View;

