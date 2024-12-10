"use client";

import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Subject } from "@/types/subject";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, ChevronDownIcon, Loader2Icon } from "lucide-react";
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
import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

const addSubjectSchema = z.object({
  name: z.string().min(1).max(64),
  // Coefficient is a float number
  coefficient: z.coerce.number().min(0).max(1000),
  parentId: z
    .string()
    .max(64)
    .optional()
    .transform((val) => (val === "" || val === "none" ? null : val)),
  isMainSubject: z.boolean().optional(),
  isDisplaySubject: z.boolean().optional(),
});

type AddSubjectSchema = z.infer<typeof addSubjectSchema>;

export const AddSubjectForm = ({
  close,
  parentId,
}: {
  close: () => void;
  parentId? : string;
}) => {
  const [open, setOpen] = useState(false);
  const toaster = useToast();
  const queryClient = useQueryClient();

  const { data: subects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{
        subjects: Subject[];
      }>();
      return data.subjects;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-Subject"],
    mutationFn: async ({
      name,
      coefficient,
      parentId,
      isMainSubject,
      isDisplaySubject,
    }: AddSubjectSchema) => {
      const res = await apiClient.post("subjects", {
        json: {
          name,
          coefficient,
          parentId,
          isMainSubject,
          isDisplaySubject,
        },
      });

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      toaster.toast({
        title: `Matière ajoutée avec succès !`,
        description:
          "Ajouter des notes à cette matière pour commencer à suivre votre progression.",
      });

      close();

      queryClient.invalidateQueries({
        queryKey: ["Subjects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });
    },

    onError: () => {
      toaster.toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Réessayez plus tard.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<AddSubjectSchema>({
    resolver: zodResolver(addSubjectSchema),
    defaultValues: {
      name: "",
      parentId: parentId?.toString() || "",
      isDisplaySubject: false,
      isMainSubject: false,
      coefficient: undefined,
    },
  });

  const isDisplaySubject = form.watch("isDisplaySubject");

  // Update coefficient when category is toggled on
  useEffect(() => {
    if (isDisplaySubject) {
      form.setValue("coefficient", 1);
    }
  }, [isDisplaySubject, form]);

  const onSubmit = (values: AddSubjectSchema) => {
    mutate(values);
  };

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
                  <Input type="text" placeholder="Mathématiques" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coefficient"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Coefficient</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2"
                    {...field}
                    disabled={isPending || isDisplaySubject}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
                {isDisplaySubject && (
                  <FormDescription>
                    Les catégories ne prennent pas en compte le coefficient
                  </FormDescription>
                )}
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
                  Les matières principales sont affichées en premier dans le
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
                        onClick={() => setOpen(!open)}
                      >
                        {field.value
                          ? subects?.find(
                              (subject) => subject.id === field.value
                            )?.name
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
                        className=" h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Aucune matière trouvée</CommandEmpty>
                        <CommandGroup>
                          {subects
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
            Ajouter une matière
          </Button>
        </form>
      </Form>
    </div>
  );
};
