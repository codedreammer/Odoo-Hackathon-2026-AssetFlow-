"use client";

import { useState } from "react";

export function RegisterAssetModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    serial_number: "",
    condition: "GOOD",
    manufacturer: "",
    model: "",
    is_bookable: false,
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      onSuccess();
      onClose();
    } catch {
      alert("Failed to register asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[16px] font-semibold text-[#0F1117]">Register New Asset</h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#0F1117] text-xl">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">Asset Name *</label>
            <input
              className="w-full border border-[#E4E7EC] rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF]"
              placeholder="e.g. MacBook Pro 16 inch"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">Serial Number</label>
            <input
              className="w-full border border-[#E4E7EC] rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF]"
              placeholder="e.g. MBP-2024-001"
              value={form.serial_number}
              onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">Manufacturer</label>
            <input
              className="w-full border border-[#E4E7EC] rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF]"
              placeholder="e.g. Apple"
              value={form.manufacturer}
              onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">Model</label>
            <input
              className="w-full border border-[#E4E7EC] rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF]"
              placeholder="e.g. MacBook Pro M3"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#374151] mb-1">Condition</label>
            <select
              className="w-full border border-[#E4E7EC] rounded-md px-3 py-2 text-[13px] outline-none focus:border-[#4F46E5]"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
            >
              <option value="EXCELLENT">Excellent</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="POOR">Poor</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="bookable"
              checked={form.is_bookable}
              onChange={(e) => setForm({ ...form, is_bookable: e.target.checked })}
              className="w-4 h-4 accent-[#4F46E5]"
            />
            <label htmlFor="bookable" className="text-[13px] text-[#374151]">
              This is a shared/bookable resource
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-[#E4E7EC] text-[#374151] py-2 rounded-md text-[13px] hover:bg-[#F9FAFB] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name || loading}
            className="flex-1 bg-[#4F46E5] text-white py-2 rounded-md text-[13px] font-medium hover:bg-[#4338CA] transition-colors disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Asset"}
          </button>
        </div>
      </div>
    </div>
  );
}
