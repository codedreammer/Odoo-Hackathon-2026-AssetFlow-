import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .select(`id, asset_tag, name, serial_number, status, condition, manufacturer, model, is_bookable, created_at, asset_categories(name)`)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("assets")
    .insert({
      name: body.name,
      serial_number: body.serial_number || null,
      manufacturer: body.manufacturer || null,
      model: body.model || null,
      condition: body.condition,
      is_bookable: body.is_bookable,
      status: "AVAILABLE",
      asset_tag: "",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
