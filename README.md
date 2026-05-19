# Birthday landing + Decap admin

A small React site: intro + confetti, five friend faces, modal with a note, and a clickable vinyl that plays an uploaded song. **All copy, colors, fonts, timing, photos, and audio are edited in Decap CMS** at `/admin` after you connect Netlify.

## What you do on your computer (first time only)

1. **Install Node.js** (LTS) from [https://nodejs.org](https://nodejs.org) if you do not already have it.
2. Open a terminal **inside this folder** (`birthday-site`) and run:

```bash
npm install
npm run dev
```

3. Open the URL Vite prints (usually `http://localhost:5173`). You should see the intro, then the friend grid (placeholders until you add photos in Admin).

To confirm production output locally:

```bash
npm run build
npm run preview
```

---

## Part A — Put this folder on GitHub

1. On [https://github.com/new](https://github.com/new), create a **new empty repository** (any name, e.g. `birthday-site`). Do **not** add a README or `.gitignore` on GitHub (keeps pushing simpler).
2. In a terminal, still inside `birthday-site`:

```bash
git init
git add .
git commit -m "Initial birthday site with Decap admin"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

Use your real GitHub username and repo name in the remote URL. If GitHub asks you to log in, use a **Personal Access Token** as the password (or GitHub Desktop).

---

## Part B — Connect Netlify

1. In [Netlify](https://app.netlify.com), **Add new site** → **Import an existing project** → **GitHub** → pick this repo.
2. Build settings Netlify usually auto-detects from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Click **Deploy site**. Wait until you get a live URL like `https://something.netlify.app`.

---

## Part C — Turn on the Admin (Decap + Git Gateway)

Decap saves your edits by **committing to GitHub**. Netlify’s **Git Gateway** + **Identity** handles login securely.

1. In Netlify: **Site configuration** → **Identity** → **Enable Identity**.
2. Still under Identity: **Services** → enable **Git Gateway** (Netlify may show this as enabling Git Gateway for the site).
3. **Invite users** (recommended): Identity → **Invite users** → add your email. Accept the invite from your inbox so you can log in.
4. **Registration**: Under Identity → **Registration preferences**, set to **Invite only** so random visitors cannot sign up as editors.

After deploy, open:

`https://YOUR-SITE.netlify.app/admin`

Log in with the invited Identity user. You should see:

- **Site · look & feel** — global design knobs (background, colors, fonts, intro timing, confetti, modal style, vinyl speed, etc.).
- **Friends** — one entry per person (photo, note, song file, titles, optional disc image, order).

Every **Publish** in Decap creates a commit; Netlify rebuilds; the public site updates in about a minute.

### If `/admin` is blank or errors

- Confirm the site finished deploying and you are on `https://…netlify.app/admin` (not localhost for the real CMS login).
- Hard refresh. If Decap shows a backend error, double-check **Identity** + **Git Gateway** are enabled and your GitHub repo allows the Netlify integration.

---

## Where files go

| What | Where |
|------|--------|
| Editable site settings | `content/settings.json` (do not hand-edit once you use Admin, unless you prefer) |
| Each friend | `content/friends/*.json` |
| Uploaded images & audio from Admin | `public/uploads/` |

The birthday page reads those JSON files at **build time**. Changing them in Admin triggers a new Netlify build.

---

## Optional: edit locally with Decap (advanced)

If you want the CMS against your laptop without pushing every time, Decap supports a local backend; see [Decap local backend](https://decapcms.org/docs/working-with-a-local-git-repository/). This is optional—most people only use `/admin` on Netlify.

---

## Tech stack

- [Vite](https://vitejs.dev/) + React + TypeScript
- [Decap CMS](https://decapcms.org/)
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

Enjoy tuning the design in Admin—you stay “picky choosy” on visuals, the structure stays stable in code.
