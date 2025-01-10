import DeleteAccountDialog from "@/components/dialogs/delete-account-dialog";
import { Separator } from "@/components/ui/separator";
import ProfileSection from "../profile-section";
import { useTranslations } from "next-intl";

export default function DeleteAccount() {
  const t = useTranslations("Settings.Account.DeleteAccount");

  return (
    <ProfileSection
      title={t("title")}
      description={t("description")}
      className="border-red-500"
    >
      <DeleteAccountDialog />
    </ProfileSection>
  );
}
