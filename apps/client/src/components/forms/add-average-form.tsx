"use client";

import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Check,
  ChevronsUpDown,
  Loader2Icon,
  PlusCircle,
  Trash2,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/fr";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { handleError } from "@/utils/error-utils";
import { useMediaQuery } from "@/components/ui/use-media-query";

dayjs.locale("fr");

// Schema
const addCustomAverageSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(64, "Le nom est trop long"),
  subjects: z
    .array(
      z.object({
        id: z.string().min(1, "L'ID de la matière est requis"),
        customCoefficient: z
          .number()
          .min(1, "Le coefficient doit être au moins 1")
          .max(1000, "Le coefficient ne peut pas dépasser 1000")
          .nullable()
          .optional(),
        includeChildren: z.boolean().optional(),
      })
    )
    .min(1, "Au moins une matière doit être sélectionnée"),
  isMainAverage: z.boolean().optional().default(false),
});

type AddCustomAverageSchema = z.infer<typeof addCustomAverageSchema>;

export const AddAverageForm = ({ close }: { close: () => void }) => {
  const toaster = useToast();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [openSubjectIndex, setOpenSubjectIndex] = useState<number | null>(null);

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{ subjects: Subject[] }>();
      return data.subjects;
    },
  });

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationKey: ["create-custom-average"],
    mutationFn: async (formData: AddCustomAverageSchema) => {
      const res = await apiClient.post("averages", {
        json: {
          name: formData.name,
          subjects: formData.subjects,
          isMainAverage: formData.isMainAverage,
        },
      });
      if (!res.ok) {
        throw new Error(
          "Erreur lors de la création de la moyenne personnalisée."
        );
      }
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      toaster.toast({
        title: "Moyenne personnalisée créée avec succès !",
        description: "Votre moyenne personnalisée a été ajoutée.",
      });
      close();
      queryClient.invalidateQueries({ queryKey: ["customAverages"] });
    },
    onError: (error: any) => {
      handleError(error, toaster);
    },
  });

  const form = useForm<AddCustomAverageSchema>({
    resolver: zodResolver(addCustomAverageSchema),
    defaultValues: {
      name: "",
      subjects: [{ id: "", customCoefficient: null, includeChildren: false }],
      isMainAverage: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  const onSubmit = (values: AddCustomAverageSchema) => {
    const filteredSubjects = values.subjects.filter((s) => s.id !== "");
    if (filteredSubjects.length === 0) {
      toaster.toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une matière.",
        variant: "destructive",
      });
      return;
    }
    mutate({ ...values, subjects: filteredSubjects });
  };

  // Subject selection logic
  const subjectInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDesktop && openSubjectIndex !== null) {
      setTimeout(() => subjectInputRef.current?.focus(), 350);
    }
  }, [openSubjectIndex, isDesktop]);

  const setSubjectForIndex = (index: number, subjectId: string) => {
    form.setValue(`subjects.${index}.id`, subjectId, { shouldValidate: true });
    setOpenSubjectIndex(null);
  };

  // Render a single subject field row
  const renderSubjectField = (index: number, fieldItem: { id: string }) => {
    const selectedSubjectId = form.getValues(`subjects.${index}.id`);
    const selectedSubjectName = subjects?.find(
      (s) => s.id === selectedSubjectId
    )?.name;

    return (
      <div
        key={fieldItem.id}
        className="flex flex-col gap-4 border p-4 rounded"
      >
        {/* Subject selection */}
        <FormField
          control={form.control}
          name={`subjects.${index}.id`}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Matière</FormLabel>
              {isDesktop ? (
                <Popover
                  modal
                  open={openSubjectIndex === index}
                  onOpenChange={(open) =>
                    setOpenSubjectIndex(open ? index : null)
                  }
                >
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSubjectIndex === index}
                        className="justify-between w-full"
                        disabled={isSubmitting}
                      >
                        {selectedSubjectName || "Choisir une matière"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="p-0 min-w-[var(--radix-popover-trigger-width)]">
                    <Command>
                      <CommandInput
                        placeholder="Rechercher une matière..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Aucune matière trouvée.</CommandEmpty>
                        <CommandGroup>
                          {subjects
                            ?.slice()
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((subject) => (
                              <CommandItem
                                key={subject.id}
                                value={subject.name}
                                onSelect={() =>
                                  setSubjectForIndex(index, subject.id)
                                }
                              >
                                <span>{subject.name}</span>
                                {field.value === subject.id && (
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
                <>
                  <Drawer
                    open={openSubjectIndex === index}
                    onOpenChange={(open) =>
                      setOpenSubjectIndex(open ? index : null)
                    }
                  >
                    <DrawerTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSubjectIndex === index}
                          className="justify-between w-full"
                          onClick={() => setOpenSubjectIndex(index)}
                          disabled={isSubmitting}
                        >
                          {selectedSubjectName || "Choisir une matière"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="mt-4 border-t p-4">
                        <Command>
                          <CommandInput
                            ref={subjectInputRef}
                            placeholder="Rechercher une matière..."
                            className="h-9"
                            autoFocus
                          />
                          <CommandList>
                            <CommandEmpty>Aucune matière trouvée.</CommandEmpty>
                            <CommandGroup>
                              {subjects
                                ?.slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((subject) => (
                                  <CommandItem
                                    key={subject.id}
                                    value={subject.name}
                                    onSelect={() =>
                                      setSubjectForIndex(index, subject.id)
                                    }
                                  >
                                    <span>{subject.name}</span>
                                    {field.value === subject.id && (
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
                </>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Custom Coefficient */}
        <FormField
          control={form.control}
          name={`subjects.${index}.customCoefficient`}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>
                Coefficient personnalisé{" "}
                <Badge className="ml-2">Optionnel</Badge>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1"
                  min={1}
                  max={1000}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Include Children */}
        <FormField
          control={form.control}
          name={`subjects.${index}.includeChildren`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-4">
              <FormLabel>Inclure les sous matières</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remove subject button */}
        {fields.length > 1 && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => remove(index)}
            disabled={isSubmitting}
            className="mt-2"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Retirer cette matière
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mx-1">
                <FormLabel>Nom de la moyenne personnalisée</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Moyenne Semestre 1"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* isMainAverage Switch */}
          <FormField
            control={form.control}
            name="isMainAverage"
            render={({ field }) => (
              <FormItem className="mx-1 flex flex-row items-center gap-4">
                <FormLabel>Afficher sur la page principale</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subjects */}
          <div className="flex flex-col gap-4 mx-1">
            <FormLabel>Matières</FormLabel>
            <div className="flex flex-col gap-4">
              {fields.map((fieldItem, index) =>
                renderSubjectField(index, fieldItem)
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({
                  id: "",
                  customCoefficient: null,
                  includeChildren: false,
                })
              }
              disabled={isSubmitting}
              className="mt-2 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Ajouter une matière
            </Button>
          </div>

          {/* Submit */}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
            )}
            Créer la moyenne personnalisée
          </Button>
        </form>
      </Form>
    </div>
  );
};
