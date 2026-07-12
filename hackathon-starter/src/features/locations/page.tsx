import { Container, DashboardLayout } from "@/components/layout";
import { EmptyState } from "@/components/common";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BackButton, PageHeader } from "@/components/common";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

export default function LocationsPage() {
  return (
    <DashboardLayout>
      <Container size="2xl" className="space-y-6">
        <PageHeader
          title="Locations"
          description="Manage physical locations where assets are stored or deployed."
          actions={
            <>
              <BackButton />
              <Button className="gap-2 ml-4">
                <Plus className="h-4 w-4" />
                New Location
              </Button>
            </>
          }
        />

        <Card className="overflow-hidden rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Location</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Assets</TableHead>
                <TableHead className="w-[120px]">Created</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <EmptyState
                    icon={<MapPin className="h-12 w-12 mx-auto text-zinc-400" />}
                    title="No locations yet"
                    description="Add your first location to start tracking where assets are deployed."
                    action={
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Location
                      </Button>
                    }
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