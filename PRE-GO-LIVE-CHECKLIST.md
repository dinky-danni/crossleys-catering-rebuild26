# Pre-Go-Live Checklist

## Completed Prep

- Baseline created from the static rebuild and `.gitignore` added for local/secrets files.
- Cloudflare Pages configuration added in `wrangler.toml`.
- Placeholder local secrets file added as `.dev.vars.example`.
- Enquiry forms wired to Cloudflare Pages Functions at `/api/enquiry`.
- Brevo email delivery function added with environment-variable placeholders.
- Cloudflare Turnstile config endpoint and frontend widget loading added.
- Thank-you page added and marked `noindex`.
- Cookie consent added with accept/reject controls and a persistent Cookie Settings button.
- Google Maps embed is blocked until optional cookies are accepted.
- Holding Privacy Policy, Cookie Policy and Terms & Conditions pages are in place.
- `sitemap.xml` and `robots.txt` added for `https://crossleyscatering.co.uk/`.
- Branded `404.html` added and marked `noindex`.
- `_redirects` added for `www` to apex canonical redirect and legacy `/index.php`.
- `_headers` added for security defaults, asset caching, and noindex/no-store rules.

## Local Checks Completed

- Sitemap validates as XML.
- Redirect destinations validate.
- `_headers` format validates.
- Local link and asset crawl reports `missing local refs: 0`.
- JavaScript syntax checks pass for `assets/js/main.js`.
- Pages Function syntax checks pass for `functions/api/enquiry.js` and `functions/api/turnstile-config.js`.
- Wrangler reported `Compiled Worker successfully`; local log writing was blocked by the sandbox path outside the workspace.

## Deployment-Only Tasks

- Add real `BREVO_API_KEY` as a Cloudflare Pages secret.
- Add real `TURNSTILE_SECRET_KEY` as a Cloudflare Pages secret.
- Add real `TURNSTILE_SITE_KEY` as a Cloudflare Pages environment variable.
- Replace `BREVO_SENDER_EMAIL` with a Brevo-verified sender email.
- Configure Turnstile allowed domains for `crossleyscatering.co.uk` and any preview domains.
- Deploy to Cloudflare Pages preview and test forms end to end.
- Confirm Brevo email delivery lands in `crossleyscatering@gmail.com`.
- Test cookie consent and Google Maps loading on Cloudflare preview.
- Test redirects and the custom 404 page on Cloudflare preview.
- Replace holding policy copy with approved legal wording.
- Consider adding a strict Content Security Policy after all third-party services are confirmed.
