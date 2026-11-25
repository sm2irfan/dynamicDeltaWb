# Dynamic Delta Group — website

React + TypeScript + Vite site for Dynamic Delta Group.

- **Repository:** https://github.com/sm2irfan/dynamicDeltaWb
- **Live site:** https://sm2irfan.github.io/dynamicDeltaWb/

## Running locally

```
npm install      # first time only
npm run dev
```

Open http://localhost:5173/dynamicDeltaWb/. Edits reload in the browser on save; stop with Ctrl+C.

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

### URL paths

The site lives under `/dynamicDeltaWb/`, set once as `base` in [vite.config.ts](vite.config.ts).
Everything else follows from it:

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
