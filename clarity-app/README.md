# Clarity — Water Filter Monitor

A responsive React + Tailwind app, now wired to real Firebase: email/password +
Google sign-in, a Firestore user profile, and live sensor readings from a
paired device.

## 1. Create a Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com) → **Add project**.
2. In your project, go to **Build → Authentication → Get started**, and enable:
   - **Email/Password**
   - **Google** (optional, for "Continue with Google")
3. Go to **Build → Firestore Database → Create database**. Start in **production mode**
   (the rules file in this repo locks things down properly).
4. Go to **Project settings → General → Your apps → Add app → Web**, register the
   app, and copy the config values it gives you.
5. In **Firestore → Rules**, paste in the contents of `firestore.rules` from this
   project and publish.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env` with the values from step 4:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 3. Run it

```bash
npm install
npm run dev
```

Sign up for an account in the app — this creates a `users/{uid}` document in
Firestore automatically. At this point Home/Data/Filter will show "No device
paired yet" because no device is linked to your account.

## 4. Pair a device (so Home/Data/History/Filter show real data)

Devices live in a top-level `devices` collection, linked to a user via
`ownerUid`. Add one manually in the Firestore console to test the app before
your hardware is sending data:

**`devices/{any-id}`**
```json
{
  "ownerUid": "<your user's uid, from Authentication tab>",
  "name": "Clarity-001",
  "status": "connected",
  "ntuBefore": 2.4,
  "ntuAfter": 0.3,
  "filterPercentRemaining": 68
}
```

Reload the app — Home, Data, and Filter will now show these numbers live.

### Feeding it real sensor readings

For the trend chart / History / recent log, push documents into that device's
`readings` subcollection:

**`devices/{deviceId}/readings/{any-id}`**
```json
{
  "ntuBefore": 2.4,
  "ntuAfter": 0.3,
  "timestamp": <Firestore server timestamp>
}
```

And for the Filter page's log, push into `filterLog`:

**`devices/{deviceId}/filterLog/{any-id}`**
```json
{
  "timestamp": <Firestore server timestamp>
}
```

Your actual hardware (ESP32/Raspberry Pi/etc.) should write to these same
paths using the Firebase Admin SDK or REST API whenever it takes a reading —
every page listens with `onSnapshot`, so the UI updates instantly with no
polling or refresh needed.

There's also a convenience helper for this in `src/lib/firestore.js`:

```js
import { pushReading } from './lib/firestore.js'
await pushReading(deviceId, { ntuBefore: 2.4, ntuAfter: 0.3, filterPercentRemaining: 68 })
```

Handy for testing from a script, or wiring to a temporary "simulate reading"
button while your hardware isn't ready yet.

## What's included

- `src/lib/firebase.js` — Firebase app/auth/Firestore initialization
- `src/lib/firestore.js` — all Firestore reads/writes, with the schema
  documented at the top of the file
- `src/context/AuthContext.jsx` — sign up, sign in (email + Google), sign out,
  and the current user, available anywhere via `useAuth()`
- `src/App.jsx` — routes are gated by `ProtectedRoute` (redirects to `/login`
  if signed out) and `PublicOnlyRoute` (redirects a signed-in user away from
  Login/Sign Up)
- `src/pages/` — every page now reads live data instead of hardcoded values:
  - **Home** — live NTU + trend chart from the primary device
  - **Data** — live current turbidity + filter efficiency
  - **History** — live stats + bar chart + recent log from `readings`
  - **Filter** — live "need replacement" % + `filterLog`
  - **Profile** — real signed-in user, real sign out
  - **Notification** — toggle states persist to Firestore per user
  - **Account** — edit username, view email, send password reset email
  - **Device** — lists devices actually linked to your account

## Build for production

```bash
npm run build
```

Outputs static files to `dist/`, deployable to Vercel, Netlify, GitHub Pages, etc.
Remember to set the same `VITE_FIREBASE_*` environment variables in your
hosting provider's dashboard — `.env` files aren't uploaded.
