import { ViewLabel, type ViewLabelProps } from "../ViewLabel";

type EditLabelProps = ViewLabelProps & {
    onSelect: () => void;
}

const EditLabel = (props: EditLabelProps) => {
    const { onSelect, label, className, show, style } = props;

    return (
        <ViewLabel
            label={label}
            className={className}
            style={style}
            show={show}
            onClick={() => onSelect()}
        />
    )
}

export default EditLabel;