import { Container, DashboardLayout } from "@/components/layout";
import { EmptyState } from "@/components/common";
import { ClipboardCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { BackButton, PageHeader } from "@/components/common";

export default function AuditPage() {
  return (
    <DashboardLayout>
      <Container size="2xl" className="space-y-6">
        <PageHeader
          title="Audit Log"
          description="View and filter audit trail of all system activities."
          actions={
            <>
              <BackButton />
              <div className="flex items-center gap-2 ml-4">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </>
          }
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="w-full lg:max-w-sm">
            <Input
              placeholder="Search audit logs..."
              className="pl-10"
              // Add search icon here
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[380px]">
            <Select
              aria-label="Filter by action"
              options={[
                { label: "All actions", value: "all" },
                { label: "Created", value: "created" },
                { label: "Updated", value: "updated" },
                { label: "Deleted", value: "deleted" },
                { label: "Login", value: "login" },
                { label: "Logout", value: "logout" },
              ]}
              value="all"
            />
            <Select
              aria-label="Filter by resource"
              options={[
                { label: "All resources", value: "all" },
                { label: "Assets", value: "assets" },
                { label: "People", value: "people" },
                { label: "Departments", value: "departments" },
                { label: "Allocations", value: "allocations" },
                { label: "Bookings", value: "bookings" },
                { label: "Maintenance", value: "maintenance" },
              ]}
              value="all"
            />
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 lg:ml-auto">
            Showing 0 of 0 entries
          </div>
        </div>

        <Card className="overflow-hidden rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Resource ID</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <EmptyState
                    icon={<ClipboardCheck className="h-12 w-12 mx-auto text-zinc-400" />}
                    title="No audit logs yet"
                    description="System activities will appear here once recorded."
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Container>
    </DashboardLayout>
  );
}