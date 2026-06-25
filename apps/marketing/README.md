# Meeting Desk AI — Marketing Site

Public landing page for **https://meetingdesk.in**

## Development

```bash
pnpm install
pnpm --filter marketing dev
```

Runs at http://localhost:8081

## Production build

```bash
pnpm --filter marketing build
```

Output: `apps/marketing/dist/` — deploy to meetingdesk.in (Vercel, Netlify, S3+CloudFront, etc.)

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_APP_URL` | Product app URL for Login / Trial CTAs (e.g. `https://app.meetingdesk.in`) |

## SEO

- Meta tags & Open Graph in `index.html`
- JSON-LD structured data (Organization, WebSite, SoftwareApplication)
- `public/robots.txt` and `public/sitemap.xml`
- Semantic HTML (`header`, `main`, `section`, `article`, `footer`)

Add a 1200×630 `public/og-image.png` for rich social previews.
