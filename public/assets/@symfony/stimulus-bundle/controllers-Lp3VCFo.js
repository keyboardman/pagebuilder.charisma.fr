import controller_0 from "../ux-autocomplete/controller.js";
import "tom-select/dist/css/tom-select.default.css";
import controller_1 from "../ux-react/render_controller.js";
import controller_2 from "../../controllers/hello_controller.js";
import controller_3 from "../../controllers/font_family_autocomplete_controller.js";
import controller_4 from "../../controllers/collection_add_controller.js";
export const eagerControllers = {"symfony--ux-autocomplete--autocomplete": controller_0, "symfony--ux-react--react": controller_1, "hello": controller_2, "font-family-autocomplete": controller_3, "collection-add": controller_4};
export const lazyControllers = {"csrf-protection": () => import("../../controllers/csrf_protection_controller.js")};
export const isApplicationDebug = true;