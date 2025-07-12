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
import { deleteClient, useClients, type Client } from "@/modules/clients/api";
import { updateClient } from "@/modules/clients/api";
import { createFileRoute } from "@tanstack/react-router";
import { MenuIcon, SearchX, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { TextField } from "@/components/ui/textfield";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Heading } from "react-aria-components";
import AddClient from "@/modules/clients/components/add-client";

export const Route = createFileRoute("/_dashboard/clients")({
  component: RouteComponent,
});

function RouteComponent() {
  const clientsQuery = useClients();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteClient(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setDeleteModalOpen(false);
      setClientToDelete(null);
      toast.success("Client deleted successfully");
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; email: string }) => {
      return updateClient(data.id, { name: data.name, email: data.email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setEditModalOpen(false);
      setClientToEdit(null);
      toast.success("Client updated successfully");
    },
  });

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (client: Client) => {
    setClientToEdit(client);
    setEditModalOpen(true);
  };

  const clientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
  });

  const editForm = useForm({
    defaultValues: { name: "", email: "" },
    validators: { onChange: clientSchema },
    onSubmit: async ({ value }) => {
      if (clientToEdit) {
        editMutation.mutate({
          id: clientToEdit.id,
          name: value.name,
          email: value.email,
        });
      }
    },
  });

  useEffect(() => {
    if (editModalOpen && clientToEdit) {
      editForm.reset({
        name: clientToEdit.name,
        email: clientToEdit.email,
      });
    }
  }, [editModalOpen, clientToEdit, editForm]);
  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteMutation.mutate(clientToDelete);
    }
  };

  return (
    <main className="py-6 container">
      <div className="flex gap-6 justify-between items-center mb-6">
        <h3 className="font-bold tracking-tight text-lg text-foreground">
          Clients
        </h3>
        <AddClient />
      </div>
      {clientsQuery.isLoading ? (
        <Skeleton className="h-36 w-full" />
      ) : clientsQuery?.data?.clients.length === 0 ? (
        <div className="border flex flex-col gap-4 text-muted-foreground items-center border-muted rounded-lg p-6">
          <SearchX className="size-8" />
          <p className="font-semibold text-sm tracking-tight">
            No clients found. Please add a client.
          </p>
        </div>
      ) : (
        <Table aria-label="Clients Table">
          <TableHeader>
            <TableHead isRowHeader>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableHeader>
          <TableBody>
            {clientsQuery.data?.clients?.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  {new Date(client.createdAt).toLocaleDateString("en-IN", {
                    dateStyle: "medium",
                  })}
                </TableCell>
                <TableCell>
                  <MenuTrigger>
                    <Button size="icon" variant="outline">
                      <MenuIcon />
                    </Button>
                    <Menu>
                      <MenuItem onAction={() => handleEditClick(client)}>
                        <MenuItemLabel>Edit</MenuItemLabel>
                      </MenuItem>
                      <MenuItem onAction={() => handleDeleteClick(client.id)}>
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

      {/* Delete Dialog */}
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
              Are you sure you want to delete this client? This action cannot be
              undone.
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

      {/* Edit Dialog */}
      <DialogTrigger isOpen={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <div className="flex gap-6 items-center justify-between">
            <Heading
              slot="title"
              className="lg:text-lg font-semibold tracking-tight"
            >
              Edit Client
            </Heading>
            <Button slot="close" variant="ghost" size="icon">
              <X />
            </Button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editForm.handleSubmit();
            }}
            className="grid gap-6"
          >
            <editForm.Field
              name="name"
              children={(field) => (
                <TextField
                  isInvalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                >
                  <Label>Name</Label>
                  <Input />
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                </TextField>
              )}
            />
            <editForm.Field
              name="email"
              children={(field) => (
                <TextField
                  isInvalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                >
                  <Label>Email</Label>
                  <Input type="email" />
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                </TextField>
              )}
            />
            <editForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onPress={() => setEditModalOpen(false)}
                    isDisabled={isSubmitting}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    type="submit"
                    isDisabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            />
          </form>
        </DialogContent>
      </DialogTrigger>
    </main>
  );
}
