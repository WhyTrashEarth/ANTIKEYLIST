// Preserve the exact original project alphabet, including order and case.
export const ALPHABET = "3479ACDEFGHJKMNPQRTUVWXYacdefghjkmnpqrtuvwy@#$%^&*_+=";
export const GROUPS = [
  { label: "Numbers", characters: "3479" },
  { label: "Uppercase", characters: "ACDEFGHJKMNPQRTUVWXY" },
  { label: "Lowercase", characters: "acdefghjkmnpqrtuvwy" },
  { label: "Symbols", characters: "@#$%^&*_+=" },
];

/** Character positions are one-based Unicode code-point positions. No normalization. */
export function inspectText(text) {
  const characters = Array.from(text);
  const excluded = characters.flatMap((character, index) =>
    ALPHABET.includes(character) ? [] : [{ character, position: index + 1 }],
  );
  return {
    length: characters.length,
    excluded,
    valid: characters.length > 0 && excluded.length === 0,
  };
}

/** Rejection sampling avoids modulo bias when mapping random bytes to the alphabet. */
export function generateCode(length = 12, random = globalThis.crypto) {
  if (!Number.isInteger(length) || length < 4 || length > 64) {
    throw new RangeError("Choose a whole-number length from 4 to 64.");
  }
  if (!random || typeof random.getRandomValues !== "function") {
    throw new Error("Secure randomness is unavailable in this browser.");
  }
  const limit = Math.floor(256 / ALPHABET.length) * ALPHABET.length;
  let result = "";
  while (result.length < length) {
    const bytes = random.getRandomValues(new Uint8Array(64));
    for (const byte of bytes) {
      if (byte < limit) result += ALPHABET[byte % ALPHABET.length];
      if (result.length === length) break;
    }
  }
  return result;
}

export function describeCharacter(character) {
  if (character === " ") return "space";
  if (character === "\n") return "line break";
  if (character === "\t") return "tab";
  if (character === "\r") return "carriage return";
  const code = character.codePointAt(0);
  const label = `U+${code.toString(16).toUpperCase().padStart(4, "0")}`;
  return /[\p{C}\p{Z}\p{M}]/u.test(character)
    ? label
    : `${character} (${label})`;
}
