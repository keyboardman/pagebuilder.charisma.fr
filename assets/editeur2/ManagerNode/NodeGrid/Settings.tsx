import { type FC, useMemo } from "react";
import { BaseSettings, BackgroundSettings, BorderSettings, SpacingSettings } from "../Settings";
import Form from "../../components/form";
import { type NodeSettingsProps } from "../NodeConfigurationType";
import { useNodeBuilderContext } from "../../services/providers/NodeBuilderContext";
import type { NodeGridType, NodeGridLayout } from "./index";

const Settings: FC<NodeSettingsProps> = () => {

    const { node, onChange } = useNodeBuilderContext();
    const gridNode = node as NodeGridType;

    // Rétrocompatibilité : utiliser options si layout n'existe pas
    const legacyColumns = gridNode?.attributes?.options?.columns ?? 2;
    const legacyRows = gridNode?.attributes?.options?.rows ?? 2;

    const layout: NodeGridLayout = gridNode?.attributes?.layout || {
        desktop: { columns: legacyColumns, rows: legacyRows },
        tablet: { columns: legacyColumns, rows: legacyRows },
        mobile: { columns: legacyColumns, rows: legacyRows }
    };

    const updateLayout = (breakpoint: keyof NodeGridLayout, updates: Partial<NodeGridLayout[keyof NodeGridLayout]>) => {
        onChange({
            ...node,
            attributes: {
                ...gridNode.attributes,
                layout: {
                    ...layout,
                    [breakpoint]: {
                        ...layout[breakpoint],
                        ...updates
                    }
                }
            } as NodeGridType['attributes']
        });
    };

    // Calculer le nombre de cellules pour chaque breakpoint
    const desktopCells = (layout.desktop?.columns ?? 2) * (layout.desktop?.rows ?? 2);
    const tabletCells = (layout.tablet?.columns ?? 2) * (layout.tablet?.rows ?? 2);
    const mobileCells = (layout.mobile?.columns ?? 2) * (layout.mobile?.rows ?? 2);

    // Vérifier si le nombre de cellules diffère
    const hasDifferentCellCount = useMemo(() => {
        const cells = [desktopCells, tabletCells, mobileCells];
        return new Set(cells).size > 1;
    }, [desktopCells, tabletCells, mobileCells]);

    return (
        <>
            <BaseSettings />
            
            {hasDifferentCellCount && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Attention :</strong> Le nombre de cellules diffère entre les breakpoints. 
                        Desktop: {desktopCells}, Tablet: {tabletCells}, Mobile: {mobileCells}. 
                        Cela peut affecter l&apos;affichage des contenus.
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-2 mt-2">
                <h3 className="text-sm font-semibold text-foreground/80 mb-1">Configuration de la grille</h3>
                
                {/* Gap */}
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground/70 w-20 shrink-0">Gap</h4>
                    <Form.Group className="mb-0 flex-1">
                        <Form.Label text="Espacement" />
                        <Form.Input
                            type="number"
                            value={(gridNode?.attributes?.options?.gap ?? 4).toString()}
                            onChange={(value: string) => {
                                const numValue = parseInt(value, 10);
                                if (!isNaN(numValue) && numValue >= 0 && numValue <= 20) {
                                    onChange({
                                        ...node,
                                        attributes: {
                                            ...gridNode.attributes,
                                            options: {
                                                ...gridNode.attributes?.options,
                                                gap: numValue
                                            }
                                        }
                                    });
                                }
                            }}
                            className="h-7 text-sm"
                            min="0"
                            max="20"
                        />
                    </Form.Group>
                </div>
                
                {/* Desktop */}
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground/70 w-20 shrink-0">Desktop</h4>
                    <div className="grid grid-cols-2 gap-1 flex-1">
                        <Form.Group className="mb-0">
                            <Form.Label text="Colonnes" />
                            <Form.Input
                                type="number"
                                value={(layout.desktop?.columns ?? 2).toString()}
                                onChange={(value: string) => {
                                    const numValue = parseInt(value, 10);
                                    if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
                                        updateLayout('desktop', { columns: numValue });
                                    }
                                }}
                                className="h-7 text-sm"
                                min="1"
                                max="12"
                            />
                        </Form.Group>
                        <Form.Group className="mb-0">
                            <Form.Label text="Lignes" />
                            <Form.Input
                                type="number"
                                value={(layout.desktop?.rows ?? 2).toString()}
                                onChange={(value: string) => {
                                    const numValue = parseInt(value, 10);
                                    if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
                                        updateLayout('desktop', { rows: numValue });
                                    }
                                }}
                                className="h-7 text-sm"
                                min="1"
                                max="12"
                            />
                        </Form.Group>
                    </div>
                </div>

                {/* Tablet */}
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground/70 w-20 shrink-0">Tablet</h4>
                    <div className="grid grid-cols-2 gap-1 flex-1">
                        <Form.Group className="mb-0">
                            <Form.Label text="Colonnes" />
                            <Form.Input
                                type="number"
                                value={(layout.tablet?.columns ?? 2).toString()}
                                onChange={(value: string) => {
                                    const numValue = parseInt(value, 10);
                                    if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
                                        updateLayout('tablet', { columns: numValue });
                                    }
                                }}
                                className="h-7 text-sm"
                                min="1"
                                max="12"
                            />
                        </Form.Group>
                        <Form.Group className="mb-0">
                            <Form.Label text="Lignes" />
                            <Form.Input
                                type="number"
                                value={(layout.tablet?.rows ?? 2).toString()}
                                onChange={(value: string) => {
                                    const numValue = parseInt(value, 10);
                                    if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
                                        updateLayout('tablet', { rows: numValue });
                                    }
                                }}
                                className="h-7 text-sm"
                                min="1"
                                max="12"
                            />
                        </Form.Group>
                    </div>
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground/70 w-20 shrink-0">Mobile</h4>
                    <div className="grid grid-cols-2 gap-1 flex-1">
                        <Form.Group className="mb-0">
                            <Form.Label text="Colonnes" />
                            <Form.Input
                                type="number"
                                value={(layout.mobile?.columns ?? 2).toString()}
                                onChange={(value: string) => {
                                    const numValue = parseInt(value, 10);
                                    if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
                                        updateLayout('mobile', { columns: numValue });
                                    }
                                }}
                                className="h-7 text-sm"
                                min="1"
                                max="12"
                            />
                        </Form.Group>
                        <Form.Group className="mb-0">
                            <Form.Label text="Lignes" />
                            <Form.Input
                                type="number"
                                value={(layout.mobile?.rows ?? 2).toString()}
                                onChange={(value: string) => {
                                    const numValue = parseInt(value, 10);
                                    if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
                                        updateLayout('mobile', { rows: numValue });
                                    }
                                }}
                                className="h-7 text-sm"
                                min="1"
                                max="12"
                            />
                        </Form.Group>
                    </div>
                </div>
            </div>

            <SpacingSettings />
            <hr className="mt-2 border-white-500 border border-dotted" />
            <BackgroundSettings />
            <BorderSettings />
        </>
    );
}

export default Settings;
