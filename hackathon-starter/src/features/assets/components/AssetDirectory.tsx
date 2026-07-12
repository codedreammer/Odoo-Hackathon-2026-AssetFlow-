"use client";

import { useState } from "react";
import { RegisterAssetModal } from "./RegisterAssetModal";

export function AssetDirectory({ assets: initialAssets }: { assets: any[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [showModal, setShowModal] = useState(false);

  const refresh = async () => {
    const res = await fetch("/api/assets");
    const data = await res.json();
    setAssets(data);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      AVAILABLE: "bg-[#F0FDF4] text-[#166534]",
      ALLOCATED: "bg-[#EFF6FF] text-[#1D4ED8]",
      UNDER_MAINTENANCE: "bg-[#FFFBEB] text-[#92400E]",
      LOST: "bg-[#FEF2F2] text-[#991B1B]",
      RESERVED: "bg-[#F5F3FF] text-[#5B21B6]",
      RETIRED: "bg-[#F9FAFB] text-[#374151]",
    };
    return (
      <span className={`${styles[status] ?? "bg-gray-100 text-gray-700"} px-2.5 py-1 rounded-full text-[12px] font-medium`}>
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {showModal && (
        <RegisterAssetModal onClose={() => setShowModal(false)} onSuccess={refresh} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#0F1117]">Asset Directory</h1>
          <p className="text-[13px] text-[#6B7280] mt-1">{assets.length} total assets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#4F46E5] text-white px-4 py-2 rounded-md text-[13px] font-medium hover:bg-[#4338CA] transition-colors"
        >
          + Register Asset
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#E4E7EC] overflow-hidden">
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-[#6B7280]">No assets registered yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-[#4F46E5] text-white px-4 py-2 rounded-md text-[13px]"
            >
              Register your first asset
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E4E7EC] bg-[#FAFAFA] text-[12px] text-[#6B7280]">
                <th className="px-5 py-3">ASSET TAG</th>
                <th className="px-5 py-3">NAME</th>
                <th className="px-5 py-3">CATEGORY</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3">CONDITION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F5] text-[13px]">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-[#F8F9FB]">
                  <td className="px-5 py-3.5 font-mono text-[#4F46E5]">{asset.asset_tag}</td>
                  <td className="px-5 py-3.5 font-medium">{asset.name}</td>
                  <td className="px-5 py-3.5 text-[#6B7280]">{asset.asset_categories?.name ?? "-"}</td>
                  <td className="px-5 py-3.5">{getStatusBadge(asset.status)}</td>
                  <td className="px-5 py-3.5 text-[#6B7280]">{asset.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
