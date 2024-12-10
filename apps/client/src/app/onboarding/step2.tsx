import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { GetSubjectsResponse } from "@/types/get-subjects-response";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  PlusCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import AddSubjectDialog from "@/components/dialogs/add-subject-dialog";
import UpdateSubjectDialog from "@/components/dialogs/update-subject-dialog";
import DeleteSubjectDialog from "@/components/dialogs/delete-subject-dialog";
import { Subject } from "@/types/subject";
import { Badge } from "@/components/ui/badge";
import errorStateCard from "@/components/skeleton/error-card";
import ListPresetsDialog from "@/components/dialogs/list-presets-dialog";

export default function Step2() {
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
    return <div>Loading subjects...</div>;
  }

  if (isError) {
    return errorStateCard();
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-primary">Matières</h2>
        <p className="text-muted-foreground text-justify">
          Avant d'ajouter votre première matière quelques choses à savoir:
          <br />
          <ul>
            <li>
              Les matières peuvent être configurées comme "matière principale"
              ces matières seront affichées dans les données et les graphiques
              de la page d'accueil. Il faut donc marquer les matières comme
              Mathématiques, Français, Anglais, etc. comme matières principales.
            </li>
            <br />
            <li>
              Les matières peuvent être configurées comme "catégories". Elles
              n'ont pas d'existance propre, mais permettent de regrouper des
              matières pour mieux les organiser. Par exemple, vous pouvez créer
              une catégorie "Langues" et y ajouter les matières "Anglais",
              "Espagnol", "Allemand", etc. Pour calculer la moyenne on ne fera
              pas la moyenne de la catégorie mais c'est comme si les matières de
              la catégorie étaient regroupées hors de la catégorie.
            </li>
            <br />
            <li>
              Les matières peuvent être regroupées en "sous-matières". Par
              exemple, si vous avez une matière "Mathématiques" vous pouvez
              créer des sous-matières "Ecrit" et "Oral" si elles sont notées
              différemment. Les sous-matières permettent de mieux organiser les
              notes et de calculer des moyennes
            </li>
          </ul>
        </p>
      <div className="flex flex-row items-center justify-center space-x-4">
        <AddSubjectDialog>
          <Button variant="outline">
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une matière
          </Button>
        </AddSubjectDialog>
        <ListPresetsDialog>
          <Button>
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une préconfiguration
          </Button>
          </ListPresetsDialog>
          </div>
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
          <div className="flex md:flex-row md:items-center justify-between min-w-0 pb-4 gap-4">
            <div className="flex items-center space-x-2  flex-1 min-w-0">
              <span className="font-bold truncate">{subject.name}</span>
              {!subject.isDisplaySubject && (
                <span className="text-sm text-muted-foreground">
                  ({subject.coefficient / 100})
                </span>
              )}
              {subject.isMainSubject && (
                <>
                  <span className="hidden md:block text-xs text-blue-500">
                    Matière Principale
                  </span>
                  <Badge className="bg-blue-500 block md:hidden py-0 px-0 w-2 h-2 min-w-2" />
                </>
              )}
              {subject.isDisplaySubject && (
                <>
                  <span className="hidden md:block text-xs text-green-500">
                    Catégorie
                  </span>
                  <Badge className="bg-green-500 block md:hidden py-0 px-0 w-2 h-2 min-w-2" />
                </>
              )}
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <AddSubjectDialog parentId={subject.id}>
                <Button variant="outline" size="icon">
                  <PlusCircleIcon className="size-4" />
                </Button>
              </AddSubjectDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline">
                    <EllipsisVerticalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <UpdateSubjectDialog subjectId={subject.id} />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <DeleteSubjectDialog
                      subject={subject}
                      backOnDelete={false}
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {renderSubjects(subjects, subject.id, level + 1)}
        </div>
      ));

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-primary">Subjects</h2>
      <div>{renderSubjects(subjects ?? [])}</div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <AddSubjectDialog>
          <Button variant="outline">
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une nouvelle matière
          </Button>
        </AddSubjectDialog>
      </div>
    </div>
  );
}
