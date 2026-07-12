"use client";

import { NoData } from "@/components/common";
import { Badge, Card } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatCurrency, getStatusStyle } from "@/lib/asset-ui";
import { formatDate } from "@/lib/format-date";

import type { AssetListItem } from "../types";
import AssetMenu from "./asset-menu";

interface AssetTableProps {
  assets: AssetListItem[];
  onEdit: (asset: AssetListItem) => void;
  onToggleStatus: (asset: AssetListItem) => void;
  pendingAssetId: string | null;
  searchValue: string;
}

function getStatusVariant(status: AssetListItem["status"]) {
  switch (status) {
    case "AVAILABLE":
      return "default";
    case "ALLOCATED":
    case "RESERVED":
    case "UNDER_MAINTENANCE":
      return "secondary";
    case "LOST":
      return "destructive";
    case "RETIRED":
    case "DISPOSED":
    default:
      return "outline";
  }
}

export default function AssetTable({
  assets,
  onEdit,
  onToggleStatus,
  pendingAssetId,
  searchValue,
}: AssetTableProps) {
  if (assets.length === 0) {
    return (
      <Card className="rounded-2xl p-6">
        <NoData
          description={
            searchValue
              ? `No assets match "${searchValue}".`
              : "Register your first asset to start tracking inventory."
          }
          title={
            searchValue ? "No matching assets" : "No assets registered yet"
          }
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[280px]">Asset</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Bookable</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => {
            const statusStyle = getStatusStyle(asset.status);

            return (
              <TableRow key={asset.id} className="hover:bg-zinc-50">
                <TableCell>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {asset.name}
                    </h3>
                    <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
                      {asset.asset_tag}
                    </p>
                    {asset.serial_number ? (
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        Serial: {asset.serial_number}
                      </p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {asset.category_name ?? "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">
                  {asset.location_name ?? "Unassigned"}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {asset.model ?? "No model"}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {asset.manufacturer ?? "No manufacturer"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(asset.status)}>
                    {statusStyle.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {formatCurrency(asset.acquisition_cost)}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {formatDate(asset.acquisition_date ?? asset.created_at)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={asset.is_bookable ? "default" : "outline"}>
                    {asset.is_bookable ? "Bookable" : "Not Bookable"}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">
                  {formatDate(asset.updated_at)}
                </TableCell>
                <TableCell>
                  <AssetMenu
                    asset={asset}
                    disabled={pendingAssetId === asset.id}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
