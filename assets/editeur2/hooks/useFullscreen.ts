import { useState, useEffect, useCallback } from "react";
import { useBuilderContextSafe } from "../services/providers/BuilderContext";

const useFullscreen = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const context = useBuilderContextSafe();
    const iframeRef = context?.iframeRef;

    // Obtenir le document de l'iframe
    const getIframeDocument = useCallback(() => {
        return iframeRef?.current?.contentDocument || null;
    }, [iframeRef]);

    // Obtenir le body de l'iframe
    const getIframeBody = useCallback(() => {
        return iframeRef?.current?.contentDocument?.body || null;
    }, [iframeRef]);

    const enterFullScreen = async () => {
        const iframeBody = getIframeBody();
        const iframeDoc = getIframeDocument();

        if (iframeBody && iframeDoc) {
            try {
                // Utiliser le document de l'iframe pour le fullscreen
                const docElement = iframeDoc.documentElement;
                if (docElement.requestFullscreen) {
                    await docElement.requestFullscreen();
                } else if ('webkitRequestFullscreen' in docElement && typeof (docElement as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen === 'function') {
                    await (docElement as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
                } else if ('mozRequestFullScreen' in docElement && typeof (docElement as { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen === 'function') {
                    await (docElement as { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
                } else if ('msRequestFullscreen' in docElement && typeof (docElement as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen === 'function') {
                    await (docElement as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
                }
            } catch (error) {
                console.error('Erreur lors de l\'entrée en plein écran:', error);
            }
        }
    };

    const exitFullScreen = async () => {
        const iframeDoc = getIframeDocument();
        
        if (iframeDoc && iframeDoc.fullscreenElement) {
            try {
                if (iframeDoc.exitFullscreen) {
                    await iframeDoc.exitFullscreen();
                } else if ('webkitExitFullscreen' in iframeDoc && typeof (iframeDoc as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen === 'function') {
                    await (iframeDoc as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
                } else if ('mozCancelFullScreen' in iframeDoc && typeof (iframeDoc as { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen === 'function') {
                    await (iframeDoc as { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
                } else if ('msExitFullscreen' in iframeDoc && typeof (iframeDoc as { msExitFullscreen?: () => Promise<void> }).msExitFullscreen === 'function') {
                    await (iframeDoc as { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
                }
            } catch (error) {
                console.error('Erreur lors de la sortie du plein écran:', error);
            }
        }
    };

    // Détection du changement d'état (entrée/sortie du plein écran)
    useEffect(() => {
        const iframeDoc = getIframeDocument();
        if (!iframeDoc) return;

        const updateFullscreenState = () => {
            setIsFullScreen(!!iframeDoc.fullscreenElement);
        };

        iframeDoc.addEventListener('fullscreenchange', updateFullscreenState);
        iframeDoc.addEventListener('webkitfullscreenchange', updateFullscreenState);
        iframeDoc.addEventListener('mozfullscreenchange', updateFullscreenState);
        iframeDoc.addEventListener('MSFullscreenChange', updateFullscreenState);

        // Vérifier l'état initial
        updateFullscreenState();

        return () => {
            iframeDoc.removeEventListener('fullscreenchange', updateFullscreenState);
            iframeDoc.removeEventListener('webkitfullscreenchange', updateFullscreenState);
            iframeDoc.removeEventListener('mozfullscreenchange', updateFullscreenState);
            iframeDoc.removeEventListener('MSFullscreenChange', updateFullscreenState);
        };
    }, [getIframeDocument]);

    return { enterFullScreen, exitFullScreen, isFullScreen }
}

export default useFullscreen