"use client";

import { useMemo, useState } from "react";

import { departments, employees, stats } from "./data";

import {
  DepartmentSidebar,
  EmployeeTable,
  StatsCards,
  Toolbar,
} from "./components";


export default function PeoplePage() {
  const [selectedDepartment, setSelectedDepartment] =
    useState("All");

  const [search, setSearch] = useState("");

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesDepartment =
        selectedDepartment === "All" ||
        employee.department === selectedDepartment;

      const keyword = search.toLowerCase();

      const matchesSearch =
        employee.name.toLowerCase().includes(keyword) ||
        employee.email.toLowerCase().includes(keyword) ||
        employee.role.toLowerCase().includes(keyword);

      return matchesDepartment && matchesSearch;
    });
  }, [selectedDepartment, search]);

  return (
    <main className="min-h-screen bg-zinc-100">

      <div className="mx-auto max-w-7xl p-8">

        <Toolbar
          totalEmployees={filteredEmployees.length}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="mt-8">

          <StatsCards stats={stats} />

        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">

          <div className="lg:col-span-3">

            <DepartmentSidebar
              departments={departments}
              selectedDepartment={selectedDepartment}
              onSelectDepartment={
                setSelectedDepartment
              }
            />

          </div>

          <div className="lg:col-span-9">

            <EmployeeTable
              employees={filteredEmployees}
            />

          </div>

        </div>

      </div>

    </main>
  );
}