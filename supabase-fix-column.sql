-- ============================================================================
-- StudyFlow - Fix daily_plans foreign key constraint
-- Run in Supabase SQL Editor with "No limit"
-- ============================================================================

-- Step 1: Drop the OLD foreign key that incorrectly points to chapters(id)
alter table daily_plans drop constraint if exists daily_plans_chapter_id_fkey;

-- Step 2: Drop any stale constraint from previous attempts
alter table daily_plans drop constraint if exists daily_plans_user_id_plan_date_chapter_id_key;

-- Step 3: Rename column to subject_id (safe to run multiple times)
alter table daily_plans rename column chapter_id to subject_id;

-- Step 4: Add the CORRECT foreign key referencing subjects(id)
alter table daily_plans add constraint daily_plans_subject_id_fkey
  foreign key (subject_id) references subjects(id) on delete cascade;

-- Step 5: Add the correct unique constraint
alter table daily_plans add constraint daily_plans_user_id_plan_date_subject_id_key
  unique (user_id, plan_date, subject_id);

-- Step 6: Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
