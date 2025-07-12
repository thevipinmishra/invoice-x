import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type Client = {
   id : string;
        name: string;
        email: string;
        createdAt: string;
        userId: string;
}

export const addClient = async (body: {
  name: string;
  email: string;
}): Promise<unknown> => {
  return await api
    .post("clients", {
      json: body,
    })
    .json();
};

const getClients = async (): Promise<{
    clients: Client[];
}> => {
  return await api.get("clients").json();
};

export const deleteClient = async (id: string): Promise<unknown> => {
  return await api.delete(`clients/${id}`).json();
};

export const updateClient = async (
  id: string,
  body: { name: string; email: string }
): Promise<unknown> => {
  return await api
    .put(`clients/${id}`, {
      json: body,
    })
    .json();
  };

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });
};
