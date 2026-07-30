# Clarity — Mockup App (no login, no Firebase)

This is a stripped-down copy of the main Clarity app, for browsing the UI
locally without setting up Firebase, logging in, or pairing a device.

- No Firebase — this app has zero dependency on Firebase at all
- No login wall — every route is open, `/` goes straight to `/home`
- Every page uses realistic sample data instead of live Firestore reads
- Login/Sign Up pages are included as visual references, but their forms
  don't authenticate anything — submitting either just takes you to `/home`
- Notification toggles and the Account "Save" button work in local state
  only (nothing persists on refresh)

This is **not** meant to replace the real `clarity-app` — use this one when
you just want to look at / demo the UI, and use `clarity-app` (the Firebase
version) for the actual working product.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). You'll land
directly on the Home page — no sign-in required.

## Pages

| Route | Page |
|---|---|
| `/home` | Home dashboard |
| `/data` | Current turbidity detail |
| `/history` | Stats + chart (linked from Data) |
| `/filter` | Filter status + replacement log |
| `/profile` | Profile + settings menu |
| `/settings/notification` | Notification toggles |
| `/settings/account` | Account details |
| `/settings/device` | Paired devices |
| `/login`, `/signup` | Visual references only |
