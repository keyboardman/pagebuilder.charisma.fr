import React, { useEffect, useRef, useState } from "react";
import { Input as ShadcnInput } from "@editeur/components/ui/input";
import useDebounce from "../../hooks/useDebounce";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
    value?: string;
    onChange?: (input: string) => void;
    className?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ onChange, value, className, ...rest }, ref) => {
        const [_value, setValue] = useState(value || "");

        // ref pour ignorer le premier rendu
        const isFirstRender = useRef(true);

        const [debouncedValue, isWaiting] = useDebounce(_value, 500);

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

        return (
            <>
                <ShadcnInput
                    {...rest}
                    ref={ref}
                    value={_value}
                    onChange={(e) => setValue(e.target.value ?? '')}
                    className={className}
                />
                {isWaiting && <span className="text-muted-foreground">...</span>}
            </>
        );
    }
);

Input.displayName = "Input";


