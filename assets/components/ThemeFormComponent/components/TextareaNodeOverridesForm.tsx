import { useTheme } from '../ThemeContext';

export const TextareaNodeOverridesForm = () => {
    const { themeState } = useTheme();

    return (
        <input type="hidden" name="config" value={JSON.stringify(themeState)} readOnly/>
    );
};

export default TextareaNodeOverridesForm;