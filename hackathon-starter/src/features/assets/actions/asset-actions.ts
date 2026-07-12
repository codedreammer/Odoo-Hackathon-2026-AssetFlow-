"use server";

import { revalidatePath } from "next/cache";

import {
  assetCreateSchema,
  assetToggleSchema,
  assetUpdateSchema,
  normalizeAssetFormValues,
  normalizeAssetUpdateFormValues,
} from "../schemas/asset-schema";
import {
  createAsset,
  toggleAssetStatus,
  updateAsset,
} from "../services/asset.service";
import type {
  AssetMutationActionState,
  AssetToggleActionState,
} from "../types";

const REVALIDATE_PATHS = ["/assets", "/", "/dashboard"];

function revalidateAssetPaths() {
  REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
}

export async function createAssetAction(
  input: unknown,
): Promise<AssetMutationActionState> {
  try {
    const parsedValues = assetCreateSchema.safeParse(input);

    if (!parsedValues.success) {
      return {
        success: false,
        error: {
          message: "Please correct the highlighted fields and try again.",
        },
        fieldErrors: parsedValues.error.flatten().fieldErrors,
      };
    }

    const result = await createAsset(
      normalizeAssetFormValues(parsedValues.data),
    );

    if (!result.success) {
      return {
        success: false,
        error: {
          message: result.error?.message ?? "Unable to register the asset.",
        },
      };
    }

    revalidateAssetPaths();

    return {
      success: true,
      data: {
        assetId: result.data.assetId,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "Something went wrong while registering the asset. Please try again.",
        details: error instanceof Error ? error.message : undefined,
      },
    };
  }
}

export async function updateAssetAction(
  input: unknown,
): Promise<AssetMutationActionState> {
  try {
    const parsedValues = assetUpdateSchema.safeParse(input);

    if (!parsedValues.success) {
      return {
        success: false,
        error: {
          message: "Please correct the highlighted fields and try again.",
        },
        fieldErrors: parsedValues.error.flatten().fieldErrors,
      };
    }

    const result = await updateAsset({
      id: parsedValues.data.id,
      ...normalizeAssetUpdateFormValues(parsedValues.data),
    });

    if (!result.success) {
      return {
        success: false,
        error: {
          message: result.error?.message ?? "Unable to update the asset.",
        },
      };
    }

    revalidateAssetPaths();

    return {
      success: true,
      data: {
        assetId: result.data.assetId,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "Something went wrong while updating the asset. Please try again.",
        details: error instanceof Error ? error.message : undefined,
      },
    };
  }
}

export async function toggleAssetStatusAction(
  input: unknown,
): Promise<AssetToggleActionState> {
  try {
    const parsedValues = assetToggleSchema.safeParse(input);

    if (!parsedValues.success) {
      return {
        success: false,
        error: {
          message: "Unable to update the asset status.",
          details: parsedValues.error.flatten().formErrors.join(", "),
        },
      };
    }

    const result = await toggleAssetStatus(parsedValues.data);

    if (!result.success) {
      return {
        success: false,
        error: {
          message:
            result.error?.message ?? "Unable to update the asset status.",
        },
      };
    }

    revalidateAssetPaths();

    return {
      success: true,
      data: {
        assetId: result.data.assetId,
        status: result.data.status,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "Something went wrong while updating the asset status. Please try again.",
        details: error instanceof Error ? error.message : undefined,
      },
    };
  }
}
