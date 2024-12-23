import { apiClient } from "@/lib/api";
import { GetSubjectsResponse } from "@/types/get-subjects-response";
import { useQuery } from "@tanstack/react-query";

export const useSubjects = () =>
  useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<GetSubjectsResponse>();
      return data.subjects;
    },
  });
