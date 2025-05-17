import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import ManageCards from "./manage-cards";
import { useTranslations } from "next-intl";
import { useState } from "react";

export interface ManageCardsButtonProps {
  page?: "dashboard" | "grade" | "subject";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ManageCardsButton({
  page = "dashboard",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ManageCardsButtonProps) {
  const t = useTranslations("Dashboard.Components.ManageCardsButton");
  const [internalOpen, setInternalOpen] = useState(false);

  // Allow both controlled and uncontrolled usage
  const isControlled =
    controlledOpen !== undefined && controlledOnOpenChange !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        {t("customizeCards")}
      </Button>

      <ManageCards page={page} open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
