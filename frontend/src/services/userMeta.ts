import { api } from "../lib/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface GetUserMetaResponse {
  message: string;
  status: string;
  data: {
    user: User;
    invoices: number,
    clients: number,
  }
}

export const getMeta = async (): Promise<GetUserMetaResponse> => {
  return api.get("meta").json();
};
