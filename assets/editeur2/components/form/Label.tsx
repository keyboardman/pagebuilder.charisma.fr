import { Label as ShadcnLabel } from "@editeur/components/ui/label";

type LabelProps = {
    text: string;
    className?: string;
}

export const Label = ({ text, className }: LabelProps) => {
    return (
        <ShadcnLabel className={className}>
            {text}
        </ShadcnLabel>
    )
}