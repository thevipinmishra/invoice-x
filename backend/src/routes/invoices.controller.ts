import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoiceItemsByInvoiceId,
  getInvoicesByUserId,
  insertInvoiceItems,
} from "../services/invoices.service.js";
import { getClientById } from "../services/clients.service.js";
import type { InvoiceItemsSchema } from "../db/schema.js";
import createPdf from "../components/invoice.js";

type Variables = JwtVariables;

const invoicesRouter = new Hono<{ Variables: Variables }>();

invoicesRouter.use(
  jwt({
    secret: process.env.SECRET_KEY!,
  })
);

invoicesRouter
  .get("/", async (c) => {
    try {
      const payload = c.get("jwtPayload");

      if (!payload || !payload.id) {
        return c.json(
          {
            error: "Invalid token payload",
            code: "TOKEN_INVALID",
          },
          401
        );
      }
      const invoices = await getInvoicesByUserId(payload.id as string);
      return c.json({
        message: "Invoices retrieved successfully",
        status: "success",
        invoices,
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return c.json(
        {
          error: "Failed to fetch invoices",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .post("/", async (c) => {
    try {
      const payload = c.get("jwtPayload");
      const body = await c.req.json();

      if (!payload || !payload.id) {
        return c.json(
          {
            error: "Invalid token payload",
            code: "TOKEN_INVALID",
          },
          401
        );
      }

      const userId = payload.id as string;
      const { items, ...invoiceData } = body;

      const newInvoice = await createInvoice({
        ...invoiceData,
        userId,
      });

      // Then create the invoice items with the invoice ID
      let invoiceItems: InvoiceItemsSchema[] = [];
      if (items && Array.isArray(items) && items.length > 0) {
        invoiceItems = await insertInvoiceItems(items, newInvoice.id, userId);
      }

      return c.json({
        message: "Invoice created successfully",
        status: "success",
        invoice: {
          ...newInvoice,
          items: invoiceItems,
        },
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      return c.json(
        {
          error: "Failed to create invoice",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .get("/:invoiceId/render", async (c) => {
    const invoiceId = c.req.param("invoiceId");
    const payload = c.get("jwtPayload");

    if (!payload || !payload.id) {
      return c.json(
        {
          error: "Invalid token payload",
          code: "TOKEN_INVALID",
        },
        401
      );
    }

    try {
      const invoice = await getInvoiceById(invoiceId, payload.id as string);
      const items = await getInvoiceItemsByInvoiceId(
        invoiceId,
        payload.id as string
      );
      const client = await getClientById(
        invoice.clientId,
        payload.id as string
      );

      // Prepare invoice data for PDF
      const invoiceDataForPdf = {
        invoiceNumber: invoice.invoiceNumber,
        client: {
          name: client.name,
          email: client.email,
          address: client.address,
          gstin: client.gstin,
        },
        currency: invoice.currency,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };

      // Generate PDF
      const pdfBuffer = await createPdf(invoiceDataForPdf);

      // Set proper headers for PDF response
      c.header("Content-Type", "application/pdf");
      c.header(
        "Content-Disposition",
        `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`
      );

      return c.body(pdfBuffer);
    } catch (error) {
      console.error("Error rendering invoice:", error);
      return c.json(
        {
          error: "Failed to render invoice",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  }).delete("/:invoiceId", async (c) => {
    try {
    const invoiceId = c.req.param("invoiceId");
    const payload = c.get("jwtPayload");
    if (!payload || !payload.id) {
      return c.json(
        {
          error: "Invalid token payload",
          code: "TOKEN_INVALID",
        },
        401
      );
    }
  
     await deleteInvoice(invoiceId, payload.id as string);
     

    
        return c.json({
          message: "Invoice deleted successfully",
          status: "success",
        });
      
    } catch (error) {
      console.error("Error deleting invoice:", error);
      return c.json(
        {
          error: "Failed to delete invoice",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  });

export { invoicesRouter };
