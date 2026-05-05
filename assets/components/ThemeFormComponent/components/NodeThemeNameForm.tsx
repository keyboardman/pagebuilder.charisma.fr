import { useTheme } from '../ThemeContext';

export const NodeThemeNameForm = () => {

    const { getThemeName, setThemeName } = useTheme();

    return (
        <div className="space-y-4">
            <div className="space-y-2 max-w-xs">
                <label htmlFor="theme-name" className="text-sm font-medium">
                    Nom du thème
                </label>
                <input
                    id="theme-name"
                    type="text"
                    className="input input-bordered w-full "
                    value={getThemeName()}
                    onChange={(e) => setThemeName(e.target.value)}
                    placeholder="Ex. Mon thème"
                />
            </div>
        </div>
    )
}

export default NodeThemeNameForm;