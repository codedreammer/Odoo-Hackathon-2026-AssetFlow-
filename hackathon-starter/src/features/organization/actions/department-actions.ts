"use server";

import { revalidatePath } from "next/cache";

import {
  departmentCreateSchema,
  departmentToggleSchema,
  departmentUpdateSchema,
  normalizeDepartmentFormValues,
} from "../schemas/department-schema";
import {
  createDepartment,
  toggleDepartmentStatus,
  updateDepartment,
} from "../services/department.service";
import type {
  DepartmentMutationActionState,
  DepartmentToggleActionState,
} from "../types/department";

const DEPARTMENTS_PATH = "/organization/departments";

export async function createDepartmentAction(
  input: unknown,
): Promise<DepartmentMutationActionState> {
  try {
    const parsedValues = departmentCreateSchema.safeParse(input);

    if (!parsedValues.success) {
      return {
        success: false,
        error: {
          message: "Please correct the highlighted fields and try again.",
        },
        fieldErrors: parsedValues.error.flatten().fieldErrors,
      };
    }

    const result = await createDepartment(
      normalizeDepartmentFormValues(parsedValues.data),
    );

    if (!result.success) {
      return {
        success: false,
        error: {
          message: result.error ?? "Unable to create the department.",
        },
      };
    }

    revalidatePath(DEPARTMENTS_PATH);

    return {
      success: true,
      data: {
        departmentId: result.data.departmentId,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "Something went wrong while creating the department. Please try again.",
        details: error instanceof Error ? error.message : undefined,
      },
    };
  }
}

export async function updateDepartmentAction(
  input: unknown,
): Promise<DepartmentMutationActionState> {
  try {
    const parsedValues = departmentUpdateSchema.safeParse(input);

    if (!parsedValues.success) {
      return {
        success: false,
        error: {
          message: "Please correct the highlighted fields and try again.",
        },
        fieldErrors: parsedValues.error.flatten().fieldErrors,
      };
    }

    const result = await updateDepartment({
      id: parsedValues.data.id,
      ...normalizeDepartmentFormValues(parsedValues.data),
    });

    if (!result.success) {
      return {
        success: false,
        error: {
          message: result.error ?? "Unable to update the department.",
        },
      };
    }

    revalidatePath(DEPARTMENTS_PATH);

    return {
      success: true,
      data: {
        departmentId: result.data.departmentId,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "Something went wrong while updating the department. Please try again.",
        details: error instanceof Error ? error.message : undefined,
      },
    };
  }
}

export async function toggleDepartmentStatusAction(
  input: unknown,
): Promise<DepartmentToggleActionState> {
  try {
    const parsedValues = departmentToggleSchema.safeParse(input);

    if (!parsedValues.success) {
      return {
        success: false,
        error: {
          message: "Unable to update the department status.",
          details: parsedValues.error.flatten().formErrors.join(", "),
        },
      };
    }

    const result = await toggleDepartmentStatus(parsedValues.data);

    if (!result.success) {
      return {
        success: false,
        error: {
          message:
            result.error ?? "Unable to update the department status right now.",
        },
      };
    }

    revalidatePath(DEPARTMENTS_PATH);

    return {
      success: true,
      data: {
        departmentId: result.data.departmentId,
        status: result.data.status,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          "Something went wrong while updating the department status. Please try again.",
        details: error instanceof Error ? error.message : undefined,
      },
    };
  }
}
