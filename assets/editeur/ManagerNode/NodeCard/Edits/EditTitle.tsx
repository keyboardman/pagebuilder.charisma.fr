import { type FC } from "react";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../../utils/styleHelper";
import { ViewTitle } from "../Views/index";
import Form from "../../../components/form";

export type EditTitleProps = {
    show: boolean;
    title: string;
    className: string;
    style: React.CSSProperties;

    placeholder?: string | null;
    edit: boolean;
    onFocus: () => void;
    onBlur: (html: string) => void;
    onSelect: () => void;
}

export const EditTitle: FC<EditTitleProps> = (props: EditTitleProps) => {
    const { show, edit, title, className, style, onFocus, onBlur } = props;

    const _className = cn("ce-card-title", className ?? "");

    if (!show || !edit) return (<ViewTitle title={title} className={_className} style={styleForView(style)} show={show} />);

    return (
        <Form.InputEditor
            value={title}
            className={_className}
            tagName="div"
            style={styleForView(style)}
            onFocus={() => {
                onFocus();
            }}
            onBlur={(html) => {
                onBlur(html);
            }}
        />
    )
}

export default EditTitle;