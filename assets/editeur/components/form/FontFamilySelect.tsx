import React from "react";
import { Select } from "./Select";
import { useTypographyOptions } from "../../services/typography";

type FontFamilySelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> & {
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    placeholder?: string;
};

export const FontFamilySelect = ({ 
    value, 
    onChange, 
    className,
    placeholder = "...",
    ...rest 
}: FontFamilySelectProps) => {
    const { fontOptions } = useTypographyOptions();
    
    // Ajouter l'option vide en premier
    const options = [
        { label: placeholder, value: '' },
        ...fontOptions
    ];

    return (
        <Select
            {...rest}
            value={value || ""}
            onChange={onChange}
            options={options}
            className={className}
        />
    );
};

FontFamilySelect.displayName = "FontFamilySelect";
