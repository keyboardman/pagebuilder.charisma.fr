import Form from "../../components/form";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";

export function BaseSettings() {

    const { node, onChange } = useNodeBuilderContext();
    const attributes = node.attributes;

    return (
        <div className="flex flex-col gap-1 ">
            <Form.Group className="mb-0">
                <Form.Label text="ID" />
                <Form.Input
                    type="text"
                    value={attributes?.id ?? ""}
                    onChange={(value: string) => {
                        onChange({
                            ...node,
                            attributes: { ...node.attributes, id: value ?? '' },
                        })
                    }}
                    className="h-7 text-sm"
                />
            </Form.Group>

            <Form.Group className="mb-0">
                <Form.Label text="Classe" />
                <Form.Input
                    type="text"
                    value={attributes?.className ?? ""}
                    onChange={(value) => {
                        onChange({
                            ...node,
                            attributes: { ...node.attributes, className: value },
                        })
                    }}
                    className="h-7 text-sm"
                />
            </Form.Group>
            <hr className="border-border/30 mb-2 mt-1"/>
        </div>
    );
}
