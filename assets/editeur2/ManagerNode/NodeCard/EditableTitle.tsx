import { type FC } from "react";
import Form from "../../components/form";
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

export const EditableTitle: FC<EditableTitleProps> = ({ show, title, className, style, edit, onBlur, onFocus, onSelect, placeholder = 'Votre titre...' }) => {
    if (!show) return null;
    return edit ? (
        <Form.InputEditor
            value={title}
            className={cn("w-full leading-1.2 text-xl/normal font-bold", className)}
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
        <>
            <div
                role="heading"
                aria-level={3}
                dangerouslySetInnerHTML={{ __html: title }}
                className={cn("w-full text-xl/normal font-bold", className)}
                style={style}
                onClick={() => {
                    onSelect();
                }}
            />
            {!title ? (<div
                role="heading"
                aria-level={3}
                className="text-muted-foreground/50"
                onClick={() => {
                    onSelect();
                }}
            >{placeholder}</div>) : null}
        </>
    )
}


export default EditableTitle;