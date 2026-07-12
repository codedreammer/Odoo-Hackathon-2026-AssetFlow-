"use client";

import { useMemo, useState } from "react";
import { Download, Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { type Asset } from "@/features/assets/actions";
import { RegisterAssetModal } from "./RegisterAssetModal";
import { formatCurrency, formatDate, getAvatarStyle, getInitials, getStatusStyle } from "@/lib/asset-ui";

const STATUS_OPTIONS = [
  "All statuses",
  "AVAILABLE",
  "ALLOCATED",
  "RESERVED",
  "UNDER_MAINTENANCE",
  "LOST",
  "RETIRED",
  "DISPOSED",
];

export function AssetRegistry({ assets: initialAssets }: { assets: Asset[] }) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((asset) => asset.asset_categories?.name && set.add(asset.asset_categories.name));
    return ["All categories", ...Array.from(set)];
  }, [assets]);

  const refresh = async () => {
    const res = await fetch("/api/assets");
    const data = await res.json();
    setAssets(data);
  };

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return assets.filter((asset) => {
      const matchesQuery =
        !term ||
        asset.name.toLowerCase().includes(term) ||
        asset.asset_tag.toLowerCase().includes(term) ||
        (asset.assigned_to ?? "").toLowerCase().includes(term) ||
        (asset.location ?? "").toLowerCase().includes(term);
      const matchesStatus = statusFilter === "All statuses" || asset.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All categories" || asset.asset_categories?.name === categoryFilter;
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [assets, categoryFilter, query, statusFilter]);

  const exportCsv = () => {
    const header = [
      "Asset ID",
      "Name",
      "Category",
      "Status",
      "Assigned To",
      "Location",
      "Purchase Date",
      "Value",
    ];
    const rows = filtered.map((asset) => [
      asset.asset_tag,
      asset.name,
      asset.asset_categories?.name ?? "",
      asset.status,
      asset.assigned_to ?? "",
      asset.location ?? "",
      asset.purchase_date ?? "",
      asset.value ?? "",
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asset-registry-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const lastSynced = assets[0]?.created_at
    ? formatDate(assets[0].created_at)
    : formatDate(new Date().toISOString());

  return (
    <div className="space-y-5">
      {showModal && (
        <RegisterAssetModal onClose={() => setShowModal(false)} onSuccess={refresh} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#0F1117]">Asset Registry</h1>
          <p className="mt-1 text-[13px] text-[#6B7280]">
            {assets.length} assets · synced {lastSynced}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-md border border-[#E4E7EC] px-3.5 py-2 text-[13px] font-medium text-[#374151] hover:bg-[#FAFAFA]"
          >
            <Download size={14} />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-md bg-[#0F1117] px-3.5 py-2 text-[13px] font-medium text-white hover:bg-[#1F2229]"
          >
            <Plus size={14} />
            Register Asset
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-[#E4E7EC] bg-white px-3 py-2">
          <Search size={14} className="text-[#9CA3AF]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by name, ID, person..."
            className="w-full text-[13px] text-[#0F1117] placeholder:text-[#9CA3AF] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-md border border-[#E4E7EC] bg-white px-3 py-2 text-[13px] text-[#374151] focus:outline-none"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === "All statuses" ? status : getStatusStyle(status).label}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-md border border-[#E4E7EC] bg-white px-3 py-2 text-[13px] text-[#374151] focus:outline-none"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <span className="ml-auto text-[13px] text-[#6B7280]">{filtered.length} results</span>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-[#6B7280]">No assets match your filters.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 rounded-md bg-[#0F1117] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#1F2229]"
            >
              Register your first asset
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E4E7EC] bg-[#FAFAFA] text-[11px] uppercase tracking-wide text-[#9CA3AF]">
                <th className="px-5 py-3">Asset ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Assigned To</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Purchase Date</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F5] text-[13px] text-[#0F1117]">
              {filtered.map((asset) => {
                const avatarStyle = getAvatarStyle(asset.assigned_to ?? asset.name);
                const statusStyle = getStatusStyle(asset.status);
                return (
                  <tr key={asset.id} className="hover:bg-[#F8F9FB]">
                    <td className="px-5 py-3.5 font-mono text-[#4F46E5]">{asset.asset_tag || "—"}</td>
                    <td className="px-5 py-3.5 font-medium">{asset.name}</td>
                    <td className="px-5 py-3.5 text-[#6B7280]">{asset.asset_categories?.name ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${statusStyle.dot}`} />
                        <span>{statusStyle.label}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full ${avatarStyle.bg} ${avatarStyle.text} text-[11px] font-semibold`}
                        >
                          {asset.assigned_to ? getInitials(asset.assigned_to) : "—"}
                        </div>
                        <span className="text-[#374151]">{asset.assigned_to || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#6B7280]">{asset.location || "—"}</td>
                    <td className="px-5 py-3.5 text-[#6B7280]">{formatDate(asset.purchase_date)}</td>
                    <td className="px-5 py-3.5 font-medium">{formatCurrency(asset.value)}</td>
                    <td className="px-5 py-3.5">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenMenuId((current) => (current === asset.id ? null : asset.id))
                          }
                          className="rounded-md p-1 text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#0F1117]"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {openMenuId === asset.id && (
                          <div className="absolute right-0 top-8 z-10 w-32 rounded-md border border-[#E4E7EC] bg-white p-2 shadow-lg">
                            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] text-[#374151] hover:bg-[#FAFAFA]">
                              <Eye size={13} /> View
                            </button>
                            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] text-[#374151] hover:bg-[#FAFAFA]">
                              <Pencil size={13} /> Edit
                            </button>
                            <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] text-[#374151] hover:bg-[#FAFAFA]">
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
