# VectorCart Frontend

A ready-to-run React + Tailwind CSS frontend implementing the Company
branding slice (dynamic logo/name/colors, Navbar, Footer, and an admin
Company Settings page) for the VectorCart project.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Before it can load real data

This frontend expects your ASP.NET Core API to be running and reachable.

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to match your
   API's actual URL/port.
2. Make sure CORS is enabled on the backend for `http://localhost:5173`
   (see `SETUP_NOTES.md` — this is the most common thing people forget,
   and without it the browser silently blocks every request).
3. Make sure your backend has one seeded row in `tblPlnCompany` (see the
   SQL in `SETUP_NOTES.md`), otherwise the Company Settings page will
   show a "Could not load company settings" state.

**The app itself will still run with `npm run dev` even without the
backend connected** — you'll just see loading/error states instead of
real data, since there's nothing to fetch yet. That's expected, not a bug.

## What's included

- Tailwind CSS fully configured with the VectorCart design system
  (see `DESIGN_SYSTEM.md`)
- `framer-motion` for entrance/hover animations, `lucide-react` for icons
- `CompanyContext` — fetches company branding once, available app-wide
- `Navbar` / `Footer` — dynamically branded from the API, with a graceful
  initials-avatar fallback if no logo is uploaded yet or the logo URL
  fails to load (this was the bug behind the logo not appearing before)
- `CompanySettings` page — sectioned, animated edit form with a
  drag-and-drop logo uploader + full logo upload flow

## Full setup details

See `SETUP_NOTES.md` for CORS setup, environment variables, and how this
plugs into your backend.
