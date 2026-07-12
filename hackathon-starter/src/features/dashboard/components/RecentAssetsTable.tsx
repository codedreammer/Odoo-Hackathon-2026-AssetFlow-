import type { AssetStatus, RecentAsset } from "../types";

const statusDot: Record<AssetStatus, string> = {
  active: "bg-emerald-600",
  available: "bg-[#3B63F5]",
  maint: "bg-amber-600",
};

const statusText: Record<AssetStatus, string> = {
  active: "text-emerald-600",
  available: "text-[#3B63F5]",
  maint: "text-amber-600",
};

const TABLE_HEADERS = ["Asset", "Category", "Assigned to", "Status", "Value"];

export function RecentAssetsTable({ assets }: { assets: RecentAsset[] }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-neutral-900">Recently registered</h2>
        <a className="cursor-pointer text-xs font-bold text-[#3B63F5]">View all assets</a>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {TABLE_HEADERS.map((h) => (
              <th
                key={h}
                className="border-b border-neutral-200 pb-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-neutral-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b border-neutral-200 last:border-none">
              <td className="py-3">
                <p className="text-sm font-semibold text-neutral-900">{asset.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-neutral-400">{asset.id}</p>
              </td>
              <td className="py-3 text-sm text-neutral-700">{asset.category}</td>
              <td className="py-3 text-sm text-neutral-700">
                {asset.assignee ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[9.5px] font-bold text-white"
                      style={{ background: asset.avatarColor ?? "#9CA1AC" }}
                    >
                      {asset.initials}
                    </span>
                    {asset.assignee}
                  </span>
                ) : (
                  <span className="text-neutral-400">Unassigned</span>
                )}
              </td>
              <td className="py-3">
                <span className={`flex items-center gap-1.5 text-sm font-medium ${statusText[asset.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDot[asset.status]}`} />
                  {asset.statusLabel}
                </span>
              </td>
              <td className="py-3 font-mono text-sm font-semibold text-neutral-900">{asset.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
