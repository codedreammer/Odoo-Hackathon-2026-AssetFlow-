"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Error } from "@/components/common";

import { toggleAssetStatusAction } from "../actions/asset-actions";
import { useAssetSearch } from "../hooks/use-asset-search";
import {
  getToggledAssetStatus,
  type AssetListItem,
  type AssetManagementData,
} from "../types";
import { AssetFormDialog } from "./asset-form-dialog";
import AssetTable from "./asset-table";
import Toolbar from "./toolbar";

interface AssetScreenProps {
  initialData: AssetManagementData;
}

export function AssetScreen({ initialData }: AssetScreenProps) {
  const router = useRouter();
  const {
    categoryFilter,
    filteredAssets,
    searchValue,
    setCategoryFilter,
    setSearchValue,
    setStatusFilter,
    statusFilter,
  } = useAssetSearch(initialData.assets);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetListItem | null>(null);
  const [pendingAssetId, setPendingAssetId] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  async function handleToggleStatus(asset: AssetListItem) {
    setPageError(null);
    setPendingAssetId(asset.id);

    const result = await toggleAssetStatusAction({
      id: asset.id,
      status: getToggledAssetStatus(asset.status),
    });

    setPendingAssetId(null);

    if (!result.success) {
      setPageError(
        result.error?.message ?? "Unable to update the asset status right now.",
      );
      return;
    }

    router.refresh();
  }

  return (
    <>
      <AssetFormDialog
        categoryOptions={initialData.categoryOptions}
        locationOptions={initialData.locationOptions}
        mode="create"
        onOpenChange={setCreateDialogOpen}
        open={createDialogOpen}
      />

      <AssetFormDialog
        asset={editingAsset}
        categoryOptions={initialData.categoryOptions}
        locationOptions={initialData.locationOptions}
        mode="edit"
        onOpenChange={(open) => {
          if (!open) {
            setEditingAsset(null);
          }
        }}
        open={Boolean(editingAsset)}
      />

      <div className="space-y-6">
        {pageError ? (
          <Error
            className="rounded-xl"
            message={pageError}
            title="Unable to complete that action"
          />
        ) : null}

        <Toolbar
          categoryFilter={categoryFilter}
          categoryOptions={initialData.categoryOptions}
          filteredAssetsCount={filteredAssets.length}
          onAddClick={() => setCreateDialogOpen(true)}
          onCategoryChange={setCategoryFilter}
          onSearchChange={setSearchValue}
          onStatusChange={setStatusFilter}
          searchValue={searchValue}
          statusFilter={statusFilter}
          totalAssets={initialData.assets.length}
        />

        <AssetTable
          assets={filteredAssets}
          onEdit={setEditingAsset}
          onToggleStatus={handleToggleStatus}
          pendingAssetId={pendingAssetId}
          searchValue={searchValue}
        />
      </div>
    </>
  );
}
