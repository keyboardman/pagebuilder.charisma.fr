import { ViewLabels } from "../View/index";

interface EditLabelProps {
    label: string;
    className: string;
    style: React.CSSProperties;
}

const EditLabel = (props: EditLabelProps) => {
    const {label, className, style } = props;

    if(!label) return false;
    return (
        <ViewLabels
            labels={[label]}
            className={className}
            style={style}
        />
    )
}

export default EditLabel;