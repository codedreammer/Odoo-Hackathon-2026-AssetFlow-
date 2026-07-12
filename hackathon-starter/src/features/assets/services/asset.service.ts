import "server-only";

import { createClient } from "@/lib/supabase/server";

import type {
  AssetListItem,
  AssetManagementData,
  AssetMutationInput,
  AssetOption,
  AssetRecord,
  AssetStatus,
  ToggleAssetStatusInput,
  UpdateAssetInput,
} from "../types";

interface AssetCategoryRecord {
  id: string;
  name: string;
  active: boolean;
}

interface AssetLocationRecord {
  id: string;
  name: string;
  building: string | null;
  floor: string | null;
  room: string | null;
  active: boolean;
}

interface RawAssetRow {
  id: string;
  asset_tag: string;
  name: string;
  category_id: string;
  location_id: string | null;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  acquisition_date: string | null;
  acquisition_cost: number | string | null;
  warranty_expiry: string | null;
  status: AssetStatus;
  is_bookable: boolean;
  photo_url: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
  asset_categories: { name: string } | { name: string }[] | null;
  asset_locations: { name: string } | { name: string }[] | null;
}

function formatAssetError(message: string) {
  return {
    success: false as const,
    error: {
      message,
    },
  };
}

function isDuplicateKeyError(error: { code?: string | null }) {
  return error.code === "23505";
}

function buildLocationLabel(location: AssetLocationRecord) {
  const parts = [location.building, location.floor, location.room].filter(
    (value): value is string => Boolean(value),
  );

  if (parts.length === 0) {
    return location.name;
  }

  return `${location.name} (${parts.join(" / ")})`;
}

function mapAssetData(
  assets: RawAssetRow[],
  categories: AssetCategoryRecord[],
  locations: AssetLocationRecord[],
): AssetManagementData {
  function getRelationName(
    relation: { name: string } | { name: string }[] | null,
  ) {
    if (!relation) {
      return null;
    }

    if (Array.isArray(relation)) {
      return relation[0]?.name ?? null;
    }

    return relation.name;
  }

  const categoryOptions: AssetOption[] = categories.map((category) => ({
    label: category.active ? category.name : `${category.name} (Inactive)`,
    value: category.id,
  }));

  const locationOptions: AssetOption[] = locations.map((location) => ({
    label: location.active
      ? buildLocationLabel(location)
      : `${buildLocationLabel(location)} (Inactive)`,
    value: location.id,
  }));

  const assetList: AssetListItem[] = assets.map((asset) => ({
    id: asset.id,
    asset_tag: asset.asset_tag,
    name: asset.name,
    category_id: asset.category_id,
    location_id: asset.location_id,
    manufacturer: asset.manufacturer,
    model: asset.model,
    serial_number: asset.serial_number,
    acquisition_date: asset.acquisition_date,
    acquisition_cost:
      asset.acquisition_cost == null ? null : Number(asset.acquisition_cost),
    warranty_expiry: asset.warranty_expiry,
    status: asset.status,
    is_bookable: asset.is_bookable,
    photo_url: asset.photo_url,
    document_url: asset.document_url,
    created_at: asset.created_at,
    updated_at: asset.updated_at,
    category_name: getRelationName(asset.asset_categories),
    location_name: getRelationName(asset.asset_locations),
  }));

  return {
    assets: assetList,
    categoryOptions,
    locationOptions,
  };
}

async function validateAssetUniqueness(
  excludeAssetId: string | null,
  input: Pick<AssetMutationInput, "asset_tag" | "serial_number">,
) {
  const supabase = await createClient();

  let assetTagQuery = supabase
    .from("assets")
    .select("id")
    .ilike("asset_tag", input.asset_tag);

  if (excludeAssetId) {
    assetTagQuery = assetTagQuery.neq("id", excludeAssetId);
  }

  const {
    data: existingAssetTag,
    error: assetTagError,
  } = await assetTagQuery.maybeSingle();

  if (assetTagError) {
    return formatAssetError("Unable to validate the asset tag right now.");
  }

  if (existingAssetTag) {
    return formatAssetError("An asset with this asset tag already exists.");
  }

  if (input.serial_number) {
    let serialNumberQuery = supabase
      .from("assets")
      .select("id")
      .ilike("serial_number", input.serial_number);

    if (excludeAssetId) {
      serialNumberQuery = serialNumberQuery.neq("id", excludeAssetId);
    }

    const {
      data: existingSerialNumber,
      error: serialNumberError,
    } = await serialNumberQuery.maybeSingle();

    if (serialNumberError) {
      return formatAssetError(
        "Unable to validate the serial number right now.",
      );
    }

    if (existingSerialNumber) {
      return formatAssetError(
        "An asset with this serial number already exists.",
      );
    }
  }

  return {
    success: true as const,
  };
}

async function validateRelationships(
  categoryId: string,
  locationId: string | null,
) {
  const supabase = await createClient();

  const { data: category, error: categoryError } = await supabase
    .from("asset_categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();

  if (categoryError || !category) {
    return formatAssetError("Please select a valid asset category.");
  }

  if (locationId) {
    const { data: location, error: locationError } = await supabase
      .from("asset_locations")
      .select("id")
      .eq("id", locationId)
      .maybeSingle();

    if (locationError || !location) {
      return formatAssetError("Please select a valid asset location.");
    }
  }

  return {
    success: true as const,
  };
}

export async function getAssetManagementData() {
  const supabase = await createClient();

  const [assetsResult, categoriesResult, locationsResult] = await Promise.all([
    supabase
      .from("assets")
      .select(
        `
          id,
          asset_tag,
          name,
          category_id,
          location_id,
          manufacturer,
          model,
          serial_number,
          acquisition_date,
          acquisition_cost,
          warranty_expiry,
          status,
          is_bookable,
          photo_url,
          document_url,
          created_at,
          updated_at,
          asset_categories ( name ),
          asset_locations ( name )
        `,
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("asset_categories")
      .select("id, name, active")
      .order("name"),
    supabase
      .from("asset_locations")
      .select("id, name, building, floor, room, active")
      .order("name"),
  ]);

  if (assetsResult.error) {
    return {
      success: false as const,
      error: {
        message: "Unable to load assets right now.",
        details: assetsResult.error.message,
      },
    };
  }

  if (categoriesResult.error) {
    return {
      success: false as const,
      error: {
        message: "Unable to load asset categories right now.",
        details: categoriesResult.error.message,
      },
    };
  }

  if (locationsResult.error) {
    return {
      success: false as const,
      error: {
        message: "Unable to load asset locations right now.",
        details: locationsResult.error.message,
      },
    };
  }

  return {
    success: true as const,
    data: mapAssetData(
      assetsResult.data as unknown as RawAssetRow[],
      categoriesResult.data as AssetCategoryRecord[],
      locationsResult.data as AssetLocationRecord[],
    ),
  };
}

export async function createAsset(input: AssetMutationInput) {
  const uniquenessValidation = await validateAssetUniqueness(null, {
    asset_tag: input.asset_tag,
    serial_number: input.serial_number,
  });

  if (!uniquenessValidation.success) {
    return uniquenessValidation;
  }

  const relationshipValidation = await validateRelationships(
    input.category_id,
    input.location_id,
  );

  if (!relationshipValidation.success) {
    return relationshipValidation;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assets")
    .insert({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    return formatAssetError(
      isDuplicateKeyError(error)
        ? "An asset with this asset tag or serial number already exists."
        : "Unable to register the asset right now.",
    );
  }

  return {
    success: true as const,
    data: {
      assetId: (data as Pick<AssetRecord, "id">).id,
    },
  };
}

export async function updateAsset(input: UpdateAssetInput) {
  const uniquenessValidation = await validateAssetUniqueness(input.id, {
    asset_tag: input.asset_tag,
    serial_number: input.serial_number,
  });

  if (!uniquenessValidation.success) {
    return uniquenessValidation;
  }

  const relationshipValidation = await validateRelationships(
    input.category_id,
    input.location_id,
  );

  if (!relationshipValidation.success) {
    return relationshipValidation;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assets")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select("id")
    .single();

  if (error) {
    return formatAssetError(
      isDuplicateKeyError(error)
        ? "An asset with this asset tag or serial number already exists."
        : "Unable to update the asset right now.",
    );
  }

  return {
    success: true as const,
    data: {
      assetId: (data as Pick<AssetRecord, "id">).id,
    },
  };
}

export async function toggleAssetStatus({
  id,
  status,
}: ToggleAssetStatusInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assets")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error) {
    return formatAssetError("Unable to update the asset status right now.");
  }

  return {
    success: true as const,
    data: {
      assetId: (data as Pick<AssetRecord, "id">).id,
      status,
    },
  };
}
