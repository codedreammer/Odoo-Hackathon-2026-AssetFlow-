"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle, Button, Dialog, Input, Select, Spinner } from "@/components/ui";
import { createDepartmentAction, updateDepartmentAction } from "../actions/department-actions";
import { departmentFormSchema, type DepartmentFormValues } from "../schemas/department-schema";
import type { DepartmentListItem, DepartmentMutationActionState, DepartmentOption } from "../types/department";

interface DepartmentFormDialogProps {
  department?: DepartmentListItem | null;
  headOptions: DepartmentOption[];
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  open: boolean;
  parentOptions: DepartmentOption[];
}

function getDefaultValues(
  department?: DepartmentListItem | null,
): DepartmentFormValues {
  return {
    name: department?.name ?? "",
    parent_department_id: department?.parent_department_id ?? "",
    head_id: department?.head_id ?? "",
    status: department?.status ? "true" : "false",
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-600 dark:text-red-400">{message}</p>;
}

export function DepartmentFormDialog({
  department,
  headOptions,
  mode,
  onOpenChange,
  open,
  parentOptions,
}: DepartmentFormDialogProps) {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    mode: "onBlur",
    defaultValues: getDefaultValues(department),
  });

  useEffect(() => {
    reset(getDefaultValues(department));
    clearErrors();
  }, [clearErrors, department, open, reset]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSubmissionError(null);
      clearErrors();
    }

    onOpenChange(nextOpen);
  }

  const availableParentOptions = parentOptions.filter(
    (option) => option.value !== department?.id,
  );

  const onSubmit = handleSubmit(async (values) => {
    setSubmissionError(null);
    clearErrors();

    const result: DepartmentMutationActionState =
      mode === "create"
        ? await createDepartmentAction(values)
        : await updateDepartmentAction({
            id: department?.id,
            ...values,
          });

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [fieldName, messages] of Object.entries(
          result.fieldErrors,
        ) as Array<[keyof DepartmentFormValues | "id", string[] | undefined]>) {
          const message = messages?.[0];

          if (!message || fieldName === "id") {
            continue;
          }

          setError(fieldName, {
            type: "server",
            message,
          });
        }
      }

      setSubmissionError(
        result.error?.message ??
          (mode === "create"
            ? "Unable to create the department."
            : "Unable to update the department."),
      );
      return;
    }

    handleOpenChange(false);
    router.refresh();
  });

  return (
    <Dialog
      description={
        mode === "create"
          ? "Add a department and optionally link it to a parent department or department head."
          : "Update the department name, parent, head, or active status."
      }
      onOpenChange={handleOpenChange}
      open={open}
      size="lg"
      title={mode === "create" ? "Create Department" : "Edit Department"}
    >
      <form className="space-y-5" noValidate onSubmit={onSubmit}>
        {submissionError ? (
          <Alert variant="destructive">
            <AlertTitle>
              {mode === "create" ? "Create failed" : "Update failed"}
            </AlertTitle>
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
            htmlFor={`${mode}-department-name`}
          >
            Department Name
          </label>
          <Input
            id={`${mode}-department-name`}
            placeholder="Enter department name"
            aria-invalid={errors.name ? "true" : "false"}
            disabled={isSubmitting}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              htmlFor={`${mode}-parent-department`}
            >
              Parent Department
            </label>
            <Select
              id={`${mode}-parent-department`}
              aria-invalid={errors.parent_department_id ? "true" : "false"}
              disabled={isSubmitting}
              options={availableParentOptions}
              placeholder="No parent department"
              {...register("parent_department_id")}
            />
            <FieldError message={errors.parent_department_id?.message} />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
              htmlFor={`${mode}-head`}
            >
              Department Head
            </label>
            <Select
              id={`${mode}-head`}
              aria-invalid={errors.head_id ? "true" : "false"}
              disabled={isSubmitting}
              options={headOptions}
              placeholder="No department head"
              {...register("head_id")}
            />
            <FieldError message={errors.head_id?.message} />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
            htmlFor={`${mode}-status`}
          >
            Status
          </label>
          <Select
            id={`${mode}-status`}
            aria-invalid={errors.status ? "true" : "false"}
            disabled={isSubmitting}
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
            {...register("status")}
          />
          <FieldError message={errors.status?.message} />
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner label="Saving department" size="sm" /> : null}
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create Department"
                : "Save Changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
