import { useQuery } from "@tanstack/react-query";
import { getMeta } from "../services/userMeta";

export const useMeta = () => {
  const meta = useQuery({
    queryKey: ["meta"],
    queryFn: getMeta,
  });

  return meta;
};
