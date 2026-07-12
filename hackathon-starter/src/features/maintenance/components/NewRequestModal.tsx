"use client";

import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Spinner } from "@/components/ui/Spinner";

type Asset = { id: string; name: string; asset_tag: string };

interface NewRequestModalProps {
  onClose: () => void;
  onSuccess: () => void;
  open: boolean;
}

export function NewRequestModal({ onClose, onSuccess, open }: NewRequestModalProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    asset_id: "",
    type: "Hardware Repair",
    priority: "Medium",
    due_date: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/assets")
      .then((r) => r.json())
      .then((data) => setAssets(Array.isArray(data) ? data : []))
      .catch(() => setAssets([]));
  }, []);

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error ?? "Failed to create request");
        return;
      }

      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="New Maintenance Request"
      description="Create a new maintenance request for an asset."
      size="md"
    >
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Failed to create request</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Asset</label>
          <Select
            options={[
              { label: "Select an asset", value: "" },
              ...assets.map((asset) => ({ label: `${asset.name} (${asset.asset_tag})`, value: asset.id })),
            ]}
            value={form.asset_id}
            onChange={(e) => setField("asset_id", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Type</label>
          <Input
            placeholder="e.g. Hardware Repair"
            value={form.type}
            onChange={(e) => setField("type", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Priority</label>
          <Select
            options={[
              { label: "Low", value: "Low" },
              { label: "Medium", value: "Medium" },
              { label: "High", value: "High" },
              { label: "Critical", value: "Critical" },
            ]}
            value={form.priority}
            onChange={(e) => setField("priority", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Due date</label>
          <Input
            type="date"
            value={form.due_date}
            onChange={(e) => setField("due_date", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Description</label>
          <Textarea
            rows={3}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!form.asset_id || loading}>
            {loading ? <Spinner size="sm" className="mr-2" /> : null}
            {loading ? "Creating..." : "Create Request"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}