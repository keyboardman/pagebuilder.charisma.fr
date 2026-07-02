import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import InputEditor, { normalizeContentEditableHtml } from "./InputEditor";

describe("normalizeContentEditableHtml", () => {
  it("retourne une chaîne vide pour un contenu vide ou uniquement un saut de ligne", () => {
    expect(normalizeContentEditableHtml("")).toBe("");
    expect(normalizeContentEditableHtml("   ")).toBe("");
    expect(normalizeContentEditableHtml("<br>")).toBe("");
    expect(normalizeContentEditableHtml("<div><br></div>")).toBe("");
  });

  it("convertit les blocs div en sauts de ligne br", () => {
    expect(normalizeContentEditableHtml("<div>Ligne 1</div><div>Ligne 2</div>")).toBe(
      "Ligne 1<br>Ligne 2"
    );
  });

  it("conserve les espaces normaux", () => {
    expect(normalizeContentEditableHtml("hello world")).toBe("hello world");
  });

  it("préserve les espaces insécables en entité &nbsp;", () => {
    expect(normalizeContentEditableHtml("a\u00A0b")).toBe("a&nbsp;b");
    expect(normalizeContentEditableHtml("mot&nbsp;!")).toBe("mot&nbsp;!");
  });

  it("combine sauts de ligne et espaces", () => {
    expect(normalizeContentEditableHtml("<div>foo bar</div><div>baz</div>")).toBe(
      "foo bar<br>baz"
    );
  });
});

describe("InputEditor", () => {
  function getEditor(container: HTMLElement): HTMLElement {
    const editor = container.querySelector("[contenteditable='true']");
    if (!editor) throw new Error("contentEditable introuvable");
    return editor as HTMLElement;
  }

  it("affiche la valeur initiale et est contentEditable", () => {
    const { container } = render(<InputEditor value="Bonjour" tagName="h1" className="ce-header" />);
    const editor = getEditor(container);

    expect(editor.tagName).toBe("H1");
    expect(editor).toHaveClass("ce-header");
    expect(editor).toHaveAttribute("contenteditable", "true");
    expect(editor.innerHTML).toBe("Bonjour");
  });

  it("normalise le HTML et appelle onBlur", () => {
    const onBlur = vi.fn();
    const { container } = render(<InputEditor value="" onBlur={onBlur} />);
    const editor = getEditor(container);

    editor.innerHTML = "<div>foo bar</div><div>baz</div>";
    fireEvent.blur(editor);

    expect(onBlur).toHaveBeenCalledWith("foo bar<br>baz");
  });

  it("insère un espace normal lors d'un appui sur Espace", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    const { container } = render(<InputEditor value="" onBlur={onBlur} />);
    const editor = getEditor(container);

    await user.click(editor);
    await user.keyboard("a b");
    fireEvent.blur(editor);

    expect(onBlur).toHaveBeenCalledWith("a b");
  });

  it("insère un espace insécable avec Maj+Espace", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    const { container } = render(<InputEditor value="" onBlur={onBlur} />);
    const editor = getEditor(container);

    await user.click(editor);
    await user.keyboard("mot");
    fireEvent.keyDown(editor, { key: " ", shiftKey: true });
    await user.keyboard("!");
    fireEvent.blur(editor);

    expect(onBlur).toHaveBeenCalledWith("mot&nbsp;!");
  });

  it("insère des sauts de ligne lors d'un collage multiligne", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    const { container } = render(<InputEditor value="" onBlur={onBlur} />);
    const editor = getEditor(container);

    await user.click(editor);
    await user.paste("ligne 1\nligne 2");
    fireEvent.blur(editor);

    expect(onBlur).toHaveBeenCalledWith("ligne 1<br>ligne 2");
  });

  it("insère un saut de ligne lors d'un appui sur Entrée", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    const { container } = render(<InputEditor value="" onBlur={onBlur} />);
    const editor = getEditor(container);

    await user.click(editor);
    await user.keyboard("ligne 1{Enter}ligne 2");
    fireEvent.blur(editor);

    expect(onBlur).toHaveBeenCalledWith("ligne 1<br>ligne 2");
  });

  it("synchronise la valeur externe quand le champ n'a pas le focus", () => {
    const { container, rerender } = render(<InputEditor value="Ancien" />);
    const editor = getEditor(container);

    expect(editor.innerHTML).toBe("Ancien");

    rerender(<InputEditor value="Nouveau depuis NodeSettings" />);

    expect(editor.innerHTML).toBe("Nouveau depuis NodeSettings");
  });

  it("ne propage pas le clic au parent du canevas", () => {
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <InputEditor value="texte" />
      </div>
    );

    const editor = screen.getByText("texte");
    fireEvent.click(editor);

    expect(parentClick).not.toHaveBeenCalled();
  });
});
