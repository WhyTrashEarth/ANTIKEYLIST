# Anti Key List

A small character-set project with a big love of legibility. Anti Key List proposes an alphabet for short codes people need to read and retype. This repository contains the original alphabet and examples, plus an Astro website starring Annie Key.

## The original alphabet

```text
3479ACDEFGHJKMNPQRTUVWXYacdefghjkmnpqrtuvwy@#$%^&*_+=
```

The set has 53 unique characters: 4 numbers, 20 uppercase letters, 19 lowercase letters, and 10 symbols. Its exact order and case are preserved from the original project. It excludes familiar look-alikes such as O, 0, I, l and 1, but still includes pairs like C/c and 9/g. Font, size, keyboard, language and context matter. This is a proposal, not a universal accessibility standard or a claim of tested outcomes.

Use restricted alphabets for generated identifiers where appropriate, not to restrict people's names or messages. Alphabet membership alone does not establish security. Production authentication systems also need suitable lengths, random generation, expiration, storage and rate limits.

## Website

Requires Node 22.23.4 or later (developed with Node 24.18.0). Astro is pinned to 7.4.2, the current npm release when this preview was built on October 24, 2026.

```sh
npm ci
npm run dev -- --port 4173 --ignore-lock
```

Open http://127.0.0.1:4173. For the production build:

```sh
npm run check
npm test
python -m unittest discover -s tests -p 'test_*.py'
npm run build
npm run preview -- --port 4173 --ignore-lock
```

The `--ignore-lock` option keeps Astro in the foreground for retained development sessions. Stop it with Ctrl-C. Static output is written to `dist/`. The live site is [antikeylist.com](https://antikeylist.com). Cloudflare Pages builds and deploys `main` automatically after the configured checks pass. The `www` and `.org` addresses redirect to the canonical HTTPS URL, preserving paths and query strings. See [deployment notes](docs/DEPLOYMENT.md) for hosting, verification and rollback details.

The website includes:

- Font and size comparisons with explicit set-membership labels.
- A code generator using Web Crypto and rejection sampling to avoid modulo bias.
- A non-destructive sample checker with Unicode code-point positions.
- A complete, copyable alphabet and Python example.
- Locally hosted fonts, accessible tabs and labels, reduced-motion support, and responsive layouts.
- Annie-based favicon and home-screen icons, 1200 × 630 Open Graph artwork, sitemap and metadata.
- No analytics, third-party fonts, browser storage or network transmission from the playground.

The default generator output is labeled as an example until the visitor generates a code. Copy actions require browser clipboard support; a visible manual-copy fallback is provided. The mobile layout has been reviewed in browser emulation; physical-device and assistive-technology testing remain separate.

## Source examples

- `ANTIKEYLIST_key_generation.py`: uses `secrets.choice` for random generation.
- `ANTIKEYLIST_input_validation.py`: validates a nonempty string without normalizing it.
- `ANTIKEYLISTInputValidation.java`: checks a nonempty string; rejects null.
- `ANTIKEYLIST_input_validation.html`: checks the entire input, including paste, without deleting characters.
- `src/lib/alphabet.mjs`: browser-independent website helpers and canonical website alphabet.

Automated tests check that every example preserves the original alphabet. Validation checks membership only; it does not measure usability or entropy.

## Artwork, type and credit

- **Annie Key artwork: [Nano (@Mainlian)](https://vgen.co/Mainlian).** The original owner-supplied PNG is preserved byte for byte in `public/art/annie-key-original.png`. Favicon and sharing compositions reuse it without redrawing the character. Artwork credit appears beside Annie, in the credits section, in the footer and on the Open Graph image.
- **Original inspiration: [Aviituber (Avii)](https://www.twitch.tv/aviituber).** The original project's dedication remains in `CONTRIBUTIONS.md` and on the site.
- **Typeface: Atkinson Hyperlegible by Braille Institute.** Font files are self-hosted with their SIL Open Font License in `public/fonts/`.
- Colors and character-comparison ideas draw from the owner's supplied concept drawings. Those originals remain in the owner's supplied archive; they are not republished as a new asset collection.

Run `npm run assets` to reproduce icons and sharing images. The build script uses the supplied original, project fonts and SVG layout; it does not generate replacement artwork.

The project's code and alphabet are dedicated to the public domain under CC0. Third-party artwork and fonts are separate: no CC0 or additional reuse permission is asserted for Nano's illustration. See `public/art/ARTWORK-CREDIT.txt` and the bundled font license.

## Contributing and contact

[Follow the project](https://github.com/WhyTrashEarth/ANTIKEYLIST), [open an issue](https://github.com/WhyTrashEarth/ANTIKEYLIST/issues), or submit a pull request. For legibility reports, include the typeface, size, display context and made-up sample. Do not post real access codes or personal information.

See [CONTRIBUTIONS.md](CONTRIBUTIONS.md) for the original acknowledgments and contribution guide.
