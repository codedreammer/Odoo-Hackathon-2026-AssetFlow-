import { createClient } from "@/lib/supabase/server";

export type Asset = {
  id: string;
  asset_tag: string;
  name: string;
  serial_number: string | null;
  status: string;
  condition: string;
  manufacturer: string | null;
  model: string | null;
  photo_url: string | null;
  is_bookable: boolean;
  assigned_to: string | null;
  location: string | null;
  purchase_date: string | null;
  value: number | null;
  created_at: string;
  asset_categories: { name: string } | null;
};

export async function getAssets(): Promise<Asset[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .select(
      `
      id, asset_tag, name, serial_number, status, condition,
      manufacturer, model, photo_url, is_bookable,
      assigned_to, location, purchase_date, value, created_at,
      asset_categories(name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as Asset[];
}