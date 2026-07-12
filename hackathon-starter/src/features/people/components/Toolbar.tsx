"use client";

import { Plus } from "lucide-react";

import { BackButton, PageHeader, SearchBar } from "@/components/common";
import { Button } from "@/components/ui/Button";

interface ToolbarProps {
  onAddClick: () => void;
  onSearchChange: (value: string) => void;
  search: string;
  totalEmployees: number;
}

export default function Toolbar({
  onAddClick,
  onSearchChange,
  search,
  totalEmployees,
}: ToolbarProps) {
  return (
    <PageHeader
      actions={
        <>
          <BackButton />
          <Button className="gap-2 ml-4" onClick={onAddClick}>
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </>
      }
      description="Manage employees, departments and assigned assets."
      title="People"
    >
      <SearchBar
        value={search}
        placeholder="Search employee..."
        onValueChange={onSearchChange}
        className="w-full sm:w-80"
      />
    </PageHeader>
  );
}