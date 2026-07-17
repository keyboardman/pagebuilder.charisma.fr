import type { CSSProperties } from "react";
import {
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
} from "../../../Settings";
import { useNodeBuilderContext } from "../../../../services/providers/NodeBuilderContext";
import type { NodeCollectionType } from "../../index";

export function VideoCardSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const cardStyle = content.card?.style ?? {};

  const updateCardStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: {
        ...content,
        card: { ...content.card, style },
      },
    });

  return (
    <>
      <Background2Settings style={cardStyle} onChange={updateCardStyle} />
      <Border2Settings style={cardStyle} onChange={updateCardStyle} />
      <Spacing2Settings style={cardStyle} onChange={updateCardStyle} />
    </>
  );
}
