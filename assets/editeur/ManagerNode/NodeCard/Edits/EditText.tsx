import { type FC } from "react";
import { cn } from "@/editeur/lib/utils";
import { styleForView } from "../../../utils/styleHelper";
import { ViewText } from "../Views/index";
import Form from "../../../components/form";

export type EditTextProps = {
    className: string;
    show: boolean;
    style: React.CSSProperties;
    text: string;

    placeholder?: string | null;
    edit: boolean;
    onFocus: () => void;
    onBlur: (html: string) => void;
    onSelect: () => void;
    
}

export const EditText: FC<EditTextProps> = (props: EditTextProps) => {
    const { show, edit, text, className, style, onFocus, onBlur, onSelect } = props;

    const _className = cn("ce-card-text", className ?? "");
    
    if (!show || !edit) return (<ViewText text={text} className={_className} style={styleForView(style)} show={show} />);

    return (
        <Form.InputEditor
            value={text}
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

export default EditText;