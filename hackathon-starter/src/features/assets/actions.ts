import { createClient } from "@/lib/supabase/server";

export async function getAssets() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .select(`
      id, asset_tag, name, serial_number, status, condition,
      manufacturer, model, photo_url, is_bookable, created_at,
      asset_categories(name),
      asset_locations(name)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getAssetById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .select(`
      *,
      asset_categories(name),
      departments(name),
      asset_locations(name),
      asset_allocations(
        id, status, allocated_at, expected_return_date,
        profiles(full_name)
      ),
      maintenance_requests(
        id, status, priority, description, created_at
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createAsset(formData: {
  name: string;
  serial_number?: string;
  category_id: string;
  department_id?: string;
  location_id?: string;
  condition: string;
  manufacturer?: string;
  model?: string;
  acquisition_date?: string;
  acquisition_cost?: number;
  is_bookable: boolean;
  warranty_expiry?: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .insert({ ...formData, asset_tag: "" }) // trigger auto-generates tag
    .select()
    .single();

  if (error) throw error;
  return data;
}