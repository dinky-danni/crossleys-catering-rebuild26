# Cloudflare Pages Setup

This site is prepared for Cloudflare Pages as a static HTML/CSS/JavaScript build.

## Project

- Cloudflare Pages project name: `crossleys-catering-rebuild26`
- Repository: `dinky-danni/crossleys-catering-rebuild26`
- Live domain: `https://crossleyscatering.co.uk/`
- Build command: none
- Build output directory: `.`
- Functions directory: `functions/`

## Public Variables

Set these in Cloudflare Pages as environment variables. Placeholder values are already present in `wrangler.toml` for local/reference use.

- `BREVO_SENDER_EMAIL`: replace with a Brevo-verified sender email.
- `BREVO_SENDER_NAME`: `Crossleys Catering`
- `ENQUIRY_NOTIFICATION_EMAIL`: `crossleyscatering@gmail.com`
- `ENQUIRY_SUCCESS_PATH`: `/thank-you/`
- `TURNSTILE_SITE_KEY`: replace with the real Cloudflare Turnstile site key.

## Secret Variables

Set these as Cloudflare Pages secrets, not committed files.

- `BREVO_API_KEY`
- `TURNSTILE_SECRET_KEY`

## Local Testing Notes

For the current static preview:

```bash
python3 preview-server.py
```

Then open `http://127.0.0.1:8010/`.

For Cloudflare Pages Functions testing, install/use Wrangler and copy `.dev.vars.example` to `.dev.vars`, then replace placeholder values locally. Do not commit `.dev.vars`.

```bash
wrangler pages dev . --compatibility-date 2026-05-27
```

## Included Cloudflare Files

- `wrangler.toml`
- `.dev.vars.example`
- `functions/`
- `thank-you/`
- `_headers`
- `_redirects`
- `sitemap.xml`
- `robots.txt`
- `404.html`

## Included Go-Live Prep

- Forms post to `/api/enquiry` through Cloudflare Pages Functions.
- Turnstile is loaded only when `TURNSTILE_SITE_KEY` is available.
- Brevo delivery is handled server-side with `BREVO_API_KEY`.
- Cookie consent is global and gates the Google Maps embed until optional cookies are accepted.
- `sitemap.xml` and `robots.txt` use `https://crossleyscatering.co.uk/`.
- `_redirects` keeps the apex domain canonical and redirects legacy `/index.php` to home.
- `_headers` adds conservative security headers and cache rules.
- `404.html` is a branded noindex page for Cloudflare Pages.

## Final Deployment Notes

Before launch, the deployment developer should:

- Add real Brevo and Turnstile secrets in Cloudflare.
- Replace the placeholder sender email with a Brevo-verified sender.
- Configure Turnstile allowed domains.
- Deploy a Cloudflare Pages preview.
- Test form submissions end to end.
- Test cookie consent, Google Maps gating, redirects, 404 handling, `sitemap.xml`, and `robots.txt` on the Cloudflare preview/live domain.
- Consider adding a strict Content Security Policy only after Turnstile, Google Maps, and form submissions are confirmed on Cloudflare preview.
