import React, { type FC, useEffect, useState } from "react";
import { type NodeViewProps } from "../NodeConfigurationType";
import { useNodeContext } from "../../services/providers/NodeContext";
import type { NodeAnniversaireType } from "./index";
import { styleForView } from "../../utils/styleHelper";
import { cn } from "@/editeur/lib/utils";

type AnniversaireItem = {
  couple: string;
  years: number;
  label: string;
};

type AnniversaireGroup = {
  date: string;
  items: AnniversaireItem[];
};

type AnniversaireResponse = {
  groups?: AnniversaireGroup[];
};

const View: FC<NodeViewProps> = () => {
  const { node } = useNodeContext();
  const anniversaireNode = node as NodeAnniversaireType;
  const endpoint =
    anniversaireNode.content.endpoint || "https://api.charisma.fr/charisma/anniversaire/mariage";
  const containerStyle = anniversaireNode.content.container?.style ?? {};
  const titleStyle = anniversaireNode.content.title?.style ?? {};
  const dayStyle = anniversaireNode.content.day?.style ?? {};
  const anniversairesStyle = anniversaireNode.content.anniversaires?.style ?? {};
  const titleText = anniversaireNode.content.title?.text?.trim() || "Anniversaires de mariage";
  const [groups, setGroups] = useState<AnniversaireGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(endpoint, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const contentType = response.headers.get("content-type") ?? "";
        let data: AnniversaireResponse = {};

        if (contentType.includes("application/json")) {
          data = (await response.json()) as AnniversaireResponse;
        } else {
          const text = await response.text();
          data = { groups: parseAnniversaireGroups(text) };
        }

        if (cancelled) return;
        setGroups(Array.isArray(data.groups) ? data.groups : []);
      } catch {
        if (cancelled) return;
        setGroups([]);
        setError(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return (
    <section
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id ?? undefined}
      className={cn("ce-anniversaire", node?.attributes?.className ?? "")}
      style={{
        ...styleForView(node?.attributes?.style ?? {}),
        ...styleForView(containerStyle),
      }}
    >
      <h3 className="ce-anniversaire-title" style={styleForView(titleStyle)}>
        {titleText}
      </h3>
      {loading ? <p className="ce-anniversaire-status">Chargement...</p> : null}
      {error ? <p className="ce-anniversaire-status">Impossible de charger les anniversaires.</p> : null}
      {!loading && !error && groups.length === 0 ? (
        <p className="ce-anniversaire-status">Aucun anniversaire disponible.</p>
      ) : null}

      {!loading && !error ? (
        <div className="ce-anniversaire-groups">
          {groups.map((group) => (
            <div className="ce-anniversaire-group" key={group.date}>
              <h4 className="ce-anniversaire-date" style={styleForView(dayStyle)}>
                {group.date}
              </h4>
              <ul className="ce-anniversaire-list">
                {group.items.map((item, index) => (
                  <li
                    className="ce-anniversaire-item"
                    key={`${group.date}-${item.couple}-${index}`}
                    style={styleForView(anniversairesStyle)}
                  >
                    <span>{item.couple}</span> - <strong>{item.label || `${item.years} ans`}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};

function parseAnniversaireGroups(content: string): AnniversaireGroup[] {
  const fromHtml = parseAnniversaireGroupsFromHtml(content);
  if (fromHtml.length > 0) {
    return fromHtml;
  }
  return parseAnniversaireGroupsFromText(content);
}

function parseAnniversaireGroupsFromHtml(content: string): AnniversaireGroup[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4"));
  const groups: AnniversaireGroup[] = [];

  headings.forEach((heading) => {
    const date = heading.textContent?.trim() ?? "";
    if (!/^\d{2}\/\d{2}$/.test(date)) {
      return;
    }

    const items: AnniversaireItem[] = [];
    let cursor = heading.nextElementSibling;
    while (cursor) {
      if (/^H[1-4]$/.test(cursor.tagName)) {
        break;
      }
      if (cursor.tagName === "UL" || cursor.tagName === "OL") {
        cursor.querySelectorAll("li").forEach((li) => {
          const parsed = parseAnniversaireLine(li.textContent ?? "");
          if (parsed) items.push(parsed);
        });
      }
      cursor = cursor.nextElementSibling;
    }

    if (items.length > 0) {
      groups.push({ date, items });
    }
  });

  return groups;
}

function parseAnniversaireGroupsFromText(content: string): AnniversaireGroup[] {
  const lines = content.split(/\r?\n/);
  const map = new Map<string, AnniversaireItem[]>();
  let currentDate: string | null = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const dateMatch = trimmed.match(/(\d{2}\/\d{2})/);
    if (dateMatch) {
      currentDate = dateMatch[1];
      if (!map.has(currentDate)) {
        map.set(currentDate, []);
      }
      return;
    }

    if (!currentDate) return;
    const parsed = parseAnniversaireLine(trimmed);
    if (parsed) {
      map.get(currentDate)?.push(parsed);
    }
  });

  return Array.from(map.entries())
    .filter(([, items]) => items.length > 0)
    .map(([date, items]) => ({ date, items }));
}

function parseAnniversaireLine(line: string): AnniversaireItem | null {
  const normalized = line.replace(/\*/g, "").replace(/\s+/g, " ").trim();
  const match = normalized.match(/^(.*?)\s*-\s*(\d+)\s*ans?\s*$/i);
  if (!match) return null;

  const couple = (match[1] ?? "").trim();
  const years = Number.parseInt(match[2] ?? "0", 10);
  if (!couple || !Number.isFinite(years) || years <= 0) {
    return null;
  }

  return { couple, years, label: `${years} ans` };
}

export default View;
