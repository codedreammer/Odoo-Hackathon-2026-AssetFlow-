"use client";

import { useMemo, useState } from "react";

import { Container, DashboardLayout } from "@/components/layout";
import { BackButton, PageHeader } from "@/components/common";

import { allocations } from "./data";
import {
  calculateStats,
  filterByStatus,
  searchAllocations,
} from "./utils";

import {
  AllocationStats,
  AllocationTable,
  TransferTabs,
  TransferToolbar,
} from "./components";

export default function AllocationPage() {
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<
    "All" | "Active" | "Pending" | "Reserved" | "Maintenance"
  >("All");

  const [department, setDepartment] = useState("All");

  const [tab, setTab] = useState("allocations");

  const filteredAllocations = useMemo(() => {
    let data = [...allocations];

    data = searchAllocations(data, search);

    data = filterByStatus(data, status);

    if (department !== "All") {
      data = data.filter((item) => item.department === department);
    }

    return data;
  }, [search, status, department]);

  const stats = useMemo(
    () => calculateStats(filteredAllocations),
    [filteredAllocations]
  );

  return (
    <DashboardLayout>
      <Container size="2xl" className="space-y-6">
        <PageHeader
          title="Asset Allocations"
          description="Track allocated assets, transfer requests and department assignments."
          actions={
            <>
              <BackButton />
              <TransferTabs className="ml-4" activeTab={tab} onTabChange={setTab} />
            </>
          }
        />

        <AllocationStats stats={stats} />

        <TransferToolbar
          search={search}
          status={status}
          department={department}
          onSearchChange={setSearch}
          onStatusChange={(value) =>
            setStatus(
              value as
                | "All"
                | "Active"
                | "Pending"
                | "Reserved"
                | "Maintenance"
            )
          }
          onDepartmentChange={setDepartment}
        />

        <AllocationTable allocations={filteredAllocations} />
      </Container>
    </DashboardLayout>
  );
}