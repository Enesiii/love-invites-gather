CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manage_token UUID NOT NULL DEFAULT gen_random_uuid(),
  partner_one TEXT NOT NULL,
  partner_two TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL DEFAULT '17:00',
  venue TEXT NOT NULL,
  address TEXT,
  message TEXT,
  theme TEXT NOT NULL DEFAULT 'rose',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.invitations TO service_role;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX rsvps_invitation_idx ON public.rsvps(invitation_id);
GRANT ALL ON public.rsvps TO service_role;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;