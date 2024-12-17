"use client";

import { UploadButton } from "@/components/buttons/upload-button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const UpdateAvatar = () => {
  const toast = useToast();
  const router = useRouter();

  return (
    <UploadButton
      endpoint="avatarUploader"
      onClientUploadComplete={() => {
        toast.toast({
          title: "✅ Avatar modifier avec succès !",
          description: "Votre avatar a été modifié avec succès.",
        });

        router.refresh();
      }}
      onUploadError={(err) => {
        if (err.code === "TOO_LARGE") {
          toast.toast({
            title: "❌ Erreur",
            description:
              "Le fichier que vous avez essayé d'upload est trop volumineux.",
          });

          return;
        }

        toast.toast({
          title: "❌ Erreur",
          description:
            "Une erreur est survenue lors de l'upload de votre avatar. Réesayez plus tard.",
        });

        console.log(err);
      }}
    />
  );
};

export default UpdateAvatar;
