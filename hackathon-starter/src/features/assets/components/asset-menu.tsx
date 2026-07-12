"use client";

import { CheckCircle, Edit, MoreHorizontal, XCircle } from "lucide-react";

import { Dropdown } from "@/components/ui";
import {
  getToggledAssetStatus,
  isInactiveAssetStatus,
  type AssetListItem,
} from "../types";

interface AssetMenuProps {
  asset: AssetListItem;
  disabled?: boolean;
  onEdit: (asset: AssetListItem) => void;
  onToggleStatus: (asset: AssetListItem) => void;
}

export default function AssetMenu({
  asset,
  disabled = false,
  onEdit,
  onToggleStatus,
}: AssetMenuProps) {
  const nextStatus = getToggledAssetStatus(asset.status);
  const activating = !isInactiveAssetStatus(nextStatus);

  const menuItems = [
    {
      label: (
        <span className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Asset
        </span>
      ),
      onSelect: () => onEdit(asset),
      disabled,
    },
    {
      label: (
        <span className="flex items-center gap-2">
          {activating ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              Activate
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              Deactivate
            </>
          )}
        </span>
      ),
      onSelect: () => onToggleStatus(asset),
      destructive: !activating,
      disabled,
    },
  ];

  return (
    <Dropdown
      align="end"
      items={menuItems}
      label={<MoreHorizontal className="h-5 w-5" />}
      triggerClassName="h-8 w-8 p-0"
    />
  );
}
