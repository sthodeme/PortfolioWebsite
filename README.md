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

## Scalability controls

| File | Controls |
|------|----------|
| `data/owner.json` | Name, role, socials, milestones, domain |
| `data/projects.json` | Which projects appear on the portfolio grid, their order, and status |
| `data/projects/[slug].json` | Full detail per project (detail page only) |
| `assets/css/main.css` | Design tokens, colors, typography, badge styles |
| `assets/js/loader.js` | Shared rendering logic — badges, filters, summaries |
| `portfolio/index.html` | Portfolio grid, filter buttons, project card icons |

---

## Project status badges

Use a **machine key** in JSON (not the display label). The site renders the human-readable badge automatically.

| JSON value (`status`) | Badge shown | Use when |
|-----------------------|-------------|----------|
| `mvp` | MVP | Early prototype or proof of concept |
| `planning` | In planning | Idea scoped but build not started |
| `development` | Under development | Actively being built |
| `production` | Production | Live and in use |

Accepted aliases (normalized automatically): `under-development` → `development`, `in-planning` → `planning`.

**Set status in both places** when you want the badge to match everywhere:

1. `data/projects.json` — portfolio grid cards and filters
2. `data/projects/[slug].json` — project detail page header

Example:

```json
"status": "planning"
```

Do **not** use display text like `"Under development"` or `"In planning"` in JSON — use the keys above.

---

## How to add a new project status (scalability steps)

When you need a new lifecycle stage (e.g. `planning`, `development`):

1. **`assets/js/loader.js`**
   - Add the key to `normalizeStatus()` if it has a multi-word alias
   - Add a branch in `statusBadge()` with badge class, icon, and display label
   - Add the label to `STATUS_LABELS` and include the key in the `order` array inside `statusSummary()`

2. **`assets/css/main.css`**
   - Add CSS variables under `:root` (e.g. `--col-plan`, `--col-plan-bg`)
   - Add a badge class (e.g. `.badge-plan`)

3. **`portfolio/index.html`**
   - Add a filter button: `<button class="filter-btn" data-filter="planning">In planning</button>`
   - Bump `loader.js` and `main.css` cache versions (`?v=N`) so browsers load the update

4. **`README.md`**
   - Document the new status in the table above

5. **Deploy**
   - Commit, push, then hard-refresh the live site (`Cmd+Shift+R`) to bypass cached JSON/JS

No changes are needed on individual project detail pages — they all use `statusBadge()` from `loader.js`.

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

Use a **lowercase hyphenated slug** (e.g. `rag-spec-extractor`). The slug must match the folder name under `portfolio/` and the JSON filename under `data/projects/`.

**Step 2** — Create `data/projects/my-new-project.json` (copy from an existing file and set the same `slug` and `status`).

**Step 3** — Copy `portfolio/_project-template.html` to `portfolio/my-new-project/index.html`.

The project appears on the portfolio grid automatically. No build step required.

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
