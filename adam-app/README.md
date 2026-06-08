# adam-app

React + TypeScript + Vite source for the page served at
**iuliuvisovan.github.io/adam**.

## Layout

- Source lives here in `adam-app/`.
- `npm run build` emits the production build into `../adam/`, which GitHub
  Pages serves verbatim. The build wipes and regenerates `../adam/`, so do not
  hand-edit files in `adam/` — change things here and rebuild.
- Static assets: `bg.png` lives in `src/assets/` (imported via CSS), `favicon.jpeg`
  lives in `public/`.

## Commands

```bash
npm run dev        # local dev at http://localhost:5173/adam/
npm run build      # build into ../adam/ for deploy
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
```

## Deploy

The site deploys by committing the built `adam/` folder (same commit-to-deploy
flow as the rest of the repo):

```bash
npm run build
# then from the repo root: commit the changes under adam/
```
