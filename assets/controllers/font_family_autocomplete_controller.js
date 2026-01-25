import { Controller } from '@hotwired/stimulus';
import TomSelect from 'tom-select';

/**
 * Transforme un <select> font-family en champ de recherche (autocomplete) via Tom Select.
 * La valeur est envoyée via un <input type="hidden"> (même name que le select) car le select
 * peut être ignoré par FormData/Turbo une fois stylé par Tom Select.
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

        // Forcer la présélection si le select a déjà une valeur (theme.yaml chargé)
        const initial = this.element.value || this.element.querySelector('option:checked')?.value || '';
        if (initial && this.tomselect.getValue() !== initial) {
            this.tomselect.setValue(initial, true);
        }

        // Input hidden avec le même name que le select : c’est lui qui est soumis (Tom Select
        // peut faire ignorer le select par FormData). On retire le name du select pour éviter
        // les doublons.
        const name = this.element.getAttribute('name');
        if (name) {
            this.hiddenInput = document.createElement('input');
            this.hiddenInput.type = 'hidden';
            this.hiddenInput.name = name;
            const v = this.tomselect.getValue();
            this.hiddenInput.value = Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
            this.element.removeAttribute('name');
            this.element.insertAdjacentElement('afterend', this.hiddenInput);
        }

        this._boundSync = this._syncToSelect.bind(this);
        this.tomselect.on('change', this._boundSync);
        const form = this.element.form || this.element.closest('form');
        if (form) {
            form.addEventListener('submit', this._boundSync, { capture: true });
        }
    }

    _syncToSelect() {
        if (!this.tomselect) return;
        const v = this.tomselect.getValue();
        const str = Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
        this.element.value = String(str);
        if (this.hiddenInput) {
            this.hiddenInput.value = String(str);
        }
    }

    disconnect() {
        if (this.tomselect && this._boundSync) {
            this.tomselect.off('change', this._boundSync);
        }
        const form = this.element?.form || this.element?.closest?.('form');
        if (form && this._boundSync) {
            form.removeEventListener('submit', this._boundSync, { capture: true });
        }
        if (this.hiddenInput?.parentNode) {
            this.hiddenInput.remove();
        }
        this.hiddenInput = null;
        if (this.tomselect) {
            this.tomselect.destroy();
            this.tomselect = null;
        }
    }
}
