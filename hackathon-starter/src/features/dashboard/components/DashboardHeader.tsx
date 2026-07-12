"use client";

import type { DashboardOrg } from "../types";
import { SyncIcon, PlusIcon } from "./icons";

interface DashboardHeaderProps {
  org: DashboardOrg;
  onSync?: () => void;
  onRegisterAsset?: () => void;
}

export function DashboardHeader({ org, onSync, onRegisterAsset }: DashboardHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          {org.date} · {org.name}
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
          Hello, {org.user}.
        </h1>
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onSync}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
        >
          <SyncIcon className="h-4 w-4" />
          Sync
        </button>
        <button
          type="button"
          onClick={onRegisterAsset}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          <PlusIcon className="h-4 w-4" />
          Register Asset
        </button>
      </div>
    </div>
  );
}
