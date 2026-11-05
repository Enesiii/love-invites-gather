ALTER TABLE public.invitations DROP CONSTRAINT invitations_category_check;
ALTER TABLE public.invitations ADD CONSTRAINT invitations_category_check CHECK (category IN ('wedding','kanagjegji','syneti'));
ALTER TABLE public.payment_orders DROP CONSTRAINT payment_orders_category_check;
ALTER TABLE public.payment_orders ADD CONSTRAINT payment_orders_category_check CHECK (category IN ('wedding','kanagjegji','syneti'));
ALTER TABLE public.order_requests DROP CONSTRAINT order_requests_category_check;
ALTER TABLE public.order_requests ADD CONSTRAINT order_requests_category_check CHECK (category IN ('wedding','kanagjegji','syneti'));
ALTER TABLE public.category_packages DROP CONSTRAINT category_packages_category_check;
ALTER TABLE public.category_packages ADD CONSTRAINT category_packages_category_check CHECK (category IN ('kanagjegji','syneti'));
INSERT INTO public.category_packages (category, package, price, features, templates) VALUES
('syneti','classic',10,
 ARRAY['Zarf me animacion hapjeje','Muzikë në sfond','Numërim mbrapsht','Google Maps','RSVP online','Paneli i mysafirëve','Foto dhe video nga mysafirët','Fotoja e djalit','Kalendar','Kodi QR','Link unik','Shkarkim PDF'],
 ARRAY['s-royal','s-sky','s-minimal','s-prince']);