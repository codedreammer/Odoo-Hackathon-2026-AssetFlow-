"use client";

import { useDeferredValue, useState } from "react";

import type { DepartmentListItem } from "../types/department";

export function useDepartmentSearch(departments: DepartmentListItem[]) {
  const [searchValue, setSearchValue] = useState("");
  const deferredSearchValue = useDeferredValue(searchValue);
  const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();

  const filteredDepartments = normalizedSearchValue
    ? departments.filter((department) =>
        department.name.toLowerCase().includes(normalizedSearchValue),
      )
    : departments;

  return {
    filteredDepartments,
    hasSearchValue: searchValue.trim().length > 0,
    searchValue,
    setSearchValue,
  };
}
