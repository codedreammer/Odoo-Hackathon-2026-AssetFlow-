"use client";

import { formatDate } from "@/lib/format-date";
import { Badge, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { NoData } from "@/components/common";

import type { DepartmentListItem } from "../types/department";

interface DepartmentsTableProps {
  departments: DepartmentListItem[];
  onEdit: (department: DepartmentListItem) => void;
  onToggleStatus: (department: DepartmentListItem) => Promise<void>;
  pendingDepartmentId: string | null;
  searchValue: string;
}

function DepartmentsTable({
  departments,
  onEdit,
  onToggleStatus,
  pendingDepartmentId,
  searchValue,
}: DepartmentsTableProps) {
  if (departments.length === 0) {
    return (
      <NoData
        description={
          searchValue
            ? `No departments match "${searchValue}".`
            : "Create your first department to start organizing teams and reporting lines."
        }
        title={
          searchValue ? "No matching departments" : "No departments created yet"
        }
      />
    );
  }

  return (
    <Table containerClassName="rounded-xl border border-zinc-200 dark:border-zinc-800">
      <TableHeader>
        <TableRow>
          <TableHead>Department</TableHead>
          <TableHead>Parent</TableHead>
          <TableHead>Department Head</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="w-[180px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((department) => {
          const isPending = pendingDepartmentId === department.id;

          return (
            <TableRow key={department.id}>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium text-zinc-950 dark:text-zinc-50">
                    {department.name}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-300">
                {department.parent_department_name ?? "None"}
              </TableCell>
              <TableCell>
                {department.head_name ? (
                  <div className="space-y-1">
                    <p className="font-medium text-zinc-950 dark:text-zinc-50">
                      {department.head_name}
                    </p>
                    {department.head_email ? (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {department.head_email}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-zinc-600 dark:text-zinc-300">None</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={department.status ? "default" : "secondary"}>
                  {department.status ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-300">
                {formatDate(department.updated_at)}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(department)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={department.status ? "secondary" : "default"}
                    disabled={isPending}
                    onClick={() => void onToggleStatus(department)}
                  >
                    {isPending
                      ? "Updating..."
                      : department.status
                        ? "Deactivate"
                        : "Activate"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export { DepartmentsTable };
