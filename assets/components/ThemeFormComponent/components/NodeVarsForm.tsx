import { useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { ThemeVar } from '../types';
export const NodeVarsForm = () => {
    const { getVars, setVars, themeState } = useTheme();

    const nextVarId = useRef<number>(themeState.vars.length + 1);
    
    const vars = getVars();

    const addVar = () => {
        const _vars = [...themeState.vars, { id: nextVarId.current + 1, name: '--', value: '' }];
        nextVarId.current += 1;
        setVars(_vars);
    };   

    const updateVar = (id: number, patch: Partial<{ name: string; value: string }>) => {
        const _vars = themeState.vars.map((v) => (v.id === id ? { ...v, ...patch } : v));
        setVars(_vars);
    };

    const removeVar = (id: number, name?: string) => {
        const label = name && name.trim() ? name.trim() : 'cette variable';
        if (!window.confirm(`Supprimer la variable « ${label} » ?`)) {
            return;
        }

        const _vars = themeState.vars.filter((v) => v.id !== id);
        setVars(_vars);
    };

    return (
        <details className="group border border-border rounded-lg">
            <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-base select-none hover:bg-muted/50 rounded-t-lg [&::-webkit-details-marker]:hidden flex items-center gap-2">
                <span className="transition group-open:rotate-90">▶</span>
                Variables du thème
            </summary>
            <div className="px-4 pb-4 pt-1 space-y-2 border-t border-border">
                <p className="text-sm text-muted-foreground pt-2">
                    Variables CSS inspirées des valeurs par défaut Tailwind. Vous pouvez les modifier, en ajouter ou en
                    supprimer.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                    {vars.map((v) => (
                        <div key={v.id} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                            <input
                                type="text"
                                className="input input-bordered w-full sm:w-1/3"
                                value={v.name}
                                onChange={(e) => updateVar(v.id, { name: e.target.value })}
                                placeholder="--ma-variable"
                            />
                            <input
                                type="text"
                                className="input input-bordered flex-1"
                                value={v.value}
                                onChange={(e) => updateVar(v.id, { value: e.target.value })}
                                placeholder="Valeur (ex. #000000, 16px, oklch(...))"
                            />
                            <button
                                type="button"
                                className="btn btn-sm btn-ghost mt-1 sm:mt-0"
                                onClick={() => removeVar(v.id, v.name)}
                            >
                                Supprimer
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" className="btn btn-sm btn-outline" onClick={addVar}>
                    Ajouter une variable
                </button>

            </div>
        </details >
    );
};

export default NodeVarsForm;