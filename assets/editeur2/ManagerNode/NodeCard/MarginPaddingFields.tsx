import Form from "../../components/form";

interface MarginPaddingFieldsProps {
  style?: React.CSSProperties;
  onStyleChange: (property: keyof React.CSSProperties, value: string | undefined) => void;
}

export function MarginPaddingFields({ style = {}, onStyleChange }: MarginPaddingFieldsProps) {
  return (
    <div className="flex flex-col gap-1 mb-1 mt-1">
      <div className="text-center text-sm py-0 leading-tight">Marge</div>
      <div className="grid grid-cols-2 gap-1">
        <Form.Group className="mb-0">
          <Form.Label text="top" />
          <Form.Input
            type="text"
            value={style?.marginTop?.toString() ?? ""}
            onChange={(value) => onStyleChange("marginTop", value)}
            className="h-7 text-sm"
          />
        </Form.Group>
        <Form.Group className="mb-0">
          <Form.Label text="bottom" />
          <Form.Input
            type="text"
            value={style?.marginBottom?.toString() ?? ""}
            onChange={(value) => onStyleChange("marginBottom", value)}
            className="h-7 text-sm"
          />
        </Form.Group>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <Form.Group className="mb-0">
          <Form.Label text="left" />
          <Form.Input
            type="text"
            value={style?.marginLeft?.toString() ?? ""}
            onChange={(value) => onStyleChange("marginLeft", value)}
            className="h-7 text-sm"
          />
        </Form.Group>
        <Form.Group className="mb-0">
          <Form.Label text="right" />
          <Form.Input
            type="text"
            value={style?.marginRight?.toString() ?? ""}
            onChange={(value) => onStyleChange("marginRight", value)}
            className="h-7 text-sm"
          />
        </Form.Group>
      </div>

      <hr className="border-border/30 mb-2 mt-1" />
      <div className="text-center text-sm py-0 leading-tight">Padding</div>
      <div className="grid grid-cols-2 gap-1">
        <Form.Group className="mb-0">
          <Form.Label text="top" />
          <Form.Input
            type="text"
            value={style?.paddingTop?.toString() ?? ""}
            onChange={(value) => onStyleChange("paddingTop", value)}
            className="h-7 text-sm"
          />
        </Form.Group>
        <Form.Group className="mb-0">
          <Form.Label text="bottom" />
          <Form.Input
            type="text"
            value={style?.paddingBottom?.toString() ?? ""}
            onChange={(value) => onStyleChange("paddingBottom", value)}
            className="h-7 text-sm"
          />
        </Form.Group>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <Form.Group className="mb-0">
          <Form.Label text="left" />
          <Form.Input
            type="text"
            value={style?.paddingLeft?.toString() ?? ""}
            onChange={(value) => onStyleChange("paddingLeft", value)}
            className="h-7 text-sm"
          />
        </Form.Group>
        <Form.Group className="mb-0">
          <Form.Label text="right" />
          <Form.Input
            type="text"
            value={style?.paddingRight?.toString() ?? ""}
            onChange={(value) => onStyleChange("paddingRight", value)}
            className="h-7 text-sm"
          />
        </Form.Group>
      </div>
    </div>
  );
}
