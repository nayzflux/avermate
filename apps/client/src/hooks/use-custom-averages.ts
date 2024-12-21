import { apiClient } from "@/lib/api";
import { Average } from "@/types/average";
import { useQuery } from "@tanstack/react-query";

export const useCustomAverages = () =>
  useQuery({
    queryKey: ["customAverages"],
    queryFn: async () => {
      const res = await apiClient.get("averages");
      const data = await res.json<{ customAverages: Average[] }>();
      return data.customAverages;
    },
  });
