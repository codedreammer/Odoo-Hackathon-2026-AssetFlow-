"use client";

import { Building2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

import { Department } from "../types";

interface DepartmentSidebarProps {
  departments: Department[];
  selectedDepartment: string;
  onSelectDepartment: (department: string) => void;
}

export default function DepartmentSidebar({
  departments,
  selectedDepartment,
  onSelectDepartment,
}: DepartmentSidebarProps) {
  return (
    <Card className="overflow-hidden">

      <div className="border-b px-6 py-5">

        <h2 className="text-lg font-semibold">
          Departments
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Browse employees by department
        </p>

      </div>

      <div className="space-y-2 p-3">

        {departments.map((department) => {
          const active =
            selectedDepartment === department.name;

          return (
            <button
              key={department.id}
              onClick={() =>
                onSelectDepartment(department.name)
              }
              className={`w-full rounded-xl border p-4 text-left transition-all

              ${
                active
                  ? "border-black bg-black text-white shadow-lg"
                  : "border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-start justify-between">

                <div className="flex gap-3">

                  <div
                    className={`rounded-lg p-2 ${
                      active
                        ? "bg-white/20"
                        : "bg-zinc-100"
                    }`}
                  >
                    <Building2
                      className={`h-5 w-5 ${
                        active
                          ? "text-white"
                          : "text-zinc-700"
                      }`}
                    />
                  </div>

                  <div>

                    <h3
                      className={`font-semibold ${
                        active
                          ? "text-white"
                          : "text-zinc-900"
                      }`}
                    >
                      {department.name}
                    </h3>

                    <p
                      className={`mt-1 text-sm ${
                        active
                          ? "text-zinc-200"
                          : "text-zinc-500"
                      }`}
                    >
                      {department.employees} Employees
                    </p>

                  </div>

                </div>

                <Badge
                  variant={
                    active
                      ? "default"
                      : "secondary"
                  }
                >
                  {department.assets}
                </Badge>

              </div>

              <div className="mt-4 flex items-center justify-between">

                <span
                  className={`text-xs ${
                    active
                      ? "text-zinc-300"
                      : "text-zinc-500"
                  }`}
                >
                  Asset Value
                </span>

                <span
                  className={`text-sm font-semibold ${
                    active
                      ? "text-white"
                      : "text-zinc-900"
                  }`}
                >
                  $
                  {(
                    department.assetValue / 1000
                  ).toFixed(0)}
                  k
                </span>

              </div>

            </button>
          );
        })}

      </div>

    </Card>
  );
}