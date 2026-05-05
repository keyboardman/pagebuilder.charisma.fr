import { resolveColorValue } from '../utils';

function ColorSwatch({
    value,
    prop,
}: {
    value: string;
    prop: 'background' | 'color' | 'border-color';
}) {
    const resolved = value.trim() ? resolveColorValue(value.trim()) : '';
    const style = prop === 'background'
        ? { background: resolved || 'transparent' }
        : { backgroundColor: resolved || 'transparent' };
    return (
        <span
            className="w-5 h-5 rounded border border-border shrink-0"
            style={style}
            title={resolved || '—'}
            aria-hidden
        />
    );
}

export default ColorSwatch;