import { type FC } from "react";
import Form from "../../../components/form";
import  { ViewTitle }  from "../View/index";
import { cn } from "@editeur/lib/utils";

interface EditableTitleProps {
    show: boolean;
    edit: boolean;
    title: string;
    placeholder?: string | null;
    className: string;
    style: React.CSSProperties;
    onFocus: () => void;
    onBlur: (html: string) => void;
    onSelect: () => void;

}

export const EditableTitle: FC<EditableTitleProps> = (props: EditableTitleProps) => {
    const { show, title, className, style, edit, onBlur, onFocus, onSelect } = props;

    if (!show) return <ViewTitle text={title} className={className} style={style} />;
    return edit ? (
        <Form.InputEditor
            value={title}
            className={cn("node-block-title w-full leading-1.2 text-xl font-bold", className ?? "")}
            tagName="div"
            style={style}
            onFocus={() => {
                onFocus();
            }}
            onBlur={(html) => {
                onBlur(html);
            }}
        />
    ) : (
        <ViewTitle
            text={title}
            className={className}
            style={style}
        /> 
    )
}


export default EditableTitle;