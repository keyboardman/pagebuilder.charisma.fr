import type { FC } from "react";
import { Switch } from "@/editeur/components/ui/switch";
import type { CollectionShow } from "../index";

type ShowKey = keyof CollectionShow;

interface StyleTabProps {
  show?: CollectionShow;
  onToggle: (key: ShowKey, checked: boolean) => void;
  /** Clés à afficher (défaut : toutes). Permet de masquer counter/like en vue card. */
  keys?: ShowKey[];
}

const DEFAULT_KEYS: ShowKey[] = ["image", "title", "description", "counter", "like", "labels"];

const LABELS: Partial<Record<ShowKey, string>> = {
  image: "Image",
  title: "Titre",
  description: "Description",
  counter: "Counter",
  like: "Like",
  labels: "Labels",
};

export const StyleTab: FC<StyleTabProps> = ({ show, onToggle, keys = DEFAULT_KEYS }) => {
  return (
    <div className="mt-0 space-y-2 text-xs">
      {keys.map((key) => (
        <label key={key} className="flex items-center justify-between gap-2">
          <span>{LABELS[key] ?? key}</span>
          <Switch checked={show?.[key] !== false} onCheckedChange={(checked) => onToggle(key, checked)} />
        </label>
      ))}
    </div>
  );
};
