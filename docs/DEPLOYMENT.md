# Anti Key List deployment

Launched October 24, 2026, after owner approval of the preview.

## Hosting

- Repository: https://github.com/WhyTrashEarth/ANTIKEYLIST
- Cloudflare Pages project: `antikeylist`
- Production branch: `main`; Git integration automatically deploys new commits.
- Build command: `npm run check && npm test && npm run build`
- Output directory: `dist`; repository root is the build root.
- Node: `24.18.0`, pinned in `.node-version`; Astro: `7.4.2`.
- Canonical URL: https://antikeylist.com
- Pages hostname: https://antikeylist.pages.dev
- Both `antikeylist.com` and `www.antikeylist.com` are active custom domains with SSL enabled.
- GitHub repository homepage points to https://antikeylist.com.

## DNS and redirects

Pages replaced the two proxied apex A records (`44.227.65.245`, `44.227.76.166`) with a proxied CNAME to `antikeylist.pages.dev`. The `www` CNAME changed from `pixie.porkbun.com` to the Pages hostname. Existing wildcard and other DNS records were preserved.

The `.com` Single Redirect rule, **Anti Key List canonical HTTPS**, matches:

```text
((http.host eq "www.antikeylist.com") or (http.host eq "antikeylist.com" and not ssl)) and not starts_with(http.request.uri.path, "/.well-known/acme-challenge/")
```

The `.org` Single Redirect rule, **Anti Key List .org to .com**, matches:

```text
(http.host in {"antikeylist.org" "www.antikeylist.org"})
```

Both return 301 with dynamic target `concat("https://antikeylist.com", http.request.uri.path)` and preserve the query string. The `.org` domain already had proxied records, so its DNS did not need changing. Certificate validation paths on `.com` are excluded from forwarding.

## Release verification

The first production release was merge commit `245dd1d318b9419197ffbd878e517f9ee369d712` (PR #1). Cloudflare successfully ran the configured build. Subsequent documentation commits use the same automatic pipeline.

Before a release, run:

```sh
npm run check
npm test
python -m unittest discover -s tests -p 'test_*.py'
npm run build
python scripts/check-built.py
```

After deployment, verify the custom domain, not only the Pages hostname: homepage and About content, canonical URLs, 1200 x 630 Open Graph image, favicons, robots/sitemap, real 404 status, hashed JS/CSS assets, and path/query-preserving redirects. Confirm the generator and checker in a browser. Test mobile layout when layout changes.

Cloudflare Pages Web Analytics is disabled. At launch, the live HTML contained no injected analytics scripts. Keep domain-level automatic analytics injection disabled too if that feature is later configured. Fonts and artwork are hosted locally. Never add analytics injection while the site's privacy statement says there is no analytics.

## Rollback

Use Cloudflare Pages' deployment history to roll back to a previously successful production deployment. Revert the corresponding Git commit so later pushes retain the rollback. Keep domain records pointing to Pages for application rollbacks.

For a full hosting reversal, the pre-launch parking values are recorded above; restoring parking intentionally removes the new website and requires owner direction. Disable only the two named redirect rules if forwarding itself must be rolled back. Do not remove unrelated DNS records.
