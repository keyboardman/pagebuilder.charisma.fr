import { type FC } from "react";
import Form from "../../../components/form";
import { cn } from "@editeur/lib/utils";

interface EditableTextProps {
    show: boolean;
    edit: boolean;
    text: string;
    placeholder?: string|null;
    className: string;
    style: React.CSSProperties;
    onFocus: () => void;
    onBlur: (html: string) => void;
    onSelect: () => void;
}

export const EditableText: FC<EditableTextProps> = ({ show, text, className, style, edit, placeholder = 'Votre texte...', onBlur, onFocus, onSelect }) => {
    if (!show) return null;
    return edit ? (
        <Form.InputEditor
            value={text}
            className={cn("text-base/6", className )}
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
                dangerouslySetInnerHTML={{ __html: text }}
                className={cn("text-base/6", className )}
                style={style}
                onClick={() => {
                    onSelect();
                }}
            />
            {!text ? (<div 
                className="text-muted-foreground/50" 
                onClick={() => {
                    onSelect();
                }}
            >{ placeholder }</div>) : null} 
        </>
    )
}


export default EditableText;