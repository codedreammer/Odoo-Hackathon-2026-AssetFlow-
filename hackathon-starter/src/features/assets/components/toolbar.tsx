"use client";

import { Plus } from "lucide-react";

import { PageHeader, SearchBar } from "@/components/common";
import { Button, Select } from "@/components/ui";
import { getStatusStyle } from "@/lib/asset-ui";

import {
  ALL_ASSET_CATEGORY_FILTER,
  ALL_ASSET_STATUS_FILTER,
} from "../hooks/use-asset-search";
import {
  ASSET_STATUS_VALUES,
  type AssetOption,
  type AssetStatus,
} from "../types";

interface ToolbarProps {
  categoryFilter: string;
  categoryOptions: AssetOption[];
  filteredAssetsCount: number;
  onAddClick: () => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: AssetStatus | typeof ALL_ASSET_STATUS_FILTER,
  ) => void;
  searchValue: string;
  statusFilter: AssetStatus | typeof ALL_ASSET_STATUS_FILTER;
  totalAssets: number;
}

const statusOptions = [
  { label: "All statuses", value: ALL_ASSET_STATUS_FILTER },
  ...ASSET_STATUS_VALUES.map((status) => ({
    label: getStatusStyle(status).label,
    value: status,
  })),
];

export default function Toolbar({
  categoryFilter,
  categoryOptions,
  filteredAssetsCount,
  onAddClick,
  onCategoryChange,
  onSearchChange,
  onStatusChange,
  searchValue,
  statusFilter,
  totalAssets,
}: ToolbarProps) {
  const allCategoryOptions = [
    { label: "All categories", value: ALL_ASSET_CATEGORY_FILTER },
    ...categoryOptions,
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        actions={
          <Button className="gap-2" onClick={onAddClick}>
            <Plus className="h-4 w-4" />
            Register Asset
          </Button>
        }
        description="Register, search, and manage assets across categories, locations, and lifecycle status."
        eyebrow="Assets"
        title="Asset Registry"
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="w-full lg:max-w-sm">
          <SearchBar
            inputLabel="Search assets"
            placeholder="Search asset name, tag, model..."
            value={searchValue}
            onValueChange={onSearchChange}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
          <Select
            aria-label="Filter assets by status"
            options={statusOptions}
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(
                event.target.value as
                  | AssetStatus
                  | typeof ALL_ASSET_STATUS_FILTER,
              )
            }
          />

          <Select
            aria-label="Filter assets by category"
            options={allCategoryOptions}
            value={categoryFilter}
            onChange={(event) => onCategoryChange(event.target.value)}
          />
        </div>

        <div className="text-sm text-zinc-500 dark:text-zinc-400 lg:ml-auto">
          Showing {filteredAssetsCount} of {totalAssets} assets
        </div>
      </div>
    </div>
  );
}
