import type { CSSProperties } from "react";
import {
  Border2Settings,
  Object2Settings,
  Spacing2Settings,
} from "../../../Settings";
import { useNodeBuilderContext } from "../../../../services/providers/NodeBuilderContext";
import type { NodeCollectionType } from "../../index";

export function VideoImageSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const imageStyle = content.image?.style ?? {};

  const updateImageStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: {
        ...content,
        image: { ...content.image, style },
      },
    });

  return (
    <>
      <Object2Settings style={imageStyle} onChange={updateImageStyle} />
      <Border2Settings style={imageStyle} onChange={updateImageStyle} />
      <Spacing2Settings style={imageStyle} onChange={updateImageStyle} />
    </>
  );
}
