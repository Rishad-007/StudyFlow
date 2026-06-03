# StudyFlow — Manual Setup Guide

This document covers all manual steps you need to take to get StudyFlow fully running.

---

## 1. Supabase Project Setup

### 1.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Enter a name (e.g. "studyflow")
4. Set a secure database password (save it)
5. Choose a region close to you
6. Click **Create new project** (takes ~2 minutes)

### 1.2 Run the Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Open `supabase-schema.sql` from this project and copy the entire contents
4. Paste into the SQL Editor
5. Click **Run** (or Cmd+Enter)
6. Verify all 10 tables appear in **Table Editor**:
   - `profiles`, `subjects`, `chapters`, `study_sessions`
   - `daily_targets`, `daily_plans`, `weekly_plans`
   - `user_settings`, `habits`, `session_notes`

### 1.3 Enable Email Auth
1. Go to **Authentication → Providers**
2. Ensure **Email** is enabled
3. Disable **Confirm email** (optional — makes testing easier)
4. Save

### 1.4 Get API Keys
1. Go to **Project Settings → API**
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy the **anon public key** (starts with `eyJ...`)
4. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Edit `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

> **Important**: Never commit `.env` to git. It's already in `.gitignore`.

---

## 2. Running the App

```bash
# Install dependencies (if not already done)
npm install

# Start dev server
npm run dev

# Full TypeScript build check (stricter)
npx tsc -b

# Standard type check
npx tsc --noEmit
```

The app will be at `http://localhost:5173`.

---

## 3. Creating a Test User

1. Open the app at `http://localhost:5173`
2. Click **Sign up**
3. Enter a name, email, and password
4. After signup, you can start using all features

> If you see "Email not confirmed" errors, go to **Authentication → Providers → Email** and disable "Confirm email" in Supabase.

---

## 4. PWA Icons (Production)

The current PWA icons are SVG placeholders. For production, replace them with real PNGs:

1. Generate a 192×192 PNG icon → `public/pwa-192x192.png`
2. Generate a 512×512 PNG icon → `public/pwa-512x512.png`
3. Generate an Apple touch icon (180×180) → `public/apple-touch-icon.png`

Tools: [PWA Image Generator](https://www.pwabuilder.com/imageGenerator), [Real Favicon Generator](https://realfavicongenerator.net/)

---

## 5. Ambient Sound URLs

The ambient sounds use placeholder SoundHelix URLs. For production, replace them in `src/hooks/useAmbientSound.ts` (`SOUND_OPTIONS` array) with:

- **Self-hosted audio files**: Place `.mp3` files in `public/sounds/` and reference as `/sounds/rain.mp3`
- **Free sound resources**:
  - [Freesound.org](https://freesound.org) (CC0 licensed)
  - [Pixabay Sounds](https://pixabay.com/sound-effects/)
  - [Zapsplat](https://www.zapsplat.com)

Replace the URLs in the `url` field of each sound option.

---

## 6. Deployment

### Build for production
```bash
npm run build
```

The output goes to `dist/`.

### Deploy to Netlify
1. Connect your repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. Add `public/_redirects` for SPA fallback:
   ```
   /*    /index.html   200
   ```

### Deploy to Vercel
1. Connect repo to Vercel
2. Framework preset: **Vite**
3. Add environment variables
4. Deploy — SPA fallback is automatic

### Deploy to Cloudflare Pages
1. Connect repo to Cloudflare Pages
2. Build command: `npm run build`
3. Build output: `dist`
4. Add environment variables
5. Add `public/_redirects` or configure SPA fallback in Cloudflare dashboard

---

## 7. Manual Actions Checklist

| Step | Action | Location |
|------|--------|----------|
| [ ] | Create Supabase project | supabase.com |
| [ ] | Run `supabase-schema.sql` | SQL Editor |
| [ ] | Enable Email auth provider | Auth → Providers |
| [ ] | Copy `.env.example` to `.env` | Project root |
| [ ] | Add `VITE_SUPABASE_URL` to `.env` | Project root |
| [ ] | Add `VITE_SUPABASE_ANON_KEY` to `.env` | Project root |
| [ ] | Run `npm install` | Terminal |
| [ ] | Run `npm run dev` | Terminal |
| [ ] | Create a test account | App UI |
| [ ] | Replace PWA icons (optional) | `public/` |
| [ ] | Replace ambient sound URLs (optional) | `src/hooks/useAmbientSound.ts` |
| [ ] | Add `_redirects` file (Netlify/Cloudflare) | `public/` |

---

## 8. Troubleshooting

**"Failed to start session" toast**
→ Check Supabase connection in `.env`
→ Verify `study_sessions` table exists in Supabase

**"relation does not exist" errors**
→ The SQL schema hasn't been run. Go to SQL Editor and run `supabase-schema.sql`

**TypeScript build errors with `npx tsc -b`**
→ Run `npx tsc --noEmit` instead (less strict)
→ The `tsc -b` build mode uses project references which may have stricter checks

**PWA not installing**
→ App must be served over HTTPS or localhost
→ Open Chrome DevTools → Application → Manifest to check for errors
