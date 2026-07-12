"use client";

import { useDeferredValue, useState } from "react";

import type { AssetListItem, AssetStatus } from "../types";

export const ALL_ASSET_STATUS_FILTER = "ALL_STATUSES";
export const ALL_ASSET_CATEGORY_FILTER = "ALL_CATEGORIES";

export function useAssetSearch(assets: AssetListItem[]) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    AssetStatus | typeof ALL_ASSET_STATUS_FILTER
  >(ALL_ASSET_STATUS_FILTER);
  const [categoryFilter, setCategoryFilter] = useState(
    ALL_ASSET_CATEGORY_FILTER,
  );
  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const filteredAssets = assets.filter((asset) => {
    const matchesStatus =
      statusFilter === ALL_ASSET_STATUS_FILTER || asset.status === statusFilter;

    const matchesCategory =
      categoryFilter === ALL_ASSET_CATEGORY_FILTER ||
      asset.category_id === categoryFilter;

    const matchesSearch =
      normalizedSearchValue.length === 0 ||
      asset.name.toLowerCase().includes(normalizedSearchValue) ||
      asset.asset_tag.toLowerCase().includes(normalizedSearchValue) ||
      (asset.serial_number ?? "").toLowerCase().includes(normalizedSearchValue) ||
      (asset.manufacturer ?? "").toLowerCase().includes(normalizedSearchValue) ||
      (asset.model ?? "").toLowerCase().includes(normalizedSearchValue) ||
      (asset.category_name ?? "").toLowerCase().includes(normalizedSearchValue) ||
      (asset.location_name ?? "").toLowerCase().includes(normalizedSearchValue);

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return {
    categoryFilter,
    filteredAssets,
    searchValue,
    setCategoryFilter,
    setSearchValue,
    setStatusFilter,
    statusFilter,
  };
}
