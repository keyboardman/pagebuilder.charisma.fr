import { useEffect, useRef, useState } from "react";
import { Input as ShadcnInput } from "@editeur/components/ui/input";
import { cn } from "@editeur/lib/utils";
import useDebounce from "../../hooks/useDebounce";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
    value?: string;
    onChange?: (input: string) => void;
    className?: string;
};

export function InputColor({ value, onChange, className, ...rest }: InputProps) {
    const [_value, setValue] = useState(value || "");

    // ref pour ignorer le premier rendu
    const isFirstRender = useRef(true);

    const isHex = /^#([0-9A-Fa-f]{3,8})$/.test(_value);
    const colorValue = isHex ? _value : "#777777";

    const [debouncedValue, isWaiting] = useDebounce(_value, 500);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (onChange) {
            onChange(debouncedValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue]);

    // Synchroniser avec la valeur externe
    useEffect(() => {
        if (value !== undefined && value !== _value) {
            setValue(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Détecter si h-7 est dans className pour ajuster la hauteur du color picker
    const isCompact = className?.includes('h-7');
    const colorPickerHeight = isCompact ? 'h-7' : 'h-4';

    return (
        <div className="flex gap-0 align-top justify-start items-start">
            <input
                type="color"
                value={colorValue}
                onChange={handleColorChange}
                className={cn(
                    "w-8 color-input appearance-none border-none rounded-l-md rounded-r-none cursor-pointer p-0 m-0",
                    colorPickerHeight,
                    !isHex && _value.trim() !== "" && "disabled:opacity-25 cursor-not-allowed"
                )}
                disabled={!isHex && _value.trim() !== ""}
                title={isHex ? "Sélecteur de couleur" : "Non applicable à cette valeur"}
            />
            <ShadcnInput
                {...rest}
                value={_value}
                onChange={handleTextChange}
                className={cn(className, "rounded-l-none")}
            />
            {isWaiting && <span className="text-muted-foreground">...</span>}
        </div>
    );
}