import AddGradeDialog from "@/components/dialogs/add-grade-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const AddGradeButton = ({ disabled }: { disabled?: boolean }) => {
  const t = useTranslations("Dashboard.Pages.GradesPage"); // Initialize t

  return (
    <AddGradeDialog>
      <div>
        <div className="hidden lg:flex">
          <Button disabled={disabled}>
            <PlusCircleIcon className="size-4 mr-2" />
            {t("addGrade")}
          </Button>
        </div>

        <div className="flex lg:hidden">
          <Button size="icon" disabled={disabled}>
            <PlusCircleIcon className="size-4" />
          </Button>
        </div>
      </div>
    </AddGradeDialog>
  );
};
