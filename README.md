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
- `assets/css/styles.css`
- `assets/js/main.js`
- `assets/images/`
- `assets/fonts/`

## Notes

- Header, footer and the repeated contact form are injected globally via `assets/js/main.js`.
- The contact form is visual only and requires integration with a form handler before launch.
- Policy pages are holding pages and need approved legal copy before launch.
- The Google Map on the contact page is retained as an embedded iframe.
- Only used assets were carried forward and large photography has been resized/exported as WebP.

## Local preview

```bash
python3 preview-server.py
```

Then open `http://127.0.0.1:8010/`.
