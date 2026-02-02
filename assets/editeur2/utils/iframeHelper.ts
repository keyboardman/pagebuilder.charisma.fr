import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";

type jsLink = {
    link: string;
    onLoad?: () => void
}

type MessageHandler = (event: MessageEvent) => void;

function iframeHelper() {
    let iframe:HTMLIFrameElement | null = null;
    let messageHandler: MessageHandler | null = null;

    function init(): HTMLIFrameElement {
        iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "90vh";
        iframe.style.border = "1px solid #ccc";
        iframe.style.borderRadius = "8px";
        iframe.style.marginTop = "12px";
        iframe.sandbox.add("allow-scripts", "allow-same-origin", "allow-modals");

        return iframe;
    }

    function clean(){
        if (!iframe) return;

        const iframeDoc = iframe.contentDocument!;
        const iframeBody = iframeDoc.body;

        iframeDoc.head.innerHTML = "";
        iframeBody.innerHTML = "";
    }

    function setTitle(title: string) {
        if (!iframe) return;
        const iframeDoc = iframe.contentDocument!;

        const meta = iframeDoc.createElement("meta");
        meta.setAttribute("charset", "UTF-8");

        const viewport = iframeDoc.createElement("meta");
        viewport.name = "viewport";
        viewport.content = "width=device-width, initial-scale=1.0";

        const iframeTitle = iframeDoc.createElement("title");
        iframeTitle.textContent = title;

        iframeDoc.head.append(meta, viewport, iframeTitle);
    }

    async function setCss(cssLinks: string[]) {
        if (!iframe) return;
        const iframeDoc = iframe.contentDocument!;

        cssLinks.forEach((_link: string) => {
            const iframeCssLink = iframeDoc.createElement("link");
            iframeCssLink.rel = "stylesheet";
            iframeCssLink.href = _link;
            iframeDoc.head.appendChild(iframeCssLink);
        });
    }

    async function setJs(jsLinks: jsLink[]) {
        if (!iframe) return;
        const iframeDoc = iframe.contentDocument!;

        jsLinks.forEach((js) => {
            const iframeJsScript = iframeDoc.createElement("script");
            iframeJsScript.type = 'module';
            iframeJsScript.src = js.link;
            if(js.onLoad) {
                iframeJsScript.onload = js.onLoad;
            }

            iframeDoc.body.appendChild(iframeJsScript);
        })
        
    }

    function render(content: ReactNode) {
        if (!iframe) {
            throw new Error("iframe not initialized. Call init() first.");
        }
        const iframeDoc = iframe.contentDocument!;
        const rootEl = iframeDoc.createElement("div");
        rootEl.id = "iframe-root";
        iframeDoc.body.appendChild(rootEl);
        createRoot(rootEl).render(content);
    }

    function getIframe(): HTMLIFrameElement | null {
        return iframe;
    }

    // --- Supprimer complètement l’iframe ---
    function destroy() {
        if (iframe && iframe.parentElement) {
        iframe.parentElement.removeChild(iframe);
        iframe = null;
        }
    }

    // --- Envoi de message vers l’iframe ---
    function postMessage(message: any) {
        if (!iframe?.contentWindow) return;
        iframe.contentWindow.postMessage(message, "*");
    }

    // --- Réception de message depuis l’iframe ---
    function onMessage(callback: MessageHandler) {
        messageHandler = callback;
        window.addEventListener("message", messageHandler);
    }
    
    // --- Stopper l’écoute des messages ---
    function offMessage() {
        if (messageHandler) {
        window.removeEventListener("message", messageHandler);
        messageHandler = null;
        }
    }

    return {
        init,
        clean,
        setTitle,
        setCss,
        setJs,
        render,
        destroy,
        postMessage,
        onMessage,
        offMessage,
        getIframe,
    }
}

export default iframeHelper;