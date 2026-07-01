import { registerCharismaFavoriButtonPlugin } from "./charismaFavoriButton";
import { registerCharismaMediaCompteurPlugin } from "./charismaMediaCompteur";

let registered = false;

export function registerCharismaVideoPlugins(): void {
  if (registered) return;
  registerCharismaFavoriButtonPlugin();
  registerCharismaMediaCompteurPlugin();
  registered = true;
}
