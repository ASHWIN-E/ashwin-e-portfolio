# Ashwin E — Portfolio

A responsive, dark-futuristic portfolio built with plain HTML, CSS, and JavaScript. It uses no framework, build step, or paid asset dependency.

## Preview

Open `index.html` directly, or run a local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Personal details

Update the `SITE_CONFIG` object at the top of `script.js`:

```js
const SITE_CONFIG = Object.freeze({
  email: "your-email@example.com",
  linkedin: "https://www.linkedin.com/in/your-profile/",
  github: "https://github.com/your-username",
  resumeUrl: "assets/ashwin-e-resume.pdf",
});
```

- Place the PDF at `assets/ashwin-e-resume.pdf`, or change `resumeUrl`.
- The contact form opens the visitor's email application with the message already prepared; it does not send data to a server.
- Social buttons remain safe development placeholders until a real URL is configured.

## Files

- `index.html` — page content and semantic structure
- `styles.css` — theme, layout, responsive design, and animations
- `script.js` — navigation, animations, project dialogs, contact form, and profile links

## Customize

- Main colors: CSS variables at the top of `styles.css`
- Hero headline and copy: `index.html`, inside `#home`
- Project details: `projectDetails` in `script.js`
- Skills and education: the relevant sections in `index.html`

The design includes keyboard navigation, visible focus states, reduced-motion support, semantic landmarks, and mobile layouts.
