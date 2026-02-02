import { ViewTitle, type ViewTitleProps } from "../ViewTitle";

type EditTitleProps = ViewTitleProps & {
    onSelect: () => void;
    show: boolean;
}

const EditTitle = (props: EditTitleProps) => {
    const { onSelect, title, className, show, style } = props;

    return (
        <ViewTitle
            title={title}
            className={className}
            style={style}
            onClick={() => onSelect()}  
            show={show}
        />
    )

}

export default EditTitle;