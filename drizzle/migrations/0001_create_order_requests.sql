CREATE TABLE public.order_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  style text NOT NULL,
  partner_one text NOT NULL,
  partner_two text NOT NULL,
  wedding_date date NOT NULL,
  contact_phone text NOT NULL,
  contact_email text,
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.order_requests TO service_role;
ALTER TABLE public.order_requests ENABLE ROW LEVEL SECURITY;