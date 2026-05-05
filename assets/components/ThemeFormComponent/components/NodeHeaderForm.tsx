import React from 'react';
import HeadingTag from './HeadingTag';
import NodeHeaderFormRow from './NodeHeaderFormRow';
import { useTheme } from '../ThemeContext';

export type headerType = {
    key: string;
    label: string;
    selector: string;
    tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

const HEADERS = [
    { key: 'node-header-h1', label: 'NodeHeader H1', selector: '.ce-header-h1', tag: 'h1' },
    { key: 'node-header-h2', label: 'NodeHeader H2', selector: '.ce-header-h2', tag: 'h2' },
    { key: 'node-header-h3', label: 'NodeHeader H3', selector: '.ce-header-h3', tag: 'h3' },
    { key: 'node-header-h4', label: 'NodeHeader H4', selector: '.ce-header-h4', tag: 'h4' },
    { key: 'node-header-h5', label: 'NodeHeader H5', selector: '.ce-header-h5', tag: 'h5' },
    { key: 'node-header-h6', label: 'NodeHeader H6', selector: '.ce-header-h6', tag: 'h6' },
] as headerType[];

export function NodeHeaderForm() {

    const { getStyleFromOverride } = useTheme();

    return (
        <details className="group border border-border rounded-lg">
            <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
                <span className="transition group-open:rotate-90">▶</span>
                NodeHeader
            </summary>
            <div className="px-4 pb-4 pt-1 border-t border-border space-y-4">
                <p className="text-sm text-muted-foreground pt-2">
                    Styles des titres H1 à H6 du bloc NodeHeader (classes <code className="text-xs">.ce-header-h*</code>),
                    alignés sur les réglages du builder.
                </p>
                <div>
                    {HEADERS.map((header) => {
                        return (
                            <React.Fragment key={header.key}>
                                <HeadingTag tag={header.tag} style={getStyleFromOverride(header.selector)}>{header.label}</HeadingTag>
                                <hr style={{ border: '1px solid #e0e0e0', margin: '1rem 0' }} />
                                <NodeHeaderFormRow target={header} />
                                <hr style={{ border: '1px solid #e0e0e0', margin: '1rem 0' }} />
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </details>
    );
}

export default NodeHeaderForm;