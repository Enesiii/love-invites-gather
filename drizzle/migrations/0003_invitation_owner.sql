ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS owner_id uuid;
CREATE INDEX IF NOT EXISTS invitations_owner_idx ON public.invitations(owner_id);