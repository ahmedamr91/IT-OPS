# Trufla IT Ops Portal

GitHub Pages-ready static SaaS demo.

## Included

- Trufla logo landing page
- Role selection before entering portal
- IT Admin, Helpdesk, Security, HR, Finance, Viewer routes
- Professional dark futuristic splash page
- Dashboard
- Users
- Devices
- Asset manager with create/edit/delete
- HR view
- Finance view
- Security view
- Reports
- Audit logs
- CSV export
- localStorage persistence
- GitHub Actions deployment

## Local run

```powershell
npm install
npm run dev
```

## Test production build

```powershell
npm run build
npm run preview
```

## GitHub Pages

Set:

```text
Settings -> Pages -> Source -> GitHub Actions
```

Then push to main.

Open:

```text
https://ahmedamr91.github.io/IT-OPS/
```

## Important

Do not deploy from branch root.  
GitHub Pages should use GitHub Actions and deploy the `dist` artifact.
