# Crossleys Catering static rebuild

This is a frontend-only rebuild of the WordPress/Elementor brochure site using HTML, CSS and JavaScript.

## Structure

- `index.html`
- `menu/index.html`
- `catering-services/index.html`
- `sandwich-shop/index.html`
- `contact/index.html`
- `privacy-policy/index.html`
- `cookie-policy/index.html`
- `terms-and-conditions/index.html`
- `thank-you/index.html`
- `404.html`
- `_headers`
- `_redirects`
- `sitemap.xml`
- `robots.txt`
- `assets/css/styles.css`
- `assets/js/main.js`
- `functions/api/`
- `assets/images/`
- `assets/fonts/`

## Notes

- Header, footer and the repeated contact form are injected globally via `assets/js/main.js`.
- The contact forms post to Cloudflare Pages Functions and require Brevo/Turnstile environment values before launch.
- Policy pages are holding pages and need approved legal copy before launch.
- Cookie consent gates the Google Map on the contact page until optional cookies are accepted.
- Cloudflare Pages headers, redirects, sitemap, robots and a branded 404 page are included for go-live.
- Only used assets were carried forward and large photography has been resized/exported as WebP.

## Local preview

```bash
python3 preview-server.py
```

Then open `http://127.0.0.1:8010/`.
