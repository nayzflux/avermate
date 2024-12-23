import { apiClient } from "@/lib/api";
import { Grade } from "@/types/grade";
import { useQuery } from "@tanstack/react-query";

export const useGrade = (gradeId: string) =>
  useQuery({
    queryKey: ["grades", gradeId],
    queryFn: async () => {
      const res = await apiClient.get(`grades/${gradeId}`);
      const data = await res.json<{ grade: Grade }>();
      return data.grade;
    },
  });
