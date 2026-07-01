import "video.js/dist/video-js.css";
import "./editeur/components/video/charismaVideo.css";
import { initCharismaVideoModals } from "./editeur/components/video/charismaVideoModal";

window.CharismaVideoModal = {
  init: initCharismaVideoModals,
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initCharismaVideoModals());
} else {
  initCharismaVideoModals();
}
