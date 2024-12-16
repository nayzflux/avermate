import DeleteAccountDialog from "@/components/dialogs/delete-account-dialog";
import { Separator } from "@/components/ui/separator";
import ProfileSection from "../profile-section";

export default function DeleteAccount() {
  return (
    <ProfileSection
      title="Supprimer le compte"
      description="Supprimez votre compte définitivement de Avermate"
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
