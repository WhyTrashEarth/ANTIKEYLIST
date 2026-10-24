import {
  ALPHABET,
  describeCharacter,
  generateCode,
  inspectText,
} from "../lib/alphabet.mjs";

const el = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T;
const tabs = Array.from(
  document.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
);
function selectTab(tab: HTMLButtonElement) {
  for (const item of tabs) {
    const active = item === tab;
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
    el(item.getAttribute("aria-controls")!).hidden = !active;
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[next]);
    tabs[next].focus();
  });
});

const specimen = el("specimen");
const choices = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-characters]"),
);
const names: Record<string, string> = {
  "0": "zero",
  O: "uppercase O",
  o: "lowercase o",
  "1": "one",
  l: "lowercase L",
  I: "uppercase I",
  "5": "five",
  S: "uppercase S",
  s: "lowercase s",
  C: "uppercase C",
  c: "lowercase c",
  "9": "nine",
  g: "lowercase g",
};
choices.forEach((button) =>
  button.addEventListener("click", () => {
    choices.forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
    const characters = Array.from(button.dataset.characters!);
    specimen.setAttribute(
      "aria-label",
      characters.map((char) => names[char]).join(", "),
    );
    specimen.replaceChildren(
      ...characters.map((char) => {
        const column = document.createElement("div");
        column.className = "specimen-character";
        const glyph = document.createElement("span");
        glyph.className = "specimen-glyph";
        glyph.textContent = char;
        const status = document.createElement("span");
        const included = ALPHABET.includes(char);
        status.className = `membership${included ? " included" : ""}`;
        status.textContent = included ? "In the set" : "Left out";
        column.append(glyph, status);
        return column;
      }),
    );
    el("comparison-note").textContent = button.dataset.note!;
  }),
);
const fonts: Record<string, string> = {
  atkinson: "Atkinson, Arial, sans-serif",
  sans: "Arial, sans-serif",
  serif: "Georgia, serif",
  mono: "ui-monospace, monospace",
};
el<HTMLSelectElement>("font-select").addEventListener("change", (event) => {
  specimen.style.fontFamily = fonts[(event.target as HTMLSelectElement).value];
});
const size = el<HTMLInputElement>("type-size");
function updateSize() {
  specimen.style.setProperty("--glyph-size", `${size.value}px`);
  el("size-output").textContent = `${size.value} px`;
}
size.addEventListener("input", updateSize);
updateSize();

// A failed clipboard request leaves the content intact and selectable.
async function copyText(text: string, status: HTMLElement) {
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(text);
    status.textContent = "Copied. Ready when you are.";
  } catch {
    status.textContent =
      "Copy is unavailable here. Select the text and copy it manually.";
    if (status.id === "alphabet-copy-status") {
      const fallback = document.createElement("textarea");
      fallback.value = text;
      fallback.readOnly = true;
      fallback.setAttribute("aria-label", "Character set to copy manually");
      fallback.style.cssText =
        "width:100%;margin-top:12px;padding:10px;overflow-wrap:anywhere";
      status.replaceChildren(
        document.createTextNode("Select the character set below to copy it."),
        fallback,
      );
      fallback.select();
    }
  }
}
const generated = el<HTMLOutputElement>("generated-code");
el("generate-code").addEventListener("click", () => {
  try {
    generated.textContent = generateCode(
      Number(el<HTMLSelectElement>("code-length").value),
    );
    el("generation-label").textContent = "GENERATED IN YOUR BROWSER";
    el("code-copy-status").textContent = "";
  } catch {
    el("code-copy-status").textContent =
      "Your browser could not securely generate a code. The example has been kept.";
  }
});
el("copy-code").addEventListener("click", () =>
  copyText(generated.textContent!, el("code-copy-status")),
);
el("copy-alphabet").addEventListener("click", () =>
  copyText(ALPHABET, el("alphabet-copy-status")),
);
el("copy-snippet").addEventListener("click", () =>
  copyText(el("python-snippet").textContent!, el("snippet-copy-status")),
);

const input = el<HTMLTextAreaElement>("check-input");
const result = el("check-result");
function checkSample() {
  const inspection = inspectText(input.value);
  const heading = document.createElement("strong");
  const explanation = document.createElement("p");
  result.className = "check-result";
  if (!inspection.length) {
    heading.textContent = "A little clarity starts here.";
    explanation.textContent =
      "Enter a sample to see which characters belong to the set.";
  } else if (inspection.valid) {
    result.classList.add("is-valid");
    heading.textContent = "Every character makes the list.";
    explanation.textContent = `All ${inspection.length} character${inspection.length === 1 ? "" : "s"} belong to the original set. That checks membership, not security or readability in every context.`;
  } else {
    result.classList.add("has-excluded");
    const count = inspection.excluded.length;
    heading.textContent = `${count} character${count === 1 ? "" : "s"} outside the set.`;
    explanation.textContent =
      "Your sample is unchanged. Positions count characters from 1, including spaces and line breaks.";
  }
  result.replaceChildren(heading, explanation);
  if (inspection.excluded.length) {
    const list = document.createElement("ul");
    for (const { character, position } of inspection.excluded.slice(0, 20)) {
      const item = document.createElement("li");
      item.textContent = `${describeCharacter(character)} — position ${position}`;
      list.append(item);
    }
    result.append(list);
    if (inspection.excluded.length > 20) {
      const more = document.createElement("p");
      more.textContent = `Showing the first 20 of ${inspection.excluded.length} excluded characters.`;
      result.append(more);
    }
  }
}
input.addEventListener("input", checkSample);
el("try-sample").addEventListener("click", () => {
  input.value = "A0lI 7g";
  checkSample();
  input.focus();
});
el("clear-sample").addEventListener("click", () => {
  input.value = "";
  checkSample();
  input.focus();
});
