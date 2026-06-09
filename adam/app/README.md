# adam

React + TypeScript + Vite source for the page served at
**iuliuvisovan.github.io/adam**.

## Layout

Everything lives under `adam/`:

- Source lives here in `adam/app/`.
- The Cloudflare Worker lives in `adam/worker/`.
- `npm run build` emits the production build into `adam/` itself (index.html,
  assets/, favicon.jpeg), which GitHub Pages serves verbatim. The build first
  removes `../assets/` and then regenerates the output, so do not hand-edit
  the built files in `adam/` — change things here and rebuild.
- Static assets: `bg.png` lives in `src/assets/` (imported via CSS), `favicon.jpeg`
  lives in `public/`.

## Commands

```bash
npm run dev        # local dev at http://localhost:5173/adam/
npm run build      # build into ../ (the adam/ folder) for deploy
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
```

## Deploy

The site deploys by committing the built output under `adam/` (same
commit-to-deploy flow as the rest of the repo):

```bash
npm run build
# then from the repo root: commit the changes under adam/
```
