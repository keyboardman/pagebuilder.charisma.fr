import React from "react";
import DraggableItem from "./DraggableItem";
import NodeComponentButton from "./NodeComponentButton";
import NodeRegistry from "../components/NodeRegistry";
import type { NodeConfigurationType } from "../NodeConfigurationType";
import _ from "lodash";

// Définir l'ordre des catégories avec leurs labels
const CATEGORY_CONFIG = [
    { key: 'container', label: 'Container' },
    { key: 'content', label: 'Content' },
    { key: 'api', label: 'Api' }
] as const;

export default function PanelButtons() {
    const registriesWithButton = _.filter(
        NodeRegistry,
        (registry): registry is NodeConfigurationType & { button: NonNullable<NodeConfigurationType["button"]> } =>
            !!registry.button
    );

    // Grouper par catégorie en utilisant le champ category du button
    const groupedByCategory = _.groupBy(registriesWithButton, (registry) => {
        // Utiliser la catégorie du button, ou 'content' par défaut si non définie
        return registry.button?.category || 'content';
    });

    // Trier les registries dans chaque catégorie par order
    const sortedCategories = CATEGORY_CONFIG.map(categoryConfig => {
        const registries = groupedByCategory[categoryConfig.key] || [];
        return {
            ...categoryConfig,
            registries: _.sortBy(registries, (registry) => registry.button?.order || 0)
        };
    });

    return (
        <>
            {sortedCategories.map(({ key, label, registries }) => {
                if (registries.length === 0) return null;
                return (
                    <React.Fragment key={key}>
                        <div className="col-span-full text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-4 first:mt-0">
                            {label}
                        </div>
                        {registries.map((registry: NodeConfigurationType) => {
                            if (!registry.button) return null;
                            return (
                                <DraggableItem
                                    key={registry.type}
                                    id={registry.type}
                                    data={{ action: "add", type: registry.type }}
                                >
                                    <NodeComponentButton label={registry.button.label} icon={<registry.button.icon />} />
                                </DraggableItem>
                            );
                        })}
                    </React.Fragment>
                );
            })}
            {/* Boutons personnalisés supplémentaires */}
            {/* Exemple: 
            <DraggableItem
                id="custom-button"
                data={{ action: "add", type: "custom-type" }}
            >
                <NodeComponentButton label="Custom" icon={<CustomIcon />} />
            </DraggableItem>
            */}
        </>
    );
}
