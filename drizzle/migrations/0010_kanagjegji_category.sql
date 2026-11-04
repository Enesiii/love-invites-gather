ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'wedding';
ALTER TABLE public.invitations ADD CONSTRAINT invitations_category_check CHECK (category IN ('wedding','kanagjegji'));
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS parents text;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS music text;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS maps_url text;
CREATE INDEX IF NOT EXISTS invitations_category_idx ON public.invitations(category);

ALTER TABLE public.payment_orders ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'wedding';
ALTER TABLE public.payment_orders ADD CONSTRAINT payment_orders_category_check CHECK (category IN ('wedding','kanagjegji'));

ALTER TABLE public.order_requests ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'wedding';
ALTER TABLE public.order_requests ADD CONSTRAINT order_requests_category_check CHECK (category IN ('wedding','kanagjegji'));

CREATE TABLE public.category_packages (
  category text NOT NULL CHECK (category IN ('kanagjegji')),
  package text NOT NULL CHECK (package IN ('classic','premium')),
  price numeric NOT NULL CHECK (price >= 0 AND price <= 10000),
  features text[] NOT NULL DEFAULT '{}',
  templates text[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (category, package)
);
GRANT ALL ON public.category_packages TO service_role;
ALTER TABLE public.category_packages ENABLE ROW LEVEL SECURITY;

INSERT INTO public.category_packages (category, package, price, features, templates) VALUES
('kanagjegji','classic',10,
 ARRAY['Zarf me animacion hapjeje','Muzikë në sfond','Numërim mbrapsht','Google Maps','RSVP online','Paneli i mysafirëve','Foto dhe video nga mysafirët','Kalendar','Kodi QR','Link unik','Shkarkim PDF'],
 ARRAY['k-traditional','k-modern']),
('kanagjegji','premium',15,
 ARRAY['Gjithçka nga paketa Klasike','Fotoja juaj personale','Prerje dhe pozicionim i fotos','Dizajne ekskluzive Premium'],
 ARRAY['k-burgundy','k-ottoman']);