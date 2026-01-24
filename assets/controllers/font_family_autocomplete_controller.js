import { Controller } from '@hotwired/stimulus';
import TomSelect from 'tom-select';

/**
 * Transforme un <select> font-family en champ de recherche (autocomplete) via Tom Select.
 */
export default class extends Controller {
    static values = {
        placeholder: { type: String, default: '—' },
    };

    connect() {
        this.tomselect = new TomSelect(this.element, {
            allowEmptyOption: true,
            placeholder: this.placeholderValue,
            maxOptions: null,
            hideSelected: false,
            render: {
                option: (data, escape) => {
                    const val = String(data.value || '');
                    const text = data.text || val;
                    const idx = val.indexOf(', ');
                    const name = idx >= 0 ? val.slice(0, idx) : val;
                    const fallback = idx >= 0 ? val.slice(idx + 2) : 'sans-serif';
                    const quoted = /[\s']/.test(name) ? `'${name.replace(/'/g, "\\'")}'` : name;
                    const fontFamily = `${quoted}, ${fallback}`.replace(/["<>]/g, '');

                    return `<div style="font-family: ${fontFamily}">${escape(text)}</div>`;
                },
                item: (data, escape) => {
                    return `<div>${escape(data.text || data.value)}</div>`;
                },
            },
        });
    }

    disconnect() {
        if (this.tomselect) {
            this.tomselect.destroy();
            this.tomselect = null;
        }
    }
}
