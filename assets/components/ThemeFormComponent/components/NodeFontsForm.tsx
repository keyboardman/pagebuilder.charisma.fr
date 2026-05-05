import _ from 'lodash';
import { Combobox, ComboboxContent, ComboboxList, ComboboxItem, useComboboxAnchor, ComboboxChips, ComboboxChip, ComboboxValue, ComboboxChipsInput, ComboboxEmpty } from '../../ui/combobox';
import { useTheme } from '../ThemeContext';
import { FontOption } from '../types';

export const NodeFontsForm = () => {
    const anchor = useComboboxAnchor();

    const { allFontsOptions, getFonts, setFonts } = useTheme();

    const items = allFontsOptions.map((f) => `${f.id}|${f.name}`);


    const updateFonts = (values: string[]) => {
        setFonts(values.map((value: string) => parseInt(value.split('|')[0])));
    }

    return (
        <>
            <h1 className="text-xl font-semibold">Polices du thème</h1>
            <Combobox multiple autoHighlight items={items} value={getFonts} onValueChange={updateFonts}>
                <ComboboxChips ref={anchor} className="w-full max-w-xs">
                    <ComboboxValue>
                        {(values: string[]) => (
                            <>
                                {values.map((value) => {
                                    const [, name] = value.split('|');
                                    const fontFamily = name ? `"${String(name).replace(/"/g, '')}", sans-serif` : undefined;
                                    return (
                                        <ComboboxChip key={value} style={fontFamily ? { fontFamily } : undefined}>
                                            {name}
                                        </ComboboxChip>
                                    );
                                })}
                                <ComboboxChipsInput />
                                {values.map((value) => {
                                    const [id] = value.split('|');
                                    return (
                                        <input key={`hidden-${id}`} type="hidden" value={id} />
                                    );
                                })}
                            </>
                        )}
                    </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>Aucune police trouvée.</ComboboxEmpty>
                    <ComboboxList>
                        {(item: string) => {
                            const [id, name] = item.split('|');
                            const fontFamily = name ? `"${String(name).replace(/"/g, '')}", sans-serif` : undefined;
                            return (
                                <ComboboxItem key={id} value={item} style={fontFamily ? { fontFamily } : undefined}>
                                    {name}
                                </ComboboxItem>
                            );
                        }}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </>
    )
}

export default NodeFontsForm;