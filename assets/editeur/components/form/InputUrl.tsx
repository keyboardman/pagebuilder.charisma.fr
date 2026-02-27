import { extractUrl } from "../../utils/helpers";
import { Input } from "./Input";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
    value?: string;
    onChange?: (input: string) => void;
};

export function InputUrl({ value, onChange, ...rest }: InputProps) {
    const _value = value !== undefined ? extractUrl(value) : "";

    return (
        <Input type="text" value={_value ?? ""} onChange={(v) => onChange?.(`url('${v}')`)} {...rest} />
    );
}