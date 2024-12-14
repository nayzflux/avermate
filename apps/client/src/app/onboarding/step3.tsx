import AddGradeDialog from "@/components/dialogs/add-grade-dialog";
import AddSubjectDialog from "@/components/dialogs/add-subject-dialog";
import errorStateCard from "@/components/skeleton/error-card";
import GradeBadge from "@/components/tables/grade-badge";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { GetSubjectsResponse } from "@/types/get-subjects-response";
import { Subject } from "@/types/subject";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";

// export default function Step3() {
//   const {
//     data: subjects,
//     isError,
//     isLoading,
//   } = useQuery({
//     queryKey: ["subjects"],
//     queryFn: async () => {
//       const res = await apiClient.get("subjects");
//       const data = await res.json<GetSubjectsResponse>();
//       return data.subjects;
//     },
//   });

//   if (isLoading) {
//     return <div>Loading subjects...</div>;
//   }

//   if (isError) {
//     return <div>Error loading subjects</div>;
//   }

//   const renderSubjects = (
//     subjects: Subject[],
//     parentId: string | null = null
//   ) =>
//     subjects
//       .filter((subject: Subject) => subject.parentId === parentId)
//       .map((subject: Subject) => (
//         <div key={subject.id} className="pl-4">
//           <div className="flex items-center justify-between">
//             <div>{subject.name}</div>
//             <div className="flex items-center gap-2">
//               <AddGradeDialog>
//                 <Button size="icon" variant="outline">
//                   <PlusCircleIcon className="size-4" />
//                 </Button>
//               </AddGradeDialog>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button size="icon" variant="outline">
//                     <EllipsisVerticalIcon className="size-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem asChild>
//                     <UpdateSubjectDialog subjectId={subject.id} />
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <DeleteSubjectDialog subject={subject} />
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {subject.grades?.map((grade) => (
//               <GradeBadge
//                 key={grade.id}
//                 value={grade.value}
//                 outOf={grade.outOf}
//                 coefficient={grade.coefficient}
//                 id={grade.id}
//                 periodId={grade.periodId}
//               />
//             ))}
//           </div>
//           {renderSubjects(subjects, subject.id)}
//         </div>
//       ));

//   return (
//     <div className="flex flex-col gap-4">
//       <h2 className="text-2xl font-bold text-primary">Subjects</h2>
//       <AddSubjectDialog>
//         <Button variant="outline">
//           <PlusCircleIcon className="size-4 mr-2" />
//           Add Subject
//         </Button>
//       </AddSubjectDialog>
//       <div>{renderSubjects(subjects ?? [])}</div>
//     </div>
//   );
// }

export default function Step3() {
  const {
    data: subjects,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<GetSubjectsResponse>();
      return data.subjects;
    },
  });

  if (isLoading) {
    return <div></div>;
  }

  if (isError) {
    return errorStateCard();
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8">
        <h2 className="text-2xl font-bold text-primary">Notes</h2>
        <p className="text-muted-foreground text-justify">
          Il semble que vous n&apos;ayez pas encore ajouté de matières. Veuillez
          ajouter des matières pour pouvoir ajouter des notes.
        </p>

        <AddSubjectDialog>
          <Button variant="outline">
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une matière
          </Button>
        </AddSubjectDialog>
      </div>
    );
  }

  const renderSubjects = (
    subjects: Subject[],
    parentId: string | null = null,
    level: number = 0
  ) =>
    subjects
      .filter((subject: Subject) => subject.parentId === parentId)
      .map((subject: Subject) => (
        <div
          key={subject.id}
          className={`${
            level > 0 ? "border-l-2 border-gray-300 pl-2 md:pl-4 " : ""
          }`}
        >
          <div className="flex md:flex-row md:items-center justify-between min-w-0 gap-4">
            <div className="flex items-center space-x-2  flex-1 min-w-0">
              <span className="font-bold truncate">{subject.name}</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {!subject.isDisplaySubject && (
                <AddGradeDialog parentId={subject.id}>
                  <Button variant="outline" size="icon">
                    <PlusCircleIcon className="size-4" />
                  </Button>
                </AddGradeDialog>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pb-2">
            {subject.grades?.map((grade) => (
              <GradeBadge
                key={grade.id}
                value={grade.value}
                outOf={grade.outOf}
                coefficient={grade.coefficient}
                id={grade.id}
                periodId={grade.periodId}
              />
            ))}
          </div>
          {renderSubjects(subjects, subject.id, level + 1)}
        </div>
      ));

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-primary">Subjects</h2>
      <div>{renderSubjects(subjects ?? [])}</div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <AddGradeDialog>
          <Button variant="outline">
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une nouvelle note
          </Button>
        </AddGradeDialog>
      </div>
    </div>
  );
}
