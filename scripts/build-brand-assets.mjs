import sharp from "sharp";
import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";

const art = resolve("public/art/annie-key-original.png");
const fontRegular = resolve("public/fonts/atkinson-regular.ttf");
const fontBold = resolve("public/fonts/atkinson-bold.ttf");
const cream = "#fcf3ec";
const ink = "#29241f";
// Only resize/composite the supplied artwork; do not redraw or modify its features.
for (const [size, name] of [
  [32, "favicon-32.png"],
  [180, "apple-touch-icon.png"],
  [192, "icon-192.png"],
  [512, "icon-512.png"],
]) {
  const dimension = Math.round(size * 0.95);
  const image = await sharp(art)
    .resize(dimension, dimension, { fit: "inside" })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: cream },
  })
    .composite([{ input: image, gravity: "centre" }])
    .png()
    .toFile(`public/${name}`);
}
const favicon = await sharp("public/favicon-32.png").png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico[6] = 32;
ico[7] = 32;
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(favicon.length, 14);
ico.writeUInt32LE(22, 18);
await writeFile("public/favicon.ico", Buffer.concat([ico, favicon]));

async function text(text, size, color = ink, bold = false) {
  return sharp({
    text: {
      text: `<span foreground="${color}">${text}</span>`,
      font: `Atkinson Hyperlegible ${bold ? "Bold " : ""}${size}`,
      fontfile: bold ? fontBold : fontRegular,
      rgba: true,
      dpi: 72,
    },
  })
    .png()
    .toBuffer();
}
const decoration = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="${cream}"/><path d="M48 94H1152" stroke="${ink}" stroke-opacity=".25"/><rect x="46" y="304" width="598" height="29" rx="10" fill="#fdb9cc" transform="rotate(-1 46 304)"/><ellipse cx="923" cy="325" rx="217" ry="215" fill="#efe2aa"/><rect y="548" width="1200" height="82" fill="#d1b0f7"/><path d="M0 548H1200" stroke="${ink}"/><rect x="1070" y="412" width="66" height="68" rx="12" fill="#e3f1fa" stroke="${ink}" stroke-width="2" transform="rotate(8 1070 412)"/></svg>`,
);
const annie = await sharp(art)
  .resize(463, 463, { fit: "inside" })
  .png()
  .toBuffer();
const layers = [
  { input: await text("ANTI KEY LIST.", 27, ink, true), left: 48, top: 35 },
  { input: await text("A little less", 80, ink, true), left: 45, top: 144 },
  { input: await text("guesswork.", 88, ink, true), left: 45, top: 233 },
  {
    input: await text("Small characters. Human design.", 29),
    left: 48,
    top: 371,
  },
  {
    input: await text("Meet Annie Key. Find your clarity.", 24),
    left: 48,
    top: 417,
  },
  { input: annie, left: 690, top: 107 },
  { input: await text("7", 43, ink, true), left: 1093, top: 430 },
  { input: await text("antikeylist.com", 24, ink, true), left: 48, top: 575 },
  {
    input: await text("Annie Key artwork by Nano · vgen.co/Mainlian", 18),
    left: 789,
    top: 40,
  },
  {
    input: await text("OPEN SOURCE. OPEN TO YOUR IDEAS.", 19, ink, true),
    left: 786,
    top: 579,
  },
];
await sharp(decoration)
  .composite(layers)
  .png()
  .toFile("public/og-annie-key.png");
console.log(
  "Created Annie favicons, home-screen icons, and 1200 × 630 sharing artwork.",
);
