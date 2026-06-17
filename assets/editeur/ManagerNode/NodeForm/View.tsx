import { type FC, type FormEvent, useMemo, useState } from "react";
import NodeCollection from "../components/NodeCollection";
import { useNodeContext } from "../../services/providers/NodeContext";
import { type NodeEditProps, type NodeViewProps } from "../NodeConfigurationType";
import { styleForView } from "../../utils/styleHelper";
import type { NodeFormType } from "./index";
import { cn } from "@/editeur/lib/utils";
import { IoClose } from "react-icons/io5";
import { BUILDER_FORM_HONEYPOT_FIELD } from "./builderFormConstants";
import { resolveFormSubmitAction } from "./resolveFormSubmitAction";

const View: FC<NodeViewProps | NodeEditProps> = () => {
  const { node, getChildren } = useNodeContext();
  const formNode = node as NodeFormType;
  const children = getChildren("main");
  const method = formNode.content?.method ?? "POST";
  const storedAction = (formNode.content?.action ?? "").trim();
  const formConfigId = (formNode.content?.formConfigId ?? "").trim();
  const action = resolveFormSubmitAction(storedAction, formConfigId);

  const [submitState, setSubmitState] = useState<{
    status: "idle" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "" });

  const absoluteAction = useMemo(() => {
    if (!action) return "";
    if (typeof window === "undefined") return action;
    if (action.startsWith("http://") || action.startsWith("https://")) return action;
    const path = action.startsWith("/") ? action : `/${action}`;
    return `${window.location.origin}${path}`;
  }, [action]);

  const resolveMessageFromResponse = async (res: Response): Promise<{ ok: boolean; message: string }> => {
    try {
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        const ok = typeof data?.success === "boolean" ? data.success : res.ok;
        const message =
          (typeof data?.message === "string" && data.message) ||
          (typeof data?.successMessage === "string" && data.successMessage) ||
          (typeof data?.error === "string" && data.error) ||
          (typeof data?.errors === "string" && data.errors) ||
          res.statusText ||
          "Réponse reçue.";
        return { ok, message };
      }
    } catch {
      // ignore parse errors, fallback to text
    }

    if (res.ok) {
      return { ok: true, message: "Formulaire envoyé." };
    }
    return { ok: false, message: "Erreur lors de la soumission du formulaire." };
  };

  const onSubmitAjax = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!absoluteAction) {
      setSubmitState({ status: "error", message: "URL d'action manquante." });
      return;
    }

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      if (method === "GET") {
        const url = new URL(absoluteAction);
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
          params.append(key, String(value ?? ""));
        }
        const qs = params.toString();
        if (qs) url.search = url.search ? `${url.search}&${qs}` : qs;

        const res = await fetch(url.toString(), { method: "GET", credentials: "same-origin" });
        const { ok, message } = await resolveMessageFromResponse(res);
        setSubmitState({ status: ok ? "success" : "error", message });
        return;
      }

      const res = await fetch(absoluteAction, {
        method,
        body: formData,
        credentials: "same-origin",
      });

      const { ok, message } = await resolveMessageFromResponse(res);
      setSubmitState({ status: ok ? "success" : "error", message });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur réseau.";
      setSubmitState({ status: "error", message: msg });
    }
  };

  return (
    <form
      data-ce-id={node.id}
      data-ce-type={node.type}
      id={node?.attributes?.id}
      className={cn("ce-form", node?.attributes?.className)}
      style={styleForView(node?.attributes?.style)}
      method={method}
      action={action || undefined}
      onSubmit={onSubmitAjax}
    >
      {formConfigId ? (
        <input
          type="text"
          name={BUILDER_FORM_HONEYPOT_FIELD}
          defaultValue=""
          tabIndex={-1}
          autoComplete="off"
          className="pointer-events-none absolute left-[-10000px] h-px w-px opacity-0"
          aria-hidden="true"
        />
      ) : null}
      {submitState.status !== "idle" ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "ce-form-alert",
            submitState.status === "success" ? "ce-form-alert--success" : "ce-form-alert--error"
          )}
        >
          <span className="ce-form-alert__message">{submitState.message}</span>
          <button
            type="button"
            className="ce-form-alert__close"
            aria-label="Fermer"
            onClick={() => setSubmitState({ status: "idle", message: "" })}
          >
            <IoClose />
          </button>
        </div>
      ) : null}
      <NodeCollection nodes={children} parentId={node.id} zone="main" />
    </form>
  );
};

export default View;
