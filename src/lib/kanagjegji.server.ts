import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { KANAGJEGJI_DEFAULT_PRICES } from "@/lib/kanagjegji";

export type KanaPackageRow = { package: "classic" | "premium"; price: number; features: string[]; templates: string[] };

export async function readKanaPackages(supabase: SupabaseClient<Database>): Promise<KanaPackageRow[]> {
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

