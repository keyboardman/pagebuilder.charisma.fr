import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import Form from "../../../components/form";
import {
  ClassName2Settings,
  Text2Settings,
  Spacing2Settings,
  Background2Settings,
  Border2Settings,
  getCardThemeSelector,
} from "../../Settings";
import type { NodeCardType } from "../index";

export function TitleSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;
  const titleStyle = cardNode.content?.title?.style || {};
  const titleClassName = cardNode.content?.title?.className || "";
  const titleText = cardNode.content?.title?.text || "";
  const themeOverrideSelector = getCardThemeSelector(cardNode.content?.container?.position, "title");

  const styleProps = { themeOverrideSelector, style: titleStyle };

  return (
    <div className="flex flex-1 flex-col gap-1">
      <Form.Group>
        <Form.Label text="Titre" />
        <Form.Textarea
          value={titleText}
          onChange={(value) =>
            onChange({
              ...node,
              content: {
                ...cardNode.content,
                title: { ...cardNode.content?.title, text: value },
              },
            })
          }
          className="min-h-[4rem] text-sm"
        />
      </Form.Group>
      <ClassName2Settings
        classes={titleClassName}
        onChange={(className) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              title: { ...cardNode.content?.title, className },
            },
          })
        }
      />
      <Text2Settings
        {...styleProps}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              title: { ...cardNode.content?.title, style },
            },
          })
        }
      />
      <Background2Settings
        {...styleProps}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              title: { ...cardNode.content?.title, style },
            },
          })
        }
      />
      <Border2Settings
        {...styleProps}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              title: { ...cardNode.content?.title, style },
            },
          })
        }
      />
      <Spacing2Settings
        {...styleProps}
        onChange={(style) =>
          onChange({
            ...node,
            content: {
              ...cardNode.content,
              title: { ...cardNode.content?.title, style },
            },
          })
        }
      />
    </div>
  );
}


export default TitleSettings;
