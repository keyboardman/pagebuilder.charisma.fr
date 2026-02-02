import { type FC } from "react";
import { BaseSettings } from "../Settings";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import type { NodeCardType } from "./index";
import { CardSettings } from "./CardSettings";
import { ImageSettings } from "./ImageSettings";
import { TitleSettings } from "./TitleSettings";
import { TextSettings } from "./TextSettings";
import { LabelsSettings } from "./LabelsSettings";

const Settings: FC<NodeSettingsProps> = () => {
  const { node } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;
  const content = cardNode.content || {};
  const selectedElement = content.selectedElement || null;

  // Afficher les settings selon l'élément sélectionné, avec CardSettings toujours en premier
  if (selectedElement === "image") {
    return (
      <>
        <BaseSettings />
        <CardSettings />
        <ImageSettings />
      </>
    );
  }

  if (selectedElement === "title") {
    return (
      <>
        <BaseSettings />
        <CardSettings />
        <TitleSettings />
      </>
    );
  }

  if (selectedElement === "text") {
    return (
      <>
        <BaseSettings />
        <CardSettings />
        <TextSettings />
      </>
    );
  }

  if (selectedElement === "labels") {
    return (
      <>
        <BaseSettings />
        <CardSettings />
        <LabelsSettings />
      </>
    );
  }

  // Par défaut, afficher les settings généraux
  return (
    <>
      <BaseSettings />
      <CardSettings />
    </>
  );
};

export default Settings;
