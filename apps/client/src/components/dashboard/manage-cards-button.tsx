import { LayoutGrid } from "lucide-react";
import ManageCards from "./manage-cards";

interface ManageCardsButtonProps {
  page: "dashboard" | "grade" | "subject";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ManageCardsButton({
  page,
  open,
  onOpenChange,
}: ManageCardsButtonProps) {
  return <ManageCards open={open} onOpenChange={onOpenChange} page={page} />;
}
