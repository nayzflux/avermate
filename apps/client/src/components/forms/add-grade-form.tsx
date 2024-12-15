"use client";

import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { CalendarIcon } from "@heroicons/react/24/outline";

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
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { useMediaQuery } from "../ui/use-media-query";

dayjs.locale("fr");

const addGradeSchema = z.object({
  name: z.string().min(1).max(64),
  outOf: z.coerce.number().min(0).max(1000),
  value: z.coerce.number().min(0).max(1000),
  coefficient: z.coerce.number().min(0).max(1000),
  passedAt: z.date(),
  subjectId: z.string().min(1).max(64),
  periodId: z.string().min(1).max(64).nullable(),
});

type AddGradeSchema = z.infer<typeof addGradeSchema>;

const determinePeriodId = (
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  periods: any[] | undefined
) => {
  if (!date || !periods) return "";
  const formattedDate = dayjs(date);
  const matchedPeriod = periods.find(
    (period) =>
      formattedDate.isAfter(dayjs(period.startAt)) &&
      formattedDate.isBefore(dayjs(period.endAt))
  );
  return matchedPeriod ? matchedPeriod.id : "full-year";
};

export const AddGradeForm = ({
  close,
  parentId,
}: {
  close: () => void;
  parentId?: string;
}) => {
  const toaster = useToast();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // States for controlling the open/close of our responsive comboboxes
  const [openPeriod, setOpenPeriod] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);

  // Queries
  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{ subjects: Subject[] }>();
      return data.subjects;
    },
  });

  const { data: periods } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const res = await apiClient.get("periods");
      const data = await res.json<{
        periods: { id: string; name: string; startAt: string; endAt: string }[];
      }>();
      return data.periods;
    },
  });

  // Mutation to create a grade
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-grade"],
    mutationFn: async ({
      name,
      outOf,
      value,
      coefficient,
      passedAt,
      subjectId,
      periodId,
    }: AddGradeSchema) => {
      const res = await apiClient.post("grades", {
        json: {
          name,
          value,
          outOf,
          coefficient,
          passedAt,
          subjectId,
          periodId,
        },
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      toaster.toast({
        title: `Note ajoutée avec succès !`,
        description: "Vous pouvez à présent suivre votre évolution.",
      });
      close();
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: () => {
      toaster.toast({
        title: "Échec de l'ajout de la note",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<AddGradeSchema>({
    resolver: zodResolver(addGradeSchema),
    defaultValues: {
      name: "",
      subjectId: parentId || "",
    },
  });

  // Automatically set the periodId when passedAt changes
  useEffect(() => {
    const passedAt = form.watch("passedAt");
    if (passedAt) {
      const matchedPeriodId = determinePeriodId(passedAt, periods);
      form.setValue("periodId", matchedPeriodId, { shouldValidate: true });
    }
  }, [form, form.watch("passedAt"), periods]);

  const selectedPeriod = periods?.find(
    (period) => period.id === form.getValues("periodId")
  );
  const selectedSubject = subjects?.find(
    (subject) => subject.id === form.getValues("subjectId")
  );

  const onSubmit = (values: AddGradeSchema) => {
    const processedValues = {
      ...values,
      periodId: values.periodId === "full-year" ? null : values.periodId,
    };
    mutate(processedValues);
  };

  const periodInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);

  // Focus the CommandInput inside the Drawer whenever it opens
  useEffect(() => {
    if (!isDesktop && openPeriod) {
      // Delay a bit to ensure the Drawer content is mounted
      setTimeout(() => periodInputRef.current?.focus(), 350);
    }
  }, [openPeriod, isDesktop]);

  useEffect(() => {
    if (!isDesktop && openSubject) {
      setTimeout(() => subjectInputRef.current?.focus(), 350);
    }
  }, [openSubject, isDesktop]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* Nom de la note */}
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mx-1">
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="DS: Nombres complexes"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Note, Sur, et Coefficient */}
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="value"
              disabled={isPending}
              render={({ field }) => (
                <FormItem className="mx-1">
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="13.5"
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
              name="outOf"
              disabled={isPending}
              render={({ field }) => (
                <FormItem className="mx-1">
                  <FormLabel>Sur</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="20"
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
              name="coefficient"
              disabled={isPending}
              render={({ field }) => (
                <FormItem className="col-span-2 mx-1">
                  <FormLabel>Coefficient</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date (Calendar) */}
          <FormField
            control={form.control}
            name="passedAt"
            render={({ field }) => (
              <FormItem className="flex flex-col mx-1">
                <FormLabel htmlFor="">Passé le</FormLabel>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          dayjs(field.value).format("dddd DD MMM YYYY")
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("2023-01-02")
                      }
                      autoFocus
                      weekStartsOn={1}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Responsive Combobox for Period */}
          <FormField
            control={form.control}
            name="periodId"
            render={({ field }) => (
              <FormItem className="flex flex-col mx-1">
                <FormLabel className="pointer-events-none">Période</FormLabel>

                {isDesktop ? (
                  // Desktop: Popover
                  <Popover
                    modal
                    open={openPeriod}
                    onOpenChange={(isOpen) => setOpenPeriod(isOpen)}
                  >
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openPeriod ? "true" : "false"}
                          className="justify-between"
                          onClick={() => setOpenPeriod(!openPeriod)}
                        >
                          {selectedPeriod
                            ? selectedPeriod.name
                            : form.getValues("periodId") === "full-year"
                            ? "Année complète"
                            : "Choisir une période"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent
                      className="p-0 min-w-[var(--radix-popover-trigger-width)]"
                      align="center"
                    >
                      <Command>
                        <CommandInput
                          placeholder="Choisir une période"
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Aucune période trouvée</CommandEmpty>
                          <CommandGroup>
                            {periods?.map((period) => (
                              <CommandItem
                                key={period.id}
                                value={period.name}
                                onSelect={() => {
                                  form.setValue("periodId", period.id, {
                                    shouldValidate: true,
                                  });
                                  setOpenPeriod(false);
                                }}
                              >
                                <span>{period.name}</span>
                                {form.getValues("periodId") === period.id && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                            <CommandItem
                              key="full-year"
                              value="Année complète"
                              onSelect={() => {
                                form.setValue("periodId", "full-year", {
                                  shouldValidate: true,
                                });
                                setOpenPeriod(false);
                              }}
                            >
                              <span>Année complète</span>
                              {form.getValues("periodId") === "full-year" && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  // Mobile: Drawer
                  <Drawer open={openPeriod} onOpenChange={setOpenPeriod}>
                    <DrawerTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openPeriod ? "true" : "false"}
                          className="justify-between"
                          onClick={() => setOpenPeriod(!openPeriod)}
                        >
                          {selectedPeriod
                            ? selectedPeriod.name
                            : form.getValues("periodId") === "full-year"
                            ? "Année complète"
                            : "Choisir une période"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="mt-4 border-t p-4">
                        <Command>
                          <CommandInput
                            ref={periodInputRef}
                            autoFocus
                            placeholder="Choisir une période"
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>Aucune période trouvée</CommandEmpty>
                            <CommandGroup>
                              {periods?.map((period) => (
                                <CommandItem
                                  key={period.id}
                                  value={period.name}
                                  onSelect={() => {
                                    form.setValue("periodId", period.id, {
                                      shouldValidate: true,
                                    });
                                    setOpenPeriod(false);
                                  }}
                                >
                                  <span>{period.name}</span>
                                  {form.getValues("periodId") === period.id && (
                                    <Check className="ml-auto h-4 w-4" />
                                  )}
                                </CommandItem>
                              ))}
                              <CommandItem
                                key="full-year"
                                value="Année complète"
                                onSelect={() => {
                                  form.setValue("periodId", "full-year", {
                                    shouldValidate: true,
                                  });
                                  setOpenPeriod(false);
                                }}
                              >
                                <span>Année complète</span>
                                {form.getValues("periodId") === "full-year" && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </div>
                    </DrawerContent>
                  </Drawer>
                )}
                <FormMessage />
                <FormDescription>
                  Une note doit être associée à une période. Celle ci peut être
                  différente de la date de passage si besoin.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Responsive Combobox for Subject */}
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem className="flex flex-col mx-1">
                <FormLabel className="pointer-events-none">Matière</FormLabel>

                {isDesktop ? (
                  // Desktop: Popover
                  <Popover
                    modal
                    open={openSubject}
                    onOpenChange={(isOpen) => setOpenSubject(isOpen)}
                  >
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSubject ? "true" : "false"}
                          className="justify-between"
                          onClick={() => setOpenSubject(!openSubject)}
                        >
                          {selectedSubject
                            ? selectedSubject.name
                            : "Choisir une matière"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent
                      className="p-0 min-w-[var(--radix-popover-trigger-width)]"
                      align="center"
                    >
                      <Command>
                        <CommandInput
                          placeholder="Choisir une matière"
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Aucune matière trouvée</CommandEmpty>
                          <CommandGroup>
                            {subjects
                              ?.filter(
                                (subject) => subject.isDisplaySubject === false
                              )
                              .slice()
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map((subject) => (
                                <CommandItem
                                  key={subject.id}
                                  value={subject.name}
                                  onSelect={() => {
                                    form.setValue("subjectId", subject.id, {
                                      shouldValidate: true,
                                    });
                                    setOpenSubject(false);
                                  }}
                                >
                                  <span>{subject.name}</span>
                                  {form.getValues("subjectId") ===
                                    subject.id && (
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
                  // Mobile: Drawer
                  <Drawer open={openSubject} onOpenChange={setOpenSubject}>
                    <DrawerTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSubject ? "true" : "false"}
                          className="justify-between"
                          onClick={() => setOpenSubject(!openSubject)}
                        >
                          {selectedSubject
                            ? selectedSubject.name
                            : "Choisir une matière"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="mt-4 border-t p-4">
                        <Command>
                          <CommandInput
                            ref={subjectInputRef}
                            autoFocus
                            placeholder="Choisir une matière"
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>Aucune matière trouvée</CommandEmpty>
                            <CommandGroup>
                              {subjects
                                ?.filter(
                                  (subject) =>
                                    subject.isDisplaySubject === false
                                )
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((subject) => (
                                  <CommandItem
                                    key={subject.id}
                                    value={subject.name}
                                    onSelect={() => {
                                      form.setValue("subjectId", subject.id, {
                                        shouldValidate: true,
                                      });
                                      setOpenSubject(false);
                                    }}
                                  >
                                    <span>{subject.name}</span>
                                    {form.getValues("subjectId") ===
                                      subject.id && (
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

          {/* Submit button */}
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin mr-2 size-4" />}
            Ajouter ma note
          </Button>
        </form>
      </Form>
    </div>
  );
};
