import { Controller } from '@hotwired/stimulus';

/**
 * Pour les champs CollectionType avec allow_add : bouton « + Ajouter » qui insère
 * une nouvelle entrée à partir du <template> prototype en remplaçant __name__ par l’index.
 * Le template contient du HTML brut (non échappé) pour que les champs soient correctement interprétés.
 */
export default class extends Controller {
    static targets = ['list', 'prototype'];

    add() {
        if (!this.hasListTarget || !this.hasPrototypeTarget) return;
        const html = this.prototypeTarget.innerHTML.replace(/__name__/g, String(this.listTarget.children.length));
        this.listTarget.insertAdjacentHTML('beforeend', html);
    }
}
