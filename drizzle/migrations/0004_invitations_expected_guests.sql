ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS expected_guests integer;
COMMENT ON COLUMN public.invitations.expected_guests IS 'Total guests the couple expects; null = not set';