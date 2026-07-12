"use client";

import { useState, type ReactNode } from "react";

type FormState = {
  name: string;
  asset_tag: string;
  serial_number: string;
  manufacturer: string;
  model: string;
  condition: string;
  status: string;
  assigned_to: string;
  location: string;
  purchase_date: string;
  value: string;
  is_bookable: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  asset_tag: "",
  serial_number: "",
  manufacturer: "",
  model: "",
  condition: "GOOD",
  status: "AVAILABLE",
  assigned_to: "",
  location: "",
  purchase_date: "",
  value: "",
  is_bookable: false,
};

export function RegisterAssetModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: form.value ? Number(form.value) : null,
          purchase_date: form.purchase_date || null,
        }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#0F1117]">Register New Asset</h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#0F1117]">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Asset name" span2>
            <input
              className="input"
              placeholder="e.g. MacBook Pro 16 inch"
              value={form.name}
              onChange={(event) => set("name", event.target.value)}
            />
          </Field>

          <Field label="Asset ID / tag">
            <input
              className="input"
              placeholder="e.g. AST-016"
              value={form.asset_tag}
              onChange={(event) => set("asset_tag", event.target.value)}
            />
          </Field>

          <Field label="Serial number">
            <input
              className="input"
              placeholder="e.g. MBP-2024-001"
              value={form.serial_number}
              onChange={(event) => set("serial_number", event.target.value)}
            />
          </Field>

          <Field label="Manufacturer">
            <input
              className="input"
              placeholder="e.g. Apple"
              value={form.manufacturer}
              onChange={(event) => set("manufacturer", event.target.value)}
            />
          </Field>

          <Field label="Model">
            <input
              className="input"
              placeholder="e.g. MacBook Pro M3"
              value={form.model}
              onChange={(event) => set("model", event.target.value)}
            />
          </Field>

          <Field label="Condition">
            <select
              className="input"
              value={form.condition}
              onChange={(event) => set("condition", event.target.value)}
            >
              <option value="EXCELLENT">Excellent</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="POOR">Poor</option>
            </select>
          </Field>

          <Field label="Status">
            <select
              className="input"
              value={form.status}
              onChange={(event) => set("status", event.target.value)}
            >
              <option value="AVAILABLE">Available</option>
              <option value="ALLOCATED">Allocated</option>
              <option value="RESERVED">Reserved</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              <option value="LOST">Lost</option>
              <option value="RETIRED">Retired</option>
              <option value="DISPOSED">Disposed</option>
            </select>
          </Field>

          <Field label="Assigned to">
            <input
              className="input"
              placeholder="e.g. Sarah Chen"
              value={form.assigned_to}
              onChange={(event) => set("assigned_to", event.target.value)}
            />
          </Field>

          <Field label="Location">
            <input
              className="input"
              placeholder="e.g. HQ · Floor 2"
              value={form.location}
              onChange={(event) => set("location", event.target.value)}
            />
          </Field>

          <Field label="Purchase date">
            <input
              type="date"
              className="input"
              value={form.purchase_date}
              onChange={(event) => set("purchase_date", event.target.value)}
            />
          </Field>

          <Field label="Value (USD)">
            <input
              type="number"
              className="input"
              placeholder="e.g. 3499"
              value={form.value}
              onChange={(event) => set("value", event.target.value)}
            />
          </Field>

          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="bookable"
              checked={form.is_bookable}
              onChange={(event) => set("is_bookable", event.target.checked)}
              className="h-4 w-4 accent-[#4F46E5]"
            />
            <label htmlFor="bookable" className="text-[13px] text-[#374151]">
              This is a shared / bookable resource
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-[#E4E7EC] py-2 text-[13px] font-medium text-[#374151] hover:bg-[#FAFAFA]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name || loading}
            className="flex-1 rounded-md bg-[#4F46E5] py-2 text-[13px] font-medium text-white hover:bg-[#433BCB] disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Asset"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #e4e7ec;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 13px;
          color: #0f1117;
        }
        .input:focus {
          outline: none;
          border-color: #4f46e5;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  span2,
}: {
  label: string;
  children: ReactNode;
  span2?: boolean;
}) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <label className="mb-1 block text-[12px] font-medium text-[#374151]">{label}</label>
      {children}
    </div>
  );
}
