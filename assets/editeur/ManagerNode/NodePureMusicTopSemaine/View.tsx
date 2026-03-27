import React, { type FC, useEffect, useMemo, useState } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import { cn } from "@/editeur/lib/utils";
import type { NodePureMusicTopSemaineItem, NodePureMusicTopSemaineType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { PlayerProvider } from "./PlayerProvider";
import Player from "./components/Player";
import Card from "./components/Card";

type PureMusicApiResponse = {
  member?: Array<{
    id?: string | number;
    titre?: string;
    source?: string;
    album?: {
      name?: string;
      vignette?: string;
      artiste?: {
        nom?: string;
      };
    };
  }>;
};

const ENDPOINT_DEFAULT = "https://api.charisma.fr/api/puremusic/musiques/tops/semaine";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const topNode = node as NodePureMusicTopSemaineType;

  const endpoint = topNode.content?.endpoint || ENDPOINT_DEFAULT;
  const titleStyle = topNode.content?.title?.style ?? {};
  const itemStyle = topNode.content?.item?.style ?? {};
  const itemNumberStyle = topNode.content?.item?.number?.style ?? {};
  const itemTitleStyle = topNode.content?.item?.title?.style ?? {};
  const itemIconStyle = topNode.content?.item?.icon?.style ?? {};
  const itemDescriptionStyle = topNode.content?.item?.description?.style ?? {};
  const playerStyle = topNode.content?.player?.style ?? {};
  const playerIconStyle = topNode.content?.player?.icon?.style ?? {};

  const [musiques, setMusiques] = useState<NodePureMusicTopSemaineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        const data = (await response.json()) as PureMusicApiResponse;
        const nextTracks = mapTracks(data.member);

        if (cancelled) return;
        setMusiques(nextTracks);
      } catch {
        if (cancelled) return;
        setMusiques([]);
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

  const tracks = useMemo(() => musiques, [musiques]);

  return (
    <PlayerProvider>
      <div
        data-ce-id={node.id}
        data-ce-type={node.type}
        id={node?.attributes?.id ?? undefined}
        className={cn("ce-puremusic-top-semaine", node?.attributes?.className ?? "")}
        style={{
          ...styleForView(node?.attributes?.style ?? {}),
        }}
      >
        <h3 className="ce-puremusic-top-semaine-heading" style={styleForView(titleStyle)}>
          Top Semaine
        </h3>
        <div className="ce-puremusic-top-semaine-list">
          {loading ? <p className="ce-puremusic-top-semaine-status">Chargement...</p> : null}
          {error ? <p className="ce-puremusic-top-semaine-status">Impossible de charger le top semaine.</p> : null}
          {!loading && !error && tracks.length === 0 ? (
            <p className="ce-puremusic-top-semaine-status">Aucune musique disponible.</p>
          ) : null}
          {tracks.map((musique, i) => (
            <Card
              key={musique.id}
              musique={musique}
              position={i + 1}
              itemStyle={styleForView(itemStyle)}
              numberStyle={styleForView(itemNumberStyle)}
              titleStyle={styleForView(itemTitleStyle)}
              descriptionStyle={styleForView(itemDescriptionStyle)}
              iconStyle={styleForView(itemIconStyle)}
            />
          ))}
        </div>
      </div>
      <Player playerStyle={styleForView(playerStyle)} iconStyle={styleForView(playerIconStyle)} />
    </PlayerProvider>
  );
};

function mapTracks(items: PureMusicApiResponse["member"]): NodePureMusicTopSemaineItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item, index) => {
      const id = String(item?.id ?? index);
      const titre = (item?.titre ?? "").trim();
      const artiste = (item?.album?.artiste?.nom ?? "").trim();
      const album = (item?.album?.name ?? "").trim();
      const vignette = (item?.album?.vignette ?? "").trim();
      const source = (item?.source ?? "").trim();

      if (!titre) {
        return null;
      }

      return {
        id,
        titre,
        artiste,
        album,
        vignette,
        source,
      } satisfies NodePureMusicTopSemaineItem;
    })
    .filter((item): item is NodePureMusicTopSemaineItem => item !== null);
}

export default View;
