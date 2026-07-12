import { z } from "zod";

import {
  requiredStringSchema,
  urlSchema,
  uuidSchema,
} from "@/lib/validators";
import { ASSET_STATUS_VALUES } from "../types";

const optionalUuidField = z.union([uuidSchema, z.literal(""), z.null()]);
const optionalDateField = z.union([
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  z.literal(""),
  z.null(),
]);

function optionalTextField(fieldName: string, maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength, `${fieldName} must not exceed ${maxLength} characters`)
    .or(z.literal(""));
}

const acquisitionCostField = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Acquisition cost must be a valid amount")
  .or(z.literal(""));

export const assetFormSchema = z.object({
  assetTag: requiredStringSchema("Asset tag").max(
    64,
    "Asset tag must not exceed 64 characters",
  ),
  name: requiredStringSchema("Asset name").max(
    160,
    "Asset name must not exceed 160 characters",
  ),
  categoryId: uuidSchema,
  locationId: optionalUuidField.default(""),
  manufacturer: optionalTextField("Manufacturer", 120),
  model: optionalTextField("Model", 120),
  serialNumber: optionalTextField("Serial number", 120),
  acquisitionDate: optionalDateField.default(""),
  acquisitionCost: acquisitionCostField.default(""),
  warrantyExpiry: optionalDateField.default(""),
  status: z.enum(ASSET_STATUS_VALUES),
  isBookable: z.boolean(),
  photoUrl: urlSchema.default(""),
  documentUrl: urlSchema.default(""),
});

export const assetCreateSchema = assetFormSchema;

export const assetUpdateSchema = assetFormSchema.extend({
  id: uuidSchema,
});

export const assetToggleSchema = z.object({
  id: uuidSchema,
  status: z.enum(ASSET_STATUS_VALUES),
});

export type AssetFormValues = z.input<typeof assetFormSchema>;
export type AssetUpdateFormValues = z.input<typeof assetUpdateSchema>;

export function normalizeAssetFormValues(values: AssetFormValues) {
  return {
    asset_tag: values.assetTag.trim(),
    name: values.name.trim(),
    category_id: values.categoryId,
    location_id: values.locationId || null,
    manufacturer: values.manufacturer.trim() || null,
    model: values.model.trim() || null,
    serial_number: values.serialNumber.trim() || null,
    acquisition_date: values.acquisitionDate || null,
    acquisition_cost: values.acquisitionCost
      ? Number(values.acquisitionCost)
      : null,
    warranty_expiry: values.warrantyExpiry || null,
    status: values.status,
    is_bookable: values.isBookable,
    photo_url: values.photoUrl?.trim() || null,
    document_url: values.documentUrl?.trim() || null,
  };
}

export function normalizeAssetUpdateFormValues(values: AssetUpdateFormValues) {
  return normalizeAssetFormValues(values);
}
