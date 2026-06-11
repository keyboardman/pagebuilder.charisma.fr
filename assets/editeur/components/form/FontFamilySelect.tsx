import React, { useState } from "react";
import { Select } from "./Select";
import { useTypographyOptions } from "../../services/typography";
import { useAppContext } from "../../services/providers/AppContext";
import { ManagerFontModal } from "../../ManagerFont/ManagerFontModal";
import { adoptPageFont } from "../../ManagerFont/FontUsageRegistry";
import type { FontPayload } from "../../ManagerFont/backendFontAdapter";
import { Button } from "@/editeur/components/ui/button";

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
    const { pageBuilderApiBaseUrl } = useAppContext();
    const [modalOpen, setModalOpen] = useState(false);

    const options = [
        { label: placeholder, value: '' },
        ...fontOptions
    ];

    const handleFontSelect = (font: FontPayload) => {
        adoptPageFont(font);
        onChange?.(font.fontFamily);
    };

    return (
        <div className="flex flex-col gap-1">
            <Select
                {...rest}
                value={value || ""}
                onChange={onChange}
                options={options}
                className={className}
            />
            {pageBuilderApiBaseUrl && (
                <>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs w-fit"
                        onClick={() => setModalOpen(true)}
                    >
                        Ajouter une police…
                    </Button>
                    <ManagerFontModal
                        open={modalOpen}
                        onOpenChange={setModalOpen}
                        apiBaseUrl={pageBuilderApiBaseUrl}
                        onSelect={handleFontSelect}
                    />
                </>
            )}
        </div>
    );
};

FontFamilySelect.displayName = "FontFamilySelect";
