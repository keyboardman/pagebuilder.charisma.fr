import { cn } from "@editeur/lib/utils";

type GroupProps = {
    children: React.ReactNode;
    className?: string;
}

export const Group = ({ children, className }: GroupProps) => {
    return (
        <div className={cn("flex flex-1 flex-col gap-0.5 p-0 mb-1 mx-1", className)}>
            {children}
        </div>
    );
}
