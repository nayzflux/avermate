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
import { cn } from "@/lib/utils";
import { Grade } from "@/types/grade";
import { Subject } from "@/types/subject";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Loader2Icon, Check, ChevronsUpDown } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, { useEffect, useState, useRef } from "react";
import "dayjs/locale/fr";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/components/ui/use-media-query";

dayjs.locale("fr");

const updateGradeSchema = z.object({
  name: z.string().min(1).max(64),
  outOf: z.coerce.number().min(0).max(1000),
  value: z.coerce.number().min(0).max(1000),
  coefficient: z.coerce.number().min(0).max(1000),
  passedAt: z.date(),
  subjectId: z.string().min(1).max(64),
  periodId: z.string().min(1).max(64).nullable(),
});

type UpdateGradeSchema = z.infer<typeof updateGradeSchema>;

const determinePeriodId = (
  date: Date | null | undefined,
  periods:
    | { id: string; name: string; startAt: string; endAt: string }[]
    | undefined
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

export const UpdateGradeForm = ({
  close,
  grade,
}: {
  close: () => void;
  grade: Grade;
}) => {
  const toaster = useToast();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [openPeriod, setOpenPeriod] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);

  const periodInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);

  const [periodInputValue, setPeriodInputValue] = useState("");
  const [subjectInputValue, setSubjectInputValue] = useState("");

  // Track if period was manually selected
  const [isManualPeriod, setIsManualPeriod] = useState(false);

  // Store initial date so we only apply date->period logic after date changes
  const [initialDate] = useState(grade.passedAt);

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
        periods: {
          id: string;
          name: string;
          startAt: string;
          endAt: string;
        }[];
      }>();
      return data.periods;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-grade"],
    mutationFn: async (values: UpdateGradeSchema) => {
      const payload = {
        ...values,
        periodId: values.periodId === "full-year" ? null : values.periodId,
      };
      const res = await apiClient.patch(`grades/${grade.id}`, {
        json: payload,
      });
      const data = await res.json<{ grade: Grade }>();
      return data.grade;
    },
    onSuccess: () => {
      toaster.toast({
        title: `Note modifiée avec succès !`,
        description: "Votre note a été mise à jour.",
      });
      close();
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      queryClient.invalidateQueries({ queryKey: ["grade", grade.id] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: () => {
      toaster.toast({
        title: "Erreur",
        description:
          "Impossible de mettre à jour la note. Réessayez plus tard.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<UpdateGradeSchema>({
    resolver: zodResolver(updateGradeSchema),
    defaultValues: {
      name: grade.name,
      outOf: grade.outOf / 100,
      value: grade.value / 100,
      coefficient: grade.coefficient / 100,
      passedAt: new Date(grade.passedAt),
      subjectId: grade.subjectId,
      periodId: grade.periodId === null ? "full-year" : grade.periodId,
    },
  });

  const watchedPassedAt = useWatch({ control: form.control, name: "passedAt" });

  // When the date changes, if not manually selected and if actually changed from initial, update the periodId
  useEffect(() => {
    if (
      watchedPassedAt &&
      initialDate &&
      new Date(watchedPassedAt).getTime() !== new Date(initialDate).getTime() &&
      !isManualPeriod &&
      periods
    ) {
      const matchedPeriodId = determinePeriodId(watchedPassedAt, periods);
      const currentPeriodId = form.getValues("periodId");

      if (matchedPeriodId !== currentPeriodId) {
        form.setValue("periodId", matchedPeriodId, { shouldValidate: true });
      }
    }
  }, [watchedPassedAt, periods, form, isManualPeriod, initialDate]);

  useEffect(() => {
    if (!isDesktop && openPeriod) {
      setTimeout(() => periodInputRef.current?.focus(), 350);
    }
  }, [openPeriod, isDesktop]);

  useEffect(() => {
    if (!isDesktop && openSubject) {
      setTimeout(() => subjectInputRef.current?.focus(), 350);
    }
  }, [openSubject, isDesktop]);

  const selectedPeriodValue = form.getValues("periodId");
  const selectedPeriod =
    selectedPeriodValue && selectedPeriodValue !== "full-year"
      ? periods?.find((p) => p.id === selectedPeriodValue)
      : null;

  const selectedSubject = subjects?.find(
    (subject) => subject.id === form.getValues("subjectId")
  );

  const onSubmit = (values: UpdateGradeSchema) => {
    mutate(values);
  };

  // Filter periods based on input
  const filteredPeriods = periods
    ?.filter((p) =>
      p.name.toLowerCase().includes(periodInputValue.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filter subjects based on input
  const filteredSubjects = subjects
    ?.filter(
      (subject) =>
        subject.isDisplaySubject === false &&
        subject.name.toLowerCase().includes(subjectInputValue.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Update periodInputValue when popover/drawer opens
  useEffect(() => {
    if (openPeriod) {
      setPeriodInputValue(
        selectedPeriod?.name ||
          (selectedPeriodValue === "full-year" ? "Année complète" : "")
      );
    }
  }, [openPeriod, selectedPeriod, selectedPeriodValue]);

  // Update subjectInputValue when popover/drawer opens
  useEffect(() => {
    if (openSubject) {
      setSubjectInputValue(selectedSubject?.name || "");
    }
  }, [openSubject, selectedSubject]);

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="mx-1">
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Responsive Combobox for Period */}
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
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="passedAt"
            render={({ field }) => (
              <FormItem className="flex flex-col mx-1">
                <FormLabel>Passé le</FormLabel>
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
                        {field.value
                          ? dayjs(field.value).format("dddd DD MMM YYYY")
                          : "Choisir une date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsManualPeriod(false);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("2023-01-02")
                      }
                      autoFocus
                      weekStartsOn={1}
                      defaultMonth={
                        field.value ? dayjs(field.value).toDate() : new Date()
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PeriodId Field */}
          <FormField
            control={form.control}
            name="periodId"
            render={({ field }) => (
              <FormItem className="flex flex-col mx-1">
                <FormLabel className="pointer-events-none">Période</FormLabel>
                {isDesktop ? (
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
                        >
                          {selectedPeriod
                            ? selectedPeriod.name
                            : selectedPeriodValue === "full-year"
                            ? "Année complète"
                            : "Choisir une période"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="p-0 min-w-[var(--radix-popover-trigger-width)]">
                      <Command>
                        <CommandInput
                          placeholder="Choisir une période"
                          ref={periodInputRef}
                          value={periodInputValue}
                          onValueChange={setPeriodInputValue}
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
                                  setIsManualPeriod(true);
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
                                setIsManualPeriod(true);
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
                  <Drawer open={openPeriod} onOpenChange={setOpenPeriod}>
                    <DrawerTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openPeriod ? "true" : "false"}
                          className="justify-between"
                        >
                          {selectedPeriod
                            ? selectedPeriod.name
                            : selectedPeriodValue === "full-year"
                            ? "Année complète"
                            : "Choisir une période"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </DrawerTrigger>
                    <DrawerContent>
                      <Command>
                        <CommandInput
                          ref={periodInputRef}
                          placeholder="Choisir une période"
                          className="h-9"
                          onValueChange={setPeriodInputValue}
                          value={periodInputValue}
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
                                  setIsManualPeriod(true);
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
                                setIsManualPeriod(true);
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
                    </DrawerContent>
                  </Drawer>
                )}
                <FormMessage />
                <FormDescription>
                  Une note doit être associée à une période. Celle-ci peut être
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
                <FormLabel>Matière</FormLabel>
                {isDesktop ? (
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
                        >
                          {selectedSubject
                            ? selectedSubject.name
                            : "Choisir une matière"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="p-0 min-w-[var(--radix-popover-trigger-width)]">
                      <Command>
                        <CommandInput
                          placeholder="Choisir une matière"
                          ref={subjectInputRef}
                          value={subjectInputValue}
                          onValueChange={setSubjectInputValue}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Aucune matière trouvée</CommandEmpty>
                          <CommandGroup>
                            {subjects
                              ?.filter(
                                (subject) => subject.isDisplaySubject === false
                              )
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
                  <Drawer open={openSubject} onOpenChange={setOpenSubject}>
                    <DrawerTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSubject ? "true" : "false"}
                          className="justify-between"
                        >
                          {selectedSubject
                            ? selectedSubject.name
                            : "Choisir une matière"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </DrawerTrigger>
                    <DrawerContent>
                      <Command>
                        <CommandInput
                          ref={subjectInputRef}
                          placeholder="Choisir une matière"
                          className="h-9"
                          value={subjectInputValue}
                          onValueChange={setSubjectInputValue}
                        />
                        <CommandList>
                          <CommandEmpty>Aucune matière trouvée</CommandEmpty>
                          <CommandGroup>
                            {subjects
                              ?.filter(
                                (subject) => subject.isDisplaySubject === false
                              )
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
                    </DrawerContent>
                  </Drawer>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin mr-2 size-4" />}
            Modifier la note
          </Button>
        </form>
      </Form>
    </div>
  );
};
