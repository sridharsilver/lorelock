-- Add email column to profiles table
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Backfill email for existing profiles (from auth.users if available)
-- Use COALESCE as a fallback in case of orphaned profiles
UPDATE public.profiles p
SET email = COALESCE(
  (SELECT email FROM auth.users u WHERE u.id = p.user_id),
  'unknown@lorelock.app'
);

-- Make email NOT NULL and UNIQUE after backfill
ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
