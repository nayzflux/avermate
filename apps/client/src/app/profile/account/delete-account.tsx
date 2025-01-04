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
      <div className="flex flex-col gap-4 ">
        <Separator className="bg-red-500 bg-opacity-40" />
        <div className="flex justify-end">
          <DeleteAccountDialog />
        </div>
      </div>
    </ProfileSection>
  );
}
