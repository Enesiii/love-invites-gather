ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS cover_path text;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS cover_pos_x integer NOT NULL DEFAULT 50;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS cover_pos_y integer NOT NULL DEFAULT 50;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS cover_zoom integer NOT NULL DEFAULT 100;
ALTER TABLE public.event_photos ADD COLUMN IF NOT EXISTS show_in_gallery boolean NOT NULL DEFAULT false;