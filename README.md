# IT Ops SaaS Static Pro

Professional GitHub Pages-ready IT Operations Portal demo.

## New in this version

- Animated Trufla-style startup page
- Skip/Enter Portal button
- Splash page stays until the user clicks Enter Portal
- Animation appears once per browser session

## What this version is

This is a production-style static demo that works on GitHub Pages.

It includes:

- Professional gradient UI
- Role routes
- Role-based navigation
- Dashboard
- Microsoft 365 users
- Intune devices
- Native asset manager
- Asset create/edit/delete
- HR view
- Finance view
- Security view
- Reports
- Audit logs
- Search
- CSV export
- Reset demo data
- localStorage persistence
- GitHub Actions deployment

## Role URLs

After deployment:

```text
https://ahmedamr91.github.io/IT-OPS/#/it-admin
https://ahmedamr91.github.io/IT-OPS/#/helpdesk
https://ahmedamr91.github.io/IT-OPS/#/security
https://ahmedamr91.github.io/IT-OPS/#/hr
https://ahmedamr91.github.io/IT-OPS/#/finance
https://ahmedamr91.github.io/IT-OPS/#/viewer
```

## Local run

```bash
npm install
npm run dev
```

## Test production build locally

```bash
npm run build
npm run preview
```

## GitHub Pages setup

In GitHub:

```text
Settings -> Pages -> Source -> GitHub Actions
```

Then push to `main`.

## Important

Do not deploy from branch root.  
This app must be deployed by GitHub Actions from the generated `dist` folder.
