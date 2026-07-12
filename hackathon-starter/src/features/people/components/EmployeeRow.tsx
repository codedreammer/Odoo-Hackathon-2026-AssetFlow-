"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { TableCell, TableRow } from "@/components/ui/Table";

import { Employee } from "../types";

interface EmployeeRowProps {
  employee: Employee;
}

export default function EmployeeRow({ employee }: EmployeeRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar alt={employee.name} />

          <div>
            <h3 className="font-medium text-zinc-900">
              {employee.name}
            </h3>

            <p className="text-sm text-zinc-500">
              {employee.email}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-zinc-700">
        {employee.role}
      </TableCell>

      <TableCell>
        <Badge variant="secondary">
          {employee.department}
        </Badge>
      </TableCell>

      <TableCell>{employee.assets}</TableCell>

      <TableCell className="text-zinc-500">
        {employee.joined}
      </TableCell>
    </TableRow>
  );
}