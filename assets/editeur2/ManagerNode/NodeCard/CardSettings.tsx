import Form from "../../components/form";
import { Switch } from "@editeur/components/ui/switch";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeCardType } from "./index";
import type { ContainerAlign, ContainerPosition, ContainerRatio } from "./index";
const imagePositionOptions = [
  { label: "En haut", value: "top" },
  { label: "À gauche", value: "left" },
  { label: "À droite", value: "right" },
];

const imageAlignOptions = [
  { label: "Début", value: "start" },
  { label: "Centre", value: "center" },
  { label: "Fin", value: "end" },
  { label: "Étirer", value: "stretch" },
];

const imageRatioOptions = [
  { label: "1/4", value: "1/4" },
  { label: "1/3", value: "1/3" },
  { label: "2/5", value: "2/5" },
  { label: "1/2", value: "1/2" },
  { label: "2/3", value: "2/3" },
  { label: "Plein", value: "full" },
];

export function CardSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const cardNode = node as NodeCardType;
  const content = cardNode.content || {};
  const link = content?.container?.link || "";

  return (
    <div className="flex flex-1 flex-col gap-1 p-1 m-1 border border-border/30">
      <h3 className="text-center">Card</h3>
      <table className="table-fixed align-middle">
        <colgroup>
          <col width="40px" />
          <col width="auto" />
        </colgroup>
        <thead>
          <tr className="text-left">
            <th colSpan={2}>Afficher</th>
          </tr>
        </thead>
        <tbody>
          <tr >
            <td className="align-middle">
              <Switch
                checked={content?.show?.title !== false}
                onCheckedChange={(checked) => {
                  onChange({
                    ...node,
                    content: {
                      ...cardNode.content,
                      show: {
                        ...content.show,
                        title: checked,
                      },
                    },
                  });
                }}
              />
            </td>
            <td className="align-middle">
              Titre
            </td>
          </tr>
          <tr>
            <td>
              <Switch
                checked={content?.show?.text !== false}
                onCheckedChange={(checked) => {
                  onChange({
                    ...node,
                    content: {
                      ...cardNode.content,
                      show: {
                        ...content.show,
                        text: checked,
                      },
                    },
                  });
                }}
              />
            </td>
            <td>Texte</td>
          </tr>
          <tr>
            <td>
              <Switch
                checked={content?.show?.labels !== false}
                onCheckedChange={(checked) => {
                  onChange({
                    ...node,
                    content: {
                      ...cardNode.content,
                      show: {
                        ...content.show,
                        labels: checked,
                      },
                    },
                  });
                }}
              />
            </td>
            <td>Labels</td>
          </tr>
        </tbody>
      </table>

      <Form.Group>
        <Form.Label text="Position de l'image" />
        <Form.Select
          value={content.container?.position || "top"}
          onChange={(value) => {
            onChange({
              ...node,
              content: {
                ...cardNode.content,
                container: {
                  ...content.container,
                  position: value as ContainerPosition,
                },
              },
            });
          }}
          options={imagePositionOptions}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label text="Alignement de l'image" />
        <Form.Select
          value={content.container?.align || "start"}
          onChange={(value) => {
            onChange({
              ...node,
              content: {
                ...cardNode.content,
                container: {
                  ...content.container,
                  align: value as ContainerAlign,
                },
              },
            });
          }}
          options={imageAlignOptions}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label text="Ratio de l'image" />
        <Form.Select
          value={content.container?.ratio || "1/3"}
          onChange={(value) => {
            onChange({
              ...node,
              content: {
                ...node.content,
                container: {
                  ...node?.content?.container,
                  ratio: value as ContainerRatio,
                },
              },
            });
          }}
          options={imageRatioOptions}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label text="Lien (image + titre)" />
        <Form.Input
          type="text"
          value={link}
          onChange={(value) => {
            onChange({
              ...node,
              content: {
                ...cardNode.content,
                container: {
                  ...content.container,
                  link: value,
                },
              },
            });
          }}
          placeholder="Ex: https://monsite.fr ou /page"
        />
      </Form.Group>

    </div>
  );
}

