import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SYNETI_THEMES } from "@/lib/themes";
import { SYNETI_MUSIC } from "@/lib/syneti";
import { savedMapsHref } from "@/lib/invitation-location";

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function checkKey(key: string) {
  const expected = process.env["ADMIN_KEY"]?.trim();
  if (!expected || expected.length < 8 || key.trim() !== expected) {
    throw new Error("Kodi i administrimit nuk është i saktë.");
  }
}

// Publike: vetëm çmimi, përfshirjet dhe dizajnet aktive — asnjë e dhënë private.
export const getSynetiPackages = createServerFn({ method: "GET" }).handler(async () => {
  const { readSynetiPackages } = await import("@/lib/syneti.server");
  return readSynetiPackages(await getAdmin());
});

const today = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10);

const createSchema = z.object({
  boy: z.string().trim().min(1).max(60),
  parents: z.string().trim().max(120).optional().default(""),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((d) => d >= today() && d.slice(0, 4) <= "2100", "Data duhet të jetë në të ardhmen."),
  event_time: z.string().trim().regex(/^\d{2}:\d{2}$/),
  venue: z.string().trim().min(1).max(120),
  address: z.string().trim().min(1).max(200),
  maps_url: z.string().trim().max(500).refine((v) => savedMapsHref(v) !== null, "Linku i Google Maps nuk është i vlefshëm."),
  message: z.string().trim().max(500).optional().default(""),
  music: z.enum(SYNETI_MUSIC).default("celebration"),
  theme: z.enum(SYNETI_THEMES),
});

export const createSynetiInvitation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await getAdmin();
    const { readSynetiPackages } = await import("@/lib/syneti.server");
    const pkgs = await readSynetiPackages(supabase);
    const pkg = pkgs.find((p) => p.package === "classic");
    if (pkg && pkg.templates.length && !pkg.templates.includes(data.theme)) {
      throw new Error("Ky dizajn nuk është aktiv për momentin.");
    }
    const { data: row, error } = await supabase
      .from("invitations")
      .insert({
        category: "syneti",
        partner_one: data.boy,
        partner_two: "",
        parents: data.parents || null,
        event_date: data.event_date,
        event_time: data.event_time,
        venue: data.venue,
        address: data.address,
        maps_url: savedMapsHref(data.maps_url),
        message: data.message || null,
        music: data.music,
        theme: data.theme,
      })
      .select("id, manage_token")
      .single();
    if (error || !row) {
      console.error("createSynetiInvitation failed", error);
      throw new Error("Ftesa nuk u krijua. Provoni përsëri.");
    }
    return { id: row.id, token: row.manage_token };
  });

// --- Administrimi i paketës Syneti (e ndarë nga çmimet e dasmës dhe Kanagjegjit) ---

export const listSynetiPackagesAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ key: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    const { readSynetiPackages } = await import("@/lib/syneti.server");
    return readSynetiPackages(await getAdmin());
  });

export const saveSynetiPackage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        key: z.string().min(1).max(200),
        package: z.literal("classic"),
        price: z.number().min(0).max(10000),
        features: z.array(z.string().trim().min(1).max(120)).max(30),
        templates: z.array(z.enum(SYNETI_THEMES)).min(1).max(10),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    checkKey(data.key);
    const supabase = await getAdmin();
    const { error } = await supabase.from("category_packages").upsert({
      category: "syneti",
      package: data.package,
      price: data.price,
      features: data.features,
      templates: data.templates,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error("Paketa nuk u ruajt.");
    return { ok: true };
  });
