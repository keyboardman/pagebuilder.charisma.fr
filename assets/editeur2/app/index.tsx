
import { createRoot } from "react-dom/client";
import App from "./App";
import OpenEditorButton from "./builder/OpenEditorButton";
import AppProvider from "../services/providers/AppProvider";
import type { FileManagerConfig } from "../ManagerAsset/types";
import type { ApiAdapter } from "../ManagerApi/ApiAdapter";
import { apiRegistry } from "../ManagerApi/ApiRegistry";
import type { AutoSaveOptions, AutoSaveController } from "../services/autosave";
import { registerFont, type RegisterFontInput, forceSyncToIframe } from "../services/typography";

/* Runtime Tailwind JS */
import "./../assets/css/index.css"
//import "./../assets/css/open.css"

interface BuilderInitOptions {
    target: string;
    filemanager?: FileManagerConfig;
}

interface BuilderGlobal {
    init: (options: BuilderInitOptions) => void;
    view: (options: { target: string }) => void;
    registerApi: (adapter: ApiAdapter) => void;
    registerAutoSave: (options: AutoSaveOptions) => AutoSaveController;
    registerFont: (font: RegisterFontInput) => void;
};

const Builder: BuilderGlobal = {
    init({ target, filemanager }: BuilderInitOptions) {
        const container = document.getElementById(target);
        if (!container) {
            console.error('Target not found:', target);
            return;
        }

        if (container instanceof HTMLTextAreaElement === false) {
            console.error('Target not Textarea');
            return;
        }

        const json = container.value;

        const root = document.createElement('div');

        container.insertAdjacentElement('afterend', root);

        container.style.display = 'none';

        // Stocker la config dans une variable globale pour y accéder depuis l'iframe
        const context = (window as any).__CharismaPageBuilderContext || {};
        context.fileManagerConfig = filemanager;
        (window as any).__CharismaPageBuilderContext = context;

        createRoot(root!).render(<OpenEditorButton targetId={target} json={json} />);

    },
    view({ target }: { target: string }) {

        const root = document.getElementById(target);

        if (root) {
            
            const _json = root.dataset.json ?? '{}';
            
            const _start = _json !== undefined ? _json.replace(/[\n\r\t]/g, '') : "{}";
            
            createRoot(root!).render(<AppProvider json={_start} view={true}><App /></AppProvider>);
        }

    },
    registerApi(adapter: ApiAdapter) {
        apiRegistry.register(adapter);
    },
    registerAutoSave(options: AutoSaveOptions): AutoSaveController {
        // Stocker la configuration d'autosave dans le contexte global
        const context = (window as any).__CharismaPageBuilderContext || {};
        context.autoSaveConfig = options;
        (window as any).__CharismaPageBuilderContext = context;

        // L'autosave sera démarré par BuilderProvider une fois qu'il aura accès aux nodes
        // Pour l'instant, on retourne un contrôleur qui sera mis à jour par BuilderProvider
        return {
            stop: () => {
                // Cette fonction sera remplacée par BuilderProvider avec la vraie fonction stop
                const updatedContext = (window as any).__CharismaPageBuilderContext;
                if (updatedContext?.autoSaveController) {
                    updatedContext.autoSaveController.stop();
                }
            }
        };
    },
    registerFont(font: RegisterFontInput) {
        registerFont(font);
        // Forcer la synchronisation après un court délai au cas où l'iframe serait prête
        setTimeout(() => {
            forceSyncToIframe();
        }, 500);
    }
};

(window as any).CharismaPageBuilder = Builder;

export default Builder;