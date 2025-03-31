import { apiClient } from "@/lib/api";
import { GetOrganizedSubjectsResponse } from "@/types/get-organized-subjects-response";
import { useQuery } from "@tanstack/react-query";
import { Grade } from "@/types/grade";
import { Subject } from "@/types/subject";

// Check if today is April 1st
function isAprilFoolsDay(): boolean {
    const today = new Date();
    return today.getMonth() === 3 && today.getDate() === 1;
  }

// Function to modify grades for April Fools
function modifyGradeForAprilFools(grade: any): any {
  // Create a deep copy to avoid modifying the original
  const modifiedGrade = JSON.parse(JSON.stringify(grade)) as Grade;
  
  // Apply April Fools modifications - generate a random low grade (between 0% and 50% of the out of value)
    if (modifiedGrade.value !== undefined && modifiedGrade.outOf !== undefined) {
        const randomLowValue = Math.floor(Math.random() * (modifiedGrade.outOf / 2)); // Random value between 0 and half of the outOf value
        modifiedGrade.value = randomLowValue;
    }
  
  return modifiedGrade;
}

export const useOrganizedSubjects = () => 
    useQuery({
        queryKey: ["subjects", "organized-by-periods"],
        queryFn: async () => {
            const res = await apiClient.get("subjects/organized-by-periods");
            const data = await res.json<GetOrganizedSubjectsResponse>();

            // On April 1st, return modified subjects with low values
            if (isAprilFoolsDay()) {
                return data.periods.map((period) => {
                    return {
                        ...period,
                        subjects: period.subjects.map((subject) => {
                            return {
                                ...subject,
                                grades: subject.grades.map((grade) => {
                                    // Create a Grade object that can be passed to the modifier function
                                    const fullGrade: Grade = {
                                        ...grade,
                                        subject: { id: subject.id, name: subject.name, isDisplaySubject: subject.isDisplaySubject, isMainSubject: subject.isMainSubject },
                                    } as Grade;

                                    return modifyGradeForAprilFools(fullGrade);
                                }),
                            };
                        }),
                    };
                }
                );
            }

            return data.periods;
        },
    });


//   const {
//     data: organizedSubject,
//     isError: organizedSubjectIsError,
//     isPending: organizedSubjectIsPending,
//   } = useQuery({
//     queryKey: ["subject", "organized-by-periods", subjectId],
//     queryFn: async () => {
//       const res = await apiClient.get(
//         `subjects/organized-by-periods/${subjectId}`
//       );
//       const data = await res.json<{ subject: Subject }>();
//       return data.subject;
//     },
//     enabled: !isVirtualSubject,
//   });

export const useOrganizedSpecificSubject = (subjectId: string) => 
    useQuery({
        queryKey: ["subject", "organized-by-periods", subjectId],
        queryFn: async () => {
            const res = await apiClient.get(`subjects/organized-by-periods/${subjectId}`);
            const data = await res.json<{ subject: Subject }>();

            // On April 1st, return modified subjects with low values
            if (isAprilFoolsDay()) {
                return {
                    ...data.subject,
                    grades: data.subject.grades.map((grade) => {
                        // Create a Grade object that can be passed to the modifier function
                        const fullGrade: Grade = {
                            ...grade,
                            subject: { id: data.subject.id, name: data.subject.name, isDisplaySubject: data.subject.isDisplaySubject, isMainSubject: data.subject.isMainSubject },
                        } as Grade;

                        return modifyGradeForAprilFools(fullGrade);
                    }),
                };
            }

            return data.subject;
        },
    });
