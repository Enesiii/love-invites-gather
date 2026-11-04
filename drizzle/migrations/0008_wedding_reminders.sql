ALTER TABLE public.rsvps ADD COLUMN calendar_added text;
ALTER TABLE public.rsvps ADD COLUMN push_status text;

CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  rsvp_id uuid NOT NULL REFERENCES public.rsvps(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.reminder_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES public.push_subscriptions(id) ON DELETE CASCADE,
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('10d','3d')),
  status text NOT NULL CHECK (status IN ('sent','failed','skipped')),
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subscription_id, kind)
);
ALTER TABLE public.reminder_notifications ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.reminder_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  push_enabled boolean NOT NULL DEFAULT true
);
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;