# StudyFlow — Supabase Setup Instructions

Follow these steps to set up the Supabase backend for StudyFlow.

---

## Prerequisites

- A Supabase account ([supabase.com](https://supabase.com))
- A new Supabase project created

> If you haven't created a project yet: go to [supabase.com/dashboard](https://supabase.com/dashboard), click **New Project**, enter a name (e.g. `studyflow`), set a secure database password, and choose a region close to you. Wait for the database to provision (~1-2 minutes).

---

## Step 1: Open SQL Editor

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click on your **StudyFlow** project
3. In the left sidebar, click **SQL Editor**
4. Click **New Query**

---

## Step 2: Run the Schema

1. Open the `supabase-schema.sql` file from this project
2. Copy the **entire contents** of the file
3. Paste into the SQL Editor
4. Click the **Run** button (or press `Cmd+Enter` / `Ctrl+Enter`)

The query should complete successfully. You'll see a green success message.

> **Troubleshooting**: If you see an error about `uuid-ossp` already existing, that's fine — just re-run. If you see `column "..." already exists`, it means you're running the script twice — that's safe because all tables use `if not exists`.

---

## Step 3: Verify Tables

1. In the left sidebar, click **Table Editor**
2. You should see all **10 tables** listed:
   - `profiles`
   - `subjects`
   - `chapters`
   - `study_sessions`
   - `daily_targets`
   - `daily_plans`
   - `weekly_plans`
   - `user_settings`
   - `habits`
   - `session_notes`
3. Click into each table to verify the columns match the schema

---

## Step 4: Set Up Auth

1. In the left sidebar, click **Authentication** → **Providers**
2. Under **Email / Password**, make sure the toggle is **enabled** (green)
3. **(Optional)** If you want to test with confirmations disabled:
   - Click **Edit** on the Email/Password provider
   - Turn off **Confirm emails** (only for development)
   - Click **Save**

---

## Step 5: Get API Keys

1. In the left sidebar, click **Project Settings** (gear icon)
2. Click **API** in the settings menu
3. You'll see two values you need:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public key** (a long JWT string starting with `eyJ...`)
4. Copy both values

---

## Step 6: Configure Environment

1. In the project root directory, copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in the values:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Save the file.

> **Important**: Never commit `.env` to version control. It's already in `.gitignore` if you used the Vite template. The `.env.example` file is safe to commit — it contains no secrets.

---

## Step 7: Test Connection (Optional)

To verify the connection works, you can run a quick test:

1. Start the dev server:

   ```bash
   npm run dev
   ```

2. Open the browser console (`F12`)
3. Run this in the console:

   ```js
   const { supabase } = await import('./src/services/supabase')
   const { data, error } = await supabase.from('subjects').select('*')
   console.log({ data, error })
   ```

If you see `{ data: [], error: null }`, the connection is working.

---

## All Set!

Your Supabase backend is ready. You can now proceed to the next phase of the StudyFlow build.
