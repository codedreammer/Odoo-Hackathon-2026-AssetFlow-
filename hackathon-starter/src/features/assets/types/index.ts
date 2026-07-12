import type { ActionResponse } from "@/types";

import type { AssetFormValues } from "../schemas/asset-schema";

export const ASSET_STATUS_VALUES = [
  "AVAILABLE",
  "ALLOCATED",
  "RESERVED",
  "UNDER_MAINTENANCE",
  "LOST",
  "RETIRED",
  "DISPOSED",
] as const;

export type AssetStatus = (typeof ASSET_STATUS_VALUES)[number];

export interface AssetRecord {
  id: string;
  asset_tag: string;
  name: string;
  category_id: string;
  location_id: string | null;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  acquisition_date: string | null;
  acquisition_cost: number | null;
  warranty_expiry: string | null;
  status: AssetStatus;
  is_bookable: boolean;
  photo_url: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssetListItem extends AssetRecord {
  category_name: string | null;
  location_name: string | null;
}

export interface AssetOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface AssetManagementData {
  assets: AssetListItem[];
  categoryOptions: AssetOption[];
  locationOptions: AssetOption[];
}

export interface AssetMutationInput {
  asset_tag: string;
  name: string;
  category_id: string;
  location_id: string | null;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  acquisition_date: string | null;
  acquisition_cost: number | null;
  warranty_expiry: string | null;
  status: AssetStatus;
  is_bookable: boolean;
  photo_url: string | null;
  document_url: string | null;
}

export interface UpdateAssetInput extends AssetMutationInput {
  id: string;
}

export interface ToggleAssetStatusInput {
  id: string;
  status: AssetStatus;
}

type AssetFieldErrorKey = keyof AssetFormValues | "id";

export type AssetFieldErrors = Partial<
  Record<AssetFieldErrorKey, string[] | undefined>
>;

export type AssetMutationActionState = ActionResponse<{
  assetId: string;
}> & {
  fieldErrors?: AssetFieldErrors;
};

export type AssetToggleActionState = ActionResponse<{
  assetId: string;
  status: AssetStatus;
}>;

export function isInactiveAssetStatus(status: AssetStatus) {
  return status === "RETIRED" || status === "DISPOSED";
}

export function getToggledAssetStatus(status: AssetStatus): AssetStatus {
  return isInactiveAssetStatus(status) ? "AVAILABLE" : "RETIRED";
}
