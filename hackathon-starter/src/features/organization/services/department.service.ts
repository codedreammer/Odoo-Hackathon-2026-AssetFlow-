import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { DepartmentManagementData, DepartmentMutationInput, DepartmentRecord, DepartmentHeadRecord, DepartmentListItem, ToggleDepartmentStatusInput, UpdateDepartmentInput } from "../types/department";

function normalizeDepartmentName(name: string) {
  return name.trim().toLowerCase();
}

function formatDepartmentError(message: string) {
  return {
    success: false as const,
    error: message,
  };
}

function isDuplicateKeyError(error: { code?: string | null }) {
  return error.code === "23505";
}

async function validateDuplicateName(
  excludeDepartmentId: string | null,
  name: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("id, name")
    .order("name");

  if (error) {
    return formatDepartmentError(
      "Unable to validate the department name right now.",
    );
  }

  const normalizedName = normalizeDepartmentName(name);
  const duplicate = (data as Pick<DepartmentRecord, "id" | "name">[]).find(
    (department) =>
      department.id !== excludeDepartmentId &&
      normalizeDepartmentName(department.name) === normalizedName,
  );

  if (duplicate) {
    return formatDepartmentError("A department with this name already exists.");
  }

  return {
    success: true as const,
  };
}

async function validateParentAndHead(
  parentDepartmentId: string | null,
  headId: string | null,
) {
  const supabase = await createClient();
  const [parentMessage, headMessage] = await Promise.all([
    parentDepartmentId
      ? (async () => {
          const { data, error } = await supabase
            .from("departments")
            .select("id")
            .eq("id", parentDepartmentId)
            .maybeSingle();

          return data && !error
            ? null
            : "Please select a valid parent department.";
        })()
      : Promise.resolve<string | null>(null),
    headId
      ? (async () => {
          const { data, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", headId)
            .maybeSingle();

          return data && !error ? null : "Please select a valid department head.";
        })()
      : Promise.resolve<string | null>(null),
  ]);

  if (parentMessage) {
    return formatDepartmentError(parentMessage);
  }

  if (headMessage) {
    return formatDepartmentError(headMessage);
  }

  return {
    success: true as const,
  };
}

function mapDepartmentData(
  departments: DepartmentRecord[],
  heads: DepartmentHeadRecord[],
): DepartmentManagementData {
  const departmentNameById = new Map(departments.map((department) => [
    department.id,
    department.name,
  ]));
  const headById = new Map(heads.map((head) => [head.id, head]));

  const departmentList = departments.map<DepartmentListItem>((department) => {
    const head = department.head_id ? headById.get(department.head_id) : null;

    return {
      ...department,
      head_email: head?.email ?? null,
      head_name: head?.full_name ?? null,
      parent_department_name: department.parent_department_id
        ? departmentNameById.get(department.parent_department_id) ?? null
        : null,
    };
  });

  return {
    departments: departmentList,
    parentOptions: departments.map((department) => ({
      label: department.status
        ? department.name
        : `${department.name} (Inactive)`,
      value: department.id,
    })),
    headOptions: heads.map((head) => ({
      label: head.active
        ? `${head.full_name} (${head.email})`
        : `${head.full_name} (${head.email}) - Inactive`,
      value: head.id,
    })),
  };
}

export async function getDepartmentManagementData() {
  const supabase = await createClient();
  const [departmentsResult, headsResult] = await Promise.all([
    supabase
      .from("departments")
      .select(
        "id, name, parent_department_id, head_id, status, created_at, updated_at",
      )
      .order("name"),
    supabase
      .from("profiles")
      .select("id, full_name, email, active")
      .order("full_name"),
  ]);

  if (departmentsResult.error) {
    return {
      success: false as const,
      error: {
        message: "Unable to load departments right now.",
        details: departmentsResult.error.message,
      },
    };
  }

  if (headsResult.error) {
    return {
      success: false as const,
      error: {
        message: "Unable to load department head options right now.",
        details: headsResult.error.message,
      },
    };
  }

  return {
    success: true as const,
    data: mapDepartmentData(
      departmentsResult.data as DepartmentRecord[],
      headsResult.data as DepartmentHeadRecord[],
    ),
  };
}

export async function createDepartment(input: DepartmentMutationInput) {
  const duplicateValidation = await validateDuplicateName(null, input.name);

  if (!duplicateValidation.success) {
    return duplicateValidation;
  }

  const relationValidation = await validateParentAndHead(
    input.parent_department_id,
    input.head_id,
  );

  if (!relationValidation.success) {
    return relationValidation;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .insert({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .select();

  if (error) {
    return formatDepartmentError(
      isDuplicateKeyError(error)
        ? "A department with this name already exists."
        : `Unable to create department: ${error.message}`,
    );
  }

  return {
    success: true as const,
    data: {
      departmentId: (data![0] as Pick<DepartmentRecord, "id">).id,
    },
  };
}

export async function updateDepartment(input: UpdateDepartmentInput) {
  if (input.parent_department_id === input.id) {
    return formatDepartmentError("A department cannot be its own parent.");
  }

  const duplicateValidation = await validateDuplicateName(input.id, input.name);

  if (!duplicateValidation.success) {
    return duplicateValidation;
  }

  const relationValidation = await validateParentAndHead(
    input.parent_department_id,
    input.head_id,
  );

  if (!relationValidation.success) {
    return relationValidation;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .update({
      head_id: input.head_id,
      name: input.name,
      parent_department_id: input.parent_department_id,
      status: input.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select("id")
    .single();

  if (error) {
    return formatDepartmentError(
      isDuplicateKeyError(error)
        ? "A department with this name already exists."
        : "Unable to update the department right now.",
    );
  }

  return {
    success: true as const,
    data: {
      departmentId: (data as Pick<DepartmentRecord, "id">).id,
    },
  };
}

export async function toggleDepartmentStatus({
  id,
  status,
}: ToggleDepartmentStatusInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error) {
    return formatDepartmentError(
      "Unable to update the department status right now.",
    );
  }

  return {
    success: true as const,
    data: {
      departmentId: (data as Pick<DepartmentRecord, "id">).id,
      status,
    },
  };
}
