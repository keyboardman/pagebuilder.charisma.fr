import { useState } from "react";
import { ThemeConfigJson } from "./types";
import _ from "lodash";

export default function useCssOverride(config: ThemeConfigJson, targets: Record<string, string>) {
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>(() =>
    Object.fromEntries(
      _.map(targets, (target, key) => [
        key,
        config?.node_overrides?.[key] ?? {}
      ])
    )
  );

  const updateField = (key: string, field: string, value: string) => {
    setOverrides((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  return { overrides, updateField };
}