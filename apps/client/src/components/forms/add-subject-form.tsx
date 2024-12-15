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
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "../ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState, useRef, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/components/ui/use-media-query";

const addSubjectSchema = z.object({
  name: z.string().min(1).max(64),
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
  parentId?: string;
}) => {
  const toaster = useToast();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [openParent, setOpenParent] = useState(false);

  const parentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDesktop && openParent) {
      setTimeout(() => parentInputRef.current?.focus(), 350);
    }
  }, [openParent, isDesktop]);

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{ subjects: Subject[] }>();
      return data.subjects;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-subject"],
    mutationFn: async ({
      name,
      coefficient,
      parentId,
      isMainSubject,
      isDisplaySubject,
    }: AddSubjectSchema) => {
      const res = await apiClient.post("subjects", {
        json: { name, coefficient, parentId, isMainSubject, isDisplaySubject },
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      toaster.toast({
        title: `Matière ajoutée avec succès !`,
        description:
          "Ajouter des notes à cette matière pour suivre votre progression.",
      });
      close();
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
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

  useEffect(() => {
    if (isDisplaySubject) {
      form.setValue("coefficient", 1);
    }
  }, [isDisplaySubject, form]);

  const onSubmit = (values: AddSubjectSchema) => {
    mutate(values);
  };

  return (
    <div>
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
              <FormItem className="mx-1">
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
              <FormItem className="col-span-2 mx-1">
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
                    Les catégories ne prennent pas en compte le coefficient.
                  </FormDescription>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isMainSubject"
            render={({ field }) => (
              <FormItem className="mx-1">
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
              <FormItem className="mx-1">
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
                  comme au niveau supérieur. Impossible d&apos;y ajouter des
                  notes.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Responsive Combobox for ParentId */}
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem className="flex flex-col mx-1">
                <FormLabel>
                  Sous-matière <Badge className="ml-2">Optionnel</Badge>
                </FormLabel>
                {isDesktop ? (
                  <Popover
                    modal
                    open={openParent}
                    onOpenChange={(isOpen) => setOpenParent(isOpen)}
                  >
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openParent ? "true" : "false"}
                          className="justify-between"
                          onClick={() => setOpenParent(!openParent)}
                        >
                          {field.value
                            ? subjects?.find((s) => s.id === field.value)?.name
                            : "Choisir une matière parente"}
                          <ChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="p-0 min-w-[var(--radix-popover-trigger-width)]">
                      <Command>
                        <CommandInput
                          placeholder="Choisir une matière"
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Aucune matière trouvée</CommandEmpty>
                          <CommandGroup>
                            {subjects
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
                                    setOpenParent(false);
                                  }}
                                >
                                  <span>{subject.name}</span>
                                  {form.getValues("parentId") ===
                                    subject.id && (
                                    <CheckIcon className="ml-auto h-4 w-4" />
                                  )}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Drawer open={openParent} onOpenChange={setOpenParent}>
                    <DrawerTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openParent ? "true" : "false"}
                          className="justify-between"
                          onClick={() => setOpenParent(!openParent)}
                        >
                          {field.value
                            ? subjects?.find((s) => s.id === field.value)?.name
                            : "Choisir une matière parente"}
                          <ChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </FormControl>
                    </DrawerTrigger>
                    <DrawerContent>
                      <Command>
                        <CommandInput
                          ref={parentInputRef}
                          placeholder="Choisir une matière"
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Aucune matière trouvée</CommandEmpty>
                          <CommandGroup>
                            {subjects
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
                                    setOpenParent(false);
                                  }}
                                >
                                  <span>{subject.name}</span>
                                  {form.getValues("parentId") ===
                                    subject.id && (
                                    <CheckIcon className="w-4 h-4 ml-auto" />
                                  )}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DrawerContent>
                  </Drawer>
                )}
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
