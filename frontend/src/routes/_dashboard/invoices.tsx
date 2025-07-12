import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuTrigger,
} from "@/components/ui/menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DialogContent, DialogTrigger } from "@/components/ui/dialg";
import { deleteInvoice, getInvoices } from "@/services/invoice";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MenuIcon, SearchX, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Heading } from "react-aria-components";

export const Route = createFileRoute("/_dashboard/invoices")({
  component: RouteComponent,
});

function RouteComponent() {
  const invoicesQuery = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setDeleteModalOpen(false);
      setInvoiceToDelete(null);
      toast.success("Invoice deleted successfully");
    },
  });

  const handleDeleteClick = (invoiceId: string) => {
    setInvoiceToDelete(invoiceId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (invoiceToDelete) {
      deleteMutation.mutate(invoiceToDelete);
    }
  };

  return (
    <main className="py-6 container">
      <div className="flex gap-6 justify-between items-center mb-6">
        <h3 className="font-bold tracking-tight text-lg text-foreground">
          Invoices
        </h3>
        <Button>Add Invoice</Button>
      </div>
      {invoicesQuery.isLoading ? (
        <Skeleton className="h-36 w-full" />
      ) : invoicesQuery?.data?.invoices?.length === 0 ? (
        <div className="border flex flex-col gap-4 text-muted-foreground items-center border-muted rounded-lg p-6">
          <SearchX className="size-8" />
          <p className="font-semibold text-sm tracking-tight">
            No invoices found. Please add an invoice.
          </p>
        </div>
      ) : (
        <Table aria-label="Invoices Table">
          <TableHeader>
            <TableHead isRowHeader>Invoice Number</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableHeader>
          <TableBody>
            {invoicesQuery.data?.invoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>'N/A'</TableCell>
                <TableCell>0.00</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>
                  {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                    dateStyle: "medium",
                  })}
                </TableCell>
                <TableCell>
                  <MenuTrigger>
                    <Button size="icon" variant="outline">
                      <MenuIcon />
                    </Button>
                    <Menu>
                      <MenuItem>
                        <MenuItemLabel>Edit</MenuItemLabel>
                      </MenuItem>
                      <MenuItem onAction={() => handleDeleteClick(invoice.id)}>
                        <MenuItemLabel>Delete</MenuItemLabel>
                      </MenuItem>
                    </Menu>
                  </MenuTrigger>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <DialogTrigger isOpen={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <div className="flex gap-6 items-center justify-between">
            <Heading
              slot="title"
              className="lg:text-lg font-semibold tracking-tight"
            >
              Confirm Delete
            </Heading>
            <Button slot="close" variant="ghost" size="icon">
              <X />
            </Button>
          </div>
          <div className="grid gap-6">
            <p className="text-muted-foreground">
              Are you sure you want to delete this invoice? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onPress={() => setDeleteModalOpen(false)}
                isDisabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onPress={handleConfirmDelete}
                isDisabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogTrigger>
    </main>
  );
}
