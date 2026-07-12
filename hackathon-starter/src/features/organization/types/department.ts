import type { ActionResponse } from "@/types";

import type { DepartmentFormValues } from "../schemas/department-schema";

export interface DepartmentRecord {
  id: string;
  name: string;
  parent_department_id: string | null;
  head_id: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface DepartmentHeadRecord {
  id: string;
  full_name: string;
  email: string;
  active: boolean;
}

export interface DepartmentListItem extends DepartmentRecord {
  head_email: string | null;
  head_name: string | null;
  parent_department_name: string | null;
}

export interface DepartmentOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface DepartmentManagementData {
  departments: DepartmentListItem[];
  headOptions: DepartmentOption[];
  parentOptions: DepartmentOption[];
}

export interface DepartmentMutationInput {
  name: string;
  parent_department_id: string | null;
  head_id: string | null;
  status: boolean;
}

export interface UpdateDepartmentInput extends DepartmentMutationInput {
  id: string;
}

export interface ToggleDepartmentStatusInput {
  id: string;
  status: boolean;
}

type DepartmentFieldErrorKey = keyof DepartmentFormValues | "id";

export type DepartmentFieldErrors = Partial<
  Record<DepartmentFieldErrorKey, string[] | undefined>
>;

export type DepartmentMutationActionState = ActionResponse<{
  departmentId: string;
}> & {
  fieldErrors?: DepartmentFieldErrors;
};

export type DepartmentToggleActionState = ActionResponse<{
  departmentId: string;
  status: boolean;
}>;
