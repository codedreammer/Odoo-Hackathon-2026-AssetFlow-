import { Container, DashboardLayout } from "@/components/layout";
import { EmptyState } from "@/components/common";
import { FolderGit2, Plus } from "lucide-react";
import { BackButton, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

export default function CategoriesPage() {
  return (
    <DashboardLayout>
      <Container size="2xl" className="space-y-6">
        <PageHeader
          title="Categories"
          description="Manage asset categories for organizing your inventory."
          actions={
            <>
              <BackButton />
              <Button className="gap-2 ml-4">
                <Plus className="h-4 w-4" />
                New Category
              </Button>
            </>
          }
        />

        <Card className="overflow-hidden rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assets</TableHead>
                <TableHead className="w-[120px]">Created</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <EmptyState
                    icon={<FolderGit2 className="h-12 w-12 mx-auto text-zinc-400" />}
                    title="No categories yet"
                    description="Create your first category to start organizing assets."
                    action={
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Category
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