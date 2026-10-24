import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  ALPHABET,
  GROUPS,
  generateCode,
  inspectText,
  describeCharacter,
} from "../src/lib/alphabet.mjs";

test("the website preserves the original alphabet, order, case and uniqueness", () => {
  for (const path of [
    "ANTIKEYLIST_key_generation.py",
    "ANTIKEYLIST_input_validation.py",
    "ANTIKEYLISTInputValidation.java",
    "ANTIKEYLIST_input_validation.html",
  ]) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    assert.ok(source.includes(`"${ALPHABET}"`), `${path} alphabet differs`);
  }
  assert.equal(GROUPS.map((group) => group.characters).join(""), ALPHABET);
  assert.equal(new Set(ALPHABET).size, ALPHABET.length);
});
test("checker distinguishes empty, valid, pasted exclusions and whitespace", () => {
  assert.equal(inspectText("").valid, false);
  assert.equal(inspectText(ALPHABET).valid, true);
  const source = "A0lI 7g\n";
  assert.deepEqual(
    inspectText(source).excluded.map((x) => x.position),
    [2, 3, 4, 5, 8],
  );
  assert.equal(source, "A0lI 7g\n");
});
test("Unicode checks use code-point positions without normalization or case folding", () => {
  assert.deepEqual(inspectText("A💗c\u0301７").excluded, [
    { character: "💗", position: 2 },
    { character: "\u0301", position: 4 },
    { character: "７", position: 5 },
  ]);
  assert.equal(describeCharacter("\u200b"), "U+200B");
  assert.equal(describeCharacter("\n"), "line break");
  assert.equal(inspectText("Cc9g").valid, true);
});
test("generator accepts bounded integer lengths and uses only original characters", () => {
  for (const n of [4, 8, 12, 16, 24, 64]) {
    const code = generateCode(n);
    assert.equal(code.length, n);
    assert.equal(inspectText(code).valid, true);
  }
  for (const n of [0, -1, 3, 65, 12.5, NaN, Infinity, "12", true])
    assert.throws(() => generateCode(n), RangeError);
});
test("generator rejects out-of-range random bytes instead of biasing the mapping", () => {
  let calls = 0;
  const random = {
    getRandomValues(bytes) {
      bytes.fill(255);
      bytes[0] = calls++;
      return bytes;
    },
  };
  assert.equal(generateCode(4, random), ALPHABET.slice(0, 4));
  assert.equal(calls, 4);
});
test("generator fails clearly when browser cryptography is unavailable", () => {
  assert.throws(() => generateCode(12, {}), /unavailable/);
});
