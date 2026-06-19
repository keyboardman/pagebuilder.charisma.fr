import React, { type FC } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import { APP_MODE, useAppContext } from "../../services/providers/AppContext";
import { useOptionalNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeButtonType } from "./index";
import TagNameEditable from "./components/TagNameEditable";
import { sanitizeButtonLabelHtml } from "./shared";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const { mode } = useAppContext();
  const builder = useOptionalNodeBuilderContext();
  const buttonNode = node as NodeButtonType;
  const buttonType = buttonNode.content?.buttonType ?? "button";
  const label = buttonNode.content?.label ?? "";
  const labelHtml = sanitizeButtonLabelHtml(label);
  const href = buttonNode.content?.href ?? "";
  const target = buttonNode.content?.target ?? "_self";
  const style = styleForView(node?.attributes?.style ?? {});
  const isEdit = mode === APP_MODE.EDIT;
  const isInlineEditing = isEdit && builder?.isSelected();

  const className = cn(
    `ce-button ce-button-${buttonNode.content?.size ?? "medium"} ce-button-${buttonNode.content?.variant ?? "default"}`,
    node?.attributes?.className ?? ""
  );

  const commonProps = {
    "data-ce-id": node.id,
    "data-ce-type": node.type,
    id: node?.attributes?.id ?? undefined,
    className,
    style,
  };

  if (isInlineEditing && builder) {
    const updateLabel = (value: string) =>
      builder.onChange({
        ...node,
        content: { ...node.content, label: value },
      });

    const preventLinkNavigation = (e: React.MouseEvent) => e.preventDefault();

    const editableProps = {
      label,
      onChange: updateLabel,
      allowPartialBold: true,
      ...commonProps,
    };

    if (buttonType === "link") {
      return (
        <TagNameEditable
          tagName="a"
          {...editableProps}
          href={href || "#"}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          onClick={preventLinkNavigation}
        />
      );
    }

    return (
      <TagNameEditable
        tagName="button"
        {...editableProps}
        type={buttonType === "submit" ? "submit" : "button"}
      />
    );
  }

  const preventEditInteraction = (e: React.MouseEvent) => {
    if (isEdit) {
      e.preventDefault();
    }
  };

  const previewProps = {
    ...commonProps,
    onClick: preventEditInteraction,
    dangerouslySetInnerHTML: { __html: labelHtml },
  };

  if (buttonType === "link") {
    return (
      <a href={href || "#"} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} {...previewProps} />
    );
  }

  return (
    <button type={buttonType === "submit" ? "submit" : "button"} {...previewProps} />
  );
};

export default View;
