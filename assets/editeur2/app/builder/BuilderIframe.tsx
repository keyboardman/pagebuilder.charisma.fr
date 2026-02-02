import { useEffect, useRef, useState, type ReactNode } from "react";
import ReactDOM from "react-dom";
import { useBuilderContextSafe } from "../../services/providers/BuilderContext";
import { syncRegisteredFontsToDocument } from "../../services/typography";

interface BuilderIframeProps {
    cssFiles?: string[];
    jsFiles?: { link: string; onLoad?: () => void }[];
    children: ReactNode

}

// Composant qui sera rendu dans l'iframe pour mettre à jour le contexte
function IframeRefUpdater({ iframeRef }: { iframeRef: React.RefObject<HTMLIFrameElement | null> }) {
    const context = useBuilderContextSafe();

    useEffect(() => {
        if (iframeRef.current && context?.setIframeRef) {
            context.setIframeRef(iframeRef);
        }
    }, [iframeRef, context]);

    return null;
}

export default function BuilderIframe({ cssFiles = [], jsFiles = [], children }: BuilderIframeProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);

    // Attendre le load de l'iframe avant de rendre le contenu
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        const onLoad = () => {

            const doc = iframe?.contentDocument;
            if (!doc?.head || !doc?.body) return;

            // Injecter CSS
            cssFiles.forEach((href) => {
                const link = doc.createElement("link");
                link.rel = "stylesheet";
                link.href = href;
                doc.head.appendChild(link);
            });

            // Injecter JS
            jsFiles.forEach(({ link, onLoad }) => {
                const script = doc.createElement("script");
                script.src = link;
                script.type = "text/javascript";
                script.onload = () => onLoad?.();
                script.onerror = () => {};
                doc.body.appendChild(script);
            });

            setIframeBody(doc.body);
            
            // Synchroniser les fonts enregistrées vers l'iframe
            syncRegisteredFontsToDocument(doc);
        };

        iframe.addEventListener("load", onLoad);

        if (iframe.contentDocument?.readyState === 'complete') {
            onLoad()
        } else {
            iframe.addEventListener("load", onLoad);
        }

        return () => iframe.removeEventListener("load", onLoad)
    }, [cssFiles, jsFiles]);

    return (
        <iframe
            id="builder_iframe"
            ref={iframeRef}

            title="Builder Iframe"
            // a besoin de srcDoc pour permetre l'injection de js et css dans l'iframe
            srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>`}
            className="w-full h-full block border-none border-gray-300"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox allow-presentation"
        >
            {iframeBody?.isConnected && ReactDOM.createPortal(
                <>
                    <IframeRefUpdater iframeRef={iframeRef} />
                    {children}
                </>,
                iframeBody
            )}
        </iframe>
    );
}
