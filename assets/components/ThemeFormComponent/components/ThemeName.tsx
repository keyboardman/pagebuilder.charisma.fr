import { useTheme } from '../ThemeContext';

export const ThemeName = () => {
    const { getThemeName } = useTheme();
    return (
        <div className="sticky top-0 z-10 -mx-6 -mt-6 mb-4 flex items-center justify-between gap-4 border-b bg-background px-6 py-3 shadow-sm">
            <span className="font-semibold truncate" title={getThemeName() || 'Sans nom'}>
                {getThemeName() || 'Sans nom'}
            </span>
            <a 
                href={`/theme/showcase?theme=2`} 
                className="btn btn-secondary btn-sm" 
                target="_blank"
                rel="noopener"
            >Prévisualisation</a>
            <button type="submit" className="btn btn-primary shrink-0">
                Enregistrer
            </button>
        </div>
    )
}

export default ThemeName;