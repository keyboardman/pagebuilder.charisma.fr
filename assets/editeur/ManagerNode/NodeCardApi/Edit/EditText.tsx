import { ViewText, type ViewTextProps } from "../ViewText";

type EditTextProps = ViewTextProps & {
    onSelect: () => void;
    show: boolean;
}

const EditText = (props: EditTextProps) => {

    const { onSelect, text, className, show, style } = props;

    return (
        <ViewText
            text={text}
            className={className}
            style={style}
            onClick={() => onSelect()}
            show={show}
        />
    )
}

export default EditText;