ALTER TABLE public.rsvps ADD COLUMN approval text NOT NULL DEFAULT 'pending' CHECK (approval IN ('pending','approved','rejected'));
UPDATE public.rsvps SET approval = 'approved' WHERE attending;
CREATE TABLE public.event_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.event_photos TO service_role;
ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;
CREATE INDEX event_photos_inv_idx ON public.event_photos(invitation_id);