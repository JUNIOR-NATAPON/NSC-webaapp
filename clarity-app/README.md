# Clarity — Water Filter Monitor (Starter)

A responsive React + Tailwind starter matching your Clarity mockups: bottom nav on
phones, sidebar nav on tablet/desktop, same cards/badges/stats everywhere.

## Run it in VS Code

1. Open this folder in VS Code.
2. Open a terminal (Ctrl+`) and install dependencies:
   ```
   npm install
   ```
3. Start the dev server:
   ```
   npm run dev
   ```
4. Open the printed local URL (usually http://localhost:5173). Resize the
   browser window or open dev tools device toolbar to see it adapt from phone
   to desktop.

## What's included

- `src/App.jsx` — routes + the responsive shell (sidebar vs bottom nav)
- `src/components/` — NavBar, TopBar, Card, Badge, StatBox (reused everywhere)
- `src/pages/` — Login, SignUp, Home, DataPage (Stats/Filter), Profile

## Extending it

- Add more pages the same way (Notification, Account, Device screens from your
  mockups) — copy `Profile.jsx`'s list pattern.
- Swap the placeholder data in `Home.jsx` / `DataPage.jsx` for real sensor data
  from your backend/API once you have one.
- Colors, fonts, and radii live in `tailwind.config.js` under `theme.extend` —
  change them once, they update everywhere.

## Build for production

```
npm run build
```
Outputs static files to `dist/`, deployable to Vercel, Netlify, GitHub Pages, etc.
