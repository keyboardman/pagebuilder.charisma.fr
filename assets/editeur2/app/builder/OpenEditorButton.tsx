import { useState } from "react";

import BuilderIframe from "./BuilderIframe";
import BuilderProvider from "../../services/providers/BuilderProvider";
import AppProvider from "../../services/providers/AppProvider";
import App from "../App";

/**
 * Bouton React pour ouvrir l'éditeur dans une iframe isolée
 */
export default function OpenEditorButton({ targetId, json }: { targetId: string; json: string }) {
  // Récupérer la configuration filemanager depuis le contexte parent
  const parentContext = (window as any).__CharismaPageBuilderContext;
  const fileManagerConfig = parentContext?.fileManagerConfig || null;

  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <div>
        <button
          type="button"
          onClick={() => setShowEditor(!showEditor)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md mt-2"
        >
          🧩 {showEditor ? "Fermer l'éditeur" : "Ouvrir l'éditeur"}
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {showEditor && (
          <AppProvider json={json} view={false} fileManagerConfig={fileManagerConfig}>
            <BuilderProvider target={targetId}>
              <BuilderIframe
                cssFiles={import.meta.env.PROD ? [`${import.meta.env.VITE_APP_URL}/assets/index.css`] : ["/src/assets/css/index.css"]}
                jsFiles={import.meta.env.PROD ? [{ link: `${import.meta.env.VITE_APP_URL}/assets/js/tailwind.4.1.14.js` }, { link: `${import.meta.env.VITE_APP_URL}/assets/index.js` }] : [
                  { link: "/src/assets/js/tailwind.4.1.14.js" },
                ]}
              >
                <App />

              </BuilderIframe>
            </BuilderProvider>
          </AppProvider>
        )}
      </div>
    </div>

  );
}
