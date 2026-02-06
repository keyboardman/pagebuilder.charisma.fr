import React, { useEffect, useRef, useState } from "react";
import { NativeSelect, NativeSelectOption } from "@editeur/components/ui/native-select";
import useDebounce from "../../hooks/useDebounce";

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value' | 'options'> & {
    value?: string;
    onChange?: (input: string) => void;
    className?: string;
    options?: { value: string; label: string }[];
    placeholder?: string;
};

export const Select = ({ onChange, value, className, options = [], placeholder, ...rest }: SelectProps) => {
    const [_value, setValue] = useState(value || "");

    // ref pour ignorer le premier rendu
    const isFirstRender = useRef(true);

    const [debouncedValue] = useDebounce(_value, 500);

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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
    };

    // Réduire le padding si h-7 est dans className pour que le texte soit entièrement visible
    const selectClassName = className?.includes('h-7') 
        ? className.replace(/px-\d+|py-\d+/g, '').replace(/\s+/g, ' ') + ' px-2 py-0'
        : className;

    return (
        <NativeSelect
            {...rest}
            value={_value}
            onChange={handleChange}
            className={selectClassName}
        >
            {placeholder && (
                <NativeSelectOption value="" disabled>
                    {placeholder}
                </NativeSelectOption>
            )}
            {options.map((opt: { value: string; label: string }) => (
                <NativeSelectOption key={opt.value || "__empty__"} value={opt.value}>
                    {opt.label}
                </NativeSelectOption>
            ))}
        </NativeSelect>
    );
}
