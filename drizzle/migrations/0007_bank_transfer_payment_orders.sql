CREATE SEQUENCE public.order_number_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION public.next_order_number()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT 'FD-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text, 6, '0')
$$;

ALTER TABLE public.invitations ADD COLUMN activated_at timestamptz;
UPDATE public.invitations SET activated_at = created_at WHERE activated_at IS NULL;
COMMENT ON COLUMN public.invitations.activated_at IS 'NULL = ftesa e kyçur deri sa pagesa te konfirmohet; vendoset kur porosia paguhet. Rreshtat ekzistues u mbrapa-plotesuan me created_at qe te mbeten publike.';

CREATE TABLE public.payment_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  bank_name text NOT NULL DEFAULT '',
  beneficiary text NOT NULL DEFAULT '',
  iban text NOT NULL DEFAULT '',
  whatsapp_number text NOT NULL DEFAULT '',
  support_email text NOT NULL DEFAULT '',
  instructions text NOT NULL DEFAULT '',
  order_expiration_days integer NOT NULL DEFAULT 7,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.payment_settings TO service_role;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token uuid NOT NULL DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  package text NOT NULL CHECK (package IN ('classic','premium')),
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  customer_name text,
  customer_email text,
  customer_phone text,
  status text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment','paid','cancelled','expired')),
  payment_email_sent_at timestamptz,
  payment_email_status text,
  confirmation_email_sent_at timestamptz,
  confirmation_email_status text,
  paid_at timestamptz,
  confirmed_by text,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX payment_orders_access_token_uidx ON public.payment_orders(access_token);
CREATE UNIQUE INDEX payment_orders_invitation_uidx ON public.payment_orders(invitation_id);
GRANT ALL ON public.payment_orders TO service_role;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.payment_audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.payment_orders(id) ON DELETE CASCADE,
  old_status text,
  new_status text NOT NULL,
  actor text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.payment_audit_log TO service_role;
ALTER TABLE public.payment_audit_log ENABLE ROW LEVEL SECURITY;