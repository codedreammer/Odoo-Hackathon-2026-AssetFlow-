"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BackButton, Error, PageHeader, SearchBar } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { toggleDepartmentStatusAction } from "../actions/department-actions";
import { useDepartmentSearch } from "../hooks/use-department-search";
import type { DepartmentManagementData, DepartmentListItem } from "../types/department";
import { DepartmentFormDialog } from "./department-form-dialog";
import { DepartmentsTable } from "./departments-table";

interface DepartmentsScreenProps {
  initialData: DepartmentManagementData;
}

export function DepartmentsScreen({ initialData }: DepartmentsScreenProps) {
  const router = useRouter();
  const { filteredDepartments, searchValue, setSearchValue } =
    useDepartmentSearch(initialData.departments);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<DepartmentListItem | null>(null);
  const [pendingDepartmentId, setPendingDepartmentId] = useState<string | null>(
    null,
  );
  const [pageError, setPageError] = useState<string | null>(null);

  async function handleToggleStatus(department: DepartmentListItem) {
    setPageError(null);
    setPendingDepartmentId(department.id);

    const result = await toggleDepartmentStatusAction({
      id: department.id,
      status: !department.status,
    });

    setPendingDepartmentId(null);

    if (!result.success) {
      setPageError(
        result.error?.message ??
          "Unable to update the department status right now.",
      );
      return;
    }

    router.refresh();
  }

  return (
    <>
      <DepartmentFormDialog
        headOptions={initialData.headOptions}
        mode="create"
        onOpenChange={setCreateDialogOpen}
        open={createDialogOpen}
        parentOptions={initialData.parentOptions}
      />
      <DepartmentFormDialog
        department={editingDepartment}
        headOptions={initialData.headOptions}
        mode="edit"
        onOpenChange={(open) => {
          if (!open) {
            setEditingDepartment(null);
          }
        }}
        open={Boolean(editingDepartment)}
        parentOptions={initialData.parentOptions}
      />

      <div className="space-y-6">
        <PageHeader
          actions={
            <>
              <BackButton />
              <Button className="ml-4" onClick={() => setCreateDialogOpen(true)}>
                Create Department
              </Button>
            </>
          }
          description="Manage department structure, reporting lines, and active status for your organization."
          eyebrow="Organization"
          title="Department Management"
        />

        {pageError ? (
          <Error
            className="rounded-xl"
            message={pageError}
            title="Unable to complete that action"
          />
        ) : null}

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle>Departments</CardTitle>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Search, create, edit, and activate or deactivate departments.
              </p>
            </div>
            <div className="w-full sm:max-w-sm">
              <SearchBar
                inputLabel="Search departments"
                placeholder="Search by department name..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {initialData.departments.length > 0 ? (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                Showing {filteredDepartments.length} of{" "}
                {initialData.departments.length} departments
              </div>
            ) : null}

            <DepartmentsTable
              departments={filteredDepartments}
              onEdit={setEditingDepartment}
              onToggleStatus={handleToggleStatus}
              pendingDepartmentId={pendingDepartmentId}
              searchValue={searchValue}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
