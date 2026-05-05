import React from 'react';
import { cn } from '@/lib/utils';

const HeadingTag = ({ tag, children, style }: { tag: keyof JSX.IntrinsicElements; children: React.ReactNode; style: React.CSSProperties }) => {
    return React.createElement(tag, { className: cn('ce-header', `ce-header-${tag}`), style }, children);
};

export default HeadingTag;