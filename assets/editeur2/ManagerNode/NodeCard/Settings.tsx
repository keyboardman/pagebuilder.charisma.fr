import { type FC } from "react";
import { Base2Settings } from "../Settings";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import type { NodeCardType } from "./index";
import { CardSettings } from "./CardSettings";
import { ImageSettings } from "./ImageSettings";
import { TitleSettings } from "./TitleSettings";
import { TextSettings } from "./TextSettings";
import { LabelsSettings } from "./LabelsSettings";

const Settings: FC<NodeSettingsProps> = () => {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;
  const content = cardNode.content || {};
  const selectedElement = content.selectedElement || null;

  // Afficher les settings selon l'élément sélectionné, avec CardSettings toujours en premier
  const baseProps = {
    attributes: node.attributes,
    onChange: (attributes: { className?: string; id?: string }) =>
      onChange({ ...node, attributes: { ...node.attributes, ...attributes } }),
  };

  if (selectedElement === "image") {
    return (
      <>
        <Base2Settings {...baseProps} />
        <CardSettings />
        <ImageSettings />
      </>
    );
  }

  if (selectedElement === "title") {
    return (
      <>
        <Base2Settings {...baseProps} />
        <CardSettings />
        <TitleSettings />
      </>
    );
  }

  if (selectedElement === "text") {
    return (
      <>
        <Base2Settings {...baseProps} />
        <CardSettings />
        <TextSettings />
      </>
    );
  }

  if (selectedElement === "labels") {
    return (
      <>
        <Base2Settings {...baseProps} />
        <CardSettings />
        <LabelsSettings />
      </>
    );
  }

  // Par défaut, afficher les settings généraux
  return (
    <>
      <Base2Settings {...baseProps} />
      <CardSettings />
    </>
  );
};

export default Settings;
