"use client";

import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Subject } from "@/types/subject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "../ui/command";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

const updateSubjectSchema = z.object({
  name: z.string().min(1).max(64),
  coefficient: z.coerce.number().min(0).max(1000),
  parentId: z
    .string()
    .max(64)
    .optional()
    .transform((val) => (val === "none" ? null : val))
    .nullable(),
  isMainSubject: z.boolean().optional(),
  isDisplaySubject: z.boolean().optional(),
});

type UpdateSubjectSchema = z.infer<typeof updateSubjectSchema>;

export const UpdateSubjectForm = ({
  close,
  subject,
}: {
  close: () => void;
  subject: Subject;
}) => {
  const [open, setOpen] = useState(false);
  const [parentInputValue, setParentInputValue] = useState("");
  const toaster = useToast();

  const queryClient = useQueryClient();

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{
        subjects: Subject[];
      }>();
      return data.subjects;
    },
  });

  const filteredSubjects = subjects?.filter((s) => s.id !== subject.id);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-subject"],
    mutationFn: async ({
      name,
      coefficient,
      parentId,
      isMainSubject,
      isDisplaySubject,
    }: UpdateSubjectSchema) => {
      //console.log(parentId);
      const res = await apiClient.patch(`subjects/${subject.id}`, {
        json: {
          name,
          coefficient,
          parentId,
          isMainSubject,
          isDisplaySubject,
        },
      });

      const data = await res.json<{ subject: Subject }>();
      return data.subject;
    },
    onSuccess: () => {
      toaster.toast({
        title: `Matière modifiée avec succès !`,
        description: "Votre matière a été mise à jour.",
      });

      close();

      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["subject", subject.id],
      });
    },

    onError: () => {
      toaster.toast({
        title: "Erreur",
        description:
          "Impossible de mettre à jour la matière. Réessayer plus tard.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<UpdateSubjectSchema>({
    resolver: zodResolver(updateSubjectSchema),
    defaultValues: {
      name: subject.name,
      coefficient: subject.coefficient / 100,
      parentId: subject.parentId ?? "none",
      isMainSubject: subject.isMainSubject,
      isDisplaySubject: subject.isDisplaySubject,
    },
  });

  const onSubmit = (values: UpdateSubjectSchema) => {
    mutate(values);
  };

  // When the popover opens, set the input value to the currently selected parent's name (if any)
  useEffect(() => {
    if (open) {
      const parentId = form.getValues("parentId");
      setParentInputValue(
        parentId && parentId !== "none"
          ? filteredSubjects?.find((s) => s.id === parentId)?.name || ""
          : ""
      );
    }
  }, [open, filteredSubjects, form]);

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input type="text" placeholder={subject.name} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coefficient"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Coefficient</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={(subject.coefficient / 100).toString()}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isMainSubject"
            render={({ field }) => (
              <FormItem>
                <div className="col-span-2 flex flex-row gap-4 items-center">
                  <FormLabel>Matière principale</FormLabel>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
                <FormMessage />
                <FormDescription>
                  Les matières principales sont affichées en premier dans la
                  tableau de bord.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isDisplaySubject"
            render={({ field }) => (
              <FormItem>
                <div className="col-span-2 flex flex-row gap-4 items-center">
                  <FormLabel>Catégorie</FormLabel>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
                <FormMessage />
                <FormDescription>
                  Les catégories ne comptent pas dans la moyenne générale. Elles
                  regroupent des matières, mais leurs enfants sont calculés
                  comme au niveau supérieur. Impossible d'y ajouter des notes.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Sous-matière <Badge className="ml-2">Optionnel</Badge>
                </FormLabel>
                <Popover
                  modal
                  open={open}
                  onOpenChange={(isOpen) => setOpen(isOpen)}
                >
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open ? "true" : "false"}
                        className="justify-between"
                      >
                        {field.value && field.value !== "none"
                          ? filteredSubjects?.find((s) => s.id === field.value)
                              ?.name
                          : "Choisir une matière parente"}
                        <ChevronUpDownIcon className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent
                    className="p-0 min-w-[var(--radix-popover-trigger-width)]"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        placeholder="Choisir une matière parente"
                        value={parentInputValue}
                        onValueChange={setParentInputValue}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Aucune matière trouvée</CommandEmpty>
                        <CommandGroup>
                          {filteredSubjects
                            ?.slice()
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((subject) => (
                              <CommandItem
                                key={subject.id}
                                value={subject.name}
                                onSelect={() => {
                                  form.setValue("parentId", subject.id, {
                                    shouldValidate: true,
                                  });
                                  setOpen(false);
                                }}
                              >
                                <span>{subject.name}</span>
                                {form.getValues("parentId") === subject.id && (
                                  <CheckIcon className="w-4 h-4 ml-auto" />
                                )}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
                <FormDescription>
                  Une matière parente regroupe plusieurs sous-matières,
                  facilitant leur organisation.
                </FormDescription>
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin mr-2 size-4" />}
            Modifier la matière
          </Button>
        </form>
      </Form>
    </div>
  );
};
