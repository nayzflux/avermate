"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import { Check, ChevronsUpDown } from "lucide-react";
import { authClient } from "@/lib/auth";
import { Session, User } from "better-auth/types";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/components/ui/use-media-query";
import { handleError } from "@/utils/error-utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Feedback schema validation
const feedbackSchema = z.object({
  type: z.enum(["Général", "Bug", "Suggestion"]),
  subject: z.string().min(1, "Un titre est requis"),
  content: z
    .string()
    .min(10, "La remarque doit contenir au moins 10 caractères"),
  image: z.string().optional(), // Base64 image input
  email: z.string().email("Adresse email invalide"),
});

type FeedbackSchema = z.infer<typeof feedbackSchema>;

const feedbackTypes = [
  { id: "Général", name: "Général" },
  { id: "Bug", name: "Bug" },
  { id: "Suggestion", name: "Suggestion" },
];

export const FeedbackForm = ({ close }: { close: () => void }) => {
  const toaster = useToast();
  const [openType, setOpenType] = useState(false); // For responsive combobox
  const typeInputRef = useRef<HTMLInputElement>(null); // For focus management
  const isDesktop = useMediaQuery("(min-width: 768px)"); // Responsive handling

  const { mutate, isPending } = useMutation({
    mutationKey: ["submit-feedback"],
    mutationFn: async (data: FeedbackSchema) => {
      const res = await apiClient.post("feedback", {
        json: data,
      });

      return res.json();
    },
    onSuccess: () => {
      toaster.toast({
        title: "Remarque envoyée",
        description:
          "Merci pour votre retour. Nous allons étudier votre remarque attentivement.",
      });
      close();
    },
    onError: (error) => {
      handleError(error, toaster, "Erreur lors de l'envoi de la remarque");
    },
  });

  // Ensure focus for accessibility when the combobox opens
  useEffect(() => {
    if (openType) {
      setTimeout(() => typeInputRef.current?.focus(), 300);
    }
  }, [openType]);

  const onSubmit = (values: FeedbackSchema) => {
    mutate(values);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onChange(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { data } = authClient.useSession() as unknown as {
    data: { user: User; session: Session };
  };

  const form = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "Général",
      subject: "",
      content: "",
      image: "",
      email: data?.user.email,
    },
  });

  const watchedType = useWatch({ control: form.control, name: "type" });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {/* Feedback Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col mx-1">
              <FormLabel>Type de remarque</FormLabel>
              {isDesktop ? (
                <Popover modal open={openType} onOpenChange={setOpenType}>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openType ? "true" : "false"}
                        className={cn(
                          "justify-between",
                          !watchedType && "text-muted-foreground"
                        )}
                      >
                        {watchedType || "Sélectionner le type de remarque"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent
                    align="center"
                    className="p-0 min-w-[var(--radix-popover-trigger-width)]"
                  >
                    <Command>
                      <CommandInput
                        ref={typeInputRef}
                        placeholder="Rechercher un type"
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Aucun type trouvé</CommandEmpty>
                        <CommandGroup>
                          {feedbackTypes.map((type) => (
                            <CommandItem
                              key={type.id}
                              value={type.name}
                              onSelect={() => {
                                form.setValue(
                                  "type",
                                  type.id as FeedbackSchema["type"],
                                  {
                                    shouldValidate: true,
                                  }
                                );
                                setOpenType(false);
                              }}
                            >
                              {type.name}
                              {watchedType === type.id && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : (
                <Drawer open={openType} onOpenChange={setOpenType}>
                  <DrawerTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openType ? "true" : "false"}
                        className={cn(
                          "justify-between",
                          !watchedType && "text-muted-foreground"
                        )}
                        onClick={() => setOpenType(!openType)}
                      >
                        {watchedType
                          ? feedbackTypes.find((t) => t.id === watchedType)
                              ?.name
                          : "Sélectionner le type de remarque"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </DrawerTrigger>
                  <DrawerContent>
                    <VisuallyHidden>
                      <DrawerTitle>Sélectionner un type de remarque</DrawerTitle>
                    </VisuallyHidden>
                    <div className="mt-4 border-t p-4">
                      <Command>
                        <CommandInput
                          ref={typeInputRef}
                          placeholder="Rechercher un type"
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Aucun type trouvé</CommandEmpty>
                          <CommandGroup>
                            {feedbackTypes.map((type) => (
                              <CommandItem
                                key={type.id}
                                value={type.name}
                                onSelect={() => {
                                  form.setValue(
                                    "type",
                                    type.id as FeedbackSchema["type"],
                                    {
                                      shouldValidate: true,
                                    }
                                  );
                                  setOpenType(false);
                                }}
                              >
                                {type.name}
                                {watchedType === type.id && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  </DrawerContent>
                </Drawer>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subject Field */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="mx-1">
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre de votre remarque" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content Field */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="mx-1">
              <FormLabel>Contenu</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez votre remarque en détail"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Base64 Image Upload Field */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="mx-1">
              <FormLabel>Ajouter une image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => handleImageChange(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Envoi en cours..." : "Envoyer"}
        </Button>
      </form>
    </Form>
  );
};
