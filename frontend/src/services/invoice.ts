import { api } from "@/lib/api";

export const createInvoice = async (data: unknown) => {
  return await api
    .post("invoices", {
      json: data,
    })
    .json();
};

export const renderInvoice = async (id: string) => {
  return await api.get(`invoices/${id}/render`).blob();
};

export const deleteInvoice = async (id: string) => {
  return await api.delete(`invoices/${id}`).json();
};

export interface GetInvoicesResponse {
  message: string;
  status: string;
  invoices: Array<{
    id: string;
    clientId: string;
    invoiceNumber: string;
    currency: string;
    invoiceDate: string;
    dueDate: string;
    createdAt: string;
    userId: string;
  }>;
}

export const getInvoices = async (): Promise<GetInvoicesResponse> => {
  return await api.get("invoices").json();
};
