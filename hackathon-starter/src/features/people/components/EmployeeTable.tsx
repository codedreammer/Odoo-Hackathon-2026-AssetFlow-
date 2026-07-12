"use client";

import { MoreHorizontal, Users } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/common/EmptyState";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { Employee } from "../types";
import EmployeeMenu from "./EmployeeMenu";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onToggleStatus: (employee: Employee) => void;
  pendingEmployeeId: string | null;
}

function getStatusVariant(status: Employee["status"]) {
  switch (status) {
    case "Active":
      return "default";
    case "On Leave":
      return "secondary";
    case "Inactive":
      return "destructive";
    default:
      return "outline";
  }
}

export default function EmployeeTable({
  employees,
  onEdit,
  onToggleStatus,
  pendingEmployeeId,
}: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <Card className="rounded-2xl p-12">
        <EmptyState
          icon={<Users className="h-12 w-12 mx-auto text-zinc-400" />}
          title="No employees found"
          description="Get started by adding your first employee."
        />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-2xl">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead className="w-[320px]">
              Employee
            </TableHead>

            <TableHead>
              Department
            </TableHead>

            <TableHead>
              Assets
            </TableHead>

            <TableHead>
              Asset Value
            </TableHead>

            <TableHead>
              Joined
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead className="w-[60px]" />

          </TableRow>

        </TableHeader>

        <TableBody>

          {employees.map((employee) => (

            <TableRow
              key={employee.id}
              className="hover:bg-zinc-50"
            >

              <TableCell>

                <div className="flex items-center gap-4">

                  <Avatar
                    alt={employee.name}
                    size="lg"
                  />

                  <div>

                    <h3 className="font-semibold text-zinc-900">
                      {employee.name}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      {employee.email}
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                      {employee.role}
                    </p>

                  </div>

                </div>

              </TableCell>

              <TableCell>

                <Badge variant="secondary">
                  {employee.department}
                </Badge>

              </TableCell>

              <TableCell>

                {employee.assets}

              </TableCell>

              <TableCell>

                $
                {employee.assetValue.toLocaleString()}

              </TableCell>

              <TableCell>

                {employee.joined}

              </TableCell>

              <TableCell>

                <Badge
                  variant={getStatusVariant(employee.status)}
                >
                  {employee.status}
                </Badge>

              </TableCell>

              <TableCell>

                <EmployeeMenu
                  employee={employee}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  disabled={pendingEmployeeId === employee.id}
                />

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </Card>
  );
}