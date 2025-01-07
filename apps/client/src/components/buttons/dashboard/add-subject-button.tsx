import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

export default function AddSubjectButton() {
  const t = useTranslations("Dashboard.Buttons.AddSubjectButton");

  return (
    <Button variant="outline">
      <PlusCircleIcon className="size-4 mr-2" />
      {t("addSubject")}
    </Button>
  );
}
