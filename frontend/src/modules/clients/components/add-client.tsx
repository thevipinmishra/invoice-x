import { DialogContent, DialogTrigger } from "@/components/ui/dialg";
import { Heading } from "react-aria-components";
import { X } from "lucide-react";
import { TextField } from "@/components/ui/textfield";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { z } from "zod/v4";
import { FieldError } from "@/components/ui/field-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addClient } from "../api";
import { toast } from "sonner";
import { useState } from "react";
import { Description } from "@/components/ui/description";

const addClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  address: z.string(),
  gstIn: z.string().max(15, "GST IN must be at most 15 characters long"),
});

export default function AddClient() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      address: "",
      gstIn: "",
    },
    validators: {
      onChange: addClientSchema,
    },
    onSubmit: ({ value }) => {
      addClientMutation.mutate(value);
    },
  });

  const addClientMutation = useMutation({
    mutationFn: (values: {
      name: string;
      email: string;
      address?: string;
      gstIn?: string;
    }) => addClient(values),
    onSuccess: () => {
      form.reset();
      setOpen(false);
      toast.success("Client added successfully!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
  return (
    <DialogTrigger isOpen={open} onOpenChange={setOpen}>
      <Button>Add Client</Button>
      <DialogContent>
        <div className="flex gap-6 items-center justify-between">
          <Heading
            slot="title"
            className="lg:text-lg font-semibold tracking-tight"
          >
            Add a new client
          </Heading>
          <Button slot="close" variant="ghost" size="icon">
            <X />
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid gap-6"
        >
          <form.Field
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

          <form.Field
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

          <form.Field
            name="address"
            children={(field) => (
              <TextField
                isInvalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(value) => field.handleChange(value)}
              >
                <Label>Address</Label>
                <Input />
                <Description>
                    Optional
                </Description>
                <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
              </TextField>
            )}
          />

          <form.Field
            name="gstIn"
            children={(field) => (
              <TextField
                isInvalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(value) => field.handleChange(value)}
              >
                <Label>GST IN</Label>
                <Input />
                 <Description>
                    Optional, must be 15 characters long.
                </Description>
                <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
              </TextField>
            )}
          />

          <Button type="submit" className="w-full">
            Add Client
          </Button>
        </form>
      </DialogContent>
    </DialogTrigger>
  );
}
