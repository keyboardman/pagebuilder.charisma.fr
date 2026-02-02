import { useState, useEffect, useCallback } from "react";
import { useBuilderContextSafe } from "../services/providers/BuilderContext";

const useFullscreen = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const context = useBuilderContextSafe();
    const iframeRef = context?.iframeRef;

    const getDoc = useCallback(() => {
        return iframeRef?.current?.contentDocument ?? (typeof document !== "undefined" ? document : null);
    }, [iframeRef]);

    const enterFullScreen = useCallback(async () => {
        const doc = getDoc();
        const el = doc?.documentElement;
        if (!el) return;
        try {
            if (el.requestFullscreen) {
                await el.requestFullscreen();
            } else if (typeof (el as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen === "function") {
                await (el as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
            } else if (typeof (el as unknown as { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen === "function") {
                await (el as unknown as { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
            } else if (typeof (el as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen === "function") {
                await (el as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
            }
        } catch (error) {
            console.error("Erreur entrée plein écran:", error);
        }
    }, [getDoc]);

    const exitFullScreen = useCallback(async () => {
        const doc = getDoc();
        if (!doc?.fullscreenElement) return;
        try {
            if (doc.exitFullscreen) {
                await doc.exitFullscreen();
            } else if (typeof (doc as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen === "function") {
                await (doc as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
            } else if (typeof (doc as unknown as { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen === "function") {
                await (doc as unknown as { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
            } else if (typeof (doc as unknown as { msExitFullscreen?: () => Promise<void> }).msExitFullscreen === "function") {
                await (doc as unknown as { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
            }
        } catch (error) {
            console.error("Erreur sortie plein écran:", error);
        }
    }, [getDoc]);

    useEffect(() => {
        const doc = getDoc();
        if (!doc) return;
        const update = () => setIsFullScreen(!!doc.fullscreenElement);
        doc.addEventListener("fullscreenchange", update);
        doc.addEventListener("webkitfullscreenchange", update);
        doc.addEventListener("mozfullscreenchange", update);
        doc.addEventListener("MSFullscreenChange", update);
        update();
        return () => {
            doc.removeEventListener("fullscreenchange", update);
            doc.removeEventListener("webkitfullscreenchange", update);
            doc.removeEventListener("mozfullscreenchange", update);
            doc.removeEventListener("MSFullscreenChange", update);
        };
    }, [getDoc]);

    return { enterFullScreen, exitFullScreen, isFullScreen };
};

export default useFullscreen