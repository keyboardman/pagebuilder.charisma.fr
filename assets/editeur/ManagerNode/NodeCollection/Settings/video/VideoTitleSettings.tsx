import type { CSSProperties } from "react";
import { Switch } from "@/editeur/components/ui/switch";
import {
  Background2Settings,
  Border2Settings,
  Spacing2Settings,
  Text2Settings,
} from "../../../Settings";
import { useNodeBuilderContext } from "../../../../services/providers/NodeBuilderContext";
import type { NodeCollectionType } from "../../index";

export function VideoTitleSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const titleStyle = content.title?.style ?? {};

  const updateTitleStyle = (style: CSSProperties) =>
    onChange({
      ...node,
      content: {
        ...content,
        title: { ...content.title, style },
      },
    });

  return (
    <div className="space-y-2">
      <label className="flex items-center justify-between gap-2 text-xs">
        <span>Visible</span>
        <Switch
          checked={content.show?.title !== false}
          onCheckedChange={(checked) =>
            onChange({
              ...node,
              content: {
                ...content,
                show: { ...content.show, title: checked },
              },
            })
          }
        />
      </label>
      <Text2Settings style={titleStyle} onChange={updateTitleStyle} />
      <Background2Settings style={titleStyle} onChange={updateTitleStyle} />
      <Border2Settings style={titleStyle} onChange={updateTitleStyle} />
      <Spacing2Settings style={titleStyle} onChange={updateTitleStyle} />
    </div>
  );
}
