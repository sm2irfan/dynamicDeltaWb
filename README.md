# Dynamic Delta Group — website

React + TypeScript + Vite site for Dynamic Delta Group.

- **Repository:** https://github.com/sm2irfan/dynamicDeltaWb
- **Live site:** https://sm2irfan.github.io/dynamicDeltaWb/

## Running locally

```
npm install      # first time only
npm run dev
```

Open http://localhost:5173/. Edits reload in the browser on save; stop with Ctrl+C.

If the browser console shows `504 (Outdated Optimize Dep)`, restart with `npm run dev -- --force`
and hard-refresh the page (Ctrl+Shift+R).

## Building

```
npm run build    # outputs to dist/
npm run preview  # serves dist/ locally to check the production build
```

## Deploying to GitHub Pages

```
npm run deploy
```

This builds the site (`predeploy`) and publishes `dist/` to the `gh-pages` branch of this repo.
GitHub Pages serves that branch at https://sm2irfan.github.io/dynamicDeltaWb/ — make sure
**Settings → Pages** is set to *Deploy from a branch*, `gh-pages`, `/ (root)`.

## Deploying to cPanel

```
npm run build:cpanel
```

This builds the site for the domain root (`/`) and packs `dist/` into `site-cpanel.zip`
in the project folder. Then in cPanel:

1. **File Manager** → open `public_html` (or the domain's document root). Back up and remove the
   old site files there first.
2. **Upload** `site-cpanel.zip`, then right-click it → **Extract** into `public_html`, and delete
   the zip.
3. Check **Settings → Show Hidden Files (dotfiles)** and confirm `.htaccess` is present — it makes
   page links like `/about` work on reload.

### In the `new` subfolder (alongside an existing site)

```
npm run build:cpanel-new
```

Builds for `https://yourdomain.com/new/` and creates `site-cpanel-new.zip`. In File Manager create
`public_html/new`, upload the zip **into that folder** and extract it there. Nothing in
`public_html` itself is touched, so the existing site keeps working. To update later, delete the
contents of `public_html/new` only and extract the new zip.

### URL paths

The built site lives under `/dynamicDeltaWb/`, set as `base` in [vite.config.ts](vite.config.ts)
(the dev server uses `/` instead, so it runs at http://localhost:5173/). Everything else follows from it:

- Vite prefixes built asset URLs (scripts, styles, images, favicon) with the base.
- The router reads it via `import.meta.env.BASE_URL` in [src/App.tsx](src/App.tsx).
- Import images from `src/assets` (e.g. `import img from '../assets/images/gas.jpg'`) rather than
  writing paths like `/images/gas.jpg`, so they get the base automatically.

If the repository is ever renamed, update `base` in `vite.config.ts` and `homepage` in
`package.json` to match the new name, then redeploy.

### Deep links

GitHub Pages has no SPA fallback, so a reload on e.g. `/dynamicDeltaWb/about` would 404.
[public/404.html](public/404.html) (copied into `dist/` on every build) handles this: it fetches the
app's real `index.html` and swaps it in place without changing the URL, so the router opens the
requested page. It reads the project name from the URL, so it keeps working after a rename.
