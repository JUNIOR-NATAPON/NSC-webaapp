# Clarity — Live App (Firebase-wired)

This started as the no-login mockup design but is now fully wired to
Firebase: email/password + Google sign-in, live device/sensor data, and
persisted settings. All the new visual design (dark mode, animated body-fill
microplastic gauge, radial filter gauge, toast notifications, delta/trend
indicators) is preserved — only the data source changed, from
`src/data/sampleData.js` to live Firestore reads.

## 1. Create a Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com) → **Add project**.
2. **Build → Authentication → Get started** → enable **Email/Password** and,
   optionally, **Google**.
3. **Build → Firestore Database → Create database** (production mode).
4. **Project settings → General → Your apps → Add app → Web** → copy the config.
5. **Firestore → Rules** → paste in `firestore.rules` from this repo and publish.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env` with your project's config (see `.env.example` for the full
list of `VITE_FIREBASE_*` keys). Leave the `VITE_FIREBASE_DEVICE_*` keys
blank unless you're using a separate Firebase project for device data — see
that section further down.

## 3. Run it

```bash
npm install
npm run dev
```

Sign up in the app — this creates your `users/{uid}` Firestore doc
automatically. Home/Data/Filter will show "No device paired" until a device
is linked to your account (next step).

## 4. Pair a device

Add a doc to Firestore manually to test before your hardware is ready:

**`devices/{any-id}`**
```json
{
  "ownerUid": "<your uid, from the Authentication tab>",
  "name": "Clarity-001",
  "status": "connected",
  "ntuBefore": 2.4,
  "ntuAfter": 0.3,
  "filterPercentRemaining": 68
}
```

Then push readings into `devices/{deviceId}/readings/{any-id}`:
```json
{ "ntuBefore": 2.4, "ntuAfter": 0.3, "timestamp": <server timestamp> }
```

And filter-change events into `devices/{deviceId}/filterLog/{any-id}`:
```json
{ "timestamp": <server timestamp> }
```

Your real hardware should write to these same paths on every reading /
filter change. Every page listens live via `onSnapshot` — no polling, no
refresh needed. There's also a `pushReading()` helper in `src/lib/firestore.js`
for testing from a script.

## Using a separate Firebase project for device data (optional)

See `firestore-device-project.rules` and the `VITE_FIREBASE_DEVICE_*` keys
in `.env.example`. This lets device/sensor data live in a completely
separate Firebase project from user accounts. Worth knowing: Firebase Auth
is scoped per-project, so the second project can't verify per-user
ownership the way the primary one does — its rules allow any authenticated
(anonymous) client to read/write any device. Fine for personal/hobby use;
not a substitute for real per-user isolation across two projects (which
would need custom auth tokens minted server-side).

## What's included

- `src/lib/firebase.js` — Firebase app/auth/Firestore init (+ optional second project)
- `src/lib/firestore.js` — all Firestore reads/writes, schema documented at the top
- `src/lib/estimates.js` — derives the microplastic exposure estimate and
  day-over-day deltas from real readings (clearly labeled as an estimate —
  turbidity sensors don't measure microplastics directly)
- `src/context/AuthContext.jsx` — sign up, sign in (email + Google), sign out
- `src/context/DeviceContext.jsx` — single shared subscription to the
  user's primary device, its devices list, readings, and filter log — used
  by NavBar, TopBar, Home, Data, History, and Filter so there's only one
  set of Firestore listeners per session, not one per page
- `src/context/ThemeContext.jsx`, `ToastContext.jsx` — unchanged, no
  Firebase involved (dark mode + toast notifications are local UI state)
- `src/App.jsx` — routes gated by `ProtectedRoute` / `PublicOnlyRoute`
- `src/data/sampleData.js` — no longer used anywhere; kept only as a
  reference for the data shapes each page originally expected

### Known simplifications

- The "vs yesterday" Delta on Home's NTU tile and the Microplastic card
  compares real day-over-day readings. The Filter page's "remaining %"
  doesn't show a Delta — there's no historical log of
  `filterPercentRemaining` in the schema, so a real comparison isn't
  possible without adding one.
- `estimateMicroplasticExposure` is a documented illustrative estimate
  (see comments in `src/lib/estimates.js`), not a scientific measurement.

## Build for production

```bash
npm run build
```

Set the same `VITE_FIREBASE_*` env vars in your hosting provider's
dashboard (e.g. Vercel) — `.env` isn't uploaded with your code.
