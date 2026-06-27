# Trufla IT Ops Portal - GitHub Pages Fixed Version

This is the corrected GitHub Pages static version.

## Fixes included

- Correct Vite GitHub Pages base path: `/IT-OPS/`
- GitHub Actions deploys `dist`, not raw source files
- No backend dependency
- No FastAPI calls
- No `127.0.0.1` API calls
- Static role routes:
  - `/#/it-admin`
  - `/#/helpdesk`
  - `/#/security`
  - `/#/hr`
  - `/#/finance`
  - `/#/viewer`

## Run locally

```bash
npm install
npm run dev
```

## Build locally

```bash
npm run build
npm run preview
```

## Deploy

Push to GitHub.  
Then check:

Repository → Settings → Pages → Source: GitHub Actions
