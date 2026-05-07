import { useTheme } from '../ThemeContext';
import { useEffect } from 'react';

export const TextareaNodeOverridesForm = () => {
    const { themeState } = useTheme();

    useEffect(() => {
        console.log('themeState', themeState);
    }, [themeState]);

    return (
        <input type="hidden" name="config" value={JSON.stringify(themeState)} readOnly/>
    );
};

export default TextareaNodeOverridesForm;