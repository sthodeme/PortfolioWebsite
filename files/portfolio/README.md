# Portfolio Site — Sree Ram Gopal Reddy

A JSON-driven static portfolio site. All content is controlled via JSON files.
No build step. No framework. Deploy anywhere.

## Structure

```
portfolio/
├── index.html                        ← Landing page
├── portfolio/
│   ├── index.html                    ← Portfolio grid
│   ├── kmu-assistant/index.html      ← Project detail page
│   ├── cv-recognition/index.html     ← Project detail page
│   └── _project-template.html       ← Copy this for new projects
├── data/
│   ├── owner.json                    ← YOUR personal info (edit this)
│   ├── projects.json                 ← Master project list
│   └── projects/
│       ├── kmu-assistant.json
│       └── cv-recognition.json
├── assets/
│   ├── css/main.css
│   ├── js/loader.js
│   └── images/projects/
│       ├── kmu-assistant/            ← Drop screenshots here
│       └── cv-recognition/
└── README.md
```

---

## How to add a new project

**Step 1** — Add entry to `data/projects.json`:
```json
{
  "slug": "my-new-project",
  "title": "My New Project",
  "status": "mvp",
  "tagline": "One-line summary.",
  "tags": ["Python", "AI"],
  "featured": true,
  "order": 3
}
```

**Step 2** — Create `data/projects/my-new-project.json` (copy from an existing file).

**Step 3** — Copy `portfolio/_project-template.html` to `portfolio/my-new-project/index.html`.

That's it. The project appears on the portfolio grid automatically.

---

## How to update personal info

Edit `data/owner.json`. Changes propagate everywhere — nav, footer, hero, LinkedIn/GitHub links, restricted contact buttons.

## How to change your domain

Edit the `"domain"` field in `data/owner.json`. It appears in the footer.

## Adding screenshots

1. Drop image files into `assets/images/projects/[slug]/`
2. Update the `screenshots` array in `data/projects/[slug].json`
3. In the project template HTML, uncomment the `<img>` tag and remove the placeholder div

---

## Deployment

### Netlify (recommended — free)
1. Drag the `portfolio/` folder into Netlify Drop → instant live URL
2. Add custom domain in Netlify settings

### GitHub Pages
1. Push to GitHub repo
2. Enable Pages from Settings → Pages → main branch / root

### Any static host
Upload the folder as-is. No server needed.

---

## Scalability controls

| File | Controls |
|------|----------|
| `data/owner.json` | Name, role, socials, milestones, domain |
| `data/projects.json` | Which projects appear, their order, status |
| `data/projects/[slug].json` | Full detail per project |
| `assets/css/main.css` | Design tokens, colors, typography |
| `assets/js/loader.js` | Shared rendering logic |
