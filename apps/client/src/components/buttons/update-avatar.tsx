"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { UploadButton as OriginalUploadButton } from "@/components/buttons/upload-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import getCroppedImg from "@/utils/cropImage"; // Ensure this utility is correctly implemented
import { Area } from "react-easy-crop";
import isAnimated from "@frsource/is-animated"; // Import the library

const UpdateAvatar = () => {
  const toast = useToast();
  const router = useRouter();

  // State for cropping
  const [isCropping, setIsCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  // Ref to store the resolve function of the cropping promise
  const croppingPromiseRef = useRef<(file: File | null) => void>();

  // Ref to store the current object URL for cleanup
  const objectUrlRef = useRef<string | null>(null);

  // Cleanup object URLs when component unmounts or imageSrc changes
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  // Function to handle the cropping and resolve the promise
  const handleCropComplete = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      // Get the cropped image as a blob
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Convert the blob to a File object
      const croppedFile = new File([croppedBlob], "avatar.png", {
        type: "image/png",
      });

      // Resolve the promise with the cropped file
      if (croppingPromiseRef.current) {
        croppingPromiseRef.current(croppedFile);
      }

      // Cleanup
      setIsCropping(false);
      setImageSrc(null);
      setCroppedAreaPixels(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);

      // Revoke the object URL
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.toast({
        title: "❌ Erreur",
        description: "Une erreur est survenue lors du recadrage de l'image.",
      });
      setIsCropping(false);
      setImageSrc(null);
      setCroppedAreaPixels(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);

      // Revoke the object URL
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    }
  }, [imageSrc, croppedAreaPixels, toast]);

  // Function to handle cancellation of cropping
  const handleCancelCrop = () => {
    // Resolve the promise with null to cancel the upload
    if (croppingPromiseRef.current) {
      croppingPromiseRef.current(null);
    }

    // Cleanup
    setIsCropping(false);
    setImageSrc(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);

    // Revoke the object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  // onBeforeUploadBegin implementation
  const handleBeforeUpload = useCallback(
    async (files: File[]) => {
      return new Promise<File[]>((resolve, reject) => {
        if (!files || files.length === 0) {
          reject(new Error("No file selected."));
          return;
        }

        const file = files[0];

        if (!file.type.startsWith("image/")) {
          toast.toast({
            title: "❌ Erreur",
            description: "Veuillez sélectionner un fichier image valide.",
          });
          reject(new Error("Invalid file type."));
          return;
        }

        // Read the file as ArrayBuffer to check if it's animated
        const reader = new FileReader();
        reader.onload = async (e) => {
          const buffer = e.target?.result;
          if (buffer && buffer instanceof ArrayBuffer) {
            try {
              const animated = await isAnimated(buffer);
              if (animated) {
                // Skip cropping and resolve immediately
                resolve([file]);
              } else {
                // Proceed with cropping
                initiateCropping(file, resolve, reject);
              }
            } catch (error) {
              console.error("Error detecting animation:", error);
              toast.toast({
                title: "❌ Erreur",
                description:
                  "Une erreur est survenue lors de la détection de l'animation de l'image.",
              });
              reject(new Error("Failed to detect image animation."));
            }
          } else {
            // Unable to read the file as ArrayBuffer
            toast.toast({
              title: "❌ Erreur",
              description: "Impossible de lire le fichier image.",
            });
            reject(new Error("Unable to read file."));
          }
        };
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          toast.toast({
            title: "❌ Erreur",
            description:
              "Une erreur est survenue lors de la lecture du fichier.",
          });
          reject(new Error("FileReader error."));
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [toast]
  );

  // Helper function to initiate cropping
  const initiateCropping = (
    file: File,
    resolve: (value: File[] | PromiseLike<File[]>) => void,
    reject: (reason?: any) => void
  ) => {
    // Create a URL for the image to be cropped
    const imageURL = URL.createObjectURL(file);
    objectUrlRef.current = imageURL; // Store the URL for later cleanup
    setImageSrc(imageURL);
    setIsCropping(true);

    // Store the resolve function to be called after cropping
    croppingPromiseRef.current = (croppedFile: File | null) => {
      if (croppedFile) {
        resolve([croppedFile]);
      } else {
        reject(new Error("Cropping canceled."));
      }
    };
  };

  return (
    <>
      <OriginalUploadButton
        endpoint="avatarUploader"
        className="flex flex-col items-center w-full"
        appearance={{
          button({ ready, isUploading }) {
            return buttonVariants({
              variant: "default",
              size: "default",
              className: `w-full ${
                isUploading || !ready ? "opacity-50 pointer-events-none" : ""
              }`,
            });
          },
          container: "flex flex-col items-center space-y-2",
          allowedContent: "text-sm text-muted-foreground mt-1",
        }}
        content={{
          button({ ready, isUploading }) {
            if (isUploading) {
              return (
                <span className="flex items-center dark:text-black">
                  <Loader2Icon className="animate-spin mr-2 size-4" />
                  Modifier l&apos;avatar
                </span>
              );
            }
            return ready ? (
              <span className="dark:text-black">Modifier l&apos;avatar</span>
            ) : (
              <span className="flex items-center dark:text-black">
                <Loader2Icon className="animate-spin mr-2 size-4" />
                Modifier l&apos;avatar
              </span>
            );
          },
          allowedContent() {
            return "Formats images acceptés. Poids Max: 4MB.";
          },
        }}
        onBeforeUploadBegin={handleBeforeUpload}
        onClientUploadComplete={async (files) => {
          if (!files?.length) return;

          const uploadedFile = files[0];
          try {
            // Update user profile picture
            await authClient.updateUser({ image: uploadedFile.url })

            // Show success message
            toast.toast({
              title: "✅ Avatar modifié avec succès !",
              description: "Votre avatar a été mis à jour avec succès.",
            });

            // Refresh the page to update all avatar instances
            router.refresh();
          } catch (error) {
            console.error("Failed to update avatar:", error);

            // Show error message
            toast.toast({
              title: "❌ Erreur",
              description:
                "Une erreur est survenue lors de la mise à jour de l'avatar.",
            });
          }
        }}
        onUploadError={(err) => {
          if (err.code === "TOO_LARGE") {
            toast.toast({
              title: "❌ Erreur",
              description:
                "Le fichier que vous avez essayé d'uploader est trop volumineux.",
            });

            return;
          }

          toast.toast({
            title: "❌ Erreur",
            description:
              "Une erreur est survenue lors de l'upload de votre avatar. Réesayez plus tard.",
          });

          console.error(err);
        }}
        onUploadBegin={() => {
          toast.toast({
            title: "🔄 Upload de l'avatar en cours...",
            description: "Merci de patienter quelques instants.",
          });
        }}
      />

      {/* Cropping Dialog */}
      {isCropping && imageSrc && (
        <Dialog open={isCropping} onOpenChange={setIsCropping}>
          <DialogContent className="w-[90%] max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Recadrez votre avatar
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full h-64 bg-background">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  objectFit="contain"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(croppedArea, croppedAreaPixels) => {
                    setCroppedAreaPixels(croppedAreaPixels);
                  }}
                  //borderRadius={50}
                  style={{
                    containerStyle: {
                      borderRadius: "6px",
                    },
                  }}
                />
              </div>
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="secondary"
                onClick={handleCancelCrop}
                className="mr-2"
              >
                Annuler
              </Button>
              <Button
                onClick={handleCropComplete}
                className={buttonVariants({
                  variant: "default",
                  size: "default",
                })}
              >
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UpdateAvatar;
