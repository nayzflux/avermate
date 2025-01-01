"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
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
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/components/ui/use-media-query";
import { useSubjects } from "@/hooks/use-subjects";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Subject } from "@/types/subject";
import { handleError } from "@/utils/error-utils";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "../ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
  const [openParent, setOpenParent] = useState(false);
  const [parentInputValue, setParentInputValue] = useState("");
  const toaster = useToast();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const parentInputRef = useRef<HTMLInputElement>(null);

  // Focus the CommandInput inside the Drawer whenever it opens on mobile
  useEffect(() => {
    if (!isDesktop && openParent) {
      setTimeout(() => parentInputRef.current?.focus(), 350);
    }
  }, [openParent, isDesktop]);

  const { data: subjects } = useSubjects();

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

      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["subject", subject.id] });
    },
    onError: (error) => {
      handleError(error, toaster, "Erreur lors de la modification de la matière.");
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

  const isDisplaySubject = form.watch("isDisplaySubject");

  // Update coefficient when category is toggled on
  useEffect(() => {
    if (isDisplaySubject) {
      form.setValue("coefficient", 1);
    }
  }, [isDisplaySubject, form]);

  const onSubmit = (values: UpdateSubjectSchema) => {
    mutate(values);
  };

  useEffect(() => {
    if (openParent) {
      const parentId = form.getValues("parentId");
      setParentInputValue(
        parentId && parentId !== "none"
          ? filteredSubjects?.find((s) => s.id === parentId)?.name || ""
          : ""
      );
    }
  }, [openParent, filteredSubjects, form]);

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
              <FormItem className="mx-1">
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
              <FormItem className="col-span-2 mx-1">
                <FormLabel>Coefficient</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={(subject.coefficient / 100).toString()}
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
                  // Desktop: Popover
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
                          {field.value && field.value !== "none"
                            ? filteredSubjects?.find(
                                (s) => s.id === field.value
                              )?.name
                            : "Choisir une matière parente"}
                          <ChevronUpDownIcon className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent
                      className="p-0 min-w-[var(--radix-popover-trigger-width)]"
                      align="center"
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
                    </PopoverContent>
                  </Popover>
                ) : (
                  // Mobile: Drawer
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
                          {field.value && field.value !== "none"
                            ? filteredSubjects?.find(
                                (s) => s.id === field.value
                              )?.name
                            : "Choisir une matière parente"}
                          <ChevronUpDownIcon className="opacity-50" />
                        </Button>
                      </FormControl>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="mt-4 border-t p-4">
                        <Command>
                          <CommandInput
                            ref={parentInputRef}
                            autoFocus
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
                      </div>
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
            Modifier la matière
          </Button>
        </form>
      </Form>
    </div>
  );
};
