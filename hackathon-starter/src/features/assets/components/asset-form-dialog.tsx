"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  Input,
  Select,
  Spinner,
} from "@/components/ui";
import { getStatusStyle } from "@/lib/asset-ui";

import {
  createAssetAction,
  updateAssetAction,
} from "../actions/asset-actions";
import { assetFormSchema, type AssetFormValues } from "../schemas/asset-schema";
import {
  ASSET_STATUS_VALUES,
  type AssetListItem,
  type AssetMutationActionState,
  type AssetOption,
} from "../types";

interface AssetFormDialogProps {
  asset?: AssetListItem | null;
  categoryOptions: AssetOption[];
  locationOptions: AssetOption[];
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const statusOptions = ASSET_STATUS_VALUES.map((status) => ({
  label: getStatusStyle(status).label,
  value: status,
}));

function getDefaultValues(asset?: AssetListItem | null): AssetFormValues {
  return {
    assetTag: asset?.asset_tag ?? "",
    name: asset?.name ?? "",
    categoryId: asset?.category_id ?? "",
    locationId: asset?.location_id ?? "",
    manufacturer: asset?.manufacturer ?? "",
    model: asset?.model ?? "",
    serialNumber: asset?.serial_number ?? "",
    acquisitionDate: asset?.acquisition_date ?? "",
    acquisitionCost:
      asset?.acquisition_cost == null ? "" : String(asset.acquisition_cost),
    warrantyExpiry: asset?.warranty_expiry ?? "",
    status: asset?.status ?? "AVAILABLE",
    isBookable: asset?.is_bookable ?? false,
    photoUrl: asset?.photo_url ?? "",
    documentUrl: asset?.document_url ?? "",
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-600 dark:text-red-400">{message}</p>;
}

export function AssetFormDialog({
  asset,
  categoryOptions,
  locationOptions,
  mode,
  onOpenChange,
  open,
}: AssetFormDialogProps) {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    mode: "onBlur",
    defaultValues: getDefaultValues(asset),
  });

  useEffect(() => {
    reset(getDefaultValues(asset));
    clearErrors();
  }, [asset, clearErrors, open, reset]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSubmissionError(null);
      clearErrors();
    }

    onOpenChange(nextOpen);
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmissionError(null);
    clearErrors();

    const result: AssetMutationActionState =
      mode === "create"
        ? await createAssetAction(values)
        : await updateAssetAction({
            id: asset?.id,
            ...values,
          });

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [fieldName, messages] of Object.entries(
          result.fieldErrors,
        ) as Array<[keyof AssetFormValues | "id", string[] | undefined]>) {
          const message = messages?.[0];

          if (!message || fieldName === "id") {
            continue;
          }

          setError(fieldName, {
            type: "server",
            message,
          });
        }
      }

      setSubmissionError(
        result.error?.message ??
          (mode === "create"
            ? "Unable to register the asset."
            : "Unable to update the asset."),
      );
      return;
    }

    handleOpenChange(false);
    router.refresh();
  });

  return (
    <Dialog
      description={
        mode === "create"
          ? "Register a new asset with its category, location, lifecycle status, and reference links."
          : "Update the asset details, lifecycle status, and resource settings."
      }
      onOpenChange={handleOpenChange}
      open={open}
      size="xl"
      title={mode === "create" ? "Register Asset" : "Edit Asset"}
    >
      <form className="space-y-5" noValidate onSubmit={onSubmit}>
        {submissionError ? (
          <Alert variant="destructive">
            <AlertTitle>
              {mode === "create" ? "Registration failed" : "Update failed"}
            </AlertTitle>
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-asset-tag`}
              >
                Asset Tag
              </label>
              <Input
                id={`${mode}-asset-tag`}
                placeholder="e.g. AST-001"
                aria-invalid={errors.assetTag ? "true" : "false"}
                disabled={isSubmitting}
                {...register("assetTag")}
              />
              <FieldError message={errors.assetTag?.message} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-asset-name`}
              >
                Asset Name
              </label>
              <Input
                id={`${mode}-asset-name`}
                placeholder="e.g. MacBook Pro 16"
                aria-invalid={errors.name ? "true" : "false"}
                disabled={isSubmitting}
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-category`}
              >
                Category
              </label>
              <Select
                id={`${mode}-category`}
                aria-invalid={errors.categoryId ? "true" : "false"}
                disabled={isSubmitting}
                options={categoryOptions}
                placeholder="Select category"
                {...register("categoryId")}
              />
              <FieldError message={errors.categoryId?.message} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-location`}
              >
                Location
              </label>
              <Select
                id={`${mode}-location`}
                aria-invalid={errors.locationId ? "true" : "false"}
                disabled={isSubmitting}
                options={locationOptions}
                placeholder="No location"
                {...register("locationId")}
              />
              <FieldError message={errors.locationId?.message} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-manufacturer`}
              >
                Manufacturer
              </label>
              <Input
                id={`${mode}-manufacturer`}
                placeholder="e.g. Apple"
                aria-invalid={errors.manufacturer ? "true" : "false"}
                disabled={isSubmitting}
                {...register("manufacturer")}
              />
              <FieldError message={errors.manufacturer?.message} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-model`}
              >
                Model
              </label>
              <Input
                id={`${mode}-model`}
                placeholder="e.g. M3 Pro"
                aria-invalid={errors.model ? "true" : "false"}
                disabled={isSubmitting}
                {...register("model")}
              />
              <FieldError message={errors.model?.message} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-serial-number`}
              >
                Serial Number
              </label>
              <Input
                id={`${mode}-serial-number`}
                placeholder="e.g. SN-2026-1001"
                aria-invalid={errors.serialNumber ? "true" : "false"}
                disabled={isSubmitting}
                {...register("serialNumber")}
              />
              <FieldError message={errors.serialNumber?.message} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-status`}
              >
                Status
              </label>
              <Select
                id={`${mode}-status`}
                aria-invalid={errors.status ? "true" : "false"}
                disabled={isSubmitting}
                options={statusOptions}
                {...register("status")}
              />
              <FieldError message={errors.status?.message} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-acquisition-date`}
              >
                Acquisition Date
              </label>
              <Input
                id={`${mode}-acquisition-date`}
                type="date"
                aria-invalid={errors.acquisitionDate ? "true" : "false"}
                disabled={isSubmitting}
                {...register("acquisitionDate")}
              />
              <FieldError message={errors.acquisitionDate?.message} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-acquisition-cost`}
              >
                Acquisition Cost
              </label>
              <Input
                id={`${mode}-acquisition-cost`}
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 2499.99"
                aria-invalid={errors.acquisitionCost ? "true" : "false"}
                disabled={isSubmitting}
                {...register("acquisitionCost")}
              />
              <FieldError message={errors.acquisitionCost?.message} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-warranty-expiry`}
              >
                Warranty Expiry
              </label>
              <Input
                id={`${mode}-warranty-expiry`}
                type="date"
                aria-invalid={errors.warrantyExpiry ? "true" : "false"}
                disabled={isSubmitting}
                {...register("warrantyExpiry")}
              />
              <FieldError message={errors.warrantyExpiry?.message} />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-start gap-3">
              <input
                id={`${mode}-bookable`}
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:ring-zinc-50"
                disabled={isSubmitting}
                {...register("isBookable")}
              />
              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                  htmlFor={`${mode}-bookable`}
                >
                  Shared / Bookable Asset
                </label>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Enable this if the asset can be reserved as a shared resource.
                </p>
              </div>
            </div>
            <FieldError message={errors.isBookable?.message} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-photo-url`}
              >
                Photo URL
              </label>
              <Input
                id={`${mode}-photo-url`}
                type="url"
                placeholder="https://example.com/photo.jpg"
                aria-invalid={errors.photoUrl ? "true" : "false"}
                disabled={isSubmitting}
                {...register("photoUrl")}
              />
              <FieldError message={errors.photoUrl?.message} />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
                htmlFor={`${mode}-document-url`}
              >
                Document URL
              </label>
              <Input
                id={`${mode}-document-url`}
                type="url"
                placeholder="https://example.com/document.pdf"
                aria-invalid={errors.documentUrl ? "true" : "false"}
                disabled={isSubmitting}
                {...register("documentUrl")}
              />
              <FieldError message={errors.documentUrl?.message} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner label="Saving asset" size="sm" /> : null}
            {isSubmitting
              ? mode === "create"
                ? "Registering..."
                : "Saving..."
              : mode === "create"
                ? "Register Asset"
                : "Save Changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
