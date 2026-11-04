import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { KANAGJEGJI_THEMES } from "@/lib/themes";
import { KANAGJEGJI_DEFAULT_PRICES, KANAGJEGJI_MUSIC, kanaPackageOf } from "@/lib/kanagjegji";
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

export type KanaPackageRow = { package: "classic" | "premium"; price: number; features: string[]; templates: string[] };

export async function readKanaPackages(supabase: Awaited<ReturnType<typeof getAdmin>>): Promise<KanaPackageRow[]> {
  const { data } = await supabase
    .from("category_packages")
    .select("package, price, features, templates")
    .eq("category", "kanagjegji");
  const rows = (data ?? []).map((r) => ({
    package: r.package as "classic" | "premium",
    price: Number(r.price),
    features: r.features ?? [],
    templates: r.templates ?? [],
  }));
  for (const pkg of ["classic", "premium"] as const) {
    if (!rows.find((r) => r.package === pkg)) {
      rows.push({ package: pkg, price: KANAGJEGJI_DEFAULT_PRICES[pkg], features: [], templates: pkg === "premium" ? ["k-burgundy", "k-ottoman"] : ["k-traditional", "k-modern"] });
    }
  }
  return rows.sort((a) => (a.package === "classic" ? -1 : 1));
}

// Publike: vetëm çmimet, përfshirjet dhe dizajnet aktive — asnjë e dhënë private.
export const getKanaPackages = createServerFn({ method: "GET" }).handler(async () => {
  return readKanaPackages(await getAdmin());
});

const today = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10);

const createSchema = z.object({
  bride: z.string().trim().min(1).max(60),
  parents: z.string().trim().max(120).optional().default(""),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((d) => d >= today() && d.slice(0, 4) <= "2100", "Data duhet të jetë në të ardhmen."),
  event_time: z.string().trim().regex(/^\d{2}:\d{2}$/),
  venue: z.string().trim().min(1).max(120),
  address: z.string().trim().min(1).max(200),
  maps_url: z.string().trim().max(500).refine((v) => savedMapsHref(v) !== null, "Linku i Google Maps nuk është i vlefshëm."),
  message: z.string().trim().max(500).optional().default(""),
  music: z.enum(KANAGJEGJI_MUSIC).default("henna"),
  theme: z.enum(KANAGJEGJI_THEMES),
});

export const createKanagjegjiInvitation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = await getAdmin();
    const pkgs = await readKanaPackages(supabase);
    const pkg = pkgs.find((p) => p.package === kanaPackageOf(data.theme));
    if (pkg && pkg.templates.length && !pkg.templates.includes(data.theme)) {
      throw new Error("Ky dizajn nuk është aktiv për momentin.");
    }
    const { data: row, error } = await supabase
      .from("invitations")
      .insert({
        category: "kanagjegji",
        partner_one: data.bride,
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
      console.error("createKanagjegjiInvitation failed", error);
      throw new Error("Ftesa nuk u krijua. Provoni përsëri.");
    }
    return { id: row.id, token: row.manage_token };
  });

// --- Administrimi i paketave Kanagjegji (të ndara nga çmimet e dasmës) ---

export const listKanaPackagesAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ key: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    checkKey(data.key);
    return readKanaPackages(await getAdmin());
  });

export const saveKanaPackage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        key: z.string().min(1).max(200),
        package: z.enum(["classic", "premium"]),
        price: z.number().min(0).max(10000),
        features: z.array(z.string().trim().min(1).max(120)).max(30),
        templates: z.array(z.enum(KANAGJEGJI_THEMES)).min(1).max(10),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    checkKey(data.key);
    const allowed = data.package === "premium" ? ["k-burgundy", "k-ottoman"] : ["k-traditional", "k-modern"];
    if (data.templates.some((t) => !allowed.includes(t))) throw new Error("Dizajni nuk i përket kësaj pakete.");
    const supabase = await getAdmin();
    const { error } = await supabase.from("category_packages").upsert({
      category: "kanagjegji",
      package: data.package,
      price: data.price,
      features: data.features,
      templates: data.templates,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error("Paketa nuk u ruajt.");
    return { ok: true };
  });
