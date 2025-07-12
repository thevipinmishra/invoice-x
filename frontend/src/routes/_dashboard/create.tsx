import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TextField } from "@/components/ui/textfield";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field-error";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NumberField, NumberInput } from "@/components/ui/numberfield";
import { Info, Plus, Save, X } from "lucide-react";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod/v4";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Description } from "@/components/ui/description";
import {
  DatePicker,
  DatePickerControls,
  DatePickerPopover,
} from "@/components/ui/datepicker";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { useClients } from "@/modules/clients/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";
import AddClient from "@/modules/clients/components/add-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation } from "@tanstack/react-query";
import { createInvoice } from "@/services/invoice";
import { toast } from "sonner";

type InvoiceFormData = {
  currency: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  clientId: string;
  businessName: string;
  businessEmail: string;
  items: {
    product: string;
    unitPrice: number;
    quantity: number;
  }[];
};

type InvoiceResponse = {
  invoice: {
    id: string;
  };
};

const invoiceSchema = z.object({
  currency: z.enum([
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "INR",
    "SEK",
    "NZD",
  ]),
  invoiceNumber: z
    .string()
    .max(20, "Invoice number must be less than 20 characters"),
  invoiceDate: z.custom<CalendarDate>(),
  dueDate: z.custom<CalendarDate>(),
  clientId: z.string(),
  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Business name must be less than 100 characters"),
  businessEmail: z
    .email("Please enter a valid business email address")
    .min(1, "Business email is required")
    .max(100, "Business email address is too long"),

  // Invoice items
  items: z
    .array(
      z.object({
        product: z
          .string()
          .min(1, "Product name is required")
          .max(100, "Product name must be less than 100 characters"),
        unitPrice: z
          .number()
          .min(1, "Unit price must be greater than 0")
          .max(999999.99, "Unit price is too large"),
        quantity: z
          .number()
          .int("Quantity must be a whole number")
          .min(1, "Quantity must be at least 1")
          .max(10000, "Quantity cannot exceed 10,000"),
      })
    )
    .min(1, "At least one item is required"),
});

export const Route = createFileRoute("/_dashboard/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      currency: "USD",
      invoiceNumber: "",
      invoiceDate: today(getLocalTimeZone()),
      dueDate: today(getLocalTimeZone()),
      clientId: "",
      businessName: "",
      businessEmail: "",
      items: [
        {
          product: "",
          unitPrice: 1,
          quantity: 1,
        },
      ],
    },
    validators: {
      onChange: invoiceSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        ...value,
        invoiceDate: value.invoiceDate.toDate(getLocalTimeZone()),
        dueDate: value.dueDate.toDate(getLocalTimeZone()),
      };
      invoiceMutation.mutate(payload);
    },
  });

  const clients = useClients();

  const invoiceItems = useStore(form.store, (state) => state.values.items);
  const currency = useStore(form.store, (state) => state.values.currency);


  const calculateLineTotal = (unitPrice: number, quantity: number) =>
    unitPrice * quantity;
  const grandTotal = invoiceItems
    .filter((item) => item.product)
    .reduce(
      (sum, item) => sum + calculateLineTotal(item.unitPrice, item.quantity),
      0
    );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const invoiceMutation = useMutation({
    mutationFn: async (data: InvoiceFormData): Promise<InvoiceResponse> => {
      return await createInvoice(data) as InvoiceResponse;
    },
    onSuccess: async (data: InvoiceResponse) => {
      form.reset();
      toast.success("Invoice created successfully!");
      

      navigate({
        to: "/invoice",
        search: {
          id: data.invoice.id,
        },
      });
    },
  });

  return (
    <main className="container py-6 space-y-6 w-full max-w-2xl">
      <div className="flex gap-6 justify-between items-center">
        <h3 className="font-bold text-foreground tracking-tight">
          Create a new invoice
        </h3>

        <Button variant="outline" size="sm">
          <Save /> Save draft
        </Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Card className="gap-10">
          <CardHeader>
            <CardTitle>Let's get started</CardTitle>
            <CardDescription>
              Fill out the form below to create a new invoice. All fields are
              required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form.Field
              name="currency"
              children={(field) => (
                <Select
                  selectedKey={field.state.value}
                  onSelectionChange={(value) =>
                    field.handleChange(value as string)
                  }
                >
                  <Label>Currency</Label>
                  <SelectTrigger />
                  <SelectContent>
                    <SelectItem id="USD" textValue="USD">
                      USD - United States Dollar
                    </SelectItem>
                    <SelectItem id="EUR" textValue="EUR">
                      EUR - Euro
                    </SelectItem>
                    <SelectItem id="GBP" textValue="GBP">
                      GBP - British Pound Sterling
                    </SelectItem>
                    <SelectItem id="JPY" textValue="JPY">
                      JPY - Japanese Yen
                    </SelectItem>
                    <SelectItem id="AUD" textValue="AUD">
                      AUD - Australian Dollar
                    </SelectItem>
                    <SelectItem id="CAD" textValue="CAD">
                      CAD - Canadian Dollar
                    </SelectItem>
                    <SelectItem id="CHF" textValue="CHF">
                      CHF - Swiss Franc
                    </SelectItem>
                    <SelectItem id="CNY" textValue="CNY">
                      CNY - Chinese Yuan
                    </SelectItem>
                    <SelectItem id="INR" textValue="INR">
                      INR - Indian Rupee
                    </SelectItem>
                    <SelectItem id="SEK" textValue="SEK">
                      SEK - Swedish Krona
                    </SelectItem>
                    <SelectItem id="NZD" textValue="NZD">
                      NZD - New Zealand Dollar
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <form.Field
              name="invoiceNumber"
              children={(field) => (
                <TextField
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                  isInvalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <Label>Invoice number</Label>
                  <Input />
                  <Description className="inline-flex gap-2 items-center leading-2">
                    <Info className="size-4" /> This will be automatically
                    generated if left blank.
                  </Description>
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                </TextField>
              )}
            />
            <form.Field
              name="invoiceDate"
              children={(field) => (
                <DatePicker
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) =>
                    field.handleChange(value as CalendarDate)
                  }
                  isInvalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <Label>Invoice Date</Label>
                  <DatePickerControls />
                  <DatePickerPopover />
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                </DatePicker>
              )}
            />

            <form.Field
              name="dueDate"
              children={(field) => (
                <DatePicker
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) =>
                    field.handleChange(value as CalendarDate)
                  }
                  isInvalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                >
                  <Label>Due Date</Label>
                  <DatePickerControls />
                  <DatePickerPopover />
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                </DatePicker>
              )}
            />
          </CardContent>

          <CardHeader>
            <CardTitle>Client's information</CardTitle>
            <CardDescription>
              Please provide the client's information to generate the invoice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {clients?.isLoading ? (
              <Skeleton />
            ) : clients?.isError ? (
              <Alert>
                <AlertTitle>Error loading clients</AlertTitle>
              </Alert>
            ) : clients?.data?.clients && clients?.data?.clients?.length > 0 ? (
              <form.Field
                name="clientId"
                children={(field) => (
                  <Select
                    selectedKey={field.state.value}
                    onSelectionChange={(value) =>
                      field.handleChange(value as string)
                    }
                  >
                    <Label>Select a client</Label>
                    <SelectTrigger />
                    <SelectContent items={clients.data.clients}>
                      {(item) => (
                        <SelectItem id={item.id} textValue={item.id}>
                          {item.name}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <div className="space-y-6">
                <Alert>
                  <AlertTitle>No clients found, let's add one.</AlertTitle>
                </Alert>
                <AddClient />
              </div>
            )}
          </CardContent>

          <CardHeader>
            <CardTitle>Business details</CardTitle>
            <CardDescription>
              Please provide your business details to generate the invoice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form.Field
              name="businessName"
              children={(field) => (
                <TextField
                  isInvalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                >
                  <Label>Business name</Label>
                  <Input />
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                </TextField>
              )}
            />

            <form.Field
              name="businessEmail"
              children={(field) => (
                <TextField
                  isInvalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                >
                  <Label>Business email</Label>
                  <Input />
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                </TextField>
              )}
            />
          </CardContent>

          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
            <CardDescription>Add items to the invoice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form.Field name="items" mode="array">
              {(field) => (
                <>
                  <div className="space-y-6">
                    {field.state.value.map((_, i) => (
                      <div key={i} className="space-y-6">
                        <div className="flex items-center justify-between gap-8">
                          <p className="text-sm text-muted-foreground font-medium tracking-tight">
                            Product #{i + 1}
                          </p>
                          <Button
                            variant="secondary"
                            isDisabled={field.state.value.length === 1}
                            size="icon"
                            onPress={() => field.removeValue(i)}
                          >
                            <X />
                          </Button>
                        </div>

                        <form.Field
                          name={`items[${i}].product`}
                          children={(field) => (
                            <TextField
                              isInvalid={
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid
                              }
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(value) => field.handleChange(value)}
                            >
                              <Label>Product</Label>
                              <Input />
                              <FieldError>
                                {field.state.meta.errors[0]?.message}
                              </FieldError>
                            </TextField>
                          )}
                        />

                        <form.Field
                          name={`items[${i}].unitPrice`}
                          children={(field) => (
                            <NumberField
                              isInvalid={
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid
                              }
                              minValue={1}
                              maxValue={999999.99}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(value) => field.handleChange(value)}
                            >
                              <Label>Unit Price</Label>
                              <NumberInput />
                              <FieldError>
                                {field.state.meta.errors[0]?.message}
                              </FieldError>
                            </NumberField>
                          )}
                        />

                        <form.Field
                          name={`items[${i}].quantity`}
                          children={(field) => (
                            <NumberField
                              isInvalid={
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid
                              }
                              minValue={1}
                              maxValue={10000}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(value) => field.handleChange(value)}
                            >
                              <Label>Quantity</Label>
                              <NumberInput />
                              <FieldError>
                                {field.state.meta.errors[0]?.message}
                              </FieldError>
                            </NumberField>
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onPress={() =>
                        field.pushValue({
                          product: "",
                          unitPrice: 1,
                          quantity: 1,
                        })
                      }
                    >
                      <Plus /> Add Item
                    </Button>
                  </div>
                </>
              )}
            </form.Field>

            {invoiceItems.filter((item) => item.product).length > 0 && (
              <>
                <Table aria-label="Invoice Items Table">
                  <TableHeader>
                    <TableRow>
                      <TableHead isRowHeader>Product</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems
                      .filter((item) => item.product)
                      .map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item.product}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(
                              calculateLineTotal(item.unitPrice, item.quantity)
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end border-t pt-4">
                  <div className="text-right space-y-2">
                    <div className="flex justify-between items-center gap-8">
                      <span className="text-sm text-muted-foreground">
                        Subtotal:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-8 text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full"
                  isDisabled={!canSubmit}
                >
                  {isSubmitting ? "..." : "Create Invoice"}
                </Button>
              )}
            />
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
