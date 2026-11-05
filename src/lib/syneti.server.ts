import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { SYNETI_DEFAULT_PRICE, type SynetiPackageRow } from "@/lib/syneti";
import { SYNETI_THEMES } from "@/lib/themes";

const FALLBACK: SynetiPackageRow = {
  package: "classic",
  price: SYNETI_DEFAULT_PRICE,
  features: [],
  templates: [...SYNETI_THEMES],
};

export async function readSynetiPackages(supabase: SupabaseClient<Database>): Promise<SynetiPackageRow[]> {
  const { data } = await supabase
    .from("category_packages")
    .select("package, price, features, templates")
    .eq("category", "syneti");
  const row = (data ?? []).find((r) => r.package === "classic");
  if (!row) return [FALLBACK];
  return [{ package: "classic", price: Number(row.price), features: row.features ?? [], templates: row.templates ?? [] }];
}
