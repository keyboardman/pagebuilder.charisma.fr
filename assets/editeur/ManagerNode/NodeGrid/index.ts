import { type NodeType } from '../../types/NodeType'
import {
    defaultNodeConfiguration,
    type NodeConfigurationType
} from '../NodeConfigurationType'
import View from './View'
import Settings from './Settings'
import { IoGridOutline } from 'react-icons/io5'

export type BreakpointKey = "mobile" | "tablet" | "desktop";

export const NODE_GRID_TYPE = 'node-grid' as const

export const GRID_COLS: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12'
}

export const SM_GRID_COLS: Record<number, string> = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
    6: 'sm:grid-cols-6',
    7: 'sm:grid-cols-7',
    8: 'sm:grid-cols-8',
    9: 'sm:grid-cols-9',
    10: 'sm:grid-cols-10',
    11: 'sm:grid-cols-11',
    12: 'sm:grid-cols-12'
}

export const LG_GRID_COLS: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
    7: 'lg:grid-cols-7',
    8: 'lg:grid-cols-8',
    9: 'lg:grid-cols-9',
    10: 'lg:grid-cols-10',
    11: 'lg:grid-cols-11',
    12: 'lg:grid-cols-12'
}

export const GAP_CLASS: Record<number, string> = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12'
}

export const cols = (layout: NodeGridLayout, key: BreakpointKey) =>
    layout[key]?.columns ?? layout.desktop?.columns ?? 2;

export const rows = (layout: NodeGridLayout, key: BreakpointKey) =>
    layout[key]?.rows ?? layout.desktop?.rows ?? 2;

/** Zones `cell-{row}-{col}` dérivées de la structure desktop. */
export const buildDesktopCellZones = (layout: NodeGridLayout): string[] => {
    const cDesktop = cols(layout, 'desktop')
    const rDesktop = rows(layout, 'desktop')
    const zones: string[] = []
    for (let row = 0; row < rDesktop; row++) {
        for (let col = 0; col < cDesktop; col++) {
            zones.push(`cell-${row}-${col}`)
        }
    }
    return zones
}

export interface NodeGridLayout {
    desktop?: {
        columns?: number
        rows?: number
    }
    tablet?: {
        columns?: number
        rows?: number
    }
    mobile?: {
        columns?: number
        rows?: number
    }
}

export interface NodeGridType extends NodeType {
    type: 'node-grid'
    content?: undefined
    isDroppable: true
    attributes?: NodeType['attributes'] & {
        options?: {
            columns?: number
            rows?: number
            gap?: number
        }
        layout?: NodeGridLayout
    }
}

export const NodeGrid: NodeConfigurationType = {
    ...defaultNodeConfiguration,
    view: View,
    settings: Settings,
    type: NODE_GRID_TYPE,
    button: {
        ...defaultNodeConfiguration.button,
        label: 'Grid',
        icon: IoGridOutline,
        category: 'container',
        order: 2,
        tooltip: "Conteneur pour organiser les éléments en grille"
    },
    default: {
        ...defaultNodeConfiguration.default,
        attributes: {
            options: {
                columns: 2,
                rows: 2,
                gap: 4
            },
            layout: {
                desktop: {
                    columns: 2,
                    rows: 2
                },
                tablet: {
                    columns: 2,
                    rows: 2
                },
                mobile: {
                    columns: 2,
                    rows: 2
                }
            }
        }
    }
}

export default NodeGrid
