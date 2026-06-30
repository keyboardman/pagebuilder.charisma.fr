import Form from "../../../components/form";
import { useNodeBuilderContext } from "../../../services/providers/NodeBuilderContext";
import { useThemeStylePlaceholder } from "../../../services/themeStyleHints";
import { SettingsSectionTitle } from "../../Settings/SettingsSectionTitle";
import { THEME_SELECTORS } from "../../Settings";
import type { NodeIconeType } from "../index";

export function IconStyleSettings() {
  const { node, onChange } = useNodeBuilderContext();
  const iconeNode = node as NodeIconeType;
  const style = iconeNode.content?.iconMedia?.style ?? {};
  const colorPlaceholder = useThemeStylePlaceholder(THEME_SELECTORS.icone, "color");

  const updateStyle = (nextStyle: React.CSSProperties) => {
    onChange({
      ...node,
      content: {
        ...iconeNode.content,
        iconMedia: { ...iconeNode.content?.iconMedia, style: nextStyle },
      },
    });
  };

  return (
    <div className="mb-2 mt-1 flex flex-col gap-1">
      <SettingsSectionTitle>Icone</SettingsSectionTitle>
      <Form.Group className="mb-0">
        <Form.Label text="color" className="text-foreground" />
        <Form.InputColor
          type="text"
          value={style?.color?.toString() ?? ""}
          onChange={(value) => updateStyle({ ...style, color: value })}
          placeholder={colorPlaceholder}
          className="h-7 text-sm"
        />
      </Form.Group>
    </div>
  );
}
