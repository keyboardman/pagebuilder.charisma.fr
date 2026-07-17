import type { CSSProperties } from "react";
import {
  Background2Settings,
  Border2Settings,
  ClassName2Settings,
  Spacing2Settings,
  Text2Settings,
} from "../../../Settings";
import { THEME_SELECTORS } from "../../../Settings/themeOverrideSelectors";
import { useNodeBuilderContext } from "../../../../services/providers/NodeBuilderContext";
import type { CollectionStyledPart, NodeCollectionType } from "../../index";

export const PART_SELECTORS = {
  collection: THEME_SELECTORS.listApi,
  item: `${THEME_SELECTORS.listApi} .ce-list-api-item`,
  title: `${THEME_SELECTORS.listApi} .ce-list-api-title`,
  description: `${THEME_SELECTORS.listApi} .ce-list-api-description`,
  counter: `${THEME_SELECTORS.listApi} .ce-list-api-counter`,
  like: `${THEME_SELECTORS.listApi} .ce-list-api-like`,
} as const;

export type StyledPartKey = keyof typeof PART_SELECTORS;

export function StyledPartSettings({ part }: { part: StyledPartKey }) {
  const { node, onChange } = useNodeBuilderContext();
  const collectionNode = node as NodeCollectionType;
  const content = collectionNode.content ?? {};
  const partContent: CollectionStyledPart = content[part] ?? {};
  const className = partContent.className ?? "";
  const style = partContent.style ?? {};
  const themeOverrideSelector = PART_SELECTORS[part];

  const showClassName = !["collection", "item", "title", "description", "counter", "like"].includes(
    part
  );
  const showText = !["collection", "item"].includes(part);
  const showBorder = part !== "item";

  const updatePart = (patch: { className?: string; style?: CSSProperties }) => {
    onChange({
      ...node,
      content: {
        ...content,
        [part]: {
          ...partContent,
          ...patch,
        },
      },
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-1">
      {showClassName ? (
        <ClassName2Settings classes={className} onChange={(next) => updatePart({ className: next })} />
      ) : null}
      {showText ? (
        <Text2Settings
          themeOverrideSelector={themeOverrideSelector}
          style={style}
          onChange={(next) => updatePart({ style: next })}
        />
      ) : null}
      <Background2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={(next) => updatePart({ style: next })}
      />
      {showBorder ? (
        <Border2Settings
          themeOverrideSelector={themeOverrideSelector}
          style={style}
          onChange={(next) => updatePart({ style: next })}
        />
      ) : null}
      <Spacing2Settings
        themeOverrideSelector={themeOverrideSelector}
        style={style}
        onChange={(next) => updatePart({ style: next })}
      />
    </div>
  );
}
