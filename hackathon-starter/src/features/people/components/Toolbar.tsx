"use client";

import { Plus } from "lucide-react";

import { SearchBar } from "@/components/common/SearchBar";
import { Button } from "@/components/ui/Button";

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  totalEmployees: number;
}

export default function Toolbar({
  search,
  onSearchChange,
  totalEmployees,
}: ToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          People
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Manage employees, departments and assigned assets.
        </p>

      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        <div className="w-full sm:w-80">

          <SearchBar
            value={search}
            placeholder="Search employee..."
            onValueChange={onSearchChange}
          />

        </div>

        <Button className="gap-2">

          <Plus className="h-4 w-4" />

          Add Employee

        </Button>

      </div>

    </div>
  );
}