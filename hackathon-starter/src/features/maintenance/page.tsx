"use client";

import { useState } from "react";
import { Plus, List, Kanban } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { BackButton, PageHeader } from "@/components/common";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Spinner } from "@/components/ui/Spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

import { formatDueDate, getMaintStatusStyle, getPriorityStyle, isOverdue } from "@/lib/maintenance-ui";
import type { MaintenanceRequest } from "./actions";
import { NewRequestModal } from "./components/NewRequestModal";

const STATUS_COLUMNS = ["OPEN", "PENDING_APPROVAL", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

interface MaintenancePageProps {
  initialRequests: MaintenanceRequest[];
}

export function MaintenancePage({ initialRequests }: MaintenancePageProps) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [view, setView] = useState<"list" | "board">("list");
  const [showModal, setShowModal] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  const refresh = async () => {
    const res = await fetch("/api/maintenance");
    if (res.ok) setRequests(await res.json());
  };

  const openCount = requests.filter((r) => !["RESOLVED", "CLOSED"].includes(r.status.toUpperCase())).length;
  const overdueCount = requests.filter((r) => isOverdue(r.due_date, r.status)).length;
  const monthSpend = requests
    .filter((r) => {
      const createdAt = new Date(r.created_at);
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    })
    .reduce((sum, r) => sum + (r.cost ?? 0), 0);

  const chartData = requests.reduce((acc: Record<string, number>, r) => {
    const month = new Date(r.created_at).toLocaleString("en-US", { month: "short" });
    acc[month] = (acc[month] ?? 0) + (r.cost ?? 0);
    return acc;
  }, {});

  const chartArray = Object.entries(chartData).map(([month, cost]) => ({ month, cost }));

  const approve = async (id: string) => {
    setBusyId(id);
    setPageError(null);
    try {
      const res = await fetch(`/api/maintenance/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setPageError(err.error ?? "Failed to approve");
        return;
      }
      await refresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {pageError && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertTitle>Action Failed</AlertTitle>
          <AlertDescription>{pageError}</AlertDescription>
        </Alert>
      )}

      <PageHeader
        actions={
          <>
            <BackButton />
            <div className="flex items-center gap-2 ml-4">
              <div className="flex rounded-md border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-950">
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-md px-3 py-1.5 text-sm font-medium"
                  onClick={() => setView("list")}
                >
                  <List className="h-4 w-4 mr-1.5" />
                  List
                </Button>
                <Button
                  variant={view === "board" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-md px-3 py-1.5 text-sm font-medium"
                  onClick={() => setView("board")}
                >
                  <Kanban className="h-4 w-4 mr-1.5" />
                  Board
                </Button>
              </div>
              <Button className="gap-2" onClick={() => setShowModal(true)}>
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </div>
          </>
        }
        description={`${openCount} open requests · ${overdueCount} overdue · $${monthSpend.toLocaleString()} spend this month`}
        title="Maintenance"
      />

      <Dialog
        open={showModal}
        onOpenChange={setShowModal}
        title="New Maintenance Request"
        description="Create a new maintenance request for an asset."
        size="lg"
      >
        <NewRequestModal onClose={() => setShowModal(false)} onSuccess={refresh} open={showModal} />
      </Dialog>

      {view === "list" ? (
        <MaintenanceListView requests={requests} onApprove={approve} busyId={busyId} />
      ) : (
        <MaintenanceBoardView requests={requests} />
      )}

      <Card className="overflow-hidden">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 mb-4">Maintenance spend</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Monthly cost in USD</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartArray}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Line type="monotone" dataKey="cost" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function MaintenanceListView({
  requests,
  onApprove,
  busyId,
}: {
  requests: MaintenanceRequest[];
  onApprove: (id: string) => void;
  busyId: string | null;
}) {
  if (requests.length === 0) {
    return (
      <Card className="rounded-2xl p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 text-zinc-500 dark:text-zinc-400">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50 mb-1">No maintenance requests</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">Get started by creating your first maintenance request.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">ID</TableHead>
            <TableHead>Asset</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Due</TableHead>
            <TableHead className="w-[100px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => {
            const status = getMaintStatusStyle(request.status);
            const priority = getPriorityStyle(request.priority);
            const overdue = isOverdue(request.due_date, request.status);
            return (
              <TableRow key={request.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <TableCell className="font-mono text-xs text-zinc-500 dark:text-zinc-400">{request.id.slice(0, 8)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{request.assets?.name ?? "—"}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{request.assets?.asset_tag ?? ""}</p>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{request.type ?? "—"}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priority.bg} ${priority.text}`}>
                    {priority.label}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{request.raised_by_profile?.full_name ?? "—"}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{request.assigned_to_profile?.full_name ?? "—"}</TableCell>
                <TableCell className={overdue ? "text-red-600 dark:text-red-400" : "text-zinc-600 dark:text-zinc-300"}>
                  {formatDueDate(request.due_date)}
                </TableCell>
                <TableCell>
                  {request.status.toUpperCase() === "PENDING_APPROVAL" && (
                    <Button
                      size="sm"
                      variant="default"
                      disabled={busyId === request.id}
                      onClick={() => onApprove(request.id)}
                    >
                      {busyId === request.id ? (
                        <>
                          <Spinner size="sm" className="mr-1" />
                          Approving...
                        </>
                      ) : (
                        "Approve"
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}

function MaintenanceBoardView({ requests }: { requests: MaintenanceRequest[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {STATUS_COLUMNS.map((column) => {
        const style = getMaintStatusStyle(column);
        const items = requests.filter((r) => r.status.toUpperCase() === column);
        return (
          <Card key={column} className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
                  {style.label}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{items.length}</span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {items.map((request) => {
                const priority = getPriorityStyle(request.priority);
                return (
                  <div key={request.id} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">
                    <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">{request.assets?.name ?? "Untitled"}</p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{request.type}</p>
                    <p className={`mt-2 text-xs font-medium ${priority.bg} ${priority.text} inline-flex items-center rounded-full px-2 py-0.5`}>
                      {priority.label}
                    </p>
                  </div>
                );
              })}
              {items.length === 0 && (
                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 py-4">No requests</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}