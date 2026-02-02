/**
 * utilitaire pour gerer le changement dynamique des classes tailwind dans le builder
 * utile uniquement en mode edit
 */

import { type NodeType } from "../types/NodeType";
import _ from "lodash";


const tailwindHelper = {
    extractClassesFromNodes: (nodes: Record<string, NodeType>): string[] => {
        const classes: string[] = [];

        function walk(node: NodeType) {

            if (!node) return;
            if (typeof node === 'object') {
                if (node.attributes?.className !== undefined) {
                    const _classes = node?.attributes?.className.split(/\s+/) ?? [];
                    classes.push(..._classes);
                }
                Object.values(node).forEach(walk);
            }
        }

        Object.values(nodes).forEach(node => walk(node));

        return _.filter(classes);
    },
    
    // --- injecte un <style> invisible avec les classes dynamiques pour Tailwind ---
    injectDynamicStyle: (classes: string[]) => {
        if (classes.length === 0) return;

        
        // Cherche si une balise style dynamique existe déjà

        let container = document.body.querySelector<HTMLDivElement>('div[data-tw-dynamic]');
        if (container === null) {
            container = document.createElement('div');
            container.style.display = 'none';
            container.setAttribute('data-tw-dynamic', 'true'); 
            document.body.appendChild(container);
        }
        container.className = _.filter(classes.map(c => `${c}`)).join(' ');        
    },
    // --- live update : appelle cette fonction après chaque modification de nodes ---
    updateNodes: (nodes: Record<string, NodeType>) => {
        const classes = tailwindHelper.extractClassesFromNodes(nodes);
        tailwindHelper.injectDynamicStyle(classes);
    }
}

export default tailwindHelper;